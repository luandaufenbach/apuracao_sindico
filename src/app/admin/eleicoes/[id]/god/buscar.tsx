"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { agrupar } from "@/lib/agrupar";
import { Botao } from "@/ui/botao";
import { Selo } from "@/ui/selo";

import estilos from "../../../admin.module.css";
import { chamarApi, mensagemDe } from "../../../cliente";
import { dataHora, NOME_ACAO, NOME_ORIGEM } from "../../../formato";
import { DialogoMotivo } from "../../../motivo";
import { Alerta, Campo } from "../../../pecas";
import proprio from "./god.module.css";
import {
  type ApartamentoGod,
  type EleicaoGod,
  nomeApto,
  type VotoGod,
} from "./tipos";

type Acao = { tipo: "anular" | "mover"; voto: VotoGod };

/**
 * Buscar voto por apartamento ou comprovante: único lugar do painel que mostra
 * o candidato escolhido. Daqui o god anula ou move um voto válido.
 */
export function Buscar({
  eleicao,
  apartamentos,
}: {
  eleicao: EleicaoGod;
  apartamentos: ApartamentoGod[];
}) {
  const eleicaoId = eleicao.id;
  // Com o resultado publicado, o servidor recusa anular: o botão some.
  const podeAnular = eleicao.status !== "publicada";
  const router = useRouter();
  const [apartamentoId, setApartamentoId] = useState("");
  const [comprovante, setComprovante] = useState("");
  const [busca, setBusca] = useState<string | null>(null);
  const [votos, setVotos] = useState<VotoGod[] | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [acao, setAcao] = useState<Acao | null>(null);

  async function buscar(consulta: string) {
    setCarregando(true);
    setErro(null);
    try {
      const r = await chamarApi<{ votos: VotoGod[] }>(
        `/api/admin/eleicoes/${eleicaoId}/votos?${consulta}`,
        { metodo: "GET" },
      );
      setVotos(r.votos);
      setBusca(consulta);
    } catch (falha) {
      setErro(mensagemDe(falha));
    } finally {
      setCarregando(false);
    }
  }

  function porApartamento(e: FormEvent) {
    e.preventDefault();
    setAviso(null);
    if (apartamentoId)
      buscar(new URLSearchParams({ apartamentoId }).toString());
  }

  function porComprovante(e: FormEvent) {
    e.preventDefault();
    setAviso(null);
    if (comprovante.trim()) {
      buscar(
        new URLSearchParams({ comprovante: comprovante.trim() }).toString(),
      );
    }
  }

  // O diálogo segue "enviando" até a busca voltar: o cartão nunca mostra o
  // voto como estava antes da ação.
  async function depoisDaAcao(mensagem: string) {
    router.refresh();
    if (busca) await buscar(busca);
    setAcao(null);
    setAviso(mensagem);
  }

  return (
    <div className={estilos.pilha}>
      <section className={estilos.cartao}>
        <h2 className={estilos.cartaoTitulo}>Buscar voto</h2>
        <p className={estilos.texto}>
          Só aqui aparece o candidato escolhido. A busca por apartamento mostra
          também votos anulados e os que foram movidos dali.
        </p>
        <div className={estilos.grade2}>
          <form className={proprio.busca} onSubmit={porApartamento}>
            <Campo rotulo="Por apartamento">
              <select
                className={estilos.controle}
                value={apartamentoId}
                onChange={(e) => setApartamentoId(e.target.value)}
              >
                <option value="">Escolha o apartamento</option>
                {[...agrupar(apartamentos, (a) => a.bloco)].map(
                  ([bloco, aptos]) => (
                    <optgroup key={bloco} label={bloco}>
                      {aptos.map((a) => (
                        <option key={a.id} value={a.id}>
                          {nomeApto(a)}
                          {a.votou ? " · votou" : ""}
                        </option>
                      ))}
                    </optgroup>
                  ),
                )}
              </select>
            </Campo>
            <Botao
              type="submit"
              variante="contorno"
              iconeEsquerda="search"
              disabled={!apartamentoId || carregando}
            >
              Buscar
            </Botao>
          </form>
          <form className={proprio.busca} onSubmit={porComprovante}>
            <Campo rotulo="Por comprovante">
              <input
                className={`${estilos.controle} ${proprio.campoCodigo}`}
                value={comprovante}
                onChange={(e) => setComprovante(e.target.value)}
                placeholder="Ex.: K7M2QX"
                maxLength={12}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
              />
            </Campo>
            <Botao
              type="submit"
              variante="contorno"
              iconeEsquerda="search"
              disabled={!comprovante.trim() || carregando}
            >
              Buscar
            </Botao>
          </form>
        </div>
        {erro && <Alerta>{erro}</Alerta>}
      </section>

      {aviso && <Alerta tom="sucesso">{aviso}</Alerta>}

      {votos &&
        (votos.length === 0 ? (
          <p className={estilos.vazio}>Nenhum voto encontrado.</p>
        ) : (
          votos.map((v) => (
            <CartaoVoto
              key={v.id}
              voto={v}
              podeAnular={podeAnular}
              aoAgir={setAcao}
            />
          ))
        ))}

      {acao?.tipo === "anular" && (
        <DialogoMotivo
          titulo={`Anular o voto do ${acao.voto.rotulo}?`}
          descricao="O voto fica guardado como anulado e o apartamento pode votar de novo."
          rotuloConfirmar="Anular voto"
          aoFechar={() => setAcao(null)}
          aoConfirmar={async (motivo) => {
            await chamarApi(`/api/admin/votos/${acao.voto.id}/anular`, {
              corpo: { motivo },
            });
            await depoisDaAcao(
              `Voto do ${acao.voto.rotulo} anulado. O apartamento pode votar de novo.`,
            );
          }}
        />
      )}
      {acao?.tipo === "mover" && (
        <DialogoMover
          voto={acao.voto}
          apartamentos={apartamentos}
          aoFechar={() => setAcao(null)}
          aoMover={depoisDaAcao}
        />
      )}
    </div>
  );
}

