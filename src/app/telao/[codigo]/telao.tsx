"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

import {
  apiPublica,
  type Eleicao,
  comoErroApi,
  type ErroApi,
  type StatusEleicao,
  type Telao as Placar,
} from "@/lib/api-publica";
import { Brilho } from "@/ui/brilho";
import { FotoCandidato } from "@/ui/foto-candidato";
import { useConsultaPeriodica } from "@/ui/use-consulta-periodica";

import { Qr } from "./qr";
import t from "./telao.module.css";
import { useTelaAcesa } from "./use-tela-acesa";

/** Status e contagem: docs/ESPECIFICACAO.md, "Atualização ao vivo por polling a cada 2 s". */
const PLACAR_MS = 2000;
/** Com o resultado publicado. */
const PUBLICADA_MS = 30_000;
/** Nova tentativa quando a eleição não carrega (rede do evento instável). */
const NOVA_TENTATIVA_MS = 5000;

const STATUS: Record<StatusEleicao, { rotulo: string; classe: string }> = {
  rascunho: { rotulo: "Aguardando abertura", classe: t.statusRascunho },
  aberta: { rotulo: "Votação aberta", classe: t.statusAberta },
  encerrada: { rotulo: "Votação encerrada", classe: t.statusEncerrada },
  publicada: { rotulo: "Resultado publicado", classe: t.statusPublicada },
};

const porcentagem = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  maximumFractionDigits: 0,
});

// A origem do link só existe no navegador: no servidor, o QR espera.
const semAssinatura = () => () => {};
const origemDoNavegador = () => window.location.origin;
const semOrigem = () => null;

/**
 * Telão (docs/ESPECIFICACAO.md, "Telão"): QR do link de voto, título,
 * candidatos e quantos apartamentos votaram. O resultado por candidato só
 * aparece quando a API passa a mandá-lo, com a eleição publicada (R11).
 */
