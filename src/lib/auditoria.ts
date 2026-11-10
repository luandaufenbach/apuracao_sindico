import { z } from "zod";

import { db, type Executor } from "@/db";
import { logAuditoria } from "@/db/schema";

import { idBanco, validar } from "./erros";

/**
 * Ações de godmode: exigem usuário e motivo (R8) e aparecem na auditoria.
 * As demais ações de operador também gravam log, com motivo opcional.
 */
export const ACOES_GOD = [
  "voto.mesa",
  "voto.anular",
  "voto.mover",
  "eleicao.reabrir",
  // O zerar saiu do app; a ação fica para os logs antigos.
  "eleicao.zerar",
  "usuario.criar",
  "usuario.desativar",
  "empreendimento.excluir",
] as const;

export function acaoGod(acao: string): boolean {
  return (ACOES_GOD as readonly string[]).includes(acao);
}

const id = idBanco;

const entradaAuditoria = z
  .object({
    eleicaoId: id.nullish(),
    // null = ação do eleitor
    usuarioId: id.nullish(),
    acao: z
      .string()
      .regex(/^[a-z_]+\.[a-z_]+$/, "Ação no formato 'alvo.verbo'."),
    alvo: z.string().max(500).nullish(),
    motivo: z.string().trim().max(500).nullish(),
    dados: z.record(z.string(), z.unknown()).nullish(),
  })
  .superRefine((v, ctx) => {
    if (!acaoGod(v.acao)) return;
    if (!v.usuarioId) {
      ctx.addIssue({
        code: "custom",
        path: ["usuarioId"],
        message: "Ação de godmode exige o usuário.",
      });
    }
    if (!v.motivo) {
      ctx.addIssue({
        code: "custom",
        path: ["motivo"],
        message: "Ação de godmode exige motivo.",
      });
    }
  });

export type EntradaAuditoria = z.input<typeof entradaAuditoria>;

/** Grava uma linha em log_auditoria. Passe a transação para gravar junto com a ação. */
export async function registrarAuditoria(
  entrada: EntradaAuditoria,
  executor: Executor = db,
): Promise<void> {
  const log = validar(entradaAuditoria, entrada);
  await executor.insert(logAuditoria).values({
    eleicaoId: log.eleicaoId ?? null,
    usuarioId: log.usuarioId ?? null,
    acao: log.acao,
    alvo: log.alvo ?? null,
    motivo: log.motivo || null,
    dados: log.dados ?? null,
  });
}
