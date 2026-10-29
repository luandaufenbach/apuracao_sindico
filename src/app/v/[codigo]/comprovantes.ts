"use client";

// Comprovantes deste aparelho, no localStorage: sobrevivem a um recarregamento
// da página (o celular costuma recarregar a aba quando a pessoa troca de app).
// Guardam só apartamento, horário e código; nunca o candidato nem o documento.
import { useCallback, useMemo, useSyncExternalStore } from "react";
import { z } from "zod/mini";

const comprovante = z.object({
  codigo: z.string(),
  // Data inválida derrubaria a tela no Intl.DateTimeFormat.
  horario: z.iso.datetime(),
  apartamentoId: z.number(),
  bloco: z.string(),
  rotulo: z.string(),
});

export type Comprovante = z.infer<typeof comprovante>;

const listaComprovantes = z.array(comprovante);

// O evento `storage` só chega nas outras abas; este avisa a própria aba.
const EVENTO = "apuracao:comprovantes";

// Cópia em memória: sem localStorage (aba anônima, cota cheia), os
// comprovantes valem até a página recarregar.
const memoria = new Map<string, string>();

function ler(chave: string): string | null {
  try {
    const guardado = window.localStorage.getItem(chave);
    if (guardado !== null) return guardado;
  } catch {
    // Sem localStorage: fica a memória.
  }
  return memoria.get(chave) ?? null;
}

function interpretar(bruto: string | null): Comprovante[] {
  if (!bruto) return [];
  try {
    const lido = listaComprovantes.safeParse(JSON.parse(bruto));
    return lido.success ? lido.data : [];
  } catch {
    return [];
  }
}

function assinar(avisar: () => void) {
  window.addEventListener("storage", avisar);
  window.addEventListener(EVENTO, avisar);
  return () => {
    window.removeEventListener("storage", avisar);
    window.removeEventListener(EVENTO, avisar);
  };
}

export function useComprovantes(codigoEleicao: string) {
  const chave = `apuracao:comprovantes:${codigoEleicao}`;
  const bruto = useSyncExternalStore(
    assinar,
    () => ler(chave),
    () => null,
  );
  const lista = useMemo(() => interpretar(bruto), [bruto]);

  const guardar = useCallback(
    (novo: Comprovante) => {
      const outros = interpretar(ler(chave)).filter(
        (c) => c.codigo !== novo.codigo,
      );
      const bruto = JSON.stringify([...outros, novo]);
      memoria.set(chave, bruto);
      try {
        window.localStorage.setItem(chave, bruto);
      } catch {
        // Sem localStorage: fica a memória.
      }
      window.dispatchEvent(new Event(EVENTO));
    },
    [chave],
  );

  return { lista, guardar };
}
