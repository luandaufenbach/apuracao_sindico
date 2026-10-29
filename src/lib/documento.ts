// CPF e CNPJ (inclusive o CNPJ alfanumérico da Receita, a partir de julho de
// 2026). Os documentos são comparados só por letras e dígitos (R3).

export type TipoDocumento = "cpf" | "cnpj";

export type DocumentoValido = { documento: string; tipo: TipoDocumento };

/** Tira pontuação e espaços e passa para maiúsculas: `123.456.789-09` vira `12345678909`. */
export function normalizarDocumento(entrada: string): string {
  return entrada.toUpperCase().replace(/[^0-9A-Z]/g, "");
}

// Cada caractere vale o código ASCII menos 48: '0'..'9' = 0..9, 'A' = 17, 'Z' = 42.
function digitoVerificador(base: string, pesos: number[]): number {
  let soma = 0;
  for (let i = 0; i < base.length; i++) {
    soma += (base.charCodeAt(i) - 48) * pesos[i];
  }
  const resto = soma % 11;
  return resto < 2 ? 0 : 11 - resto;
}

const PESOS_CPF_1 = [10, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CPF_2 = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
const PESOS_CNPJ_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

/** Os 2 dígitos verificadores de um CPF a partir dos 9 primeiros dígitos. */
export function digitosCpf(base9: string): string {
  const d1 = digitoVerificador(base9, PESOS_CPF_1);
  const d2 = digitoVerificador(base9 + d1, PESOS_CPF_2);
  return `${d1}${d2}`;
}

/** Os 2 dígitos verificadores de um CNPJ a partir dos 12 primeiros caracteres. */
export function digitosCnpj(base12: string): string {
  const d1 = digitoVerificador(base12, PESOS_CNPJ_1);
  const d2 = digitoVerificador(base12 + d1, PESOS_CNPJ_2);
  return `${d1}${d2}`;
}

// Todos os caracteres iguais (000.000.000-00) passam no cálculo, mas não existem.
const repetido = (doc: string) => /^(.)\1*$/.test(doc);

export function cpfValido(doc: string): boolean {
  return (
    /^\d{11}$/.test(doc) &&
    !repetido(doc) &&
    digitosCpf(doc.slice(0, 9)) === doc.slice(9)
  );
}

export function cnpjValido(doc: string): boolean {
  return (
    /^[0-9A-Z]{12}\d{2}$/.test(doc) &&
    !repetido(doc) &&
    digitosCnpj(doc.slice(0, 12)) === doc.slice(12)
  );
}

/**
 * Normaliza e confere o dígito verificador. Devolve null para documento
 * inválido (tamanho errado ou dígito verificador errado), que não conta
 * tentativa (R4).
 */
export function validarDocumento(entrada: string): DocumentoValido | null {
  const documento = normalizarDocumento(entrada);
  if (cpfValido(documento)) return { documento, tipo: "cpf" };
  if (cnpjValido(documento)) return { documento, tipo: "cnpj" };
  return null;
}

/** Os 3 primeiros caracteres, únicos que a API pública pode mostrar (R10). */
export function prefixoDocumento(documento: string): string {
  return normalizarDocumento(documento).slice(0, 3);
}
