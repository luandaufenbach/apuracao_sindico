"use client";

import { useEffect } from "react";

/**
 * Pede ao navegador para não apagar a tela enquanto o telão está visível
 * (Screen Wake Lock). O pedido cai quando a aba some; volta junto com ela.
 */
export function useTelaAcesa() {
  useEffect(() => {
    if (!("wakeLock" in navigator)) return;
    let ativo = true;
    let pedindo = false;
    let trava: WakeLockSentinel | null = null;

    async function pedir() {
      // `pedindo` evita duas travas quando a aba volta com um pedido no ar.
      if (!ativo || pedindo || trava || document.hidden) return;
      pedindo = true;
      try {
        const nova = await navigator.wakeLock.request("screen");
        if (!ativo) return void nova.release();
        trava = nova;
        nova.addEventListener("release", () => {
          if (trava === nova) trava = null;
        });
      } catch {
        // Sem permissão ou em economia de bateria: a tela segue a do sistema.
      } finally {
        pedindo = false;
      }
    }

    const aoMudarVisibilidade = () => void pedir();
    document.addEventListener("visibilitychange", aoMudarVisibilidade);
    void pedir();
    return () => {
      ativo = false;
      document.removeEventListener("visibilitychange", aoMudarVisibilidade);
      void trava?.release();
    };
  }, []);
}
