import { dadosPainel } from "@/lib/painel";

import { ErroHttp, idDaRota, rotaAdmin } from "../../../comum";

/** Dados do painel ao vivo: o painel consulta a cada 2 s. */
export async function GET(
  req: Request,
  ctx: RouteContext<"/api/admin/eleicoes/[id]/painel">,
) {
  return rotaAdmin(req, async () => {
    const dados = await dadosPainel(await idDaRota(ctx.params));
    if (!dados) throw new ErroHttp(404, "Eleição não encontrada.");
    return dados;
  });
}
