// Regras do voto (docs/ESPECIFICACAO.md, "Regras que o código e os testes
// garantem"). As rotas resolvem sessão, token e papel; aqui ficam as regras e
// a gravação no banco. Toda entrada passa pelo Zod.
import { randomInt } from "node:crypto";

import { and, eq, inArray, sql } from "drizzle-orm";
import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { z } from "zod";

import { db, type Executor, type Transacao } from "@/db";
import {
  apartamento,
  candidato,
  comprador,
  eleicao,
  situacaoApartamento,
  usuarioAdmin,
  voto,
} from "@/db/schema";

import { registrarAuditoria } from "./auditoria";
import { validarDocumento } from "./documento";
import { AcessoNegado, EntradaInvalida, validar, violacaoUnica } from "./erros";

/** Documentos válidos que não conferem até bloquear o apartamento (R5). */
export const LIMITE_TENTATIVAS = 3;

const id = z.int().positive();
const motivo = z.string().trim().min(1, "Informe o motivo.").max(500);
// O documento como a pessoa digitou; a normalização e o dígito verificador
// ficam com validarDocumento, porque documento inválido é resposta, não erro.
const documentoDigitado = z.string().max(32);

type EleicaoBase = { id: number; empreendimentoId: number; status: string };

async function buscarEleicao(
  ex: Executor,
  eleicaoId: number,
  travar = false,
): Promise<EleicaoBase> {
  const consulta = ex
    .select({
      id: eleicao.id,
      empreendimentoId: eleicao.empreendimentoId,
      status: eleicao.status,
    })
    .from(eleicao)
    .where(eq(eleicao.id, eleicaoId));
  const [el] = travar ? await consulta.for("share") : await consulta;
  if (!el) throw new EntradaInvalida("Eleição não encontrada.");
  return el;
}

async function exigirPapel(
  ex: Executor,
  usuarioId: number,
  papeis: ("operador" | "god")[],
): Promise<void> {
  const [u] = await ex
    .select({ papel: usuarioAdmin.papel, ativo: usuarioAdmin.ativo })
    .from(usuarioAdmin)
    .where(eq(usuarioAdmin.id, usuarioId));
  if (!u?.ativo || !papeis.includes(u.papel)) throw new AcessoNegado();
}

async function exigirApartamentos(
  ex: Executor,
  el: EleicaoBase,
  apartamentoIds: number[],
): Promise<void> {
  const achados = await ex
    .select({ id: apartamento.id })
    .from(apartamento)
    .where(
      and(
        inArray(apartamento.id, apartamentoIds),
        eq(apartamento.empreendimentoId, el.empreendimentoId),
      ),
    );
  if (achados.length !== new Set(apartamentoIds).size) {
    throw new EntradaInvalida(
      "Apartamento não encontrado neste empreendimento.",
    );
  }
}

async function exigirCandidato(
  ex: Executor,
  eleicaoId: number,
  candidatoId: number,
): Promise<void> {
  const [c] = await ex
    .select({ id: candidato.id })
    .from(candidato)
    .where(
      and(eq(candidato.id, candidatoId), eq(candidato.eleicaoId, eleicaoId)),
    );
  if (!c) throw new EntradaInvalida("Candidato não encontrado nesta eleição.");
}

// Junções com o apartamento corrente; a eleição vem como id ou como coluna.
const votoValido = (eleicaoId: number | AnyPgColumn) =>
  and(
    eq(voto.apartamentoId, apartamento.id),
    eq(voto.eleicaoId, eleicaoId),
    eq(voto.status, "valido"),
  );
const situacaoNaEleicao = (eleicaoId: number | AnyPgColumn) =>
  and(
    eq(situacaoApartamento.apartamentoId, apartamento.id),
    eq(situacaoApartamento.eleicaoId, eleicaoId),
  );

