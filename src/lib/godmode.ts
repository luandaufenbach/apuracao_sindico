// Godmode (docs/ESPECIFICACAO.md, "Godmode" e "Quem vê o quê"): só o papel
// god. Aqui ficam as consultas que ligam voto a quem votou e a candidato, a
// auditoria e a ação sobre a eleição inteira (reabrir). Anular,
// mover e voto pela mesa ficam em regras-voto.ts.
import {
  and,
  desc,
  eq,
  inArray,
  isNotNull,
  like,
  lt,
  or,
  sql,
} from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import {
  apartamento,
  candidato,
  comprador,
  eleicao,
  logAuditoria,
  usuarioAdmin,
  voto,
} from "@/db/schema";

import { GRUPOS_ACAO } from "./acoes";
import { ACOES_GOD, registrarAuditoria } from "./auditoria";
import { mascararDocumento } from "./documento";
import { EntradaInvalida, idBanco, validar } from "./erros";
import { ordemApartamento } from "./ordem-apartamento";
import { exigirPapel, motivo } from "./regras-voto";

type Origem = (typeof voto.$inferSelect)["origem"];

/** `Bloco 01, Ap 101`, como no painel. */
const rotuloApto = (a: { bloco: string; rotulo: string }) =>
  `${a.bloco}, ${a.rotulo}`;

async function rotulosDosApartamentos(
  ids: number[],
): Promise<Map<number, string>> {
  if (ids.length === 0) return new Map();
  const linhas = await db
    .select({
      id: apartamento.id,
      bloco: apartamento.bloco,
      rotulo: apartamento.rotulo,
    })
    .from(apartamento)
    .where(inArray(apartamento.id, [...new Set(ids)]));
  return new Map(linhas.map((a) => [a.id, rotuloApto(a)]));
}

/** Rótulos dos apartamentos da lista que já têm voto válido na eleição. */
export async function apartamentosComVoto(
  eleicaoId: number,
  apartamentoIds: number[],
): Promise<string[]> {
  if (apartamentoIds.length === 0) return [];
  const linhas = await db
    .select({ bloco: apartamento.bloco, rotulo: apartamento.rotulo })
    .from(voto)
    .innerJoin(apartamento, eq(apartamento.id, voto.apartamentoId))
    .where(
      and(
        eq(voto.eleicaoId, eleicaoId),
        eq(voto.status, "valido"),
        inArray(voto.apartamentoId, apartamentoIds),
      ),
    )
    .orderBy(...ordemApartamento);
  return linhas.map(rotuloApto);
}

// --- Votos por documento -----------------------------------------------------

export type ApartamentoDoDocumento = {
  apartamentoId: number;
  rotulo: string;
  /** O documento é de um comprador deste apartamento. */
  noCadastro: boolean;
  /** Voto válido do apartamento, de quem quer que tenha votado. */
  voto: {
    horario: Date;
    nome: string;
    origem: Origem;
    /** O voto foi dado com este documento. */
    comEste: boolean;
  } | null;
};

export type VotosDoDocumento = {
  /** Identifica a linha sem revelar o documento. */
  chave: string;
  /** Mascarado: só os 3 primeiros caracteres. */
  documento: string;
  nome: string;
  /** Apartamentos em que o documento é de um comprador. */
  cadastro: number;
  /** Desses, quantos têm voto válido (de qualquer comprador ou da mesa). */
  votaram: number;
  /** Apartamentos fora do cadastro votados com o documento (mesa, voto movido). */
  foraDoCadastro: number;
  apartamentos: ApartamentoDoDocumento[];
};

/**
 * Cada documento do cadastro, e cada documento usado num voto válido (voto
 * pela mesa de quem não está no cadastro, voto movido), com os apartamentos e
 * quem votou em cada um. Do maior para o menor número de apartamentos.
 */
