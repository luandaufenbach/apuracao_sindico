"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Botao } from "@/ui/botao";

import estilos from "../admin.module.css";
import { chamarApi, mensagemDe } from "../cliente";
import { Alerta, Campo } from "../pecas";

export function NovaEleicao({
  empreendimentos,
}: {
  empreendimentos: { id: number; nome: string }[];
}) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function criar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dados = new FormData(e.currentTarget);
    setEnviando(true);
    setErro(null);
    try {
      const { id } = await chamarApi<{ id: number }>("/api/admin/eleicoes", {
        corpo: {
          empreendimentoId: Number(dados.get("empreendimentoId")),
          titulo: dados.get("titulo"),
          teste: dados.get("teste") === "on",
        },
      });
      router.push(`/admin/eleicoes/${id}`);
    } catch (falha) {
      setErro(mensagemDe(falha));
      setEnviando(false);
    }
  }

  if (empreendimentos.length === 0) {
    return (
      <section className={estilos.cartao}>
        <h2 className={estilos.cartaoTitulo}>Nova eleição</h2>
        <p className={estilos.texto}>
          Antes,{" "}
          <Link href="/admin/empreendimentos">crie um empreendimento</Link> e
          importe os apartamentos.
        </p>
      </section>
    );
  }

  return (
    <section className={estilos.cartao}>
      <h2 className={estilos.cartaoTitulo}>Nova eleição</h2>
      <form className={estilos.formulario} onSubmit={criar}>
        <Campo rotulo="Empreendimento">
          <select className={estilos.controle} name="empreendimentoId" required>
            {empreendimentos.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nome}
              </option>
            ))}
          </select>
        </Campo>
        <Campo rotulo="Título">
          <input
            className={estilos.controle}
            name="titulo"
            required
            maxLength={200}
            defaultValue="Eleição de síndico"
          />
        </Campo>
        <label className={estilos.marcar}>
          <input type="checkbox" name="teste" />
          <span>
            Eleição de teste
            <span className={estilos.dica}>
              {" "}
              — para ensaio. Só eleição de teste pode ser zerada depois.
            </span>
          </span>
        </label>
        {erro && <Alerta>{erro}</Alerta>}
        <Botao type="submit" iconeEsquerda="plus" carregando={enviando}>
          Criar eleição
        </Botao>
      </form>
    </section>
  );
}
