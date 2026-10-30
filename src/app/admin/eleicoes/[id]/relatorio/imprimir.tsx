"use client";

import { Botao } from "@/ui/botao";

/** Abre a impressão do navegador, onde dá para salvar em PDF. */
export function Imprimir() {
  return (
    <Botao iconeEsquerda="file-text" onClick={() => window.print()}>
      Imprimir ou salvar PDF
    </Botao>
  );
}
