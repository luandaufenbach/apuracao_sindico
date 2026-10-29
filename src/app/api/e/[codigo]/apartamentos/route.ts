import { and, eq, isNotNull, notExists, sql } from "drizzle-orm";

import { db } from "@/db";
import { apartamento, comprador, situacaoApartamento, voto } from "@/db/schema";

import { eleicaoPorCodigo, responder } from "../../comum";

/** Grade de apartamentos com a situação de cada um na eleição. */
export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/e/[codigo]/apartamentos">,
) {
  return responder(async () => {
    const el = await eleicaoPorCodigo(ctx.params);
    // O índice um_voto_por_apto garante no máximo um voto válido por
    // apartamento, então as junções não repetem linhas.
    return db
      .select({
        id: apartamento.id,
        bloco: apartamento.bloco,
        rotulo: apartamento.rotulo,
        jaVotou: sql`${voto.id} is not null`.mapWith(Boolean),
        bloqueado:
          sql`coalesce(${situacaoApartamento.bloqueado}, false)`.mapWith(
            Boolean,
          ),
        // Sem comprador com documento: só vota pela mesa.
        soMesa: notExists(
          db
            .select({ id: comprador.id })
            .from(comprador)
            .where(
              and(
                eq(comprador.apartamentoId, apartamento.id),
                isNotNull(comprador.documento),
              ),
            ),
        ).mapWith(Boolean),
      })
      .from(apartamento)
      .leftJoin(
        voto,
        and(
          eq(voto.apartamentoId, apartamento.id),
          eq(voto.eleicaoId, el.id),
          eq(voto.status, "valido"),
        ),
      )
      .leftJoin(
        situacaoApartamento,
        and(
          eq(situacaoApartamento.apartamentoId, apartamento.id),
          eq(situacaoApartamento.eleicaoId, el.id),
        ),
      )
      .where(eq(apartamento.empreendimentoId, el.empreendimentoId))
      .orderBy(
        apartamento.bloco,
        sql`length(${apartamento.numero})`,
        apartamento.numero,
      );
  });
}
