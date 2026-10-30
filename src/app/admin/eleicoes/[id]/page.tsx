import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { exigirUsuarioPagina } from "@/lib/auth";
import { listarApartamentos } from "@/lib/cadastro";
import { buscarEleicao } from "@/lib/eleicoes";
import { idBanco } from "@/lib/erros";
import { Selo } from "@/ui/selo";

import estilos from "../../admin.module.css";
import { Cabecalho, LinkBotao, SeloStatus } from "../../pecas";
import { Candidatos } from "./candidatos";
import { DadosEleicao } from "./dados";
import { Status } from "./status";

export const metadata: Metadata = { title: "Eleição" };

export default async function Eleicao({
  params,
}: PageProps<"/admin/eleicoes/[id]">) {
  await exigirUsuarioPagina();
  const id = idBanco.safeParse(Number((await params).id));
  const el = id.success ? await buscarEleicao(id.data) : null;
  if (!el) notFound();
  const apartamentos = (await listarApartamentos(el.empreendimentoId)).map(
    (a) => ({
      id: a.id,
      nome: `${a.bloco}, ${a.rotulo}`,
    }),
  );

  return (
    <main className={estilos.pagina}>
      <Cabecalho
        olho={
          <>
            <Link href="/admin/eleicoes">Eleições</Link>
            <span>/</span>
            <SeloStatus status={el.status} />
            {el.teste && <Selo>Teste</Selo>}
          </>
        }
        titulo={el.titulo}
        sub={
          <>
            <Link href={`/admin/empreendimentos/${el.empreendimentoId}`}>
              {el.empreendimento}
            </Link>{" "}
            · {el.apartamentos} apartamentos
          </>
        }
        acoes={
          <>
            <LinkBotao
              href={`/admin/eleicoes/${el.id}/painel`}
              icone="layout-grid"
              variante={el.status === "aberta" ? "primario" : "contorno"}
            >
              Painel ao vivo
            </LinkBotao>
            <LinkBotao
              href={`/telao/${el.codigo}`}
              icone="external-link"
              externo
            >
              Telão
            </LinkBotao>
            <LinkBotao
              href={`/admin/eleicoes/${el.id}/relatorio`}
              icone="file-text"
            >
              Relatório
            </LinkBotao>
          </>
        }
      />
      <div className={estilos.duas}>
        <Candidatos
          eleicaoId={el.id}
          status={el.status}
          candidatos={el.candidatos}
          apartamentos={apartamentos}
        />
        <div className={estilos.pilha}>
          <Status
            eleicaoId={el.id}
            status={el.status}
            codigo={el.codigo}
            abertaEm={el.abertaEm}
            encerradaEm={el.encerradaEm}
            candidatos={el.candidatos.length}
            apartamentos={el.apartamentos}
          />
          <DadosEleicao
            eleicaoId={el.id}
            titulo={el.titulo}
            teste={el.teste}
            rascunho={el.status === "rascunho"}
          />
        </div>
      </div>
    </main>
  );
}
