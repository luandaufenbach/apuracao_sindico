import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { agrupar } from "@/lib/agrupar";
import { exigirUsuarioPagina } from "@/lib/auth";
import { idBanco } from "@/lib/erros";
import { dadosRelatorio } from "@/lib/painel";

import { contar, dataHora, horaMinuto, NOME_STATUS } from "../../../formato";
import { Imprimir } from "./imprimir";
import estilos from "./relatorio.module.css";

export const metadata: Metadata = { title: "Relatório" };

export default async function Relatorio({
  params,
}: PageProps<"/admin/eleicoes/[id]/relatorio">) {
  await exigirUsuarioPagina();
  const id = idBanco.safeParse(Number((await params).id));
  const r = id.success ? await dadosRelatorio(id.data) : null;
  if (!r) notFound();
  const { eleicao: el } = r;
  const participacao =
    r.totalApartamentos === 0
      ? 0
      : Math.round((r.votaram.length / r.totalApartamentos) * 1000) / 10;
  const totalVotos = r.resultado?.reduce((n, c) => n + c.votos, 0) ?? 0;
  const porBloco = agrupar(r.votaram, (v) => v.bloco);

  return (
    <div className={estilos.fundo} data-theme="light">
      {/* Fundo branco também nas margens da folha impressa. */}
      <style>{"@media print{html,body{background:#fff}}"}</style>
      <div className={estilos.ferramentas}>
        <Link href={`/admin/eleicoes/${el.id}`}>Voltar para a eleição</Link>
        <Imprimir />
      </div>
      <article className={estilos.folha}>
        <header className={estilos.topo}>
          <p className={estilos.olho}>Relatório da apuração</p>
          <h1 className={estilos.titulo}>{el.titulo}</h1>
          <p className={estilos.sub}>{el.empreendimento}</p>
        </header>

        {(el.status === "rascunho" || el.status === "aberta") && (
          <p className={estilos.aviso}>
            Relatório parcial: a votação está{" "}
            {NOME_STATUS[el.status].toLowerCase()}. O resultado por candidato
            aparece depois do encerramento.
          </p>
        )}

        <dl className={estilos.dados}>
          <div>
            <dt>Situação</dt>
            <dd>{NOME_STATUS[el.status]}</dd>
          </div>
          <div>
            <dt>Abertura</dt>
            <dd>{el.abertaEm ? dataHora(el.abertaEm) : "—"}</dd>
          </div>
          <div>
            <dt>Encerramento</dt>
            <dd>{el.encerradaEm ? dataHora(el.encerradaEm) : "—"}</dd>
          </div>
          <div>
            <dt>Total de apartamentos</dt>
            <dd>{r.totalApartamentos}</dd>
          </div>
          <div>
            <dt>Apartamentos que votaram</dt>
            <dd>
              {r.votaram.length} ({participacao.toLocaleString("pt-BR")}%)
            </dd>
          </div>
        </dl>

        {r.resultado && (
          <section className={estilos.secao}>
            <h2 className={estilos.secaoTitulo}>Votos por candidato</h2>
            <table className={estilos.tabela}>
              <thead>
                <tr>
                  <th>Candidato</th>
                  <th className={estilos.num}>Votos</th>
                  <th className={estilos.num}>%</th>
                </tr>
              </thead>
              <tbody>
                {r.resultado.map((c) => (
                  <tr key={c.id}>
                    <td>{c.nome}</td>
                    <td className={estilos.num}>{c.votos}</td>
                    <td className={estilos.num}>
                      {totalVotos === 0
                        ? "0"
                        : (
                            Math.round((c.votos / totalVotos) * 1000) / 10
                          ).toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={estilos.vencedor}>
              {r.vencedores.length === 0
                ? "Sem votos válidos: não há vencedor."
                : r.vencedores.length === 1
                  ? `Vencedor: ${r.vencedores[0].nome}, com ${contar(r.vencedores[0].votos, "voto", "votos")}.`
                  : `Empate entre ${r.vencedores.map((v) => v.nome).join(" e ")}, com ${contar(r.vencedores[0].votos, "voto", "votos")} cada.`}
            </p>
          </section>
        )}

        <section className={estilos.secao}>
          <h2 className={estilos.secaoTitulo}>
            Apartamentos que votaram ({r.votaram.length} de{" "}
            {r.totalApartamentos})
          </h2>
          {r.votaram.length === 0 ? (
            <p className={estilos.texto}>Nenhum voto.</p>
          ) : (
            r.blocos.map(({ bloco, total }) => {
              const doBloco = porBloco.get(bloco) ?? [];
              if (doBloco.length === 0) return null;
              return (
                <div key={bloco} className={estilos.bloco}>
                  <h3 className={estilos.blocoTitulo}>
                    {bloco}
                    <span>
                      {doBloco.length} de {total}
                    </span>
                  </h3>
                  <ul className={estilos.votaram}>
                    {doBloco.map((v) => (
                      <li key={v.rotulo}>
                        <span>{v.rotulo}</span>
                        <span className={estilos.mono}>
                          {horaMinuto(v.horario)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })
          )}
        </section>

        <section className={`${estilos.secao} ${estilos.assinaturas}`}>
          <h2 className={estilos.secaoTitulo}>Assinaturas</h2>
          <div className={estilos.linhasAssinatura}>
            {[
              "Responsável pela mesa",
              "Síndico eleito",
              "Testemunha",
              "Testemunha",
            ].map((papel, i) => (
              <div key={i} className={estilos.assinatura}>
                <span />
                {papel}
              </div>
            ))}
          </div>
        </section>

        <footer className={estilos.rodape}>
          Gerado em {dataHora(r.geradoEm)} · código da eleição {el.codigo}
        </footer>
      </article>
    </div>
  );
}
