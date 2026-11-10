import { z } from "zod";

import { buscarEleicao, editarEleicao } from "@/lib/eleicoes";

import { ErroHttp, idDaRota, lerCorpo, rotaAdmin } from "../../comum";

/** Eleição com os candidatos. */
export async function GET(
  req: Request,
  ctx: RouteContext<"/api/admin/eleicoes/[id]">,
) {
  return rotaAdmin(req, async () => {
    const el = await buscarEleicao(await idDaRota(ctx.params));
    if (!el) throw new ErroHttp(404, "Eleição não encontrada.");
    return el;
  });
}

const corpoEditar = z.object({ titulo: z.string() });

export async function POST(
  req: Request,
  ctx: RouteContext<"/api/admin/eleicoes/[id]">,
) {
  return rotaAdmin(req, async (usuario) =>
    editarEleicao(
      await idDaRota(ctx.params),
      await lerCorpo(req, corpoEditar),
      usuario.id,
    ),
  );
}
