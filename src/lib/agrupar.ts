/**
 * Agrupa em ordem de chegada. Faz o papel de Map.groupBy, que falta no
 * Safari antes do iOS 17.4 (tablet da mesa) e o Next não completa.
 */
export function agrupar<T, K>(itens: readonly T[], chave: (item: T) => K) {
  const grupos = new Map<K, T[]>();
  for (const item of itens) {
    const k = chave(item);
    const grupo = grupos.get(k);
    if (grupo) grupo.push(item);
    else grupos.set(k, [item]);
  }
  return grupos;
}
