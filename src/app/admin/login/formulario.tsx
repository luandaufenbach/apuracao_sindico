"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Botao } from "@/ui/botao";

import estilos from "../admin.module.css";
import { chamarApi, mensagemDe } from "../cliente";
import { Alerta, Campo } from "../pecas";

export function FormularioLogin() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function entrar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    setEnviando(true);
    setErro(null);
    try {
      await chamarApi("/api/admin/login", {
        corpo: { email: dados.get("email"), senha: dados.get("senha") },
      });
      // O refresh refaz o layout, que volta com a barra do usuário.
      router.replace("/admin/eleicoes");
      router.refresh();
    } catch (falha) {
      setErro(mensagemDe(falha));
      setEnviando(false);
    }
  }

  return (
    <form className={estilos.formulario} onSubmit={entrar}>
      <Campo rotulo="E-mail">
        <input
          className={estilos.controle}
          name="email"
          type="email"
          autoComplete="username"
          required
          autoFocus
        />
      </Campo>
      <Campo rotulo="Senha">
        <input
          className={estilos.controle}
          name="senha"
          type="password"
          autoComplete="current-password"
          required
        />
      </Campo>
      {erro && <Alerta>{erro}</Alerta>}
      <Botao type="submit" tamanho="g" larguraTotal carregando={enviando}>
        Entrar
      </Botao>
    </form>
  );
}
