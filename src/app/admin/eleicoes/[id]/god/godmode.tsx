"use client";

import Link from "next/link";
import { useState } from "react";

import { Abas, idAba, idPainel } from "@/ui/abas";
import { Selo } from "@/ui/selo";

import estilos from "../../../admin.module.css";
import { Cabecalho, LinkBotao, SeloStatus } from "../../../pecas";
import { Auditoria } from "./auditoria";
import { Buscar } from "./buscar";
import { Documentos } from "./documentos";
import { Mesa } from "./mesa";
import type {
  ApartamentoGod,
  CandidatoGod,
  DocumentoGod,
  EleicaoGod,
  PaginaAuditoria,
  UsuarioGod,
} from "./tipos";
import { Votacao } from "./votacao";

const ABAS = [
  { valor: "mesa", rotulo: "Voto pela mesa" },
  { valor: "buscar", rotulo: "Buscar voto" },
  { valor: "documentos", rotulo: "Votos por documento" },
  { valor: "votacao", rotulo: "Reabrir e zerar" },
  { valor: "auditoria", rotulo: "Auditoria" },
] as const;
type Aba = (typeof ABAS)[number]["valor"];

export function Godmode({
  eleicao,
  candidatos,
  apartamentos,
  documentos,
  auditoria,
  usuarios,
  abaInicial,
}: {
  eleicao: EleicaoGod;
  candidatos: CandidatoGod[];
  apartamentos: ApartamentoGod[];
  documentos: DocumentoGod[];
  auditoria: PaginaAuditoria;
  usuarios: UsuarioGod[];
  abaInicial?: string;
}) {
  const inicial: Aba =
    ABAS.find((a) => a.valor === abaInicial)?.valor ?? "mesa";
  const [aba, setAba] = useState<Aba>(inicial);
  // Aba já aberta fica montada, só escondida: formulário e filtros não se
  // perdem na troca.
  const [abertas, setAbertas] = useState<ReadonlySet<Aba>>(
    () => new Set([inicial]),
  );

  function mudar(valor: Aba) {
    setAba(valor);
    setAbertas((s) => new Set(s).add(valor));
    window.history.replaceState(null, "", `?aba=${valor}`);
  }

  const soMesaSemVoto = apartamentos.filter((a) => a.soMesa && !a.votou);
  const itens = ABAS.map((a) =>
    a.valor === "mesa" ? { ...a, contagem: soMesaSemVoto.length } : a,
  );

  return (
    <main className={estilos.pagina}>
      <Cabecalho
        olho={
          <>
            <Link href="/admin/eleicoes">Eleições</Link>
            <span>/</span>
            <Link href={`/admin/eleicoes/${eleicao.id}`}>{eleicao.titulo}</Link>
            <span>/</span>
            <SeloStatus status={eleicao.status} />
            {eleicao.teste && <Selo>Teste</Selo>}
          </>
        }
        titulo="Godmode"
        sub={`${eleicao.empreendimento}. Toda ação pede motivo, que fica no log de auditoria e no relatório final.`}
        acoes={
          <>
            <LinkBotao
              href={`/admin/eleicoes/${eleicao.id}/painel`}
              icone="layout-grid"
            >
              Painel ao vivo
            </LinkBotao>
            <LinkBotao
              href={`/admin/eleicoes/${eleicao.id}/relatorio`}
              icone="file-text"
            >
              Relatório
            </LinkBotao>
          </>
        }
      />
      <div className={estilos.pilha}>
        <Abas
          itens={itens}
          valor={aba}
          aoMudar={mudar}
          rotulo="Ações do godmode"
          prefixo="god"
        />
        {/* Todo painel existe para o aria-controls das abas; o conteúdo só
            monta na primeira vez que a aba abre. */}
        {ABAS.map(({ valor }) => (
          <section
            key={valor}
            role="tabpanel"
            id={idPainel("god", valor)}
            aria-labelledby={idAba("god", valor)}
            hidden={aba !== valor}
          >
            {abertas.has(valor) && (
              <>
                {valor === "mesa" && (
                  <Mesa
                    eleicao={eleicao}
                    candidatos={candidatos}
                    apartamentos={apartamentos}
                  />
                )}
                {valor === "buscar" && (
                  <Buscar eleicao={eleicao} apartamentos={apartamentos} />
                )}
                {valor === "documentos" && (
                  <Documentos documentos={documentos} />
                )}
                {valor === "votacao" && <Votacao eleicao={eleicao} />}
                {valor === "auditoria" && (
                  <Auditoria
                    eleicaoId={eleicao.id}
                    inicial={auditoria}
                    usuarios={usuarios}
                  />
                )}
              </>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
