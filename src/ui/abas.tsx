"use client";

import { type KeyboardEvent, useRef } from "react";

import estilos from "./abas.module.css";

/**
 * Tabs do Lumen (variante underline): setas trocam a aba, só a ativa entra no
 * Tab. Cada aba controla o painel de id `idPainel(prefixo, valor)`, que a tela
 * renderiza com `role="tabpanel"` e `aria-labelledby={idAba(prefixo, valor)}`.
 */
export function Abas<T extends string>({
  itens,
  valor,
  aoMudar,
  rotulo,
  prefixo,
}: {
  itens: { valor: T; rotulo: string; contagem?: number }[];
  valor: T;
  aoMudar: (valor: T) => void;
  rotulo: string;
  prefixo: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  function teclar(e: KeyboardEvent, i: number) {
    const passo = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!passo) return;
    e.preventDefault();
    const n = (i + passo + itens.length) % itens.length;
    aoMudar(itens[n].valor);
    refs.current[n]?.focus();
  }

  return (
    <div role="tablist" aria-label={rotulo} className={estilos.abas}>
      {itens.map((item, i) => {
        const ativa = item.valor === valor;
        return (
          <button
            key={item.valor}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={idAba(prefixo, item.valor)}
            aria-selected={ativa}
            aria-controls={idPainel(prefixo, item.valor)}
            tabIndex={ativa ? 0 : -1}
            className={estilos.aba}
            onClick={() => aoMudar(item.valor)}
            onKeyDown={(e) => teclar(e, i)}
          >
            {item.rotulo}
            {item.contagem !== undefined && (
              <span className={estilos.contagem}>{item.contagem}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export const idAba = (prefixo: string, valor: string) =>
  `${prefixo}-aba-${valor}`;
export const idPainel = (prefixo: string, valor: string) =>
  `${prefixo}-painel-${valor}`;
