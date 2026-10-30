import { salvarCandidato } from "@/lib/eleicoes";

import { idDaRota, lerCorpo, rotaAdmin } from "../../../comum";
import { corpoCandidato } from "./corpo";

export async function POST(
  req: Request,
  ctx: RouteContext<"/api/admin/eleicoes/[id]/candidatos">,
) {
  return rotaAdmin(req, async (usuario) =>
    salvarCandidato({
      ...(await lerCorpo(req, corpoCandidato)),
      eleicaoId: await idDaRota(ctx.params),
      usuarioId: usuario.id,
    }),
  );
}
