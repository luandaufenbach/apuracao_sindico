import { z } from "zod";

import { votar } from "@/lib/regras-voto";
import { assinarToken, lerToken } from "@/lib/token";

import {
  eleicaoPorCodigo,
  ErroHttp,
  idBanco,
  lerCorpo,
  responder,
} from "../../comum";

const corpoVotar = z.object({
  token: z.string().min(1).max(2048),
  candidatoId: idBanco,
});

const tokenRecusado = () =>
  new ErroHttp(
    401,
    "A confirmação do documento venceu. Confirme o documento de novo.",
  );

/**
 * Grava o voto do comprador verificado no token. Cada apartamento em
 * `proximos` sai com o seu token, para votar sem digitar o documento de novo.
 */
export async function POST(
  req: Request,
  ctx: RouteContext<"/api/e/[codigo]/votar">,
) {
  return responder(async () => {
    const { token, candidatoId } = await lerCorpo(req, corpoVotar);
    // O token se confere sem banco: o inválido nem consulta a eleição.
    const t = await lerToken(token);
    if (!t) throw tokenRecusado();
    const el = await eleicaoPorCodigo(ctx.params);
    if (t.eleicaoId !== el.id) throw tokenRecusado();

    const r = await votar({ ...t, candidatoId });
    if (!r.ok) return r;
    const proximos = await Promise.all(
      r.proximos.map(async ({ apartamentoId, compradorId, bloco, rotulo }) => ({
        apartamentoId,
        bloco,
        rotulo,
        token: await assinarToken({
          eleicaoId: el.id,
          apartamentoId,
          compradorId,
        }),
      })),
    );
    return {
      ok: true,
      comprovante: r.comprovante,
      horario: r.horario,
      proximos,
    };
  });
}
