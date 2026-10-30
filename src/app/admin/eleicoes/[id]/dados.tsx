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
  teste,
  rascunho,
}: {
  eleicaoId: number;
  titulo: string;
  teste: boolean;
  rascunho: boolean;
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
        corpo: {
          titulo: dados.get("titulo"),
          // Fora do rascunho o campo fica desabilitado e não vai no form.
          teste: rascunho ? dados.get("teste") === "on" : teste,
        },
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
        <label className={estilos.marcar}>
          <input
            type="checkbox"
            name="teste"
            defaultChecked={teste}
            disabled={!rascunho}
          />
          <span>
            Eleição de teste
            <span className={estilos.dica}>
              {" "}
              {rascunho
                ? "— só eleição de teste pode ser zerada."
                : "— só muda enquanto é rascunho."}
            </span>
          </span>
        </label>
        {erro && <Alerta>{erro}</Alerta>}
        <Botao type="submit" variante="contorno" carregando={enviando}>
          Salvar dados
        </Botao>
      </form>
    </section>
  );
}