/** Apartamentos do empreendimento com um comprador desse documento (R6). */
async function apartamentosDoDocumento(
  ex: Executor,
  el: EleicaoBase,
  documento: string,
) {
  const linhas = await ex
    .select({
      apartamentoId: apartamento.id,
      compradorId: comprador.id,
      bloco: apartamento.bloco,
      rotulo: apartamento.rotulo,
      votouEm: voto.criadoEm,
      bloqueado: situacaoApartamento.bloqueado,
    })
    .from(comprador)
    .innerJoin(apartamento, eq(apartamento.id, comprador.apartamentoId))
    .leftJoin(voto, votoValido(el.id))
    .leftJoin(situacaoApartamento, situacaoNaEleicao(el.id))
    .where(
      and(
        eq(comprador.documento, documento),
        eq(apartamento.empreendimentoId, el.empreendimentoId),
      ),
    )
    .orderBy(
      apartamento.bloco,
      sql`length(${apartamento.numero})`,
      apartamento.numero,
    );
  // Um apartamento aparece uma vez, mesmo com dois compradores do mesmo documento.
  const vistos = new Set<number>();
  return linhas.filter(
    (l) => !vistos.has(l.apartamentoId) && vistos.add(l.apartamentoId),
  );
}

// --- Verificar documento ---------------------------------------------------

export type Sugestao = {
  apartamentoId: number;
  bloco: string;
  rotulo: string;
  /** Horário do voto, se o apartamento já votou. */
  votouEm: Date | null;
};

export type ResultadoVerificacao =
  | { ok: true; compradorId: number }
  | {
      ok: false;
      erro: "eleicao_fechada" | "ja_votou" | "bloqueado" | "documento_invalido";
    }
  | { ok: false; erro: "nao_confere"; tentativasRestantes: number }
  | { ok: false; erro: "outro_apto"; sugestoes: Sugestao[] };

const entradaVerificar = z.object({
  eleicaoId: id,
  apartamentoId: id,
  documento: documentoDigitado,
});

/**
 * Confere se o documento é de um comprador do apartamento (R3). Documento com
 * dígito verificador inválido (R4) ou de outro apartamento (R6) não conta
 * tentativa; os demais contam, e na 3ª falha o apartamento bloqueia (R5).
 */
export async function verificarDocumento(
  entrada: z.input<typeof entradaVerificar>,
): Promise<ResultadoVerificacao> {
  const { eleicaoId, apartamentoId, documento } = validar(
    entradaVerificar,
    entrada,
  );

  // Eleição, apartamento, bloqueio e voto numa consulta só.
  const [apto] = await db
    .select({
      empreendimentoId: eleicao.empreendimentoId,
      status: eleicao.status,
      apartamentoId: apartamento.id,
      bloqueado: situacaoApartamento.bloqueado,
      votouEm: voto.criadoEm,
    })
    .from(eleicao)
    .leftJoin(
      apartamento,
      and(
        eq(apartamento.id, apartamentoId),
        eq(apartamento.empreendimentoId, eleicao.empreendimentoId),
      ),
    )
    .leftJoin(situacaoApartamento, situacaoNaEleicao(eleicao.id))
    .leftJoin(voto, votoValido(eleicao.id))
    .where(eq(eleicao.id, eleicaoId));
  if (!apto) throw new EntradaInvalida("Eleição não encontrada.");
  if (apto.status !== "aberta") return { ok: false, erro: "eleicao_fechada" };
  if (!apto.apartamentoId) {
    throw new EntradaInvalida("Apartamento não encontrado nesta eleição.");
  }
  const el: EleicaoBase = {
    id: eleicaoId,
    empreendimentoId: apto.empreendimentoId,
    status: apto.status,
  };
  if (apto.votouEm) return { ok: false, erro: "ja_votou" };
  if (apto.bloqueado) return { ok: false, erro: "bloqueado" };

  const doc = validarDocumento(documento);
  if (!doc) return { ok: false, erro: "documento_invalido" };

  const donos = await apartamentosDoDocumento(db, el, doc.documento);
  const daqui = donos.find((d) => d.apartamentoId === apartamentoId);
  if (daqui) return { ok: true, compradorId: daqui.compradorId };
  if (donos.length > 0) {
    return {
      ok: false,
      erro: "outro_apto",
      sugestoes: donos.map(({ apartamentoId, bloco, rotulo, votouEm }) => ({
        apartamentoId,
        bloco,
        rotulo,
        votouEm,
      })),
    };
  }

  return registrarFalha(el, apartamentoId);
}

