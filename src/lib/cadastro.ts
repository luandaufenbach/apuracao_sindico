// Cadastro de empreendimentos, apartamentos e compradores pelo painel
// (docs/ESPECIFICACAO.md, "Admin"). Toda ação grava log de auditoria.
import { and, count, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import {
  apartamento,
  candidato,
  comprador,
  eleicao,
  empreendimento,
  situacaoApartamento,
  voto,
} from "@/db/schema";

import { agrupar } from "./agrupar";
import { registrarAuditoria } from "./auditoria";
import { validarDocumento } from "./documento";
import { EntradaInvalida, idBanco, validar, violacaoUnica } from "./erros";
import { removerCompradores } from "./importacao";
import { ordemApartamento } from "./ordem-apartamento";

// --- Empreendimentos ---------------------------------------------------------

const entradaEmpreendimento = z.object({
  nome: z.string().trim().min(1, "Informe o nome.").max(200),
});

export type EntradaEmpreendimento = z.input<typeof entradaEmpreendimento>;

export async function listarEmpreendimentos() {
  const aptos = db
    .select({
      empreendimentoId: apartamento.empreendimentoId,
      total: count().as("total"),
    })
    .from(apartamento)
    .groupBy(apartamento.empreendimentoId)
    .as("aptos");
  return db
    .select({
      id: empreendimento.id,
      nome: empreendimento.nome,
      criadoEm: empreendimento.criadoEm,
      apartamentos: sql<number>`coalesce(${aptos.total}, 0)`.mapWith(Number),
    })
    .from(empreendimento)
    .leftJoin(aptos, eq(aptos.empreendimentoId, empreendimento.id))
    .orderBy(empreendimento.nome);
}

export async function criarEmpreendimento(
  entrada: EntradaEmpreendimento,
  usuarioId: number,
): Promise<{ id: number }> {
  const { nome } = validar(entradaEmpreendimento, entrada);
  return db.transaction(async (tx) => {
    const [emp] = await tx
      .insert(empreendimento)
      .values({ nome })
      .returning({ id: empreendimento.id });
    await registrarAuditoria(
      {
        usuarioId,
        acao: "empreendimento.criar",
        alvo: `empreendimento:${emp.id}`,
        dados: { nome },
      },
      tx,
    );
    return emp;
  });
}

export async function renomearEmpreendimento(
  id: number,
  entrada: EntradaEmpreendimento,
  usuarioId: number,
): Promise<void> {
  const { nome } = validar(entradaEmpreendimento, entrada);
  await db.transaction(async (tx) => {
    const feito = await tx
      .update(empreendimento)
      .set({ nome })
      .where(eq(empreendimento.id, id))
      .returning({ id: empreendimento.id });
    if (feito.length === 0) {
      throw new EntradaInvalida("Empreendimento não encontrado.");
    }
    await registrarAuditoria(
      {
        usuarioId,
        acao: "empreendimento.editar",
        alvo: `empreendimento:${id}`,
        dados: { nome },
      },
      tx,
    );
  });
}

export type CompradorCadastro = {
  id: number;
  nome: string;
  documento: string | null;
};

export type ApartamentoCadastro = {
  id: number;
  bloco: string;
  numero: string;
  rotulo: string;
  compradores: CompradorCadastro[];
};

export async function existeEmpreendimento(id: number): Promise<boolean> {
  const [emp] = await db
    .select({ id: empreendimento.id })
    .from(empreendimento)
    .where(eq(empreendimento.id, id));
  return !!emp;
}

/** Só id, bloco e rótulo, em ordem: para listas de escolha. */
export function listarApartamentos(empreendimentoId: number) {
  return db
    .select({
      id: apartamento.id,
      bloco: apartamento.bloco,
      rotulo: apartamento.rotulo,
    })
    .from(apartamento)
    .where(eq(apartamento.empreendimentoId, empreendimentoId))
    .orderBy(...ordemApartamento);
}

/** Empreendimento com apartamentos e compradores, em ordem de bloco e número. */
export async function buscarEmpreendimento(id: number) {
  const [emp] = await db
    .select({ id: empreendimento.id, nome: empreendimento.nome })
    .from(empreendimento)
    .where(eq(empreendimento.id, id));
  if (!emp) return null;

  const aptos = await db
    .select({
      id: apartamento.id,
      bloco: apartamento.bloco,
      numero: apartamento.numero,
      rotulo: apartamento.rotulo,
    })
    .from(apartamento)
    .where(eq(apartamento.empreendimentoId, id))
    .orderBy(...ordemApartamento);
  const compradores =
    aptos.length === 0
      ? []
      : await db
          .select({
            id: comprador.id,
            apartamentoId: comprador.apartamentoId,
            nome: comprador.nome,
            documento: comprador.documento,
          })
          .from(comprador)
          .where(
            inArray(
              comprador.apartamentoId,
              aptos.map((a) => a.id),
            ),
          )
          .orderBy(comprador.id);
  const porApto = agrupar(compradores, (c) => c.apartamentoId);
  const eleicoes = await db
    .select({ id: eleicao.id, titulo: eleicao.titulo, status: eleicao.status })
    .from(eleicao)
    .where(eq(eleicao.empreendimentoId, id))
    .orderBy(eleicao.id);

  return {
    ...emp,
    eleicoes,
    apartamentos: aptos.map((a): ApartamentoCadastro => ({
      ...a,
      compradores: (porApto.get(a.id) ?? []).map(({ id, nome, documento }) => ({
        id,
        nome,
        documento,
      })),
    })),
  };
}

// --- Apartamentos e compradores ---------------------------------------------

const texto = (max: number, mensagem: string) =>
  z.string().trim().min(1, mensagem).max(max);

const entradaApartamento = z.object({
  bloco: texto(50, "Informe o bloco."),
  numero: z
    .string()
    .trim()
    .regex(/^\d{1,6}$/, "O número do apartamento só tem dígitos."),
  rotulo: texto(50, "Informe o rótulo (ex.: Ap 101)."),
  compradores: z
    .array(
      z.object({
        id: idBanco.optional(),
        nome: texto(200, "Informe o nome do comprador."),
        // Vazio: sem documento (o apartamento pode ficar só pela mesa).
        documento: z.string().trim().max(32),
      }),
    )
    .max(10),
});

export type EntradaApartamento = z.input<typeof entradaApartamento>;

function documentoDoCadastro(digitado: string, nome: string): string | null {
  if (!digitado) return null;
  const doc = validarDocumento(digitado);
  if (!doc) {
    throw new EntradaInvalida(
      `Documento de ${nome} inválido. Corrija ou deixe em branco (só pela mesa).`,
    );
  }
  return doc.documento;
}

/**
 * Cria (sem `apartamentoId`) ou edita um apartamento com os compradores. Os
 * compradores que saem da lista são apagados, menos quem já votou.
 */
export async function salvarApartamento(
  entrada: {
    empreendimentoId: number;
    apartamentoId?: number;
    usuarioId: number;
  } & EntradaApartamento,
): Promise<{ id: number }> {
  const { empreendimentoId, apartamentoId, usuarioId } = entrada;
  const a = validar(entradaApartamento, entrada);
  const compradores = a.compradores.map((c) => ({
    id: c.id,
    nome: c.nome,
    documento: documentoDoCadastro(c.documento, c.nome),
  }));

  try {
    return await db.transaction(async (tx) => {
      const [emp] = await tx
        .select({ id: empreendimento.id })
        .from(empreendimento)
        .where(eq(empreendimento.id, empreendimentoId));
      if (!emp) throw new EntradaInvalida("Empreendimento não encontrado.");

      let id: number;
      if (apartamentoId === undefined) {
        [{ id }] = await tx
          .insert(apartamento)
          .values({
            empreendimentoId,
            bloco: a.bloco,
            numero: a.numero,
            rotulo: a.rotulo,
          })
          .returning({ id: apartamento.id });
      } else {
        const feito = await tx
          .update(apartamento)
          .set({ bloco: a.bloco, numero: a.numero, rotulo: a.rotulo })
          .where(
            and(
              eq(apartamento.id, apartamentoId),
              eq(apartamento.empreendimentoId, empreendimentoId),
            ),
          )
          .returning({ id: apartamento.id });
        if (feito.length === 0) {
          throw new EntradaInvalida("Apartamento não encontrado.");
        }
        id = apartamentoId;
      }

      const atuais = await tx
        .select({ id: comprador.id })
        .from(comprador)
        .where(eq(comprador.apartamentoId, id));
      const idsAtuais = new Set(atuais.map((c) => c.id));
      for (const c of compradores) {
        if (c.id !== undefined && !idsAtuais.has(c.id)) {
          throw new EntradaInvalida("Comprador não é deste apartamento.");
        }
      }
      const mantidos = new Set(compradores.map((c) => c.id));
      const sair = atuais.filter((c) => !mantidos.has(c.id)).map((c) => c.id);
      if (sair.length > 0) await removerCompradores(tx, sair);
      for (const c of compradores) {
        if (c.id === undefined) {
          await tx.insert(comprador).values({
            apartamentoId: id,
            nome: c.nome,
            documento: c.documento,
          });
        } else {
          await tx
            .update(comprador)
            .set({ nome: c.nome, documento: c.documento })
            .where(eq(comprador.id, c.id));
        }
      }

      await registrarAuditoria(
        {
          usuarioId,
          acao: apartamentoId === undefined ? "apto.criar" : "apto.editar",
          alvo: `apartamento:${id}`,
          dados: {
            bloco: a.bloco,
            numero: a.numero,
            rotulo: a.rotulo,
            compradores: compradores.length,
            compradoresRemovidos: sair.length,
          },
        },
        tx,
      );
      return { id };
    });
  } catch (erro) {
    if (violacaoUnica(erro)) {
      throw new EntradaInvalida(
        `Já existe o ${a.bloco}, apartamento ${a.numero}, neste empreendimento.`,
      );
    }
    throw erro;
  }
}

/** Remove um apartamento sem voto, candidato nem situação em eleição. */
export async function removerApartamento(entrada: {
  empreendimentoId: number;
  apartamentoId: number;
  usuarioId: number;
}): Promise<void> {
  const { empreendimentoId, apartamentoId, usuarioId } = entrada;
  await db.transaction(async (tx) => {
    const [apto] = await tx
      .select({
        id: apartamento.id,
        rotulo: apartamento.rotulo,
        bloco: apartamento.bloco,
      })
      .from(apartamento)
      .where(
        and(
          eq(apartamento.id, apartamentoId),
          eq(apartamento.empreendimentoId, empreendimentoId),
        ),
      )
      .for("update");
    if (!apto) throw new EntradaInvalida("Apartamento não encontrado.");
    const [usos] = await tx
      .select({
        votos:
          sql<number>`(select count(*) from ${voto} where ${voto.apartamentoId} = ${apartamentoId})`.mapWith(
            Number,
          ),
        candidatos:
          sql<number>`(select count(*) from ${candidato} where ${candidato.apartamentoId} = ${apartamentoId})`.mapWith(
            Number,
          ),
        situacoes:
          sql<number>`(select count(*) from ${situacaoApartamento} where ${situacaoApartamento.apartamentoId} = ${apartamentoId})`.mapWith(
            Number,
          ),
      })
      .from(apartamento)
      .where(eq(apartamento.id, apartamentoId));
    if (usos.votos + usos.candidatos + usos.situacoes > 0) {
      throw new EntradaInvalida(
        "Este apartamento já tem voto, candidato ou tentativa numa eleição e não pode sair.",
      );
    }
    await tx
      .delete(comprador)
      .where(eq(comprador.apartamentoId, apartamentoId));
    await tx.delete(apartamento).where(eq(apartamento.id, apartamentoId));
    await registrarAuditoria(
      {
        usuarioId,
        acao: "apto.remover",
        alvo: `apartamento:${apartamentoId}`,
        dados: { bloco: apto.bloco, rotulo: apto.rotulo },
      },
      tx,
    );
  });
}
