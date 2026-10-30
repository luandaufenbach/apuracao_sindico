"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Botao } from "@/ui/botao";

import estilos from "../admin.module.css";
import { chamarApi, mensagemDe } from "../cliente";
import { Alerta, Campo } from "../pecas";

export function NovoEmpreendimento() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function criar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nome = new FormData(e.currentTarget).get("nome");
    setEnviando(true);
    setErro(null);
    try {
      const { id } = await chamarApi<{ id: number }>(
        "/api/admin/empreendimentos",
        { corpo: { nome } },
      );
      router.push(`/admin/empreendimentos/${id}/importar`);
    } catch (falha) {
      setErro(mensagemDe(falha));
      setEnviando(false);
    }
  }

  return (
    <section className={estilos.cartao}>
      <h2 className={estilos.cartaoTitulo}>Novo empreendimento</h2>
      <form className={estilos.formulario} onSubmit={criar}>
        <Campo rotulo="Nome" dica="Depois de criar, importe a planilha.">
          <input
            className={estilos.controle}
            name="nome"
            required
            maxLength={200}
            placeholder="Residencial Exemplo"
          />
        </Campo>
        {erro && <Alerta>{erro}</Alerta>}
        <Botao type="submit" iconeEsquerda="plus" carregando={enviando}>
          Criar
        </Botao>
      </form>
    </section>
  );
}