export async function votosPorDocumento(
  eleicaoId: number,
): Promise<VotosDoDocumento[] | null> {
  const [el] = await db
    .select({ empreendimentoId: eleicao.empreendimentoId })
    .from(eleicao)
    .where(eq(eleicao.id, eleicaoId));
  if (!el) return null;

  const aptos = await db
    .select({
      id: apartamento.id,
      bloco: apartamento.bloco,
      rotulo: apartamento.rotulo,
      votoId: voto.id,
      documento: voto.documento,
      nome: voto.nome,
      origem: voto.origem,
      horario: voto.criadoEm,
    })
    .from(apartamento)
    .leftJoin(
      voto,
      and(
        eq(voto.apartamentoId, apartamento.id),
        eq(voto.eleicaoId, eleicaoId),
        eq(voto.status, "valido"),
      ),
    )
    .where(eq(apartamento.empreendimentoId, el.empreendimentoId))
    .orderBy(...ordemApartamento);
  const compradores = await db
    .select({
      id: comprador.id,
      apartamentoId: comprador.apartamentoId,
      nome: comprador.nome,
      documento: comprador.documento,
    })
    .from(comprador)
    .innerJoin(apartamento, eq(apartamento.id, comprador.apartamentoId))
    .where(
      and(
        eq(apartamento.empreendimentoId, el.empreendimentoId),
        isNotNull(comprador.documento),
      ),
    )
    .orderBy(comprador.id);

  type Grupo = {
    chave: string;
    nomes: string[];
    cadastro: Set<number>;
    votados: Set<number>;
  };
  const grupos = new Map<string, Grupo>();
  const grupo = (documento: string, chave: string) => {
    let g = grupos.get(documento);
    if (!g) {
      g = { chave, nomes: [], cadastro: new Set(), votados: new Set() };
      grupos.set(documento, g);
    }
    return g;
  };
  for (const c of compradores) {
    if (!c.documento) continue;
    const g = grupo(c.documento, `c${c.id}`);
    g.cadastro.add(c.apartamentoId);
    if (!g.nomes.includes(c.nome)) g.nomes.push(c.nome);
  }
  for (const a of aptos) {
    if (a.votoId === null || a.documento === null || a.nome === null) continue;
    const g = grupo(a.documento, `v${a.votoId}`);
    g.votados.add(a.id);
    // Fora do cadastro, o nome é o informado no voto.
    if (g.cadastro.size === 0 && !g.nomes.includes(a.nome))
      g.nomes.push(a.nome);
  }

  const posicao = new Map(aptos.map((a, i) => [a.id, i]));
  const linhas = [...grupos].map(([documento, g]): VotosDoDocumento => {
    const apartamentos = [...new Set([...g.cadastro, ...g.votados])]
      .map((id) => aptos[posicao.get(id)!])
      .sort((x, y) => posicao.get(x.id)! - posicao.get(y.id)!)
      .map((a) => ({
        apartamentoId: a.id,
        rotulo: rotuloApto(a),
        noCadastro: g.cadastro.has(a.id),
        voto:
          a.votoId === null
            ? null
            : {
                horario: a.horario!,
                nome: a.nome!,
                origem: a.origem!,
                comEste: a.documento === documento,
              },
      }));
    return {
      chave: g.chave,
      documento: mascararDocumento(documento),
      nome: g.nomes.join(" / "),
      cadastro: g.cadastro.size,
      votaram: apartamentos.filter((a) => a.noCadastro && a.voto).length,
      foraDoCadastro: apartamentos.filter((a) => !a.noCadastro).length,
      apartamentos,
    };
  });
  return linhas.sort(
    (a, b) =>
      b.cadastro - a.cadastro ||
      b.votaram - a.votaram ||
      b.foraDoCadastro - a.foraDoCadastro ||
      a.nome.localeCompare(b.nome, "pt-BR"),
  );
}

// --- Buscar voto -------------------------------------------------------------

export const entradaBuscaVoto = z.union([
  z.object({ apartamentoId: idBanco }),
  z.object({
    // Como no comprovante do eleitor, sem diferença de caixa nem espaços.
    comprovante: z
      .string()
      .max(32)
      .transform((c) => c.toUpperCase().replace(/[^0-9A-Z]/g, ""))
      .pipe(z.string().length(6, "O comprovante tem 6 caracteres.")),
  }),
]);

export type HistoricoVoto = {
  id: number;
  acao: string;
  motivo: string | null;
  usuario: string | null;
  criadoEm: Date;
  detalhe: string | null;
};

