"use client";

import { create } from "qrcode";
import { useMemo } from "react";

/** Margem branca em volta, em módulos: o leitor precisa dela (norma do QR: 4). */
const MARGEM = 4;

/**
 * QR code em SVG, desenhado a partir da matriz da lib `qrcode`: um caminho só,
 * nítido em qualquer tamanho de tela.
 */
export function Qr({ texto, className }: { texto: string; className?: string }) {
  const { tamanho, caminho } = useMemo(() => {
    const { modules } = create(texto, { errorCorrectionLevel: "M" });
    let d = "";
    for (let y = 0; y < modules.size; y++) {
      for (let x = 0; x < modules.size; x++) {
        if (modules.get(y, x)) d += `M${x} ${y}h1v1h-1z`;
      }
    }
    return { tamanho: modules.size, caminho: d };
  }, [texto]);

  const lado = tamanho + MARGEM * 2;
  return (
    <svg
      className={className}
      viewBox={`${-MARGEM} ${-MARGEM} ${lado} ${lado}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`QR code do link ${texto}`}
    >
      <rect x={-MARGEM} y={-MARGEM} width={lado} height={lado} fill="#fff" />
      <path d={caminho} fill="#000" />
    </svg>
  );
}
