import { inArray } from "drizzle-orm";

import type { Executor } from "./index";
import {
  apartamento,
  candidato,
  comprador,
  eleicao,
  empreendimento,
  logAuditoria,
  situacaoApartamento,
  voto,
} from "./schema";

/**
 * Apaga empreendimentos com tudo que depende deles, na ordem das chaves
 * estrangeiras. Só para o seed e os testes: no app, voto nunca é apagado (R7).
 */
export async function apagarEmpreendimentos(
  ex: Executor,
  empreendimentoIds: number[],
): Promise<void> {
  if (empreendimentoIds.length === 0) return;
  const eleIds = (
    await ex
      .select({ id: eleicao.id })
      .from(eleicao)
      .where(inArray(eleicao.empreendimentoId, empreendimentoIds))
  ).map((e) => e.id);
  const aptIds = (
    await ex
      .select({ id: apartamento.id })
      .from(apartamento)
      .where(inArray(apartamento.empreendimentoId, empreendimentoIds))
  ).map((a) => a.id);

  if (eleIds.length > 0) {
    await ex
      .delete(logAuditoria)
      .where(inArray(logAuditoria.eleicaoId, eleIds));
    await ex.delete(voto).where(inArray(voto.eleicaoId, eleIds));
    await ex
      .delete(situacaoApartamento)
      .where(inArray(situacaoApartamento.eleicaoId, eleIds));
    await ex.delete(candidato).where(inArray(candidato.eleicaoId, eleIds));
    await ex.delete(eleicao).where(inArray(eleicao.id, eleIds));
  }
  if (aptIds.length > 0) {
    await ex.delete(comprador).where(inArray(comprador.apartamentoId, aptIds));
    await ex.delete(apartamento).where(inArray(apartamento.id, aptIds));
  }
  await ex
    .delete(empreendimento)
    .where(inArray(empreendimento.id, empreendimentoIds));
}
