// Dados do painel ao vivo e do relatório (docs/ESPECIFICACAO.md, "Admin" e
// "Quem vê o quê"). O operador vê quem votou, quando e por onde, mas nunca em
// quem cada apartamento votou: nenhuma consulta daqui liga voto a candidato,
// só o total por candidato no relatório, depois do encerramento.
import {
  and,
  count,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  isNull,
  like,
  lte,
  or,
  sql,
} from "drizzle-orm";

import { db } from "@/db";
import {
  apartamento,
  candidato,
  comprador,
  eleicao,
  empreendimento,
  logAuditoria,
  situacaoApartamento,
  usuarioAdmin,
  voto,
} from "@/db/schema";

import { ACOES_GOD } from "./auditoria";
import { descreverAcoes } from "./godmode";
import { ordemApartamento } from "./ordem-apartamento";
import { LIMITE_TENTATIVAS } from "./regras-voto";

async function cabecalho(eleicaoId: number) {
  const [el] = await db
    .select({
      id: eleicao.id,
      titulo: eleicao.titulo,
      codigo: eleicao.codigo,
      status: eleicao.status,
      teste: eleicao.teste,
      abertaEm: eleicao.abertaEm,
      encerradaEm: eleicao.encerradaEm,
      empreendimentoId: eleicao.empreendimentoId,
      empreendimento: empreendimento.nome,
    })
    .from(eleicao)
    .innerJoin(empreendimento, eq(empreendimento.id, eleicao.empreendimentoId))
    .where(eq(eleicao.id, eleicaoId));
  return el ?? null;
}

const votoValidoDoApto = (eleicaoId: number) =>
  and(
    eq(voto.apartamentoId, apartamento.id),
    eq(voto.eleicaoId, eleicaoId),
    eq(voto.status, "valido"),
  );

export type ApartamentoPainel = {
  id: number;
  bloco: string;
  rotulo: string;
  votouEm: Date | null;
  /** De quem votou (comprador verificado ou informado na mesa). */
  nome: string | null;
  origem: "documento" | "mesa" | null;
  bloqueado: boolean;
  tentativas: number;
  soMesa: boolean;
};

/** Contadores, grade de apartamentos e últimos votos, sem candidato. */
export async function dadosPainel(eleicaoId: number) {
  const el = await cabecalho(eleicaoId);
  if (!el) return null;

  const apartamentos: ApartamentoPainel[] = await db
    .select({
      id: apartamento.id,
      bloco: apartamento.bloco,
      rotulo: apartamento.rotulo,
      votouEm: voto.criadoEm,
      nome: voto.nome,
      origem: voto.origem,
      bloqueado: sql<boolean>`coalesce(${situacaoApartamento.bloqueado}, false)`,
      tentativas: sql<number>`coalesce(${situacaoApartamento.tentativasFalhas}, 0)`,
      soMesa: sql<boolean>`not exists (
        select 1 from ${comprador}
        where ${comprador.apartamentoId} = ${apartamento.id}
          and ${isNotNull(comprador.documento)})`,
    })
    .from(apartamento)
    .leftJoin(voto, votoValidoDoApto(el.id))
    .leftJoin(
      situacaoApartamento,
      and(
        eq(situacaoApartamento.apartamentoId, apartamento.id),
        eq(situacaoApartamento.eleicaoId, el.id),
      ),
    )
    .where(eq(apartamento.empreendimentoId, el.empreendimentoId))
    .orderBy(...ordemApartamento);

  const ultimos = await db
    .select({
      votoId: voto.id,
      apartamentoId: voto.apartamentoId,
      bloco: apartamento.bloco,
      rotulo: apartamento.rotulo,
      nome: voto.nome,
      origem: voto.origem,
      horario: voto.criadoEm,
    })
    .from(voto)
    .innerJoin(apartamento, eq(apartamento.id, voto.apartamentoId))
    .where(and(eq(voto.eleicaoId, el.id), eq(voto.status, "valido")))
    .orderBy(desc(voto.criadoEm), desc(voto.id))
    .limit(20);

  const votaram = apartamentos.filter((a) => a.votouEm).length;
  return {
    eleicao: {
      id: el.id,
      titulo: el.titulo,
      codigo: el.codigo,
      status: el.status,
      empreendimento: el.empreendimento,
    },
    contadores: {
      total: apartamentos.length,
      votaram,
      faltam: apartamentos.length - votaram,
      bloqueados: apartamentos.filter((a) => a.bloqueado && !a.votouEm).length,
      soMesa: apartamentos.filter((a) => a.soMesa && !a.votouEm).length,
    },
    limiteTentativas: LIMITE_TENTATIVAS,
    apartamentos,
    ultimos,
  };
}