// R5: o contador sobe no próprio banco (upsert com incremento), então falhas
// simultâneas nunca se perdem nem passam do limite sem bloquear.
async function registrarFalha(
  el: EleicaoBase,
  apartamentoId: number,
): Promise<ResultadoVerificacao> {
  return db.transaction(async (tx) => {
    const [s] = await tx
      .insert(situacaoApartamento)
      .values({
        eleicaoId: el.id,
        apartamentoId,
        tentativasFalhas: 1,
        bloqueado: LIMITE_TENTATIVAS <= 1,
      })
      .onConflictDoUpdate({
        target: [
          situacaoApartamento.eleicaoId,
          situacaoApartamento.apartamentoId,
        ],
        set: {
          tentativasFalhas: sql`${situacaoApartamento.tentativasFalhas} + 1`,
          bloqueado: sql`${situacaoApartamento.bloqueado} or ${situacaoApartamento.tentativasFalhas} + 1 >= ${LIMITE_TENTATIVAS}`,
        },
      })
      .returning({
        tentativas: situacaoApartamento.tentativasFalhas,
        bloqueado: situacaoApartamento.bloqueado,
      });
    await registrarAuditoria(
      {
        eleicaoId: el.id,
        acao: "documento.falha",
        alvo: `apartamento:${apartamentoId}`,
        dados: { tentativas: s.tentativas, bloqueado: s.bloqueado },
      },
      tx,
    );
    return s.bloqueado
      ? { ok: false, erro: "bloqueado" }
      : {
          ok: false,
          erro: "nao_confere",
          tentativasRestantes: LIMITE_TENTATIVAS - s.tentativas,
        };
  });
}

// --- Gravar votos ------------------------------------------------------------

// Sem 0/O/1/I, para ninguém confundir ao conferir o comprovante.
const ALFABETO_COMPROVANTE = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function gerarComprovante(): string {
  let codigo = "";
  for (let i = 0; i < 6; i++) {
    codigo += ALFABETO_COMPROVANTE[randomInt(ALFABETO_COMPROVANTE.length)];
  }
  return codigo;
}

type NovoVoto = Omit<
  typeof voto.$inferInsert,
  "id" | "eleicaoId" | "comprovante" | "status" | "criadoEm"
>;
type VotoGravado = {
  id: number;
  apartamentoId: number;
  documento: string;
  comprovante: string;
  criadoEm: Date;
};

/**
 * Grava os votos numa transação. R2: trava a eleição em modo compartilhado e
 * só grava se ela estiver aberta; quem encerra a votação espera os votos em
 * andamento terminarem. R1: o índice um_voto_por_apto barra o segundo voto
 * válido do apartamento, mesmo simultâneo, e isso vira `ja_votou`.
 */
async function gravarVotos<Recusa extends string = never>(
  eleicaoId: number,
  // Devolve os votos a gravar, ou uma recusa que encerra sem gravar nada.
  montar: (
    tx: Transacao,
    el: EleicaoBase,
  ) => Promise<NovoVoto[] | { erro: Recusa }>,
  depois?: (
    tx: Transacao,
    el: EleicaoBase,
    votos: VotoGravado[],
  ) => Promise<void>,
): Promise<
  | { ok: true; el: EleicaoBase; votos: VotoGravado[] }
  | { ok: false; erro: "eleicao_fechada" | "ja_votou" | Recusa }
