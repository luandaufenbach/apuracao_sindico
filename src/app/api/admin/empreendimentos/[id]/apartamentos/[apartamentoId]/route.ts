import { removerApartamento, salvarApartamento } from "@/lib/cadastro";

import { idDaRota, lerCorpo, rotaAdmin } from "../../../../comum";
import { corpoApartamento } from "../corpo";

type Contexto =
  RouteContext<"/api/admin/empreendimentos/[id]/apartamentos/[apartamentoId]">;

/** Edita o apartamento e os compradores. */
export async function POST(req: Request, ctx: Contexto) {
  return rotaAdmin(req, async (usuario) =>
    salvarApartamento({
      ...(await lerCorpo(req, corpoApartamento)),
      empreendimentoId: await idDaRota(ctx.params),
      apartamentoId: await idDaRota(ctx.params, "apartamentoId"),
      usuarioId: usuario.id,
    }),
  );
}

export async function DELETE(req: Request, ctx: Contexto) {
  return rotaAdmin(req, async (usuario) =>
    removerApartamento({
      empreendimentoId: await idDaRota(ctx.params),
      apartamentoId: await idDaRota(ctx.params, "apartamentoId"),
      usuarioId: usuario.id,
    }),
  );
}
