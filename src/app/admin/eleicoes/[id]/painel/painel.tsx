"use client";

import Link from "next/link";
import { useState } from "react";

import { agrupar } from "@/lib/agrupar";
import type { DadosPainel } from "@/lib/painel";
import { Botao } from "@/ui/botao";
import { Dialogo } from "@/ui/dialogo";
import { Icone } from "@/ui/icone";
import { Selo } from "@/ui/selo";
import { useConsultaPeriodica } from "@/ui/use-consulta-periodica";

import estilos from "../../../admin.module.css";
import { chamarApi, mensagemDe } from "../../../cliente";
import {
  hora,
  type Json,
  NOME_ORIGEM,
  rotuloCurto as curto,
} from "../../../formato";
import { Alerta, Cabecalho, LinkBotao, SeloStatus } from "../../../pecas";
import proprio from "./painel.module.css";

export type { Json };

type Dados = Json<DadosPainel>;
type Apto = Dados["apartamentos"][number];

const INTERVALO = 2000;

type Situacao = "votou" | "bloqueado" | "mesa" | "falta";
const situacao = (a: Apto): Situacao =>
  a.votouEm ? "votou" : a.bloqueado ? "bloqueado" : a.soMesa ? "mesa" : "falta";
const NOME_SITUACAO: Record<Situacao, string> = {
  votou: "Votou",
  bloqueado: "Bloqueado",
  mesa: "Só pela mesa",
  falta: "Falta votar",
};

