// Formatação do painel: documentos pontuados e horários no fuso do evento.
import type { StatusEleicao } from "@/lib/eleicoes";

/** `12345678909` vira `123.456.789-09`; CNPJ vira `12.345.678/0001-95`. */
export function pontuarDocumento(documento: string | null): string {
  if (!documento) return "";
  if (documento.length === 11) {
    return documento.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  }
  if (documento.length === 14) {
    return documento.replace(
      /^(.{2})(.{3})(.{3})(.{4})(.{2})$/,
      "$1.$2.$3/$4-$5",
    );
  }
  return documento;
}

const FUSO = "America/Sao_Paulo";
const formatoDataHora = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: FUSO,
});
const formatoHora = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: FUSO,
});

/** `28/10/2026, 19:42`, no horário de Brasília. */
export const dataHora = (d: Date | string) =>
  formatoDataHora.format(new Date(d));

/** `19:42:05`, no horário de Brasília. */
export const hora = (d: Date | string) => formatoHora.format(new Date(d));

export const NOME_STATUS: Record<StatusEleicao, string> = {
  rascunho: "Rascunho",
  aberta: "Aberta",
  encerrada: "Encerrada",
  publicada: "Publicada",
};

export const TOM_STATUS = {
  rascunho: "neutro",
  aberta: "sucesso",
  encerrada: "aviso",
  publicada: "info",
} as const satisfies Record<StatusEleicao, string>;

/** `1 voto`, `2 votos`. */
export const contar = (n: number, um: string, varios: string) =>
  `${n} ${n === 1 ? um : varios}`;

export const NOME_ORIGEM = { documento: "Documento", mesa: "Mesa" } as const;

/** `Ap 502 PCD` vira `502 PCD`, para caber na grade de apartamentos. */
export const rotuloCurto = (rotulo: string) => rotulo.replace(/^ap\.?\s*/i, "");

/** Datas viram texto no JSON. */
export type Json<T> = T extends Date
  ? string
  : T extends (infer U)[]
    ? Json<U>[]
    : T extends object
      ? { [K in keyof T]: Json<T[K]> }
      : T;

/** Dados do servidor no formato das respostas da API: datas como texto. */
export const paraJson = <T>(valor: T): Json<T> =>
  JSON.parse(JSON.stringify(valor));

/** Nome de cada ação do log de auditoria. */
export const NOME_ACAO: Record<string, string> = {
  "voto.mesa": "Voto pela mesa",
  "voto.anular": "Voto anulado",
  "voto.mover": "Voto movido",
  "eleicao.reabrir": "Votação reaberta",
  "eleicao.zerar": "Eleição zerada",
  "usuario.criar": "Usuário criado",
  "usuario.desativar": "Usuário desativado",
  "eleicao.criar": "Eleição criada",
  "eleicao.editar": "Eleição editada",
  "eleicao.abrir": "Votação aberta",
  "eleicao.encerrar": "Votação encerrada",
  "eleicao.publicar": "Resultado publicado",
  "candidato.criar": "Candidato criado",
  "candidato.editar": "Candidato editado",
  "candidato.remover": "Candidato removido",
  "apto.criar": "Apartamento criado",
  "apto.editar": "Apartamento editado",
  "apto.remover": "Apartamento removido",
  "apto.desbloquear": "Apartamento desbloqueado",
  "documento.falha": "Documento não conferiu",
  "empreendimento.criar": "Empreendimento criado",
  "empreendimento.excluir": "Empreendimento excluído",
  "empreendimento.editar": "Empreendimento editado",
  "importacao.confirmar": "Importação confirmada",
  "sessao.entrar": "Entrou no painel",
  "sessao.sair": "Saiu do painel",
  // Exclusões feitas direto no banco de produção antes da tela de excluir.
  "empreendimento.apagar": "Empreendimento excluído",
  "eleicao.apagar": "Eleição excluída",
  "usuario.apagar": "Usuário excluído",
  "usuario.editar": "Usuário editado",
};
