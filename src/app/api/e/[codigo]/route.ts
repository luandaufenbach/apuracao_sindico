import { eq } from "drizzle-orm";

import { db } from "@/db";
import { apartamento, candidato } from "@/db/schema";

import { eleicaoPorCodigo, responder } from "../comum";

/** Dados da eleição para a tela inicial e os cards de candidato. */
export async function GET(_req: Request, ctx: RouteContext<"/api/e/[codigo]">) {
  return responder(async () => {
    const el = await eleicaoPorCodigo(ctx.params);
    const candidatos = await db
      .select({
        id: candidato.id,
        nome: candidato.nome,
        foto: candidato.foto,
        proposta: candidato.proposta,
        bloco: apartamento.bloco,
        rotulo: apartamento.rotulo,
      })
      .from(candidato)
      .leftJoin(apartamento, eq(apartamento.id, candidato.apartamentoId))
      .where(eq(candidato.eleicaoId, el.id))
      .orderBy(candidato.ordem, candidato.id);
    return {
      empreendimento: el.empreendimento,
      titulo: el.titulo,
      status: el.status,
      candidatos: candidatos.map(({ bloco, rotulo, ...c }) => ({
        ...c,
        apartamento: bloco && rotulo ? { bloco, rotulo } : null,
      })),
    };
  });
}
