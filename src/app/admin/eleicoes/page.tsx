import type { Metadata } from "next";
import Link from "next/link";

import { exigirUsuarioPagina } from "@/lib/auth";
import { listarEmpreendimentos } from "@/lib/cadastro";
import { listarEleicoes } from "@/lib/eleicoes";
import { Selo } from "@/ui/selo";

import estilos from "../admin.module.css";
import { Cabecalho, SeloStatus } from "../pecas";
import { NovaEleicao } from "./nova";

export const metadata: Metadata = { title: "Eleições" };

export default async function Eleicoes() {
  await exigirUsuarioPagina();
  const [eleicoes, empreendimentos] = await Promise.all([
    listarEleicoes(),
    listarEmpreendimentos(),
  ]);
  return (
    <main className={estilos.pagina}>
      <Cabecalho
        olho="Votação"
        titulo="Eleições"
        sub="Crie a eleição, cadastre os candidatos e conduza a votação até o relatório."
      />
      <div className={estilos.duas}>
        <section className={estilos.cartao}>
          {eleicoes.length === 0 ? (
            <p className={estilos.vazio}>Nenhuma eleição ainda.</p>
          ) : (
            <div className={estilos.lista}>
              {eleicoes.map((e) => (
                <div key={e.id} className={estilos.linha}>
                  <div className={estilos.linhaPrincipal}>
                    <Link
                      href={`/admin/eleicoes/${e.id}`}
                      className={estilos.linhaTitulo}
                    >
                      {e.titulo}
                    </Link>
                    <span className={estilos.linhaMeta}>
                      {e.empreendimento} · {e.votos} votos · /v/{e.codigo}
                    </span>
                  </div>
                  {e.teste && <Selo>Teste</Selo>}
                  <SeloStatus status={e.status} />
                </div>
              ))}
            </div>
          )}
        </section>
        <NovaEleicao
          empreendimentos={empreendimentos.map(({ id, nome }) => ({
            id,
            nome,
          }))}
        />
      </div>
    </main>
  );
}
