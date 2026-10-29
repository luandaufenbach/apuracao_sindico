// Formatação das telas do eleitor: documento enquanto a pessoa digita,
// horários no fuso do evento e textos que dependem de número.
import { normalizarDocumento, type TipoDocumento } from "@/lib/documento";

export const MASCARA: Record<TipoDocumento, string> = {
  cpf: "___.___.___-__",
  cnpj: "__.___.___/____-__",
};

export const TAMANHO: Record<TipoDocumento, number> = { cpf: 11, cnpj: 14 };

export const NOME_TIPO: Record<TipoDocumento, string> = {
  cpf: "CPF",
  cnpj: "CNPJ",
};

/**
 * Letras e dígitos, em maiúsculas, até o tamanho do CNPJ. O campo aceita os
 * dois tipos mesmo quando a dica é de um só: documento de outro apartamento
 * precisa chegar ao servidor para virar sugestão (R6).
 */
export const limparDocumento = (entrada: string) =>
  normalizarDocumento(entrada).slice(0, TAMANHO.cnpj);

/**
 * Tipo da máscara: CNPJ quando a dica é de CNPJ; senão, pelo que já foi
 * digitado (letra ou mais de 11 caracteres é CNPJ).
 */
export const tipoExibido = (
  tipoDica: TipoDocumento | null,
  caracteres: string,
): TipoDocumento =>
  tipoDica === "cnpj" ||
  /[A-Z]/.test(caracteres) ||
  caracteres.length > TAMANHO.cpf
    ? "cnpj"
    : "cpf";

/**
 * Pontua enquanto a pessoa digita: o separador só entra antes de um caractere,
 * então apagar o último caractere nunca esbarra num ponto.
 */
export function formatarDocumento(
  caracteres: string,
  tipo: TipoDocumento,
): string {
  let saida = "";
  let i = 0;
  for (const m of MASCARA[tipo]) {
    if (i >= caracteres.length) break;
    saida += m === "_" ? caracteres[i++] : m;
  }
  return saida;
}

const FUSO = "America/Sao_Paulo";
const hora = new Intl.DateTimeFormat("pt-BR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: FUSO,
});
const data = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: FUSO,
});

/** `19:42`, no horário de Brasília. */
export const formatarHora = (iso: string) => hora.format(new Date(iso));

/** `28/10/2026`, no horário de Brasília. */
export const formatarData = (iso: string) => data.format(new Date(iso));

/** `Bloco 01, Ap 101`. */
export const nomeApartamento = (a: { bloco: string; rotulo: string }) =>
  `${a.bloco}, ${a.rotulo}`;

export const tentativasRestantes = (n: number) =>
  n === 1 ? "Resta 1 tentativa." : `Restam ${n} tentativas.`;
