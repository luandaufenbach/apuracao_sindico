"use client";

import { type ReactNode, useEffect, useId, useRef } from "react";

import estilos from "./dialogo.module.css";

/**
 * Dialog do Lumen no <dialog> nativo: prende o foco, fecha com Esc ou com um
 * toque fora e devolve o foco a quem abriu. No celular vira bottom sheet.
 */
export function Dialogo({
  aberto,
  aoFechar,
  titulo,
  descricao,
  children,
  rodape,
  fixo,
}: {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  descricao?: ReactNode;
  children?: ReactNode;
  rodape?: ReactNode;
  /** Não fecha com Esc nem com toque fora (por exemplo, enquanto envia). */
  fixo?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const idTitulo = useId();

  useEffect(() => {
    const dialogo = ref.current;
    if (!dialogo) return;
    if (aberto && !dialogo.open) dialogo.showModal();
    if (!aberto && dialogo.open) dialogo.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      className={estilos.dialogo}
      aria-labelledby={idTitulo}
      onClose={(e) => {
        // O navegador fecha mesmo assim no segundo Esc/voltar seguido: com
        // `fixo`, o diálogo volta a abrir.
        const dialogo = e.currentTarget;
        if (fixo && aberto && dialogo.isConnected) dialogo.showModal();
        else aoFechar();
      }}
      onCancel={(e) => fixo && e.preventDefault()}
      // O toque no fundo escuro chega no próprio <dialog>; dentro, no conteúdo.
      // Fecha pelo close() para avisar uma vez só, no evento close.
      onClick={(e) =>
        !fixo && e.target === e.currentTarget && e.currentTarget.close()
      }
    >
      <div className={estilos.conteudo}>
        <span className={estilos.alca} aria-hidden="true" />
        <div>
          <h2 id={idTitulo} className={estilos.titulo}>
            {titulo}
          </h2>
          {descricao && <p className={estilos.descricao}>{descricao}</p>}
        </div>
        {children}
        {rodape && <div className={estilos.rodape}>{rodape}</div>}
      </div>
    </dialog>
  );
}
