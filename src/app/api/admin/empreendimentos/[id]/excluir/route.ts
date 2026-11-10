import { z } from "zod";

import { excluirEmpreendimento } from "@/lib/cadastro";

import { idDaRota, lerCorpo, rotaGod } from "../../../comum";

const corpoExcluir = z.object({ motivo: z.string(), confirmacao: z.string() });

/** Exclui o empreendimento sem votos, com apartamentos e eleições (só god). */
export async function POST(
  req: Request,
  ctx: RouteContext<"/api/admin/empreendimentos/[id]/excluir">,
) {
  return rotaGod(req, async (usuario) => {
    const { motivo, confirmacao } = await lerCorpo(req, corpoExcluir);
    await excluirEmpreendimento({
      empreendimentoId: await idDaRota(ctx.params),
      usuarioId: usuario.id,
      motivo,
      confirmacao,
    });
  });
}