export type VotoEncontrado = {
  id: number;
  apartamentoId: number;
  rotulo: string;
  candidato: string;
  nome: string;
  /** Mascarado: só os 3 primeiros caracteres. */
  documento: string;
  origem: Origem;
  comprovante: string;
  status: (typeof voto.$inferSelect)["status"];
  horario: Date;
  historico: HistoricoVoto[];
};

/**
 * Votos de um apartamento (inclusive anulados e os que foram movidos dali) ou
 * de um comprovante. É o único lugar do painel que mostra o candidato.
 */
export async function buscarVotos(
  eleicaoId: number,
  entrada: z.input<typeof entradaBuscaVoto>,
): Promise<VotoEncontrado[]> {
  const busca = validar(entradaBuscaVoto, entrada);

  let filtro;
  if ("apartamentoId" in busca) {
    const movidos = await db
      .select({ alvo: logAuditoria.alvo })
      .from(logAuditoria)
      .where(
        and(
          eq(logAuditoria.eleicaoId, eleicaoId),
          eq(logAuditoria.acao, "voto.mover"),
          sql`${logAuditoria.dados}->>'de' = ${String(busca.apartamentoId)}`,
        ),
      );
    const ids = movidos
      .map((m) => idDoAlvo(m.alvo, "voto"))
      .filter((n) => n !== null);
    filtro = or(
      eq(voto.apartamentoId, busca.apartamentoId),
      ids.length > 0 ? inArray(voto.id, ids) : undefined,
    );
  } else {
    filtro = eq(voto.comprovante, busca.comprovante);
  }

  const votos = await db
    .select({
      id: voto.id,
      apartamentoId: voto.apartamentoId,
      bloco: apartamento.bloco,
      rotulo: apartamento.rotulo,
      candidato: candidato.nome,
      nome: voto.nome,
      documento: voto.documento,
      origem: voto.origem,
      comprovante: voto.comprovante,
      status: voto.status,
      horario: voto.criadoEm,
    })
    .from(voto)
    .innerJoin(apartamento, eq(apartamento.id, voto.apartamentoId))
    .innerJoin(candidato, eq(candidato.id, voto.candidatoId))
    .where(and(eq(voto.eleicaoId, eleicaoId), filtro))
    .orderBy(desc(voto.criadoEm), desc(voto.id));
  if (votos.length === 0) return [];

  // Anular e mover apontam o voto no alvo; o voto pela mesa lista os votos
  // do lote em dados.votoIds.
  const ids = new Set(votos.map((v) => v.id));
  const logs = await db
    .select({
      id: logAuditoria.id,
      acao: logAuditoria.acao,
      alvo: logAuditoria.alvo,
      motivo: logAuditoria.motivo,
      dados: logAuditoria.dados,
      criadoEm: logAuditoria.criadoEm,
      usuario: usuarioAdmin.nome,
    })
    .from(logAuditoria)
    .leftJoin(usuarioAdmin, eq(usuarioAdmin.id, logAuditoria.usuarioId))
    .where(
      and(
        eq(logAuditoria.eleicaoId, eleicaoId),
        or(
          inArray(
            logAuditoria.alvo,
            [...ids].map((id) => `voto:${id}`),
          ),
          eq(logAuditoria.acao, "voto.mesa"),
        ),
      ),
    )
    .orderBy(logAuditoria.criadoEm, logAuditoria.id);
  const votosDoLog = (l: (typeof logs)[number]) =>
    l.acao === "voto.mesa"
      ? numeros(l.dados?.votoIds).filter((id) => ids.has(id))
      : [idDoAlvo(l.alvo, "voto")].filter((id) => id !== null);
  const relevantes = logs.filter((l) => votosDoLog(l).length > 0);
  const detalhes = await descreverAcoes(relevantes);

  return votos.map((v) => ({
    id: v.id,
    apartamentoId: v.apartamentoId,
    rotulo: rotuloApto(v),
    candidato: v.candidato,
    nome: v.nome,
    documento: mascararDocumento(v.documento),
    origem: v.origem,
    comprovante: v.comprovante,
    status: v.status,
    horario: v.horario,
    historico: relevantes
      .filter((l) => votosDoLog(l).includes(v.id))
      .map((l) => ({
        id: l.id,
        acao: l.acao,
        motivo: l.motivo,
        usuario: l.usuario,
        criadoEm: l.criadoEm,
        detalhe: detalhes.get(l.id) ?? null,
      })),
  }));
}

