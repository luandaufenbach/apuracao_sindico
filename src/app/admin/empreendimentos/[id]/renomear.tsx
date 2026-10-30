"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Botao } from "@/ui/botao";

import estilos from "../../admin.module.css";
import { chamarApi, mensagemDe } from "../../cliente";
import { Alerta, Campo } from "../../pecas";

export function Renomear({
  empreendimentoId,
  nome,
}: {
  empreendimentoId: number;
  nome: string;
}) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);
    try {
      await chamarApi(`/api/admin/empreendimentos/${empreendimentoId}`, {
        corpo: { nome: new FormData(e.currentTarget).get("nome") },
      });
      router.refresh();
    } catch (falha) {
      setErro(mensagemDe(falha));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className={estilos.cartao}>
      <h2 className={estilos.cartaoTitulo}>Nome</h2>
      <form className={estilos.formulario} onSubmit={salvar}>
        <Campo rotulo="Nome do empreendimento">
          <input
            className={estilos.controle}
            name="nome"
            defaultValue={nome}
            required
            maxLength={200}
          />
        </Campo>
        {erro && <Alerta>{erro}</Alerta>}
        <Botao type="submit" variante="contorno" carregando={enviando}>
          Salvar nome
        </Botao>
      </form>
    </section>
  );
}