> {
  for (let tentativa = 1; ; tentativa++) {
    try {
      return await db.transaction(async (tx) => {
        const el = await buscarEleicao(tx, eleicaoId, true);
        if (el.status !== "aberta") {
          return { ok: false, erro: "eleicao_fechada" } as const;
        }
        const novos = await montar(tx, el);
        if (!Array.isArray(novos)) {
          return { ok: false, erro: novos.erro } as const;
        }
        const votos = await tx
          .insert(voto)
          .values(
            novos.map((n) => ({
              ...n,
              eleicaoId,
              comprovante: gerarComprovante(),
            })),
          )
          .returning({
            id: voto.id,
            apartamentoId: voto.apartamentoId,
            documento: voto.documento,
            comprovante: voto.comprovante,
            criadoEm: voto.criadoEm,
          });
        await depois?.(tx, el, votos);
        return { ok: true, el, votos } as const;
      });
    } catch (erro) {
      const restricao = violacaoUnica(erro);
      if (restricao === "um_voto_por_apto")
        return { ok: false, erro: "ja_votou" };
      // Comprovante repetido (1 em ~10⁹): sorteia de novo.
      if (restricao === "voto_comprovante_unique" && tentativa < 5) continue;
      throw erro;
    }
  }
}

export type ProximoApartamento = {
  apartamentoId: number;
  compradorId: number;
  bloco: string;
  rotulo: string;
};

export type ResultadoVoto =
  | {
      ok: true;
      votoId: number;
      comprovante: string;
      horario: Date;
      /** Outros apartamentos do mesmo documento que ainda não votaram. */
      proximos: ProximoApartamento[];
    }
  | { ok: false; erro: "eleicao_fechada" | "ja_votou" | "bloqueado" };

const entradaVotar = z.object({
  eleicaoId: id,
  apartamentoId: id,
  compradorId: id,
  candidatoId: id,
});

/**
 * Voto do eleitor, com o comprador já verificado (vem do token). Apartamento
 * bloqueado depois da verificação também recusa: só a mesa resolve (R5).
 */
export async function votar(
  entrada: z.input<typeof entradaVotar>,
): Promise<ResultadoVoto> {
  const e = validar(entradaVotar, entrada);

  const r = await gravarVotos(e.eleicaoId, async (tx, el) => {
    const [c] = await tx
      .select({
        nome: comprador.nome,
        documento: comprador.documento,
        bloqueado: situacaoApartamento.bloqueado,
      })
      .from(comprador)
      .innerJoin(apartamento, eq(apartamento.id, comprador.apartamentoId))
      .leftJoin(situacaoApartamento, situacaoNaEleicao(el.id))
      .where(
        and(
          eq(comprador.id, e.compradorId),
          eq(comprador.apartamentoId, e.apartamentoId),
          eq(apartamento.empreendimentoId, el.empreendimentoId),
        ),
      );
    if (!c?.documento) {
      throw new EntradaInvalida("Comprador não encontrado neste apartamento.");
    }
    if (c.bloqueado) return { erro: "bloqueado" as const };
    await exigirCandidato(tx, el.id, e.candidatoId);
    return [
      {
        apartamentoId: e.apartamentoId,
        candidatoId: e.candidatoId,
        compradorId: e.compradorId,
        documento: c.documento,
        nome: c.nome,
        origem: "documento",
      },
    ];
  });
  if (!r.ok) return r;

  const [v] = r.votos;
  const proximos = (await apartamentosDoDocumento(db, r.el, v.documento))
    .filter(
      (a) => !a.votouEm && !a.bloqueado && a.apartamentoId !== e.apartamentoId,
    )
    .map(({ apartamentoId, compradorId, bloco, rotulo }) => ({
      apartamentoId,
      compradorId,
      bloco,
      rotulo,
    }));
  return {
    ok: true,
    votoId: v.id,
    comprovante: v.comprovante,
    horario: v.criadoEm,
    proximos,
  };
}