// --- Reabrir -----------------------------------------------------------------

const entradaAcaoEleicao = z.object({
  eleicaoId: idBanco,
  usuarioId: idBanco,
  motivo,
});

/** Volta uma votação encerrada para aberta (god, motivo obrigatório). */
export async function reabrirEleicao(
  entrada: z.input<typeof entradaAcaoEleicao>,
): Promise<void> {
  const e = validar(entradaAcaoEleicao, entrada);
  await db.transaction(async (tx) => {
    await exigirPapel(tx, e.usuarioId, ["god"]);
    const [el] = await tx
      .select({ status: eleicao.status, encerradaEm: eleicao.encerradaEm })
      .from(eleicao)
      .where(eq(eleicao.id, e.eleicaoId))
      .for("update");
    if (!el) throw new EntradaInvalida("Eleição não encontrada.");
    if (el.status !== "encerrada") {
      throw new EntradaInvalida(
        `Só votação encerrada reabre; esta eleição está ${el.status}.`,
      );
    }
    // O horário do encerramento sai da eleição e fica no log; o próximo
    // encerramento grava o novo.
    await tx
      .update(eleicao)
      .set({ status: "aberta", encerradaEm: null })
      .where(eq(eleicao.id, e.eleicaoId));
    await registrarAuditoria(
      {
        eleicaoId: e.eleicaoId,
        usuarioId: e.usuarioId,
        acao: "eleicao.reabrir",
        alvo: `eleicao:${e.eleicaoId}`,
        motivo: e.motivo,
        dados: {
          de: "encerrada",
          para: "aberta",
          encerradaEm: el.encerradaEm?.toISOString() ?? null,
        },
      },
      tx,
    );
  });
}

// --- Auditoria -----------------------------------------------------------------

export const filtrosAuditoria = z.object({
  eleicaoId: idBanco.optional(),
  grupo: z.enum(GRUPOS_ACAO).optional(),
  /** Só as ações de godmode, que exigem motivo. */
  godmode: z.boolean().optional(),
  usuarioId: idBanco.optional(),
  /** Página seguinte: linhas com id menor que este. */
  antes: z.int().positive().optional(),
  limite: z.int().min(1).max(200).default(50),
});

export type ItemAuditoria = {
  id: number;
  eleicaoId: number | null;
  eleicao: string | null;
  acao: string;
  alvo: string | null;
  motivo: string | null;
  dados: Record<string, unknown> | null;
  criadoEm: Date;
  /** Null: ação do eleitor. */
  usuario: string | null;
  detalhe: string | null;
};

/** Log de auditoria, do mais novo para o mais antigo, em páginas. */
export async function listarAuditoria(
  entrada: z.input<typeof filtrosAuditoria>,
): Promise<{ itens: ItemAuditoria[]; proximo: number | null }> {
  const f = validar(filtrosAuditoria, entrada);
  const linhas = await db
    .select({
      id: logAuditoria.id,
      eleicaoId: logAuditoria.eleicaoId,
      eleicao: eleicao.titulo,
      acao: logAuditoria.acao,
      alvo: logAuditoria.alvo,
      motivo: logAuditoria.motivo,
      dados: logAuditoria.dados,
      criadoEm: logAuditoria.criadoEm,
      usuario: usuarioAdmin.nome,
    })
    .from(logAuditoria)
    .leftJoin(usuarioAdmin, eq(usuarioAdmin.id, logAuditoria.usuarioId))
    .leftJoin(eleicao, eq(eleicao.id, logAuditoria.eleicaoId))
    .where(
      and(
        f.eleicaoId ? eq(logAuditoria.eleicaoId, f.eleicaoId) : undefined,
        f.grupo ? like(logAuditoria.acao, `${f.grupo}.%`) : undefined,
        f.godmode ? inArray(logAuditoria.acao, [...ACOES_GOD]) : undefined,
        f.usuarioId ? eq(logAuditoria.usuarioId, f.usuarioId) : undefined,
        f.antes ? lt(logAuditoria.id, f.antes) : undefined,
      ),
    )
    .orderBy(desc(logAuditoria.id))
    .limit(f.limite + 1);
  const itens = linhas.slice(0, f.limite);
  const detalhes = await descreverAcoes(itens);
  return {
    itens: itens.map((l) => ({ ...l, detalhe: detalhes.get(l.id) ?? null })),
    proximo: linhas.length > f.limite ? itens[itens.length - 1].id : null,
  };
}

