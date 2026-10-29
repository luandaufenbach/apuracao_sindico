import { z } from "zod";

import { verificarDocumento } from "@/lib/regras-voto";
import { assinarToken } from "@/lib/token";

import { eleicaoPorCodigo, idBanco, lerCorpo, responder } from "../../comum";

const corpoVerificar = z.object({
  apartamentoId: idBanco,
  documento: z.string().max(32),
});

/** Confere o documento (R3 a R6) e devolve o token do voto. */
export async function POST(
  req: Request,
  ctx: RouteContext<"/api/e/[codigo]/verificar">,
) {
  return responder(async () => {
    const el = await eleicaoPorCodigo(ctx.params);
    const { apartamentoId, documento } = await lerCorpo(req, corpoVerificar);
    const r = await verificarDocumento({
      eleicaoId: el.id,
      apartamentoId,
      documento,
    });
    if (!r.ok) return r;
    const token = await assinarToken({
      eleicaoId: el.id,
      apartamentoId,
      compradorId: r.compradorId,
    });
    return { ok: true, token };
  });
}
