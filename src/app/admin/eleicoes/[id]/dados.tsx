"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Botao } from "@/ui/botao";

import estilos from "../../admin.module.css";
import { chamarApi, mensagemDe } from "../../cliente";
import { Alerta, Campo } from "../../pecas";

export function DadosEleicao({
  eleicaoId,
  titulo,
}: {
  eleicaoId: number;
  titulo: string;
}) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function salvar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    setEnviando(true);
    setErro(null);
    try {
      await chamarApi(`/api/admin/eleicoes/${eleicaoId}`, {
        corpo: { titulo: dados.get("titulo") },
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
      <h2 className={estilos.cartaoTitulo}>Dados</h2>
      <form className={estilos.formulario} onSubmit={salvar}>
        <Campo rotulo="Título">
          <input
            className={estilos.controle}
            name="titulo"
            defaultValue={titulo}
            required
            maxLength={200}
          />
        </Campo>
        {erro && <Alerta>{erro}</Alerta>}
        <Botao type="submit" variante="contorno" carregando={enviando}>
          Salvar dados
        </Botao>
      </form>
    </section>
  );
}
