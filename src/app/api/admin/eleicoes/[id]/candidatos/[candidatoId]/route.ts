import { removerCandidato, salvarCandidato } from "@/lib/eleicoes";

import { idDaRota, lerCorpo, rotaAdmin } from "../../../../comum";
import { corpoCandidato } from "../corpo";

type Contexto =
  RouteContext<"/api/admin/eleicoes/[id]/candidatos/[candidatoId]">;

export async function POST(req: Request, ctx: Contexto) {
  return rotaAdmin(req, async (usuario) =>
    salvarCandidato({
      ...(await lerCorpo(req, corpoCandidato)),
      eleicaoId: await idDaRota(ctx.params),
      candidatoId: await idDaRota(ctx.params, "candidatoId"),
      usuarioId: usuario.id,
    }),
  );
}

export async function DELETE(req: Request, ctx: Contexto) {
  return rotaAdmin(req, async (usuario) =>
    removerCandidato({
      eleicaoId: await idDaRota(ctx.params),
      candidatoId: await idDaRota(ctx.params, "candidatoId"),
      usuarioId: usuario.id,
    }),
  );
}