export type DadosPainel = NonNullable<Awaited<ReturnType<typeof dadosPainel>>>;

/** Tudo que o relatório final imprime. O resultado só sai depois de encerrar. */
export async function dadosRelatorio(eleicaoId: number) {
  const el = await cabecalho(eleicaoId);
  if (!el) return null;

  const [{ total }] = await db
    .select({ total: count() })
    .from(apartamento)
    .where(eq(apartamento.empreendimentoId, el.empreendimentoId));

  const votaram = await db
    .select({
      bloco: apartamento.bloco,
      rotulo: apartamento.rotulo,
      horario: voto.criadoEm,
      origem: voto.origem,
    })
    .from(voto)
    .innerJoin(apartamento, eq(apartamento.id, voto.apartamentoId))
    .where(and(eq(voto.eleicaoId, el.id), eq(voto.status, "valido")))
    .orderBy(...ordemApartamento);

  const apurada = el.status === "encerrada" || el.status === "publicada";
  let resultado: { id: number; nome: string; votos: number }[] | null = null;
  if (apurada) {
    resultado = await db
      .select({
        id: candidato.id,
        nome: candidato.nome,
        votos: sql<number>`count(${voto.id})`.mapWith(Number),
      })
      .from(candidato)
      .leftJoin(
        voto,
        and(eq(voto.candidatoId, candidato.id), eq(voto.status, "valido")),
      )
      .where(eq(candidato.eleicaoId, el.id))
      .groupBy(candidato.id)
      .orderBy(sql`count(${voto.id}) desc`, candidato.ordem, candidato.id);
  }
  const maximo = resultado?.[0]?.votos ?? 0;
  const vencedores =
    resultado && maximo > 0 ? resultado.filter((c) => c.votos === maximo) : [];

  // Usuários criados ou desativados com a votação aberta também entram: o log
  // deles não tem eleição.
  const usuariosNaVotacao = el.abertaEm
    ? and(
        isNull(logAuditoria.eleicaoId),
        like(logAuditoria.acao, "usuario.%"),
        gte(logAuditoria.criadoEm, el.abertaEm),
        el.encerradaEm ? lte(logAuditoria.criadoEm, el.encerradaEm) : undefined,
      )
    : undefined;
  const logsGod = await db
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
        inArray(logAuditoria.acao, [...ACOES_GOD]),
        or(eq(logAuditoria.eleicaoId, el.id), usuariosNaVotacao),
      ),
    )
    .orderBy(logAuditoria.criadoEm, logAuditoria.id);
  const detalhes = await descreverAcoes(logsGod);
  const acoesGod = logsGod.map((a) => ({
    id: a.id,
    acao: a.acao,
    alvo: a.alvo,
    motivo: a.motivo,
    criadoEm: a.criadoEm,
    usuario: a.usuario,
    detalhe: detalhes.get(a.id) ?? null,
  }));

  return {
    eleicao: el,
    totalApartamentos: total,
    votaram,
    resultado,
    vencedores,
    acoesGod,
    geradoEm: new Date(),
  };
}

export type DadosRelatorio = NonNullable<
  Awaited<ReturnType<typeof dadosRelatorio>>
>;