// --- Descrição das ações -------------------------------------------------------

type LinhaLog = {
  id: number;
  acao: string;
  alvo: string | null;
  dados: Record<string, unknown> | null;
};

const numero = (v: unknown) =>
  typeof v === "number" && Number.isInteger(v) ? v : null;
const numeros = (v: unknown) =>
  Array.isArray(v) ? v.map(numero).filter((n): n is number => n !== null) : [];
const texto = (v: unknown) => (typeof v === "string" ? v : null);

/** `voto:12` com tipo `voto` vira 12. */
function idDoAlvo(alvo: string | null, tipo: string): number | null {
  const m = alvo?.match(/^([a-z_]+):(\d{1,10})$/);
  return m && m[1] === tipo ? Number(m[2]) : null;
}

/**
 * Texto curto de cada ação, para o relatório e a auditoria: apartamentos pelo
 * rótulo, no lugar dos ids que o log guarda.
 */
export async function descreverAcoes(
  linhas: LinhaLog[],
): Promise<Map<number, string | null>> {
  const ids: number[] = [];
  for (const l of linhas) {
    const d = l.dados ?? {};
    ids.push(...numeros(d.apartamentoIds));
    for (const v of [d.apartamentoId, d.de, d.para]) {
      const n = numero(v);
      if (n !== null) ids.push(n);
    }
    const alvo = idDoAlvo(l.alvo, "apartamento");
    if (alvo !== null) ids.push(alvo);
  }
  const rotulos = await rotulosDosApartamentos(ids);
  const apto = (v: unknown) => {
    const n = numero(v);
    return n === null ? null : (rotulos.get(n) ?? `apartamento ${n}`);
  };
  return new Map(linhas.map((l) => [l.id, descrever(l, apto)]));
}

function descrever(
  l: LinhaLog,
  apto: (v: unknown) => string | null,
): string | null {
  const d = l.dados ?? {};
  switch (l.acao) {
    case "voto.mesa": {
      const rotulos = numeros(d.apartamentoIds).map(apto);
      return rotulos.length > 0 ? rotulos.join("; ") : null;
    }
    case "voto.anular":
      return apto(d.apartamentoId);
    case "voto.mover": {
      const de = apto(d.de);
      const para = apto(d.para);
      return de && para ? `de ${de} para ${para}` : null;
    }
    case "apto.desbloquear":
      return apto(idDoAlvo(l.alvo, "apartamento"));
    case "documento.falha": {
      const a = apto(idDoAlvo(l.alvo, "apartamento"));
      const n = numero(d.tentativas);
      if (!a || n === null) return a;
      return `${a} · ${n} ${n === 1 ? "tentativa" : "tentativas"}${d.bloqueado === true ? ", bloqueado" : ""}`;
    }
    case "eleicao.reabrir": {
      const de = texto(d.de);
      const para = texto(d.para);
      return de && para ? `de ${de} para ${para}` : null;
    }
    case "eleicao.zerar": {
      const n = numero(d.votos);
      return n === null
        ? null
        : `${n} ${n === 1 ? "voto apagado" : "votos apagados"}`;
    }
    case "usuario.criar":
    case "usuario.desativar": {
      const nome = texto(d.nome);
      const papel = texto(d.papel);
      if (!nome) return null;
      return papel ? `${nome} (${papel === "god" ? "god" : "operador"})` : nome;
    }
    default:
      return null;
  }
}
