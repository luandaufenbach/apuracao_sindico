import type { ReactNode } from "react";

import estilos from "./brilho.module.css";

/** Glow do Lumen: fundo com gradiente e grão; os filhos ficam por cima. */
export function Brilho({
  variante = "horizonte",
  grao = true,
  className,
  children,
}: {
  variante?: "horizonte" | "halo" | "grade";
  grao?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={[estilos.brilho, estilos[variante], className]
        .filter(Boolean)
        .join(" ")}
    >
      <span className={estilos.camada} aria-hidden="true" />
      {grao && <span className={estilos.grao} aria-hidden="true" />}
      {children}
    </div>
  );
}
