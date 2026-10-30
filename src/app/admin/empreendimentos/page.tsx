import type { Metadata } from "next";
import Link from "next/link";

import { exigirUsuarioPagina } from "@/lib/auth";
import { listarEmpreendimentos } from "@/lib/cadastro";

import estilos from "../admin.module.css";
import { Cabecalho } from "../pecas";
import { NovoEmpreendimento } from "./novo";

export const metadata: Metadata = { title: "Empreendimentos" };

export default async function Empreendimentos() {
  await exigirUsuarioPagina();
  const lista = await listarEmpreendimentos();
  return (
    <main className={estilos.pagina}>
      <Cabecalho
        olho="Cadastro"
        titulo="Empreendimentos"
        sub="Apartamentos e compradores de cada empreendimento, importados da planilha ou digitados."
      />
      <div className={estilos.duas}>
        <section className={estilos.cartao}>
          {lista.length === 0 ? (
            <p className={estilos.vazio}>Nenhum empreendimento ainda.</p>
          ) : (
            <div className={estilos.lista}>
              {lista.map((e) => (
                <div key={e.id} className={estilos.linha}>
                  <div className={estilos.linhaPrincipal}>
                    <Link
                      href={`/admin/empreendimentos/${e.id}`}
                      className={estilos.linhaTitulo}
                    >
                      {e.nome}
                    </Link>
                    <span className={estilos.linhaMeta}>
                      {e.apartamentos} apartamentos
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
        <NovoEmpreendimento />
      </div>
    </main>
  );
}
