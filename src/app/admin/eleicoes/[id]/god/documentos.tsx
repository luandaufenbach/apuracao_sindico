"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { Botao } from "@/ui/botao";
import { Icone } from "@/ui/icone";
import { Selo } from "@/ui/selo";

import estilos from "../../../admin.module.css";
import { hora, NOME_ORIGEM } from "../../../formato";
import proprio from "./god.module.css";
import type { DocumentoGod } from "./tipos";

const sem = (texto: string) =>
  texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/**
 * Votos por documento: cada CPF ou CNPJ (mascarado) com os apartamentos do
 * cadastro e quantos já votaram, do maior para o menor. Abrindo a linha, cada
 * apartamento mostra quando e por quem votou. O candidato não aparece aqui.
 */
export function Documentos({ documentos }: { documentos: DocumentoGod[] }) {
  const router = useRouter();
  const [atualizando, iniciar] = useTransition();
  const [filtro, setFiltro] = useState("");
  const [abertos, setAbertos] = useState<ReadonlySet<string>>(() => new Set());

  const termo = sem(filtro.trim());
  const visiveis = termo
    ? documentos.filter(
        (d) =>
          sem(d.nome).includes(termo) || sem(d.documento).startsWith(termo),
      )
    : documentos;

  function alternar(chave: string) {
    setAbertos((s) => {
      const novo = new Set(s);
      if (!novo.delete(chave)) novo.add(chave);
      return novo;
    });
  }

  return (
    <section className={estilos.cartao}>
      <div className={estilos.cartaoCabeca}>
        <h2 className={estilos.cartaoTitulo}>Votos por documento</h2>
        <Botao
          variante="fantasma"
          tamanho="p"
          iconeEsquerda="refresh-cw"
          carregando={atualizando}
          onClick={() => iniciar(() => router.refresh())}
        >
          Atualizar
        </Botao>
      </div>
      <p className={estilos.texto}>
        Documento mascarado, nome, apartamentos do cadastro e quantos já
        votaram. Abra a linha para ver cada apartamento.
      </p>
      <input
        className={`${estilos.controle} ${estilos.pequeno}`}
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        placeholder="Filtrar por nome ou início do documento"
        aria-label="Filtrar documentos"
        type="search"
      />
      {visiveis.length === 0 ? (
        <p className={estilos.vazio}>Nenhum documento encontrado.</p>
      ) : (
        <div className={proprio.docs}>
          <div className={proprio.docsCabeca} aria-hidden="true">
            <span>Documento</span>
            <span>Nome</span>
            <span>Cadastro</span>
            <span>Votaram</span>
            <span />
          </div>
          {visiveis.map((d) => {
            const aberto = abertos.has(d.chave);
            const idLista = `doc-${d.chave}`;
            return (
              <div key={d.chave} className={proprio.doc}>
                <button
                  type="button"
                  className={proprio.docLinha}
                  aria-expanded={aberto}
                  aria-controls={idLista}
                  onClick={() => alternar(d.chave)}
                >
                  <span className={estilos.mono}>{d.documento}</span>
                  <span className={proprio.docNome}>{d.nome}</span>
                  <span className={proprio.docNumero}>
                    <span className={proprio.soCelular}>Cadastro </span>
                    {d.cadastro}
                  </span>
                  <span
                    className={`${proprio.docNumero} ${d.votaram === d.cadastro && d.cadastro > 0 ? proprio.completo : ""}`}
                  >
                    <span className={proprio.soCelular}>Votaram </span>
                    {d.votaram}
                    {d.foraDoCadastro > 0 && (
                      <span className={proprio.fora}>
                        {" "}
                        +{d.foraDoCadastro} fora
                      </span>
                    )}
                  </span>
                  <Icone
                    nome="chevron-down"
                    tamanho={16}
                    className={aberto ? proprio.girado : undefined}
                  />
                </button>
                <ul id={idLista} className={proprio.docAptos} hidden={!aberto}>
                  {d.apartamentos.map((a) => (
                    <li key={a.apartamentoId}>
                      <span>
                        {a.rotulo}
                        {!a.noCadastro && (
                          <Selo tom="aviso" className={proprio.seloFora}>
                            Fora do cadastro
                          </Selo>
                        )}
                      </span>
                      {a.voto ? (
                        <span>
                          votou às {hora(a.voto.horario).slice(0, 5)} por{" "}
                          {a.voto.nome}
                          <span className={estilos.linhaMeta}>
                            {" "}
                            · {NOME_ORIGEM[a.voto.origem]}
                            {!a.voto.comEste && " · outro documento"}
                          </span>
                        </span>
                      ) : (
                        <span className={proprio.naoVotou}>não votou</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
