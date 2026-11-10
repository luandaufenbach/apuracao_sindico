"use client";

import { useSearchParams } from "next/navigation";
import { startTransition, useEffect, useRef, useState } from "react";
import { z } from "zod/mini";

import {
  type Apartamento,
  apiPublica,
  comoErroApi,
  type Eleicao,
  type ErroApi,
  type Proximo,
  type RespostaVotar,
} from "@/lib/api-publica";
import { Botao } from "@/ui/botao";
import { useConsultaPeriodica } from "@/ui/use-consulta-periodica";

import { AvisoBloqueado, AvisoJaVotou, AvisoSoMesa } from "./avisos";
import { Candidatos } from "./candidatos";
import { TelaComprovante } from "./comprovante";
import { type Comprovante, useComprovantes } from "./comprovantes";
import { Documento, type Recusa } from "./documento";
import e from "./eleitor.module.css";
import { Grade } from "./grade";
import { Inicio } from "./inicio";
import { Aviso, Carregando, Topo } from "./pecas";

// Onde o eleitor está, lido da URL: o voltar do celular volta um passo e
// recarregar a página mantém o lugar. Token e documento nunca vão para a URL.
type Rota =
  | { tela: "inicio" }
  | { tela: "grade"; bloco: string }
  | { tela: "apartamento"; apartamentoId: number; candidato: boolean }
  | { tela: "comprovante" };

const parametrosRota = z.object({
  bloco: z.optional(z.string().check(z.minLength(1), z.maxLength(100))),
  apto: z.optional(z.coerce.number().check(z.int(), z.positive())),
  etapa: z.optional(z.enum(["candidato", "comprovante"])),
});

/** Link com parâmetro inválido leva ao início. */
function lerRota(busca: URLSearchParams): Rota {
  const lido = parametrosRota.safeParse(Object.fromEntries(busca));
  if (!lido.success) return { tela: "inicio" };
  const { bloco, apto, etapa } = lido.data;
  if (etapa === "comprovante") return { tela: "comprovante" };
  if (apto) {
    return {
      tela: "apartamento",
      apartamentoId: apto,
      candidato: etapa === "candidato",
    };
  }
  return bloco ? { tela: "grade", bloco } : { tela: "inicio" };
}

function buscaDe(rota: Rota): string {
  const p = new URLSearchParams();
  if (rota.tela === "grade") p.set("bloco", rota.bloco);
  if (rota.tela === "apartamento") {
    p.set("apto", String(rota.apartamentoId));
    if (rota.candidato) p.set("etapa", "candidato");
  }
  if (rota.tela === "comprovante") p.set("etapa", "comprovante");
  const texto = p.toString();
  return texto ? `?${texto}` : "";
}

const TOKEN_VENCIDO =
  "A confirmação do documento venceu. Digite o documento de novo.";

/** Cópia do registro sem a chave. */
function sem<T>(registro: Record<number, T>, chave: number) {
  const copia = { ...registro };
  delete copia[chave];
  return copia;
}

/** Intervalo da tela de espera, antes da abertura. */
const ESPERA_MS = 5000;

/**
 * Navega pela URL sem duplicar o histórico: destino igual à tela atual não
 * empilha nada, e destino igual à entrada anterior volta para ela. O estado
 * guarda a marca `apuracao` (a entrada anterior é a tela de antes) e a URL dela.
 */
function ir(destino: Rota, modo: "empilhar" | "trocar" = "empilhar") {
  const atual = window.location.pathname + window.location.search;
  const url = window.location.pathname + buscaDe(destino);
  const estado = window.history.state;
  if (url === atual) return;
  if (estado?.apuracao === true && estado.anterior === url) {
    window.history.back();
  } else if (modo === "empilhar") {
    window.history.pushState({ apuracao: true, anterior: atual }, "", url);
  } else {
    window.history.replaceState(
      { apuracao: estado?.apuracao === true, anterior: estado?.anterior },
      "",
      url,
    );
  }
}

/** Voltar do app: a entrada anterior, se for desta votação; senão, a tela pai. */
function voltar(pai: Rota) {
  if (window.history.state?.apuracao === true) window.history.back();
  else ir(pai, "trocar");
}

