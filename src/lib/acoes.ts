// Grupos de ação do log de auditoria. Sem banco aqui: a tela da auditoria
// importa a mesma lista que o servidor valida.

/** Prefixo das ações (`voto.anular` é do grupo `voto`), para filtrar. */
export const GRUPOS_ACAO = [
  "voto",
  "eleicao",
  "candidato",
  "apto",
  "documento",
  "empreendimento",
  "importacao",
  "sessao",
  "usuario",
] as const;

export type GrupoAcao = (typeof GRUPOS_ACAO)[number];
