"use client";

import { type FormEvent, useEffect, useId, useState } from "react";

import {
  type Apartamento,
  apiPublica,
  type Dica,
  mensagemDe,
  type Sugestao,
} from "@/lib/api-publica";
import { type TipoDocumento, validarDocumento } from "@/lib/documento";
import { Botao } from "@/ui/botao";
import { Icone } from "@/ui/icone";

import { AvisoSoMesa } from "./avisos";
import { CampoDocumento } from "./campo-documento";
import e from "./eleitor.module.css";
import {
  formatarDocumento,
  formatarHora,
  NOME_TIPO,
  nomeApartamento,
  TAMANHO,
  tentativasRestantes,
  tipoExibido,
} from "./formato";
import { Aviso, Cabeca, Carregando } from "./pecas";
import { useSinalDaTela } from "./use-sinal-da-tela";

/** Recusas que mudam o apartamento ou a eleição, tratadas pela tela de cima. */
export type Recusa = "ja_votou" | "bloqueado" | "eleicao_fechada";

const INVALIDO = "Documento inválido. Confira os números.";

const juntar = (itens: string[]) =>
  itens.length === 1
    ? itens[0]
    : `${itens.slice(0, -1).join(", ")} ou ${itens.at(-1)}`;

/** O tipo do campo, se as dicas forem todas do mesmo tipo. */
function tipoDasDicas(dicas: Dica[]): TipoDocumento | null {
  const tipos = new Set(dicas.map((d) => d.tipo));
  return tipos.size === 1 ? dicas[0].tipo : null;
}

function textoDaDica(dicas: Dica[]): string {
  if (dicas.length === 1) {
    return dicas[0].tipo === "cpf"
      ? "Os 3 primeiros números do CPF já estão no campo. Digite o resto."
      : "Apartamento comprado por empresa. Os 3 primeiros caracteres do CNPJ já estão no campo.";
  }
  const prefixos = (tipo: TipoDocumento) =>
    dicas
      .filter((d) => d.tipo === tipo)
      .map((d) => formatarDocumento(d.prefixo, tipo));
  const cpfs = prefixos("cpf");
  const cnpjs = prefixos("cnpj");
  if (cnpjs.length === 0) {
    return `Digite o CPF inteiro de um dos compradores. Começa com ${juntar(cpfs)}.`;
  }
  if (cpfs.length === 0) {
    return `Digite o CNPJ inteiro da empresa. Começa com ${juntar(cnpjs)}.`;
  }
  return `Digite o CPF ou o CNPJ inteiro de um dos compradores. O CPF começa com ${juntar(cpfs)} e o CNPJ, com ${juntar(cnpjs)}.`;
}

const ROTULO_CAMPO = {
  cpf: "CPF do comprador",
  cnpj: "CNPJ da empresa",
  ambos: "CPF ou CNPJ do comprador",
};

/**
 * "Complete o documento do comprador" (docs/ESPECIFICACAO.md, Fluxo do
 * eleitor, passos 4 e 5). Documento inválido e documento que não confere
 * aparecem no campo; documento de outro apartamento vira sugestão.
 */
