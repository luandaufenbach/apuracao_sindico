"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { AcaoStatus, StatusEleicao } from "@/lib/eleicoes";
import { Botao } from "@/ui/botao";
import { Dialogo } from "@/ui/dialogo";
import { Icone } from "@/ui/icone";

import estilos from "../../admin.module.css";
import { chamarApi, mensagemDe } from "../../cliente";
import { dataHora, NOME_STATUS } from "../../formato";
import { Alerta } from "../../pecas";
import proprio from "./eleicao.module.css";

const ETAPAS: StatusEleicao[] = [
  "rascunho",
  "aberta",
  "encerrada",
  "publicada",
];

const PROXIMA: Partial<
  Record<
    StatusEleicao,
    { acao: AcaoStatus; botao: string; pergunta: string; texto: string }
  >
> = {
  rascunho: {
    acao: "abrir",
    botao: "Abrir votação",
    pergunta: "Abrir a votação?",
    texto:
      "O link e o QR do telão passam a aceitar votos. Os candidatos não mudam mais de lista.",
  },
  aberta: {
    acao: "encerrar",
    botao: "Encerrar",
    pergunta: "Encerrar a votação?",
    texto:
      "Ninguém mais vota pelo link. Votos em andamento terminam de gravar. Só o god reabre.",
  },
  encerrada: {
    acao: "publicar",
    botao: "Publicar resultado",
    pergunta: "Publicar o resultado?",
    texto: "O telão passa a mostrar os votos de cada candidato.",
  },
};

export function Status({
  eleicaoId,
  status,
  codigo,
  abertaEm,
  encerradaEm,
  candidatos,
  apartamentos,
}: {
  eleicaoId: number;
  status: StatusEleicao;
  codigo: string;
  abertaEm: Date | null;
  encerradaEm: Date | null;
  candidatos: number;
  apartamentos: number;
}) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [copiado, setCopiado] = useState(false);
  const proxima = PROXIMA[status];

  async function mudar() {
    if (!proxima) return;
    setEnviando(true);
    setErro(null);
    try {
      await chamarApi(`/api/admin/eleicoes/${eleicaoId}/status`, {
        corpo: { acao: proxima.acao },
      });
      setConfirmando(false);
      router.refresh();
    } catch (falha) {
      setErro(mensagemDe(falha));
    } finally {
      setEnviando(false);
    }
  }

  async function copiar() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/v/${codigo}`,
      );
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sem permissão de área de transferência: o link continua visível.
    }
  }

  const pendencia =
    status === "rascunho" &&
    (candidatos === 0
      ? "Cadastre ao menos um candidato para abrir."
      : apartamentos === 0
        ? "Importe os apartamentos do empreendimento para abrir."
        : null);

  return (
    <section className={estilos.cartao}>
      <h2 className={estilos.cartaoTitulo}>Votação</h2>
      <ol className={proprio.etapas}>
        {ETAPAS.map((e, i) => {
          const atual = ETAPAS.indexOf(status);
          return (
            <li
              key={e}
              className={
                i < atual
                  ? proprio.feita
                  : i === atual
                    ? proprio.atual
                    : undefined
              }
              aria-current={i === atual ? "step" : undefined}
            >
              <span className={proprio.marcaEtapa}>
                {i < atual ? <Icone nome="check" tamanho={14} /> : i + 1}
              </span>
              {NOME_STATUS[e]}
            </li>
          );
        })}
      </ol>
      <dl className={proprio.dados}>
        <div>
          <dt>Abertura</dt>
          <dd>{abertaEm ? dataHora(abertaEm) : "—"}</dd>
        </div>
        <div>
          <dt>Encerramento</dt>
          <dd>{encerradaEm ? dataHora(encerradaEm) : "—"}</dd>
        </div>
        <div>
          <dt>Link de voto</dt>
          <dd className={proprio.link}>
            <a href={`/v/${codigo}`} target="_blank" rel="noreferrer">
              /v/{codigo}
            </a>
            <button
              type="button"
              className={proprio.copiar}
              onClick={copiar}
              aria-label="Copiar link de voto"
            >
              <Icone nome={copiado ? "check" : "copy"} tamanho={16} />
            </button>
          </dd>
        </div>
      </dl>
      {pendencia && <Alerta tom="info">{pendencia}</Alerta>}
      {erro && !confirmando && <Alerta>{erro}</Alerta>}
      {proxima && (
        <Botao
          larguraTotal
          tamanho="g"
          disabled={!!pendencia}
          onClick={() => {
            setErro(null);
            setConfirmando(true);
          }}
        >
          {proxima.botao}
        </Botao>
      )}
      {status === "publicada" && (
        <p className={estilos.texto}>
          Resultado publicado. O relatório final está pronto para imprimir.
        </p>
      )}
      {proxima && (
        <Dialogo
          aberto={confirmando}
          aoFechar={() => setConfirmando(false)}
          fixo={enviando}
          titulo={proxima.pergunta}
          descricao={proxima.texto}
          rodape={
            <>
              <Botao
                variante="contorno"
                onClick={() => setConfirmando(false)}
                disabled={enviando}
              >
                Cancelar
              </Botao>
              <Botao carregando={enviando} onClick={mudar}>
                {proxima.botao}
              </Botao>
            </>
          }
        >
          {erro && <Alerta>{erro}</Alerta>}
        </Dialogo>
      )}
    </section>
  );
}
