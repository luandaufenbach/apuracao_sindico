import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { usuarioAtual } from "@/lib/auth";
import { Brilho } from "@/ui/brilho";

import { FormularioLogin } from "./formulario";
import estilos from "./login.module.css";

export const metadata: Metadata = { title: "Entrar" };

export default async function Login() {
  if (await usuarioAtual()) redirect("/admin");
  return (
    <Brilho variante="halo" className={estilos.fundo}>
      <main className={estilos.caixa}>
        <div className={estilos.cabeca}>
          <span className={estilos.olho}>Painel da apuração</span>
          <h1 className={estilos.titulo}>Entrar no painel</h1>
          <p className={estilos.sub}>
            Acesso da mesa: operadores e administradores.
          </p>
        </div>
        <FormularioLogin />
      </main>
    </Brilho>
  );
}
