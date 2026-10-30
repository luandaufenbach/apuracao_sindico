import { listarAuditoria } from "@/lib/godmode";

import { rotaGod } from "../comum";

const NUMEROS = ["eleicaoId", "usuarioId", "antes", "limite"] as const;

/**
 * Log de auditoria com filtros: `eleicaoId`, `grupo` (prefixo da ação),
 * `godmode=1`, `usuarioId`, `antes` (página seguinte) e `limite`.
 */
export async function GET(req: Request) {
  return rotaGod(req, async () => {
    const busca = new URL(req.url).searchParams;
    const filtros: Record<string, unknown> = {};
    for (const chave of NUMEROS) {
      const valor = busca.get(chave);
      if (valor !== null) filtros[chave] = Number(valor);
    }
    const grupo = busca.get("grupo");
    if (grupo !== null) filtros.grupo = grupo;
    if (busca.get("godmode") === "1") filtros.godmode = true;
    return listarAuditoria(filtros);
  });
}
