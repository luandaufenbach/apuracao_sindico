// Eleições, candidatos e troca de status pelo painel (docs/ESPECIFICACAO.md,
// "Admin"). Toda ação grava log de auditoria.
import { randomInt } from "node:crypto";

import { and, asc, count, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import {
  apartamento,
  candidato,
  eleicao,
  empreendimento,
  voto,
} from "@/db/schema";

import { registrarAuditoria } from "./auditoria";
import { EntradaInvalida, idBanco, validar, violacaoUnica } from "./erros";

export type StatusEleicao = (typeof eleicao.$inferSelect)["status"];

// --- Eleições ----------------------------------------------------------------

// Sem 0/O/1/I/L, para ditar o link sem confusão.
const ALFABETO_CODIGO = "23456789abcdefghjkmnpqrstuvwxyz";

function gerarCodigo(): string {
  let codigo = "";
  for (let i = 0; i < 8; i++) {
    codigo += ALFABETO_CODIGO[randomInt(ALFABETO_CODIGO.length)];
  }
  return codigo;
}

const titulo = z.string().trim().min(1, "Informe o título.").max(200);

const entradaNovaEleicao = z.object({
  empreendimentoId: idBanco,
  titulo,
});

export async function criarEleicao(
  entrada: z.input<typeof entradaNovaEleicao>,
  usuarioId: number,
): Promise<{ id: number; codigo: string }> {
  const e = validar(entradaNovaEleicao, entrada);
  for (let tentativa = 1; ; tentativa++) {
    try {
      return await db.transaction(async (tx) => {
        const [emp] = await tx
          .select({ id: empreendimento.id })
          .from(empreendimento)
          .where(eq(empreendimento.id, e.empreendimentoId));
        if (!emp) throw new EntradaInvalida("Empreendimento não encontrado.");
        const [el] = await tx
          .insert(eleicao)
          .values({ ...e, codigo: gerarCodigo() })
          .returning({ id: eleicao.id, codigo: eleicao.codigo });
        await registrarAuditoria(
          {
            eleicaoId: el.id,
            usuarioId,
            acao: "eleicao.criar",
            alvo: `eleicao:${el.id}`,
            dados: { titulo: e.titulo },
          },
          tx,
        );
        return el;
      });
    } catch (erro) {
      // Código repetido (1 em ~10¹²): sorteia de novo.
      if (violacaoUnica(erro) === "eleicao_codigo_unique" && tentativa < 5) {
        continue;
      }
      throw erro;
    }
  }
}

const entradaEditarEleicao = z.object({ titulo });

/** Muda o título. */
export async function editarEleicao(
  id: number,
  entrada: z.input<typeof entradaEditarEleicao>,
  usuarioId: number,
): Promise<void> {
  const e = validar(entradaEditarEleicao, entrada);
  await db.transaction(async (tx) => {
    const feito = await tx
      .update(eleicao)
      .set(e)
      .where(eq(eleicao.id, id))
      .returning({ id: eleicao.id });
    if (feito.length === 0) {
      throw new EntradaInvalida("Eleição não encontrada.");
    }
    await registrarAuditoria(
      {
        eleicaoId: id,
        usuarioId,
        acao: "eleicao.editar",
        alvo: `eleicao:${id}`,
        dados: e,
      },
      tx,
    );
  });
}

export async function listarEleicoes() {
  const votos = db
    .select({ eleicaoId: voto.eleicaoId, total: count().as("total") })
    .from(voto)
    .where(eq(voto.status, "valido"))
    .groupBy(voto.eleicaoId)
    .as("votos");
  return db
    .select({
      id: eleicao.id,
      titulo: eleicao.titulo,
      codigo: eleicao.codigo,
      status: eleicao.status,
      empreendimento: empreendimento.nome,
      votos: sql<number>`coalesce(${votos.total}, 0)`.mapWith(Number),
    })
    .from(eleicao)
    .innerJoin(empreendimento, eq(empreendimento.id, eleicao.empreendimentoId))
    .leftJoin(votos, eq(votos.eleicaoId, eleicao.id))
    .orderBy(sql`${eleicao.id} desc`);
}

export async function buscarEleicao(id: number) {
  const [el] = await db
    .select({
      id: eleicao.id,
      titulo: eleicao.titulo,
      codigo: eleicao.codigo,
      status: eleicao.status,
      abertaEm: eleicao.abertaEm,
      encerradaEm: eleicao.encerradaEm,
      empreendimentoId: eleicao.empreendimentoId,
      empreendimento: empreendimento.nome,
    })
    .from(eleicao)
    .innerJoin(empreendimento, eq(empreendimento.id, eleicao.empreendimentoId))
    .where(eq(eleicao.id, id));
  if (!el) return null;
  const candidatos = await db
    .select({
      id: candidato.id,
      nome: candidato.nome,
      apartamentoId: candidato.apartamentoId,
      bloco: apartamento.bloco,
      rotulo: apartamento.rotulo,
      foto: candidato.foto,
      proposta: candidato.proposta,
      ordem: candidato.ordem,
    })
    .from(candidato)
    .leftJoin(apartamento, eq(apartamento.id, candidato.apartamentoId))
    .where(eq(candidato.eleicaoId, id))
    .orderBy(asc(candidato.ordem), asc(candidato.id));
  const [{ apartamentos }] = await db
    .select({ apartamentos: count() })
    .from(apartamento)
    .where(eq(apartamento.empreendimentoId, el.empreendimentoId));
  return { ...el, candidatos, apartamentos };
}

// --- Status ------------------------------------------------------------------

export const ACOES_STATUS = {
  abrir: { de: "rascunho", para: "aberta" },
  encerrar: { de: "aberta", para: "encerrada" },
  publicar: { de: "encerrada", para: "publicada" },
} as const;

export type AcaoStatus = keyof typeof ACOES_STATUS;

const entradaStatus = z.object({
  acao: z.enum(Object.keys(ACOES_STATUS) as [AcaoStatus, ...AcaoStatus[]]),
});

/**
 * rascunho → aberta → encerrada → publicada. Encerrar trava a eleição para
 * escrita e espera os votos em andamento (que a travam para leitura) gravarem.
 */
export async function mudarStatus(
  id: number,
  entrada: { acao: string },
  usuarioId: number,
): Promise<StatusEleicao> {
  const { acao } = validar(entradaStatus, entrada);
  const { de, para } = ACOES_STATUS[acao];
  return db.transaction(async (tx) => {
    const [el] = await tx
      .select({
        status: eleicao.status,
        empreendimentoId: eleicao.empreendimentoId,
      })
      .from(eleicao)
      .where(eq(eleicao.id, id))
      .for("update");
    if (!el) throw new EntradaInvalida("Eleição não encontrada.");
    if (el.status !== de) {
      throw new EntradaInvalida(
        `A eleição está ${el.status}; esta ação vale para eleição ${de}.`,
      );
    }
    if (acao === "abrir") {
      const [{ candidatos }] = await tx
        .select({ candidatos: count() })
        .from(candidato)
        .where(eq(candidato.eleicaoId, id));
      if (candidatos === 0) {
        throw new EntradaInvalida(
          "Cadastre ao menos um candidato antes de abrir.",
        );
      }
      const [{ apartamentos }] = await tx
        .select({ apartamentos: count() })
        .from(apartamento)
        .where(eq(apartamento.empreendimentoId, el.empreendimentoId));
      if (apartamentos === 0) {
        throw new EntradaInvalida(
          "O empreendimento não tem apartamentos. Importe a planilha antes de abrir.",
        );
      }
    }
    const agora = new Date();
    await tx
      .update(eleicao)
      .set({
        status: para,
        ...(acao === "abrir" && { abertaEm: agora }),
        ...(acao === "encerrar" && { encerradaEm: agora }),
      })
      .where(eq(eleicao.id, id));
    await registrarAuditoria(
      {
        eleicaoId: id,
        usuarioId,
        acao: `eleicao.${acao}`,
        alvo: `eleicao:${id}`,
        dados: { de, para },
      },
      tx,
    );
    return para;
  });
}

// --- Candidatos --------------------------------------------------------------

/** Foto já redimensionada no navegador para 400 px: até ~150 KB em JPEG. */
const TAMANHO_MAXIMO_FOTO = 200_000;

export const entradaCandidato = z.object({
  nome: z.string().trim().min(1, "Informe o nome.").max(120),
  apartamentoId: idBanco.nullable(),
  foto: z
    .string()
    .max(TAMANHO_MAXIMO_FOTO, "A foto está grande demais.")
    .regex(
      /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+=*$/,
      "Foto em formato inválido.",
    )
    .nullable(),
  proposta: z
    .string()
    .trim()
    .max(300, "A proposta tem no máximo 300 caracteres."),
  ordem: z.int().min(0).max(999),
});

export type EntradaCandidato = z.input<typeof entradaCandidato>;

/** Cria (sem `candidatoId`) ou edita um candidato. Depois de encerrada, não muda. */
export async function salvarCandidato(
  entrada: {
    eleicaoId: number;
    candidatoId?: number;
    usuarioId: number;
  } & EntradaCandidato,
): Promise<{ id: number }> {
  const { eleicaoId, candidatoId, usuarioId } = entrada;
  const c = validar(entradaCandidato, entrada);
  return db.transaction(async (tx) => {
    const [el] = await tx
      .select({
        status: eleicao.status,
        empreendimentoId: eleicao.empreendimentoId,
      })
      .from(eleicao)
      .where(eq(eleicao.id, eleicaoId))
      .for("share");
    if (!el) throw new EntradaInvalida("Eleição não encontrada.");
    if (el.status !== "rascunho" && el.status !== "aberta") {
      throw new EntradaInvalida(
        "Depois de encerrada, os candidatos não mudam.",
      );
    }
    if (candidatoId === undefined && el.status !== "rascunho") {
      throw new EntradaInvalida(
        "Candidato novo só entra com a eleição em rascunho.",
      );
    }
    if (c.apartamentoId !== null) {
      const [apto] = await tx
        .select({ id: apartamento.id })
        .from(apartamento)
        .where(
          and(
            eq(apartamento.id, c.apartamentoId),
            eq(apartamento.empreendimentoId, el.empreendimentoId),
          ),
        );
      if (!apto) {
        throw new EntradaInvalida(
          "Apartamento não encontrado neste empreendimento.",
        );
      }
    }
    const valores = { ...c, proposta: c.proposta || null };
    let id: number;
    if (candidatoId === undefined) {
      [{ id }] = await tx
        .insert(candidato)
        .values({ ...valores, eleicaoId })
        .returning({ id: candidato.id });
    } else {
      const feito = await tx
        .update(candidato)
        .set(valores)
        .where(
          and(
            eq(candidato.id, candidatoId),
            eq(candidato.eleicaoId, eleicaoId),
          ),
        )
        .returning({ id: candidato.id });
      if (feito.length === 0) {
        throw new EntradaInvalida("Candidato não encontrado nesta eleição.");
      }
      id = candidatoId;
    }
    await registrarAuditoria(
      {
        eleicaoId,
        usuarioId,
        acao:
          candidatoId === undefined ? "candidato.criar" : "candidato.editar",
        alvo: `candidato:${id}`,
        dados: {
          nome: c.nome,
          apartamentoId: c.apartamentoId,
          ordem: c.ordem,
          foto: c.foto !== null,
        },
      },
      tx,
    );
    return { id };
  });
}

/** Remove um candidato; só com a eleição em rascunho (ainda sem votos). */
export async function removerCandidato(entrada: {
  eleicaoId: number;
  candidatoId: number;
  usuarioId: number;
}): Promise<void> {
  const { eleicaoId, candidatoId, usuarioId } = entrada;
  await db.transaction(async (tx) => {
    const [el] = await tx
      .select({ status: eleicao.status })
      .from(eleicao)
      .where(eq(eleicao.id, eleicaoId))
      .for("update");
    if (!el) throw new EntradaInvalida("Eleição não encontrada.");
    if (el.status !== "rascunho") {
      throw new EntradaInvalida("Candidato só sai com a eleição em rascunho.");
    }
    const [{ votos }] = await tx
      .select({ votos: count() })
      .from(voto)
      .where(eq(voto.candidatoId, candidatoId));
    if (votos > 0) {
      throw new EntradaInvalida("Este candidato tem votos e não pode sair.");
    }
    const feito = await tx
      .delete(candidato)
      .where(
        and(eq(candidato.id, candidatoId), eq(candidato.eleicaoId, eleicaoId)),
      )
      .returning({ nome: candidato.nome });
    if (feito.length === 0) {
      throw new EntradaInvalida("Candidato não encontrado nesta eleição.");
    }
    await registrarAuditoria(
      {
        eleicaoId,
        usuarioId,
        acao: "candidato.remover",
        alvo: `candidato:${candidatoId}`,
        dados: { nome: feito[0].nome },
      },
      tx,
    );
  });
}
