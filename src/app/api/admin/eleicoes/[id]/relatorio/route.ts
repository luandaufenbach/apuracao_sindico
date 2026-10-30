import { dadosRelatorio } from "@/lib/painel";

import { ErroHttp, idDaRota, rotaAdmin } from "../../../comum";

export async function GET(
  req: Request,
  ctx: RouteContext<"/api/admin/eleicoes/[id]/relatorio">,
) {
  return rotaAdmin(req, async () => {
    const dados = await dadosRelatorio(await idDaRota(ctx.params));
    if (!dados) throw new ErroHttp(404, "Eleição não encontrada.");
    return dados;
  });
}
