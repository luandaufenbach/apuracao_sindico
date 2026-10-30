import { votosPorDocumento } from "@/lib/godmode";

import { ErroHttp, idDaRota, rotaGod } from "../../../comum";

/** Cada documento com seus apartamentos e quem votou em cada um. */
export async function GET(
  req: Request,
  ctx: RouteContext<"/api/admin/eleicoes/[id]/votos-por-documento">,
) {
  return rotaGod(req, async () => {
    const documentos = await votosPorDocumento(await idDaRota(ctx.params));
    if (!documentos) throw new ErroHttp(404, "Eleição não encontrada.");
    return { documentos };
  });
}
