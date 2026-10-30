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
