import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { exigirUsuarioPagina } from "@/lib/auth";
import { buscarEmpreendimento } from "@/lib/cadastro";
import { idBanco } from "@/lib/erros";

import estilos from "../../admin.module.css";
import { Cabecalho, LinkBotao, SeloStatus } from "../../pecas";
import { Apartamentos } from "./apartamentos";
import { Excluir } from "./excluir";
import { Renomear } from "./renomear";

export const metadata: Metadata = { title: "Empreendimento" };

export default async function Empreendimento({
  params,
}: PageProps<"/admin/empreendimentos/[id]">) {
  const usuario = await exigirUsuarioPagina();
  const id = idBanco.safeParse(Number((await params).id));
  const emp = id.success ? await buscarEmpreendimento(id.data) : null;
  if (!emp) notFound();

  const soMesa = emp.apartamentos.filter(
    (a) => !a.compradores.some((c) => c.documento),
  ).length;
  return (
    <main className={estilos.pagina}>
      <Cabecalho
        olho={
          <>
            <Link href="/admin/empreendimentos">Empreendimentos</Link>
            <span>/</span>
          </>
        }
        titulo={emp.nome}
        sub={`${emp.apartamentos.length} apartamentos, ${soMesa} só pela mesa.`}
        acoes={
          <LinkBotao
            href={`/admin/empreendimentos/${emp.id}/importar`}
            variante={emp.apartamentos.length === 0 ? "primario" : "contorno"}
            icone="file-text"
          >
            Importar planilha
          </LinkBotao>
        }
      />
      <div className={estilos.duas}>
        <Apartamentos
          empreendimentoId={emp.id}
          apartamentos={emp.apartamentos}
        />
        <div className={estilos.pilha}>
          <Renomear empreendimentoId={emp.id} nome={emp.nome} />
          <section className={estilos.cartao}>
            <h2 className={estilos.cartaoTitulo}>Eleições</h2>
            {emp.eleicoes.length === 0 ? (
              <p className={estilos.texto}>
                Nenhuma eleição.{" "}
                <Link href="/admin/eleicoes">Criar uma eleição</Link>
              </p>
            ) : (
              <div className={estilos.lista}>
                {emp.eleicoes.map((e) => (
                  <div key={e.id} className={estilos.linha}>
                    <Link
                      href={`/admin/eleicoes/${e.id}`}
                      className={`${estilos.linhaPrincipal} ${estilos.linhaTitulo}`}
                    >
                      {e.titulo}
                    </Link>
                    <SeloStatus status={e.status} />
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* Só o god vê; a rota confere o papel no servidor. */}
          {usuario.papel === "god" && (
            <Excluir empreendimentoId={emp.id} nome={emp.nome} />
          )}
        </div>
      </div>
    </main>
  );
}
