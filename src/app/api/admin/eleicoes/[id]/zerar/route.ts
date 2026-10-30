import { z } from "zod";

import { zerarEleicao } from "@/lib/godmode";

import { idDaRota, lerCorpo, rotaGod } from "../../../comum";

const corpoMotivo = z.object({ motivo: z.string() });

/** Apaga os votos de uma eleição de teste e a volta para rascunho. */
export async function POST(
  req: Request,
  ctx: RouteContext<"/api/admin/eleicoes/[id]/zerar">,
) {
  return rotaGod(req, async (usuario) => {
    const { motivo } = await lerCorpo(req, corpoMotivo);
    return zerarEleicao({
      eleicaoId: await idDaRota(ctx.params),
      usuarioId: usuario.id,
      motivo,
    });
  });
}
