import { z } from "zod";

import { mudarStatus } from "@/lib/eleicoes";

import { idDaRota, lerCorpo, rotaAdmin } from "../../../comum";

const corpoStatus = z.object({ acao: z.string() });

/** Abrir votação, Encerrar ou Publicar resultado. */
export async function POST(
  req: Request,
  ctx: RouteContext<"/api/admin/eleicoes/[id]/status">,
) {
  return rotaAdmin(req, async (usuario) => ({
    status: await mudarStatus(
      await idDaRota(ctx.params),
      await lerCorpo(req, corpoStatus),
      usuario.id,
    ),
  }));
}