/**
 * Fluxo do eleitor (docs/ESPECIFICACAO.md, "Fluxo do eleitor"): início, bloco,
 * apartamento, documento, candidato, confirmação e comprovante.
 */
export function Eleitor({ codigo }: { codigo: string }) {
  const busca = useSearchParams();
  const rota = lerRota(busca);
  const chaveRota = buscaDe(rota);
  // A grade é a tela que mostra quem já votou: a lista recarrega ao entrar nela.
  const chaveGrade = rota.tela === "grade" ? rota.bloco : null;

  const [eleicao, setEleicao] = useState<Eleicao | null>(null);
  const [falhaEleicao, setFalhaEleicao] = useState<ErroApi | null>(null);
  const [apartamentos, setApartamentos] = useState<Apartamento[] | null>(null);
  const [falhaApartamentos, setFalhaApartamentos] = useState<ErroApi | null>(
    null,
  );
  const apartamentosCarregados = useRef(false);
  // Sobe para carregar tudo de novo: "Tentar de novo" e a abertura da votação.
  const [recarga, setRecarga] = useState(0);
  // Por apartamento: o token do voto (10 min) e avisos para a tela dele.
  const [tokens, setTokens] = useState<Record<number, string>>({});
  const [recados, setRecados] = useState<Record<number, string>>({});
  const [conexaoCaiu, setConexaoCaiu] = useState<Record<number, boolean>>({});
  const [ultimo, setUltimo] = useState<Comprovante | null>(null);
  const [proximos, setProximos] = useState<Proximo[]>([]);
  const comprovantes = useComprovantes(codigo);

  // Fotos dos candidatos vêm junto: uma chamada ao abrir e outra quando a
  // votação abre (os candidatos podem ter mudado antes da abertura).
  useEffect(() => {
    const controle = new AbortController();
    apiPublica.eleicao(codigo, controle.signal).then(
      (el) => {
        setEleicao(el);
        setFalhaEleicao(null);
      },
      (falha) => {
        if (!controle.signal.aborted) setFalhaEleicao(comoErroApi(falha));
      },
    );
    return () => controle.abort();
  }, [codigo, recarga]);

  // A grade muda enquanto os outros votam: carrega ao abrir a página e ao
  // entrar na grade de um bloco. Nas outras telas, valem as marcas de
  // `marcar` e as recusas do verificar e do votar.
  useEffect(() => {
    if (chaveGrade === null && apartamentosCarregados.current) return;
    const controle = new AbortController();
    apiPublica.apartamentos(codigo, controle.signal).then(
      (lista) => {
        apartamentosCarregados.current = true;
        setApartamentos(lista);
        setFalhaApartamentos(null);
      },
      (falha) => {
        if (!controle.signal.aborted) setFalhaApartamentos(comoErroApi(falha));
      },
    );
    return () => controle.abort();
  }, [codigo, chaveGrade, recarga]);

  // Corpo em bloco: nos navegadores novos o scrollTo devolve uma Promise, que
  // o React tomaria por função de limpeza.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chaveRota]);

  // Antes da abertura, a rota do telão (leve, sem fotos) diz quando a votação
  // abre. Aí o status muda na hora, o que para a consulta, e a eleição é
  // recarregada uma vez (os candidatos podem ter mudado antes da abertura).
  useConsultaPeriodica(
    async (sinal) => {
      const { status } = await apiPublica.telao(codigo, sinal);
      if (status === "rascunho") return;
      setEleicao((el) => el && { ...el, status });
      setRecarga((n) => n + 1);
    },
    ESPERA_MS,
    eleicao?.status === "rascunho",
  );

  const marcar = (id: number, mudanca: Partial<Apartamento>) =>
    setApartamentos(
      (lista) =>
        lista?.map((a) => (a.id === id ? { ...a, ...mudanca } : a)) ?? lista,
    );

  function aoVerificado(apartamentoId: number, token: string) {
    setTokens((t) => ({ ...t, [apartamentoId]: token }));
    setRecados((r) => sem(r, apartamentoId));
    ir({ tela: "apartamento", apartamentoId, candidato: true });
  }

  function aoRecusado(apartamentoId: number, erro: Recusa, caiu = false) {
    if (erro === "eleicao_fechada") {
      setEleicao((el) => el && { ...el, status: "encerrada" });
      ir({ tela: "inicio" }, "trocar");
      return;
    }
    marcar(
      apartamentoId,
      erro === "ja_votou" ? { jaVotou: true } : { bloqueado: true },
    );
    if (caiu) setConexaoCaiu((c) => ({ ...c, [apartamentoId]: true }));
    // Pela URL de agora, não pela da renderização em que o envio começou.
    const agora = lerRota(new URLSearchParams(window.location.search));
    const naTela =
      agora.tela === "apartamento" && agora.apartamentoId === apartamentoId;
    ir(
      { tela: "apartamento", apartamentoId, candidato: false },
      naTela ? "trocar" : "empilhar",
    );
  }

  function aoTokenVencido(apartamentoId: number) {
    setTokens((t) => sem(t, apartamentoId));
    setRecados((r) => ({ ...r, [apartamentoId]: TOKEN_VENCIDO }));
    ir({ tela: "apartamento", apartamentoId, candidato: false }, "trocar");
  }

  function aoVotar(
    apartamento: Apartamento,
    voto: Extract<RespostaVotar, { ok: true }>,
  ) {
    const novo: Comprovante = {
      codigo: voto.comprovante,
      horario: voto.horario,
      apartamentoId: apartamento.id,
      bloco: apartamento.bloco,
      rotulo: apartamento.rotulo,
    };
    comprovantes.guardar(novo);
    // Junto com a troca de URL (que o Next faz em transição): sem isso, um
    // quadro mostraria "já votou" antes do comprovante.
    startTransition(() => {
      setUltimo(novo);
      setProximos(voto.proximos);
      setTokens((t) => ({
        ...sem(t, apartamento.id),
        ...Object.fromEntries(
          voto.proximos.map((p) => [p.apartamentoId, p.token]),
        ),
      }));
      marcar(apartamento.id, { jaVotou: true });
      ir({ tela: "comprovante" }, "trocar");
    });
  }

  function tentarDeNovo() {
    setFalhaEleicao(null);
    setFalhaApartamentos(null);
    setRecarga((n) => n + 1);
  }

  // Falha só vira tela de erro enquanto não há dados: uma recarga que falha
  // depois mantém a tela com o que já foi carregado.
  const falha =
    (!eleicao && falhaEleicao) || (!apartamentos && falhaApartamentos) || null;
  if (falha?.status === 404) {
    return (
      <main className={e.tela}>
        <Topo />
        <Aviso
          icone="triangle-alert"
          tom="aviso"
          titulo="Votação não encontrada"
        >
          Confira o link ou aponte a câmera de novo para o QR code do telão.
        </Aviso>
      </main>
    );
  }
  if (falha) {
    return (
      <main className={e.tela}>
        <Topo />
        <Aviso
          icone="triangle-alert"
          tom="perigo"
          titulo="Não foi possível abrir a votação"
          acoes={
            <Botao
              variante="secundario"
              tamanho="g"
              larguraTotal
              iconeEsquerda="refresh-cw"
              onClick={tentarDeNovo}
            >
              Tentar de novo
            </Botao>
          }
        >
          {falha.message}
        </Aviso>
      </main>
    );
  }
  if (!eleicao || !apartamentos) {
    return (
      <main className={e.tela}>
        <Carregando />
      </main>
    );
  }

  const inicio: Rota = { tela: "inicio" };
  const telaInicio = (
    <main className={e.tela}>
      <Inicio
        eleicao={eleicao}
        apartamentos={apartamentos}
        comprovantes={comprovantes.lista}
        aoEscolherBloco={(bloco) => ir({ tela: "grade", bloco })}
      />
    </main>
  );

  if (rota.tela === "comprovante") {
    const atual = ultimo ?? comprovantes.lista.at(-1);
    if (!atual) return telaInicio;
    return (
      <main className={e.tela}>
        <Topo />
        <TelaComprovante
          comprovante={atual}
          proximos={ultimo ? proximos : []}
          anteriores={comprovantes.lista.filter(
            (c) => c.codigo !== atual.codigo,
          )}
          aoVotarProximo={(p) =>
            ir({
              tela: "apartamento",
              apartamentoId: p.apartamentoId,
              candidato: true,
            })
          }
          aoConcluir={() => ir(inicio)}
        />
      </main>
    );
  }

  // Fora da votação aberta, o início explica o status e se atualiza sozinho.
  if (eleicao.status !== "aberta" || rota.tela === "inicio") return telaInicio;

  if (rota.tela === "grade") {
    if (!apartamentos.some((a) => a.bloco === rota.bloco)) return telaInicio;
    return (
      <main className={e.tela}>
        <Topo aoVoltar={() => voltar(inicio)} passo="Passo 1 de 3" />
        <Grade
          bloco={rota.bloco}
          apartamentos={apartamentos}
          aoEscolher={(a) =>
            ir({ tela: "apartamento", apartamentoId: a.id, candidato: false })
          }
        />
      </main>
    );
  }

  const apartamento = apartamentos.find((a) => a.id === rota.apartamentoId);
  if (!apartamento) {
    return (
      <main className={e.tela}>
        <Topo aoVoltar={() => voltar(inicio)} />
        <Aviso
          icone="triangle-alert"
          tom="aviso"
          titulo="Apartamento não encontrado"
          acoes={
            <Botao
              variante="secundario"
              tamanho="g"
              larguraTotal
              onClick={() => ir(inicio)}
            >
              Voltar ao início
            </Botao>
          }
        >
          O link não corresponde a nenhum apartamento desta votação.
        </Aviso>
      </main>
    );
  }

  const grade: Rota = { tela: "grade", bloco: apartamento.bloco };
  const acoes = {
    aoOutroApartamento: () => ir(grade),
    aoInicio: () => ir(inicio),
  };
  const token = tokens[apartamento.id];
  const naCandidatura = rota.candidato && token;

  let conteudo;
  if (apartamento.jaVotou) {
    conteudo = (
      <AvisoJaVotou
        apartamento={apartamento}
        // O mais novo: depois de um voto anulado, o mesmo aparelho vota de novo.
        comprovante={comprovantes.lista.findLast(
          (c) => c.apartamentoId === apartamento.id,
        )}
        conexaoCaiu={conexaoCaiu[apartamento.id]}
        {...acoes}
      />
    );
  } else if (apartamento.bloqueado) {
    conteudo = <AvisoBloqueado apartamento={apartamento} {...acoes} />;
  } else if (apartamento.soMesa) {
    conteudo = <AvisoSoMesa apartamento={apartamento} {...acoes} />;
  } else if (naCandidatura) {
    conteudo = (
      <Candidatos
        key={apartamento.id}
        codigo={codigo}
        apartamento={apartamento}
        token={token}
        candidatos={eleicao.candidatos}
        aoVotar={aoVotar}
        aoRecusado={aoRecusado}
        aoTokenVencido={aoTokenVencido}
      />
    );
  } else {
    conteudo = (
      <Documento
        key={apartamento.id}
        codigo={codigo}
        apartamento={apartamento}
        recado={recados[apartamento.id] ?? null}
        aoVerificado={aoVerificado}
        aoRecusado={aoRecusado}
        {...acoes}
      />
    );
  }

  const emAviso =
    apartamento.jaVotou || apartamento.bloqueado || apartamento.soMesa;
  return (
    <main className={e.tela}>
      <Topo
        aoVoltar={() =>
          voltar(
            naCandidatura
              ? {
                  tela: "apartamento",
                  apartamentoId: apartamento.id,
                  candidato: false,
                }
              : grade,
          )
        }
        passo={
          emAviso ? undefined : naCandidatura ? "Passo 3 de 3" : "Passo 2 de 3"
        }
      />
      {conteudo}
    </main>
  );
}
