import type { ButtonHTMLAttributes } from "react";

import estilos from "./botao.module.css";
import { Icone, type NomeIcone } from "./icone";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Um `primario` por tela; `secundario` (branco) para a segunda ação. */
  variante?: "primario" | "secundario" | "contorno" | "fantasma";
  /** 32, 40 e 48 px; no toque, p e m crescem para 44 px. */
  tamanho?: "p" | "m" | "g";
  larguraTotal?: boolean;
  /** Troca o ícone da esquerda por um giro e desabilita o botão. */
  carregando?: boolean;
  iconeEsquerda?: NomeIcone;
  iconeDireita?: NomeIcone;
};

/** Button do Lumen: rótulo com verbo, 1 a 3 palavras, sem caixa alta. */
export function Botao({
  variante = "primario",
  tamanho = "m",
  larguraTotal,
  carregando,
  iconeEsquerda,
  iconeDireita,
  type = "button",
  disabled,
  className,
  children,
  ...resto
}: Props) {
  const icone = tamanho === "g" ? 18 : 16;
  const classes = [
    estilos.botao,
    estilos[variante],
    estilos[tamanho],
    larguraTotal && estilos.larguraTotal,
    className,
  ]
    .filter(Boolean)
    .join(" ");
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || carregando}
      aria-busy={carregando || undefined}
      {...resto}
    >
      {carregando ? (
        <span className={estilos.giro} aria-hidden="true" />
      ) : (
        iconeEsquerda && <Icone nome={iconeEsquerda} tamanho={icone} />
      )}
      {children}
      {iconeDireita && !carregando && (
        <Icone nome={iconeDireita} tamanho={icone} />
      )}
    </button>
  );
}