export type ResultadoMesa =
  | {
      ok: true;
      votos: {
        votoId: number;
        apartamentoId: number;
        comprovante: string;
        horario: Date;
      }[];
    }
  | { ok: false; erro: "eleicao_fechada" | "ja_votou" | "documento_invalido" };

const entradaMesa = z.object({
  eleicaoId: id,
  apartamentoIds: z
    .array(id)
    .min(1)
    .max(500)
    .refine((ids) => new Set(ids).size === ids.length, "Apartamento repetido."),
  candidatoId: id,
  nome: z.string().trim().min(1, "Informe o nome de quem vota.").max(200),
  documento: documentoDigitado,
  motivo,
  usuarioId: id,
});

/**
 * Voto pela mesa, só pelo godmode (R12): um voto por apartamento, todos ou
 * nenhum. Se algum apartamento já votou, nada é gravado.
 */
export async function votarPelaMesa(
  entrada: z.input<typeof entradaMesa>,
): Promise<ResultadoMesa> {
  const e = validar(entradaMesa, entrada);
  await exigirPapel(db, e.usuarioId, ["god"]);
  const doc = validarDocumento(e.documento);
  if (!doc) return { ok: false, erro: "documento_invalido" };

  const r = await gravarVotos(
    e.eleicaoId,
    async (tx, el) => {
      await exigirApartamentos(tx, el, e.apartamentoIds);
      await exigirCandidato(tx, el.id, e.candidatoId);
      // Em ordem crescente: dois lotes simultâneos com apartamentos em comum
      // disputam o mesmo apartamento primeiro, em vez de travar um ao outro.
      const ordenados = [...e.apartamentoIds].sort((a, b) => a - b);
      return ordenados.map((apartamentoId) => ({
        apartamentoId,
        candidatoId: e.candidatoId,
        compradorId: null,
        documento: doc.documento,
        nome: e.nome,
        origem: "mesa" as const,
      }));
    },
    (tx, el, votos) =>
      registrarAuditoria(
        {
          eleicaoId: el.id,
          usuarioId: e.usuarioId,
          acao: "voto.mesa",
          motivo: e.motivo,
          dados: {
            apartamentoIds: votos.map((v) => v.apartamentoId),
            votoIds: votos.map((v) => v.id),
          },
        },
        tx,
      ),
  );
  if (!r.ok) return r;
  return {
    ok: true,
    votos: r.votos.map((v) => ({
      votoId: v.id,
      apartamentoId: v.apartamentoId,
      comprovante: v.comprovante,
      horario: v.criadoEm,
    })),
  };
}

// --- Ações do painel ---------------------------------------------------------

const entradaDesbloquear = z.object({
  eleicaoId: id,
  apartamentoId: id,
  usuarioId: id,
});

/** Zera as tentativas e libera o apartamento (operador ou god). */
export async function desbloquearApartamento(
  entrada: z.input<typeof entradaDesbloquear>,
): Promise<void> {
  const e = validar(entradaDesbloquear, entrada);
  await exigirPapel(db, e.usuarioId, ["operador", "god"]);
  const el = await buscarEleicao(db, e.eleicaoId);
  await exigirApartamentos(db, el, [e.apartamentoId]);

  await db.transaction(async (tx) => {
    await tx
      .update(situacaoApartamento)
      .set({ tentativasFalhas: 0, bloqueado: false })
      .where(
        and(
          eq(situacaoApartamento.eleicaoId, el.id),
          eq(situacaoApartamento.apartamentoId, e.apartamentoId),
        ),
      );
    await registrarAuditoria(
      {
        eleicaoId: el.id,
        usuarioId: e.usuarioId,
        acao: "apto.desbloquear",
        alvo: `apartamento:${e.apartamentoId}`,
      },
      tx,
    );
  });
}

