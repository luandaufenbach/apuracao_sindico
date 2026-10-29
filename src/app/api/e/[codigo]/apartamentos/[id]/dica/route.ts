import { and, eq, isNotNull } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { apartamento, comprador } from "@/db/schema";
import {
  prefixoDocumento,
  type TipoDocumento,
  validarDocumento,
} from "@/lib/documento";

import {
  eleicaoPorCodigo,
  ErroHttp,
  idBanco,
  responder,
} from "../../../../comum";

const idApartamento = z.coerce.number().pipe(idBanco);

/**
 * Prefixos dos documentos dos compradores (R10: só 3 caracteres). Prefixos
 * iguais saem uma vez só: a pessoa digita o resto de qualquer jeito.
 */
export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/e/[codigo]/apartamentos/[id]/dica">,
) {
  return responder(async () => {
    const el = await eleicaoPorCodigo(ctx.params);
    const id = idApartamento.safeParse((await ctx.params).id);
    if (!id.success) {
      throw new ErroHttp(404, "Apartamento não encontrado nesta eleição.");
    }
    const linhas = await db
      .select({ documento: comprador.documento })
      .from(apartamento)
      .leftJoin(
        comprador,
        and(
          eq(comprador.apartamentoId, apartamento.id),
          isNotNull(comprador.documento),
        ),
      )
      .where(
        and(
          eq(apartamento.id, id.data),
          eq(apartamento.empreendimentoId, el.empreendimentoId),
        ),
      )
      .orderBy(comprador.id);
    if (linhas.length === 0) {
      throw new ErroHttp(404, "Apartamento não encontrado nesta eleição.");
    }

    const dicas = new Map<string, { tipo: TipoDocumento; prefixo: string }>();
    for (const { documento } of linhas) {
      // Documento inválido no cadastro nunca confere: não vira dica.
      const doc = documento && validarDocumento(documento);
      if (!doc) continue;
      const prefixo = prefixoDocumento(doc.documento);
      dicas.set(`${doc.tipo}:${prefixo}`, { tipo: doc.tipo, prefixo });
    }
    return { dicas: [...dicas.values()] };
  });
}
