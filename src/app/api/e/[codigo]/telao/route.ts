import { and, count, eq } from "drizzle-orm";

import { db } from "@/db";
import { apartamento, candidato, voto } from "@/db/schema";

import { eleicaoPorCodigo, responder } from "../../comum";

/** Só dados agregados; o resultado por candidato só com a eleição publicada (R11). */
export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/e/[codigo]/telao">,
) {
  return responder(async () => {
    const el = await eleicaoPorCodigo(ctx.params);
    // Um voto válido por apartamento (R1): contar votos é contar apartamentos.
    const [{ totalApartamentos, votaram }] = await db
      .select({ totalApartamentos: count(), votaram: count(voto.id) })
      .from(apartamento)
      .leftJoin(
        voto,
        and(
          eq(voto.apartamentoId, apartamento.id),
          eq(voto.eleicaoId, el.id),
          eq(voto.status, "valido"),
        ),
      )
      .where(eq(apartamento.empreendimentoId, el.empreendimentoId));
    if (el.status !== "publicada") return { totalApartamentos, votaram };

    const resultado = await db
      .select({
        candidatoId: candidato.id,
        nome: candidato.nome,
        votos: count(voto.id),
      })
      .from(candidato)
      .leftJoin(
        voto,
        and(
          eq(voto.candidatoId, candidato.id),
          eq(voto.eleicaoId, el.id),
          eq(voto.status, "valido"),
        ),
      )
      .where(eq(candidato.eleicaoId, el.id))
      .groupBy(candidato.id)
      .orderBy(candidato.ordem, candidato.id);
    return { totalApartamentos, votaram, resultado };
  });
}
