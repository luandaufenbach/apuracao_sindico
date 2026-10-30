// Letra da coluna da planilha. Sem dependências: a tela de importação usa também.

/** `0` vira `A`, `25` vira `Z`, `26` vira `AA`. */
export function letraColuna(indice: number): string {
  let letra = "";
  for (let n = indice + 1; n > 0; n = Math.floor((n - 1) / 26)) {
    letra = String.fromCharCode(65 + ((n - 1) % 26)) + letra;
  }
  return letra;
}
