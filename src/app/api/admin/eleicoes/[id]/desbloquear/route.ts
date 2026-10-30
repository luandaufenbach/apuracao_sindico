import { z } from "zod";

import { idBanco } from "@/lib/erros";
import { desbloquearApartamento } from "@/lib/regras-voto";

import { idDaRota, lerCorpo, rotaAdmin } from "../../../comum";

const corpoDesbloquear = z.object({ apartamentoId: idBanco });

/** Zera as tentativas do apartamento bloqueado (R5). */
export async function POST(
  req: Request,
  ctx: RouteContext<"/api/admin/eleicoes/[id]/desbloquear">,
) {
  return rotaAdmin(req, async (usuario) => {
    const { apartamentoId } = await lerCorpo(req, corpoDesbloquear);
    await desbloquearApartamento({
      eleicaoId: await idDaRota(ctx.params),
      apartamentoId,
      usuarioId: usuario.id,
    });
  });
}
