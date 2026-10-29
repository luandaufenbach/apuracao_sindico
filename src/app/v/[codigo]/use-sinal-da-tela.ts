"use client";

import { useEffect, useRef } from "react";

/**
 * Sinal cancelado quando a tela sai: a resposta que chega depois que a pessoa
 * voltou ou trocou de apartamento não navega nem mexe em outra tela.
 */
export function useSinalDaTela() {
  const controle = useRef<AbortController | null>(null);
  useEffect(() => {
    const atual = new AbortController();
    controle.current = atual;
    return () => atual.abort();
  }, []);
  return () => controle.current?.signal;
}
