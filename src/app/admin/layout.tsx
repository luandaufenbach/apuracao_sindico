import type { Metadata } from "next";

import { usuarioAtual } from "@/lib/auth";

import { Barra } from "./barra";

export const metadata: Metadata = {
  title: { template: "%s · Painel da apuração", default: "Painel da apuração" },
  robots: { index: false, follow: false },
};

// A barra só aparece com sessão. Cada página confere a sessão e o papel por
// conta própria: o layout não é barreira de acesso.
export default async function LayoutAdmin({ children }: LayoutProps<"/admin">) {
  const usuario = await usuarioAtual();
  return (
    <>
      {usuario && <Barra nome={usuario.nome} papel={usuario.papel} />}
      {children}
    </>
  );
}
