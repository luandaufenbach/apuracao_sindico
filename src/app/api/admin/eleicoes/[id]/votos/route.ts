import { buscarVotos } from "@/lib/godmode";

import { idDaRota, rotaGod } from "../../../comum";

/**
 * Buscar voto por `?apartamentoId=` ou `?comprovante=`. Único lugar do painel
 * que mostra o candidato escolhido.
 */
export async function GET(
  req: Request,
  ctx: RouteContext<"/api/admin/eleicoes/[id]/votos">,
) {
  return rotaGod(req, async () => {
    const eleicaoId = await idDaRota(ctx.params);
    const busca = new URL(req.url).searchParams;
    const apartamentoId = busca.get("apartamentoId");
    return {
      votos: await buscarVotos(
        eleicaoId,
        apartamentoId !== null
          ? { apartamentoId: Number(apartamentoId) }
          : { comprovante: busca.get("comprovante") ?? "" },
      ),
    };
  });
}
