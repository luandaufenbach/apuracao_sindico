import { z } from "zod";

import { buscarEmpreendimento, renomearEmpreendimento } from "@/lib/cadastro";

import { ErroHttp, idDaRota, lerCorpo, rotaAdmin } from "../../comum";

/** Empreendimento com apartamentos e compradores. */
export async function GET(
  req: Request,
  ctx: RouteContext<"/api/admin/empreendimentos/[id]">,
) {
  return rotaAdmin(req, async () => {
    const emp = await buscarEmpreendimento(await idDaRota(ctx.params));
    if (!emp) throw new ErroHttp(404, "Empreendimento não encontrado.");
    return emp;
  });
}

const corpoEmpreendimento = z.object({ nome: z.string() });

export async function POST(
  req: Request,
  ctx: RouteContext<"/api/admin/empreendimentos/[id]">,
) {
  return rotaAdmin(req, async (usuario) =>
    renomearEmpreendimento(
      await idDaRota(ctx.params),
      await lerCorpo(req, corpoEmpreendimento),
      usuario.id,
    ),
  );
}