function CartaoVoto({
  voto: v,
  podeAnular,
  aoAgir,
}: {
  voto: VotoGod;
  podeAnular: boolean;
  aoAgir: (acao: Acao) => void;
}) {
  const valido = v.status === "valido";
  return (
    <section className={estilos.cartao}>
      <div className={estilos.cartaoCabeca}>
        <h3 className={estilos.cartaoTitulo}>{v.rotulo}</h3>
        <div className={proprio.selos}>
          <Selo tom={v.origem === "mesa" ? "aviso" : "neutro"}>
            {NOME_ORIGEM[v.origem]}
          </Selo>
          <Selo tom={valido ? "sucesso" : "perigo"}>
            {valido ? "Válido" : "Anulado"}
          </Selo>
        </div>
      </div>
      <div className={proprio.escolha}>
        <span className={estilos.olho}>Candidato escolhido</span>
        <span className={proprio.escolhaNome}>{v.candidato}</span>
      </div>
      <dl className={proprio.dados}>
        <div>
          <dt>Quem votou</dt>
          <dd>{v.nome}</dd>
        </div>
        <div>
          <dt>Documento</dt>
          <dd className={estilos.mono}>{v.documento}</dd>
        </div>
        <div>
          <dt>Horário</dt>
          <dd>{dataHora(v.horario)}</dd>
        </div>
        <div>
          <dt>Comprovante</dt>
          <dd className={proprio.codigo}>{v.comprovante}</dd>
        </div>
      </dl>
      {v.historico.length > 0 && (
        <div>
          <h4 className={estilos.olho}>Histórico</h4>
          <ul className={proprio.historico}>
            {v.historico.map((h) => (
              <li key={h.id}>
                <span className={estilos.linhaMeta}>
                  {dataHora(h.criadoEm)} · {h.usuario ?? "—"}
                </span>
                <span>
                  {NOME_ACAO[h.acao] ?? h.acao}
                  {h.detalhe && h.acao !== "voto.mesa" ? `: ${h.detalhe}` : ""}
                </span>
                {h.motivo && <span className={proprio.motivo}>{h.motivo}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {valido && (
        <div className={estilos.acoes}>
          <Botao
            variante="contorno"
            onClick={() => aoAgir({ tipo: "mover", voto: v })}
          >
            Mover
          </Botao>
          {podeAnular && (
            <Botao
              variante="contorno"
              onClick={() => aoAgir({ tipo: "anular", voto: v })}
            >
              Anular
            </Botao>
          )}
        </div>
      )}
    </section>
  );
}

function DialogoMover({
  voto,
  apartamentos,
  aoFechar,
  aoMover,
}: {
  voto: VotoGod;
  apartamentos: ApartamentoGod[];
  aoFechar: () => void;
  aoMover: (mensagem: string) => Promise<void>;
}) {
  const [destino, setDestino] = useState("");
  const livres = apartamentos.filter(
    (a) => !a.votou && a.id !== voto.apartamentoId,
  );
  const rotuloDestino = livres.find((a) => String(a.id) === destino);
  return (
    <DialogoMotivo
      titulo={`Mover o voto do ${voto.rotulo}?`}
      descricao="O voto vai para outro apartamento, com o mesmo candidato e quem votou. Só vale para apartamento sem voto."
      rotuloConfirmar="Mover voto"
      podeConfirmar={!!destino}
      aoFechar={aoFechar}
      aoConfirmar={async (motivo) => {
        await chamarApi(`/api/admin/votos/${voto.id}/mover`, {
          corpo: { apartamentoDestinoId: Number(destino), motivo },
        });
        await aoMover(
          `Voto movido do ${voto.rotulo} para ${rotuloDestino ? nomeApto(rotuloDestino) : "o novo apartamento"}.`,
        );
      }}
    >
      <Campo rotulo="Apartamento de destino">
        <select
          className={estilos.controle}
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          required
        >
          <option value="">Escolha um apartamento sem voto</option>
          {[...agrupar(livres, (a) => a.bloco)].map(([bloco, aptos]) => (
            <optgroup key={bloco} label={bloco}>
              {aptos.map((a) => (
                <option key={a.id} value={a.id}>
                  {nomeApto(a)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </Campo>
    </DialogoMotivo>
  );
}
