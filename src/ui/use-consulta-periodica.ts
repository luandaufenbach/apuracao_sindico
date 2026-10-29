"use client";

import { useEffect, useEffectEvent } from "react";

/**
 * Chama `consultar` agora e de novo `intervaloMs` depois que cada chamada
 * termina, então rede lenta nunca acumula chamadas. Com a aba escondida, para;
 * quando ela volta, consulta na hora. Erros ficam com quem consulta.
 */
export function useConsultaPeriodica(
  consultar: (sinal: AbortSignal) => Promise<void>,
  intervaloMs: number,
  ativo = true,
) {
  const aoConsultar = useEffectEvent(consultar);

  useEffect(() => {
    if (!ativo) return;
    let parado = false;
    let emAndamento = false;
    let espera: ReturnType<typeof setTimeout> | undefined;
    const controle = new AbortController();

    async function rodar() {
      clearTimeout(espera);
      if (parado || emAndamento || document.hidden) return;
      emAndamento = true;
      try {
        await aoConsultar(controle.signal);
      } catch {
        // Quem consulta mostra o erro; aqui só segue tentando.
      } finally {
        emAndamento = false;
      }
      if (!parado && !document.hidden) espera = setTimeout(rodar, intervaloMs);
    }

    const aoMudarVisibilidade = () => {
      if (document.hidden) clearTimeout(espera);
      else rodar();
    };
    document.addEventListener("visibilitychange", aoMudarVisibilidade);
    rodar();
    return () => {
      parado = true;
      clearTimeout(espera);
      controle.abort();
      document.removeEventListener("visibilitychange", aoMudarVisibilidade);
    };
  }, [intervaloMs, ativo]);
}