export function Documento({
  codigo,
  apartamento,
  recado,
  aoVerificado,
  aoRecusado,
  aoOutroApartamento,
  aoInicio,
}: {
  codigo: string;
  apartamento: Apartamento;
  /** Aviso vindo de outra tela, como o token vencido. */
  recado: string | null;
  aoVerificado: (apartamentoId: number, token: string) => void;
  aoRecusado: (apartamentoId: number, erro: Recusa) => void;
  aoOutroApartamento: () => void;
  aoInicio: () => void;
}) {
  const [dicas, setDicas] = useState<Dica[] | null>(null);
  const [falhaDica, setFalhaDica] = useState<string | null>(null);
  const [tentativaDica, setTentativaDica] = useState(0);
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [sugestoes, setSugestoes] = useState<{
    lista: Sugestao[];
    documento: string;
    tipo: TipoDocumento;
  } | null>(null);
  const [aceitando, setAceitando] = useState<number | null>(null);
  const idCampo = useId();
  const idTexto = useId();
  const sinalDaTela = useSinalDaTela();

  useEffect(() => {
    const controle = new AbortController();
    apiPublica.dica(codigo, apartamento.id, controle.signal).then(
      (r) => {
        setDicas(r.dicas);
        // Com um comprador, o campo já vem com os 3 primeiros caracteres.
        if (r.dicas.length === 1) setValor(r.dicas[0].prefixo);
      },
      (falha) => {
        if (!controle.signal.aborted) setFalhaDica(mensagemDe(falha));
      },
    );
    return () => controle.abort();
  }, [codigo, apartamento.id, tentativaDica]);

  const olho = nomeApartamento(apartamento);

  if (falhaDica) {
    return (
      <Aviso
        icone="triangle-alert"
        tom="perigo"
        olho={olho}
        titulo="Não foi possível abrir o apartamento"
        acoes={
          <Botao
            variante="secundario"
            tamanho="g"
            larguraTotal
            iconeEsquerda="refresh-cw"
            onClick={() => {
              setFalhaDica(null);
              setTentativaDica((n) => n + 1);
            }}
          >
            Tentar de novo
          </Botao>
        }
      >
        {falhaDica}
      </Aviso>
    );
  }
  if (!dicas) return <Carregando />;
  // Sem documento válido no cadastro, o apartamento só vota pela mesa.
  if (dicas.length === 0) {
    return (
      <AvisoSoMesa
        apartamento={apartamento}
        aoOutroApartamento={aoOutroApartamento}
        aoInicio={aoInicio}
      />
    );
  }

  const tipoCampo = tipoDasDicas(dicas);

  async function enviar(ev: FormEvent) {
    ev.preventDefault();
    // O dígito verificador se confere aqui mesmo: não conta tentativa (R4).
    // Vale CPF ou CNPJ, qualquer que seja a dica (R6).
    const doc = validarDocumento(valor);
    if (!doc) {
      const tipoAtual = tipoExibido(tipoCampo, valor);
      const faltam = TAMANHO[tipoAtual] - valor.length;
      const unidade = tipoAtual === "cpf" ? "número" : "caractere";
      setErro(
        faltam <= 0
          ? INVALIDO
          : faltam === 1
            ? `Falta 1 ${unidade}.`
            : `Faltam ${faltam} ${unidade}s.`,
      );
      return;
    }
    const sinal = sinalDaTela();
    setEnviando(true);
    setErro(null);
    try {
      const r = await apiPublica.verificar(
        codigo,
        apartamento.id,
        doc.documento,
        sinal,
      );
      if (r.ok) return aoVerificado(apartamento.id, r.token);
      switch (r.erro) {
        case "documento_invalido":
          return setErro(INVALIDO);
        case "nao_confere":
          return setErro(
            `Documento não confere. ${tentativasRestantes(r.tentativasRestantes)}`,
          );
        case "outro_apto":
          return setSugestoes({
            lista: r.sugestoes,
            documento: doc.documento,
            tipo: doc.tipo,
          });
        default:
          return aoRecusado(apartamento.id, r.erro);
      }
    } catch (falha) {
      if (!sinal?.aborted) setErro(mensagemDe(falha));
    } finally {
      setEnviando(false);
    }
  }

  // O documento é de um comprador do apartamento sugerido: confere de novo
  // para pegar o token dele, sem a pessoa digitar outra vez.
  async function aceitar(s: Sugestao, documento: string) {
    const sinal = sinalDaTela();
    setAceitando(s.apartamentoId);
    setErro(null);
    try {
      const r = await apiPublica.verificar(
        codigo,
        s.apartamentoId,
        documento,
        sinal,
      );
      if (r.ok) return aoVerificado(s.apartamentoId, r.token);
      if (
        r.erro === "ja_votou" ||
        r.erro === "bloqueado" ||
        r.erro === "eleicao_fechada"
      ) {
        return aoRecusado(s.apartamentoId, r.erro);
      }
      setErro("Não foi possível confirmar o documento. Tente de novo.");
    } catch (falha) {
      if (!sinal?.aborted) setErro(mensagemDe(falha));
    } finally {
      setAceitando(null);
    }
  }

  const linhaErro = erro && (
    <p id={idTexto} className={e.erro} role="alert">
      <Icone nome="circle-x" tamanho={16} />
      {erro}
    </p>
  );

  if (sugestoes) {
    const nome = NOME_TIPO[sugestoes.tipo];
    const [unica] = sugestoes.lista.length === 1 ? sugestoes.lista : [];
    const jaVotou = (s: Sugestao) =>
      s.votouEm &&
      `O ${s.rotulo} já votou às ${formatarHora(s.votouEm)}. Procure a mesa.`;
    return (
      <>
        <Cabeca
          olho={olho}
          titulo={
            unica
              ? `Este ${nome} é do ${nomeApartamento(unica)}`
              : `Este ${nome} é de outros apartamentos`
          }
        >
          {unica
            ? jaVotou(unica) || `Votar pelo ${unica.rotulo}?`
            : "Escolha por qual apartamento votar. Quem tem mais de um vota um por um."}
        </Cabeca>
        {!unica && (
          <div className={e.sugestoes}>
            {sugestoes.lista.map((s) => (
              <div key={s.apartamentoId} className={e.sugestao}>
                <span className={e.sugestaoNome}>{nomeApartamento(s)}</span>
                {s.votouEm ? (
                  <p className={e.sugestaoVotou}>{jaVotou(s)}</p>
                ) : (
                  <Botao
                    variante="contorno"
                    larguraTotal
                    tamanho="g"
                    iconeDireita="arrow-right"
                    carregando={aceitando === s.apartamentoId}
                    disabled={aceitando !== null}
                    onClick={() => aceitar(s, sugestoes.documento)}
                  >
                    Votar pelo {s.rotulo}
                  </Botao>
                )}
              </div>
            ))}
          </div>
        )}
        {linhaErro}
        <div className={e.acoes}>
          {unica && !unica.votouEm && (
            <Botao
              larguraTotal
              tamanho="g"
              carregando={aceitando !== null}
              onClick={() => aceitar(unica, sugestoes.documento)}
            >
              Votar pelo {unica.rotulo}
            </Botao>
          )}
          <Botao
            variante="contorno"
            tamanho="g"
            larguraTotal
            disabled={aceitando !== null}
            onClick={() => {
              setSugestoes(null);
              setErro(null);
              setValor(dicas.length === 1 ? dicas[0].prefixo : "");
            }}
          >
            Digitar outro documento
          </Botao>
          <Botao
            variante="fantasma"
            tamanho="g"
            larguraTotal
            disabled={aceitando !== null}
            onClick={aoOutroApartamento}
          >
            Escolher outro apartamento
          </Botao>
        </div>
      </>
    );
  }

  return (
    <>
      <Cabeca olho={olho} titulo="Complete o documento do comprador">
        {textoDaDica(dicas)}
      </Cabeca>
      <form className={e.formulario} onSubmit={enviar} noValidate>
        {recado && (
          <p className={e.recado} role="status">
            <Icone nome="info" tamanho={16} />
            {recado}
          </p>
        )}
        <CampoDocumento
          id={idCampo}
          rotulo={ROTULO_CAMPO[tipoCampo ?? "ambos"]}
          tipo={tipoCampo}
          valor={valor}
          aoMudar={(novo) => {
            setValor(novo);
            setErro(null);
          }}
          invalido={!!erro}
          descricao={erro ? idTexto : undefined}
        />
        {linhaErro}
        <Botao
          type="submit"
          tamanho="g"
          larguraTotal
          carregando={enviando}
          iconeDireita="arrow-right"
        >
          Continuar
        </Botao>
      </form>
      <p className={e.nota}>
        O documento serve só para conferir o comprador e não fica salvo neste
        aparelho.
      </p>
    </>
  );
}
