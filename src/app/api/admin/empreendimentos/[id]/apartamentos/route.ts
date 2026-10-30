import { salvarApartamento } from "@/lib/cadastro";

import { idDaRota, lerCorpo, rotaAdmin } from "../../../comum";
import { corpoApartamento } from "./corpo";

/** Cria um apartamento com os compradores. */
export async function POST(
  req: Request,
  ctx: RouteContext<"/api/admin/empreendimentos/[id]/apartamentos">,
) {
  return rotaAdmin(req, async (usuario) =>
    salvarApartamento({
      ...(await lerCorpo(req, corpoApartamento)),
      empreendimentoId: await idDaRota(ctx.params),
      usuarioId: usuario.id,
    }),
  );
}
