import { z } from "zod";

import { reabrirEleicao } from "@/lib/godmode";

import { idDaRota, lerCorpo, rotaGod } from "../../../comum";

const corpoMotivo = z.object({ motivo: z.string() });

/** Volta a votação encerrada para aberta. */
export async function POST(
  req: Request,
  ctx: RouteContext<"/api/admin/eleicoes/[id]/reabrir">,
) {
  return rotaGod(req, async (usuario) => {
    const { motivo } = await lerCorpo(req, corpoMotivo);
    await reabrirEleicao({
      eleicaoId: await idDaRota(ctx.params),
      usuarioId: usuario.id,
      motivo,
    });
    return { status: "aberta" };
  });
}
