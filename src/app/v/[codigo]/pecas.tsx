// Peças comuns das telas do eleitor: topo com voltar, cabeçalho e aviso de
// tela cheia (bloqueado, só pela mesa, já votou, encerrada...).
import type { ReactNode } from "react";

import { Icone, type NomeIcone } from "@/ui/icone";

import e from "./eleitor.module.css";

export function Topo({
  aoVoltar,
  passo,
}: {
  aoVoltar?: () => void;
  /** `Passo 2 de 4`. */
  passo?: string;
}) {
  return (
    <header className={e.topo}>
      {aoVoltar ? (
        <button type="button" className={e.voltar} onClick={aoVoltar}>
          <Icone nome="arrow-left" tamanho={22} rotulo="Voltar" />
        </button>
      ) : (
        <span />
      )}
      {passo && <span className={e.passo}>{passo}</span>}
    </header>
  );
}

export function Cabeca({
  olho,
  titulo,
  children,
}: {
  /** Linha mono acima do título, como `Bloco 01 · Ap 101`. */
  olho?: string;
  titulo: string;
  children?: ReactNode;
}) {
  return (
    <div className={e.cabeca}>
      {olho && <span className={e.olho}>{olho}</span>}
      <h1 className={e.titulo}>{titulo}</h1>
      {children && <p className={e.sub}>{children}</p>}
    </div>
  );
}

const TOM_SELO = {
  sucesso: e.seloSucesso,
  aviso: e.seloAviso,
  perigo: e.seloPerigo,
  info: e.seloInfo,
};

/** Selo de ícone com a cor do status, acima do título. */
export function SeloIcone({
  icone,
  tom,
}: {
  icone: NomeIcone;
  tom: keyof typeof TOM_SELO;
}) {
  return (
    <span className={`${e.selo} ${TOM_SELO[tom]}`}>
      <Icone nome={icone} tamanho={24} />
    </span>
  );
}

/** Estado de tela cheia: ícone, título, explicação e o que fazer. */
export function Aviso({
  icone,
  tom,
  olho,
  titulo,
  children,
  acoes,
}: {
  icone: NomeIcone;
  tom: keyof typeof TOM_SELO;
  olho?: string;
  titulo: string;
  children?: ReactNode;
  acoes?: ReactNode;
}) {
  return (
    <section aria-live="polite">
      <div className={e.cabeca}>
        <SeloIcone icone={icone} tom={tom} />
        {olho && <span className={e.olho}>{olho}</span>}
        <h1 className={e.titulo}>{titulo}</h1>
        {children && <p className={e.sub}>{children}</p>}
      </div>
      {acoes && <div className={e.acoes}>{acoes}</div>}
    </section>
  );
}

export function Carregando({ texto = "Carregando" }: { texto?: string }) {
  return (
    <p className={e.carregando} role="status">
      {texto}
    </p>
  );
}
