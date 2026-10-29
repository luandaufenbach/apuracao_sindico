import type { ReactNode } from "react";

import estilos from "./selo.module.css";

/** Badge do Lumen: o status nunca vai só pela cor, sempre com rótulo. */
export function Selo({
  tom = "neutro",
  vivo,
  className,
  children,
}: {
  tom?: "neutro" | "sucesso" | "aviso" | "perigo" | "info";
  /** Ponto pulsando, para o que se atualiza ao vivo. */
  vivo?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const classes = [estilos.selo, estilos[tom], vivo && estilos.vivo, className]
    .filter(Boolean)
    .join(" ");
  return (
    <span className={classes}>
      <span className={estilos.ponto} aria-hidden="true" />
      {children}
    </span>
  );
}