export function Painel({ inicial }: { inicial: Dados }) {
  const [dados, setDados] = useState(inicial);
  const [offline, setOffline] = useState(false);
  const [aberto, setAberto] = useState<number | null>(null);
  const url = `/api/admin/eleicoes/${inicial.eleicao.id}/painel`;

  const atualizar = async (sinal?: AbortSignal) => {
    try {
      setDados(await chamarApi<Dados>(url, { metodo: "GET" }, sinal));
      setOffline(false);
    } catch (erro) {
      if (!sinal?.aborted) setOffline(true);
      throw erro;
    }
  };
  useConsultaPeriodica(atualizar, INTERVALO);

  const { eleicao, contadores } = dados;
  const blocos = agrupar(dados.apartamentos, (a) => a.bloco);
  const bloqueados = dados.apartamentos.filter(
    (a) => a.bloqueado && !a.votouEm,
  );
  const soMesa = dados.apartamentos.filter((a) => a.soMesa && !a.votouEm);
  const selecionado = dados.apartamentos.find((a) => a.id === aberto) ?? null;
  const porcento =
    contadores.total === 0
      ? 0
      : Math.round((contadores.votaram / contadores.total) * 100);

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
          </>
        }
        titulo="Painel ao vivo"
        sub={`${eleicao.empreendimento}. Atualiza a cada 2 segundos.`}
        acoes={
          <>
            <LinkBotao
              href={`/telao/${eleicao.codigo}`}
              icone="external-link"
              externo
            >
              Telão
            </LinkBotao>
            <LinkBotao href={`/admin/eleicoes/${eleicao.id}`}>
              Configuração
            </LinkBotao>
          </>
        }
      />

      <div className={estilos.pilha}>
        {offline && (
          <Alerta tom="aviso">
            Sem conexão com o servidor. Os números podem estar atrasados;
            tentando de novo.
          </Alerta>
        )}
        {eleicao.status !== "aberta" && (
          <Alerta tom="info">
            {eleicao.status === "rascunho"
              ? "A votação ainda não foi aberta."
              : "A votação está encerrada."}
          </Alerta>
        )}

        <div className={estilos.numeros}>
          <div className={`${estilos.numero} ${estilos.numeroDestaque}`}>
            <span className={estilos.olho}>Votaram</span>
            <span className={estilos.numeroValor}>
              {contadores.votaram}
              <span className={proprio.de}> de {contadores.total}</span>
            </span>
          </div>
          <div className={estilos.numero}>
            <span className={estilos.olho}>Faltam</span>
            <span className={estilos.numeroValor}>{contadores.faltam}</span>
          </div>
          <div className={estilos.numero}>
            <span className={estilos.olho}>Bloqueados</span>
            <span
              className={`${estilos.numeroValor} ${contadores.bloqueados > 0 ? proprio.alarme : ""}`}
            >
              {contadores.bloqueados}
            </span>
          </div>
          <div className={estilos.numero}>
            <span className={estilos.olho}>Só pela mesa</span>
            <span className={estilos.numeroValor}>{contadores.soMesa}</span>
          </div>
        </div>
        <div
          className={proprio.barra}
          role="progressbar"
          aria-valuenow={porcento}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Apartamentos que votaram"
        >
          <span style={{ width: `${porcento}%` }} />
        </div>

        <div className={estilos.duas}>
          <section className={estilos.cartao}>
            <div className={estilos.cartaoCabeca}>
              <h2 className={estilos.cartaoTitulo}>Apartamentos</h2>
              <ul className={proprio.legenda}>
                {(Object.keys(NOME_SITUACAO) as Situacao[]).map((s) => (
                  <li key={s}>
                    <span className={`${proprio.amostra} ${proprio[s]}`} />
                    {NOME_SITUACAO[s]}
                  </li>
                ))}
              </ul>
            </div>
            {[...blocos].map(([bloco, aptos]) => (
              <div key={bloco} className={proprio.bloco}>
                <h3 className={proprio.blocoTitulo}>
                  {bloco}
                  <span>
                    {aptos.filter((a) => a.votouEm).length}/{aptos.length}
                  </span>
                </h3>
                <div className={proprio.grade}>
                  {aptos.map((a) => {
                    const s = situacao(a);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        className={`${proprio.apto} ${proprio[s]}`}
                        onClick={() => setAberto(a.id)}
                        aria-label={`${a.bloco}, ${a.rotulo}: ${NOME_SITUACAO[s]}`}
                        title={`${a.rotulo}: ${NOME_SITUACAO[s]}`}
                      >
                        {curto(a.rotulo)}
                        {s === "votou" && (
                          <Icone nome="check" tamanho={12} traco={2} />
                        )}
                        {s === "bloqueado" && (
                          <Icone nome="lock" tamanho={12} traco={2} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>

          <div className={estilos.pilha}>
            <section className={estilos.cartao}>
              <h2 className={estilos.cartaoTitulo}>
                Bloqueados ({bloqueados.length})
              </h2>
              {bloqueados.length === 0 ? (
                <p className={estilos.texto}>Nenhum apartamento bloqueado.</p>
              ) : (
                <div className={estilos.lista}>
                  {bloqueados.map((a) => (
                    <div key={a.id} className={estilos.linha}>
                      <span className={estilos.linhaPrincipal}>
                        {a.bloco}, {a.rotulo}
                      </span>
                      <Desbloquear
                        eleicaoId={eleicao.id}
                        apartamentoId={a.id}
                        aoDesbloquear={() => atualizar()}
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={estilos.cartao}>
              <h2 className={estilos.cartaoTitulo}>Últimos votos</h2>
              {dados.ultimos.length === 0 ? (
                <p className={estilos.texto}>Nenhum voto ainda.</p>
              ) : (
                <div className={estilos.lista}>
                  {dados.ultimos.map((v) => (
                    <div key={v.votoId} className={estilos.linha}>
                      <div className={estilos.linhaPrincipal}>
                        <span>
                          {v.bloco}, {v.rotulo}
                        </span>
                        <span className={estilos.linhaMeta}>{v.nome}</span>
                      </div>
                      <span className={estilos.mono}>{hora(v.horario)}</span>
                      <Selo tom={v.origem === "mesa" ? "aviso" : "neutro"}>
                        {NOME_ORIGEM[v.origem]}
                      </Selo>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className={estilos.cartao}>
              <h2 className={estilos.cartaoTitulo}>
                Só pela mesa, sem voto ({soMesa.length})
              </h2>
              {soMesa.length === 0 ? (
                <p className={estilos.texto}>Nenhum pendente.</p>
              ) : (
                <p className={proprio.listaCurta}>
                  {soMesa.map((a) => `${a.bloco}, ${a.rotulo}`).join(" · ")}
                </p>
              )}
            </section>
          </div>
        </div>
      </div>

      {selecionado && (
        <Dialogo
          aberto
          aoFechar={() => setAberto(null)}
          titulo={`${selecionado.bloco}, ${selecionado.rotulo}`}
          descricao={NOME_SITUACAO[situacao(selecionado)]}
          rodape={
            selecionado.bloqueado && !selecionado.votouEm ? (
              <Desbloquear
                eleicaoId={eleicao.id}
                apartamentoId={selecionado.id}
                aoDesbloquear={async () => {
                  await atualizar();
                  setAberto(null);
                }}
              />
            ) : (
              <Botao variante="contorno" onClick={() => setAberto(null)}>
                Fechar
              </Botao>
            )
          }
        >
          <dl className={proprio.detalhes}>
            {selecionado.votouEm && (
              <>
                <div>
                  <dt>Votou às</dt>
                  <dd>{hora(selecionado.votouEm)}</dd>
                </div>
                <div>
                  <dt>Quem votou</dt>
                  <dd>{selecionado.nome}</dd>
                </div>
                <div>
                  <dt>Origem</dt>
                  <dd>
                    {selecionado.origem && NOME_ORIGEM[selecionado.origem]}
                  </dd>
                </div>
              </>
            )}
            {!selecionado.votouEm && (
              <div>
                <dt>Tentativas que não conferiram</dt>
                <dd>
                  {selecionado.tentativas} de {dados.limiteTentativas}
                </dd>
              </div>
            )}
            {selecionado.soMesa && (
              <div>
                <dt>Documento</dt>
                <dd>Sem documento válido: vota pela mesa</dd>
              </div>
            )}
          </dl>
        </Dialogo>
      )}
    </main>
  );
}

function Desbloquear({
  eleicaoId,
  apartamentoId,
  aoDesbloquear,
}: {
  eleicaoId: number;
  apartamentoId: number;
  aoDesbloquear: () => Promise<void>;
}) {
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  return (
    <span className={proprio.desbloquear}>
      <Botao
        tamanho="p"
        iconeEsquerda="lock"
        carregando={enviando}
        onClick={async () => {
          setEnviando(true);
          setErro(null);
          try {
            await chamarApi(`/api/admin/eleicoes/${eleicaoId}/desbloquear`, {
              corpo: { apartamentoId },
            });
            await aoDesbloquear();
          } catch (falha) {
            setErro(mensagemDe(falha));
          } finally {
            setEnviando(false);
          }
        }}
      >
        Desbloquear
      </Botao>
      {erro && <span className={proprio.erroCurto}>{erro}</span>}
    </span>
  );
}