const entradaAnular = z.object({ votoId: id, usuarioId: id, motivo });

/**
 * Anula um voto válido (god, motivo obrigatório). O voto nunca é apagado
 * (R7): vira `anulado` e o apartamento fica livre para votar de novo.
 */
export async function anularVoto(
  entrada: z.input<typeof entradaAnular>,
): Promise<{ ok: true } | { ok: false; erro: "ja_anulado" }> {
  const e = validar(entradaAnular, entrada);
  await exigirPapel(db, e.usuarioId, ["god"]);

  return db.transaction(async (tx) => {
    const [v] = await tx
      .select({
        eleicaoId: voto.eleicaoId,
        apartamentoId: voto.apartamentoId,
        status: voto.status,
      })
      .from(voto)
      .where(eq(voto.id, e.votoId))
      .for("update");
    if (!v) throw new EntradaInvalida("Voto não encontrado.");
    if (v.status !== "valido")
      return { ok: false, erro: "ja_anulado" } as const;

    await tx
      .update(voto)
      .set({ status: "anulado" })
      .where(eq(voto.id, e.votoId));
    await registrarAuditoria(
      {
        eleicaoId: v.eleicaoId,
        usuarioId: e.usuarioId,
        acao: "voto.anular",
        alvo: `voto:${e.votoId}`,
        motivo: e.motivo,
        dados: { apartamentoId: v.apartamentoId },
      },
      tx,
    );
    return { ok: true } as const;
  });
}

const entradaMover = z.object({
  votoId: id,
  apartamentoDestinoId: id,
  usuarioId: id,
  motivo,
});

/**
 * Move um voto válido para outro apartamento do empreendimento (god, motivo
 * obrigatório). Falha se o destino já tem voto válido (R1).
 */
export async function moverVoto(
  entrada: z.input<typeof entradaMover>,
): Promise<
  { ok: true } | { ok: false; erro: "ja_anulado" | "destino_ja_votou" }
> {
  const e = validar(entradaMover, entrada);
  await exigirPapel(db, e.usuarioId, ["god"]);

  try {
    return await db.transaction(async (tx) => {
      const [v] = await tx
        .select({
          eleicaoId: voto.eleicaoId,
          apartamentoId: voto.apartamentoId,
          compradorId: voto.compradorId,
          status: voto.status,
        })
        .from(voto)
        .where(eq(voto.id, e.votoId))
        .for("update");
      if (!v) throw new EntradaInvalida("Voto não encontrado.");
      if (v.status !== "valido")
        return { ok: false, erro: "ja_anulado" } as const;
      if (v.apartamentoId === e.apartamentoDestinoId) {
        throw new EntradaInvalida("O voto já é desse apartamento.");
      }
      const el = await buscarEleicao(tx, v.eleicaoId);
      await exigirApartamentos(tx, el, [e.apartamentoDestinoId]);

      await tx
        .update(voto)
        // O comprador é do apartamento de origem e sai do voto, que mantém nome
        // e documento de quem votou; o log guarda o vínculo antigo.
        .set({ apartamentoId: e.apartamentoDestinoId, compradorId: null })
        .where(eq(voto.id, e.votoId));
      await registrarAuditoria(
        {
          eleicaoId: v.eleicaoId,
          usuarioId: e.usuarioId,
          acao: "voto.mover",
          alvo: `voto:${e.votoId}`,
          motivo: e.motivo,
          dados: {
            de: v.apartamentoId,
            para: e.apartamentoDestinoId,
            compradorId: v.compradorId,
          },
        },
        tx,
      );
      return { ok: true } as const;
    });
  } catch (erro) {
    if (violacaoUnica(erro) === "um_voto_por_apto") {
      return { ok: false, erro: "destino_ja_votou" };
    }
    throw erro;
  }
}
