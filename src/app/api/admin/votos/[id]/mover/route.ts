import { z } from "zod";

import { idBanco } from "@/lib/erros";
import { moverVoto } from "@/lib/regras-voto";

import { ErroHttp, idDaRota, lerCorpo, rotaGod } from "../../../comum";

const corpoMover = z.object({
  apartamentoDestinoId: idBanco,
  motivo: z.string(),
});

const RECUSAS = {
  ja_anulado: "Este voto está anulado e não pode ser movido.",
  destino_ja_votou: "O apartamento de destino já tem voto válido.",
};

/** Leva o voto para outro apartamento; falha se o destino já votou (R1). */
export async function POST(
  req: Request,
  ctx: RouteContext<"/api/admin/votos/[id]/mover">,
) {
  return rotaGod(req, async (usuario) => {
    const corpo = await lerCorpo(req, corpoMover);
    const r = await moverVoto({
      ...corpo,
      votoId: await idDaRota(ctx.params),
      usuarioId: usuario.id,
    });
    if (!r.ok) throw new ErroHttp(409, RECUSAS[r.erro]);
  });
}
