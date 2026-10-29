"use client";

import { useState } from "react";

import {
  type Apartamento,
  apiPublica,
  type Candidato,
  ErroApi,
  mensagemDe,
  type RespostaVotar,
} from "@/lib/api-publica";
import { Botao } from "@/ui/botao";
import { Dialogo } from "@/ui/dialogo";
import { FotoCandidato } from "@/ui/foto-candidato";
import { Icone } from "@/ui/icone";

import type { Recusa } from "./documento";
import e from "./eleitor.module.css";
import { nomeApartamento } from "./formato";
import { Cabeca } from "./pecas";
import { useSinalDaTela } from "./use-sinal-da-tela";

/**
 * Cards dos candidatos e confirmação do voto (Fluxo do eleitor, passos 6 e 7).
 */
export function Candidatos({
  codigo,
  apartamento,
  token,
  candidatos,
  aoVotar,
  aoRecusado,
  aoTokenVencido,
}: {
  codigo: string;
  apartamento: Apartamento;
  token: string;
  candidatos: Candidato[];
  aoVotar: (
    apartamento: Apartamento,
    voto: Extract<RespostaVotar, { ok: true }>,
  ) => void;
  /** `conexaoCaiu`: uma tentativa anterior pode ter gravado o voto. */
  aoRecusado: (
    apartamentoId: number,
    erro: Recusa,
    conexaoCaiu: boolean,
  ) => void;
  aoTokenVencido: (apartamentoId: number) => void;
}) {
  const [escolhido, setEscolhido] = useState<Candidato | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [conexaoCaiu, setConexaoCaiu] = useState(false);
  const sinalDaTela = useSinalDaTela();

  async function confirmar() {
    if (!escolhido) return;
    const sinal = sinalDaTela();
    setEnviando(true);
    setErro(null);
    try {
      const r = await apiPublica.votar(codigo, token, escolhido.id, sinal);
      if (r.ok) return aoVotar(apartamento, r);
      return aoRecusado(apartamento.id, r.erro, conexaoCaiu);
    } catch (falha) {
      if (sinal?.aborted) return;
      if (falha instanceof ErroApi && falha.status === 401) {
        return aoTokenVencido(apartamento.id);
      }
      // Sem resposta, o voto pode ter sido gravado: se a próxima tentativa
      // disser que o apartamento já votou, a tela explica isso.
      if (
        !(falha instanceof ErroApi) ||
        falha.status === 0 ||
        falha.status >= 500
      ) {
        setConexaoCaiu(true);
      }
      setErro(mensagemDe(falha));
    } finally {
      setEnviando(false);
    }
  }

  const nome = nomeApartamento(apartamento);
  return (
    <>
      <Cabeca olho={nome} titulo="Escolha o candidato">
        Toque no card de quem vai receber o voto do apartamento.
      </Cabeca>
      <div className={e.candidatos}>
        {candidatos.map((c) => (
          <button
            key={c.id}
            type="button"
            className={e.candidato}
            onClick={() => {
              setErro(null);
              setEscolhido(c);
            }}
          >
            <FotoCandidato
              candidato={c}
              classeFoto={e.foto}
              classeIniciais={e.iniciais}
            />
            <span>
              <span className={e.candidatoNome}>{c.nome}</span>
              {c.apartamento && (
                <span className={e.candidatoApto}>
                  {c.apartamento.bloco} · {c.apartamento.rotulo}
                </span>
              )}
            </span>
            {c.proposta && <span className={e.proposta}>{c.proposta}</span>}
          </button>
        ))}
      </div>

      <Dialogo
        aberto={escolhido !== null}
        aoFechar={() => setEscolhido(null)}
        fixo={enviando}
        titulo={
          escolhido
            ? `Confirmar voto em ${escolhido.nome} pelo ${nome}?`
            : "Confirmar voto"
        }
        descricao="Depois de confirmar, o voto não pode ser mudado."
        rodape={
          <>
            <Botao
              variante="fantasma"
              tamanho="g"
              disabled={enviando}
              onClick={() => setEscolhido(null)}
            >
              Voltar
            </Botao>
            <Botao
              tamanho="g"
              carregando={enviando}
              iconeEsquerda="check"
              onClick={confirmar}
            >
              Confirmar voto
            </Botao>
          </>
        }
      >
        {erro && (
          <p className={e.erro} role="alert">
            <Icone nome="circle-x" tamanho={16} />
            {erro}
          </p>
        )}
      </Dialogo>
    </>
  );
}
