import { z } from "zod";

import { anularVoto } from "@/lib/regras-voto";

import { ErroHttp, idDaRota, lerCorpo, rotaGod } from "../../../comum";

const corpoMotivo = z.object({ motivo: z.string() });

const RECUSAS = {
  ja_anulado: "Este voto já está anulado.",
  resultado_publicado:
    "O resultado já foi publicado: o voto não pode mais ser anulado.",
};

/** Anula o voto (R7): ele fica guardado e o apartamento vota de novo. */
export async function POST(
  req: Request,
  ctx: RouteContext<"/api/admin/votos/[id]/anular">,
) {
  return rotaGod(req, async (usuario) => {
    const { motivo } = await lerCorpo(req, corpoMotivo);
    const r = await anularVoto({
      votoId: await idDaRota(ctx.params),
      usuarioId: usuario.id,
      motivo,
    });
    if (!r.ok) throw new ErroHttp(409, RECUSAS[r.erro]);
  });
}