export function Telao({ codigo }: { codigo: string }) {
  const origem = useSyncExternalStore(
    semAssinatura,
    origemDoNavegador,
    semOrigem,
  );
  const [eleicao, setEleicao] = useState<Eleicao | null>(null);
  const [falha, setFalha] = useState<ErroApi | null>(null);
  const [recarga, setRecarga] = useState(0);
  const [placar, setPlacar] = useState<Placar | null>(null);
  const [semConexao, setSemConexao] = useState(false);
  useTelaAcesa();

  // Fotos dos candidatos vêm junto: uma chamada ao abrir e outra quando a
  // votação abre (os candidatos podem mudar antes da abertura).
  useEffect(() => {
    const controle = new AbortController();
    let espera: ReturnType<typeof setTimeout> | undefined;
    const carregar = () =>
      apiPublica.eleicao(codigo, controle.signal).then(
        (el) => {
          setEleicao(el);
          setFalha(null);
        },
        (erro) => {
          if (controle.signal.aborted) return;
          const falhaApi = comoErroApi(erro);
          setFalha(falhaApi);
          if (falhaApi.status !== 404) {
            espera = setTimeout(carregar, NOVA_TENTATIVA_MS);
          }
        },
      );
    carregar();
    return () => {
      controle.abort();
      clearTimeout(espera);
    };
  }, [codigo, recarga]);

  // Publicada, o resultado quase não muda (só se um voto for anulado): consulta
  // mais devagar. Código inexistente: para.
  const publicada = placar?.status === "publicada";
  useConsultaPeriodica(
    async (sinal) => {
      try {
        const novo = await apiPublica.telao(codigo, sinal);
        setPlacar(novo);
        setSemConexao(false);
        // Saiu do rascunho: o status muda na hora (para não recarregar de novo
        // a cada consulta) e a eleição, com as fotos, recarrega uma vez.
        if (eleicao?.status === "rascunho" && novo.status !== "rascunho") {
          setEleicao((el) => el && { ...el, status: novo.status });
          setRecarga((n) => n + 1);
        }
      } catch {
        if (!sinal.aborted) setSemConexao(true);
      }
    },
    publicada ? PUBLICADA_MS : PLACAR_MS,
    falha?.status !== 404,
  );

  if (!eleicao) {
    return (
      <main className={t.centro}>
        {falha?.status === 404 ? (
          <>
            <h1 className={t.centroTitulo}>Eleição não encontrada</h1>
            <p className={t.centroTexto}>Confira o código no link do telão.</p>
          </>
        ) : falha ? (
          <>
            <h1 className={t.centroTitulo}>Não foi possível abrir o telão</h1>
            <p className={t.centroTexto}>{falha.message} Tentando de novo.</p>
          </>
        ) : (
          <p className={t.centroTexto} role="status">
            Carregando
          </p>
        )}
      </main>
    );
  }

  const status = placar?.status ?? eleicao.status;
  const votaram = placar?.votaram ?? 0;
  const total = placar?.totalApartamentos ?? 0;
  const fracao = total > 0 ? votaram / total : 0;
  const link = origem && `${origem}/v/${encodeURIComponent(codigo)}`;
  const mostrarQr = link && (status === "rascunho" || status === "aberta");

  return (
    <Brilho variante="grade" className={t.fundo}>
      <main className={t.telao}>
        <header className={t.topo}>
          <span>{eleicao.empreendimento}</span>
          <span className={t.selos}>
            {semConexao && (
              <span className={t.semConexao}>
                Sem conexão · tentando de novo
              </span>
            )}
            <span className={`${t.status} ${STATUS[status].classe}`}>
              {STATUS[status].rotulo}
            </span>
          </span>
        </header>

        {placar?.resultado ? (
          <Resultado
            eleicao={eleicao}
            resultado={placar.resultado}
            votaram={votaram}
            total={total}
          />
        ) : (
          <>
            <section className={t.meio}>
              <div>
                <h1 className={t.titulo}>{eleicao.titulo}</h1>
                <div className={t.contagem}>
                  <p className={t.numeros}>
                    {votaram}
                    <span className={t.total}>de {total}</span>
                  </p>
                  <p className={t.legenda}>apartamentos votaram</p>
                  <div
                    className={t.barra}
                    role="progressbar"
                    aria-label="Apartamentos que votaram"
                    aria-valuemin={0}
                    aria-valuemax={total}
                    aria-valuenow={votaram}
                  >
                    <div
                      className={t.preenchido}
                      style={{ width: `${fracao * 100}%` }}
                    />
                  </div>
                  <span className={t.porcentagem}>
                    {porcentagem.format(fracao)}
                  </span>
                </div>
              </div>
              {mostrarQr && (
                <div className={t.qrCaixa}>
                  <Qr texto={link} className={t.qr} />
                  <p className={t.qrTexto}>
                    Aponte a câmera do celular para votar
                  </p>
                  <p className={t.url}>{link.replace(/^https?:\/\//, "")}</p>
                </div>
              )}
              {status === "encerrada" && (
                <div className={t.aguardaResultado}>
                  <p className={t.aguardaTitulo}>Votação encerrada</p>
                  <p className={t.aguardaTexto}>
                    O resultado aparece aqui quando for publicado.
                  </p>
                </div>
              )}
            </section>
            <ul className={t.candidatos} aria-label="Candidatos">
              {eleicao.candidatos.map((c) => (
                <li key={c.id} className={t.candidato}>
                  <FotoCandidato
                    candidato={c}
                    classeFoto={t.foto}
                    classeIniciais={t.iniciais}
                  />
                  <span>
                    <span className={t.nome}>{c.nome}</span>
                    {c.apartamento && (
                      <span className={t.apto}>
                        {c.apartamento.bloco} · {c.apartamento.rotulo}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </Brilho>
  );
}

function Resultado({
  eleicao,
  resultado,
  votaram,
  total,
}: {
  eleicao: Eleicao;
  resultado: NonNullable<Placar["resultado"]>;
  votaram: number;
  total: number;
}) {
  // Do mais votado para o menos votado; no empate, a ordem da cédula.
  const linhas = [...resultado].sort((a, b) => b.votos - a.votos);
  const maximo = linhas[0]?.votos ?? 0;
  const empate =
    maximo > 0 && linhas.filter((l) => l.votos === maximo).length > 1;
  return (
    <section className={t.resultado} aria-label="Resultado">
      <h1 className={t.titulo}>{eleicao.titulo}</h1>
      {linhas.map((l) => {
        const candidato = eleicao.candidatos.find(
          (c) => c.id === l.candidatoId,
        );
        const lider = maximo > 0 && l.votos === maximo;
        return (
          <div
            key={l.candidatoId}
            className={`${t.linha} ${lider ? t.vencedor : ""}`}
          >
            <FotoCandidato
              candidato={candidato ?? { nome: l.nome, foto: null }}
              classeFoto={t.foto}
              classeIniciais={t.iniciais}
            />
            <div className={t.linhaMeio}>
              <span className={t.linhaNome}>
                {l.nome}
                {lider && (
                  <span className={`${t.marca} ${empate ? t.marcaEmpate : ""}`}>
                    {empate ? "Empate" : "Mais votado"}
                  </span>
                )}
              </span>
              <div className={t.barraVotos}>
                <span
                  style={{
                    width: `${maximo > 0 ? (l.votos / maximo) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
            <span className={t.votos}>
              {l.votos}
              <small>
                {l.votos === 1 ? "voto" : "votos"} ·{" "}
                {porcentagem.format(votaram > 0 ? l.votos / votaram : 0)}
              </small>
            </span>
          </div>
        );
      })}
      <p className={t.rodapeResultado}>
        {votaram} de {total} apartamentos votaram
      </p>
    </section>
  );
}
