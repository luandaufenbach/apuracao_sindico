import type { Proximo } from "@/lib/api-publica";
import { Botao } from "@/ui/botao";

import type { Comprovante } from "./comprovantes";
import e from "./eleitor.module.css";
import { formatarData, formatarHora, nomeApartamento } from "./formato";
import { SeloIcone } from "./pecas";

/**
 * Comprovante do voto (Fluxo do eleitor, passo 8): apartamento, horário e
 * código. Outro apartamento do mesmo documento que ainda não votou aparece
 * como "Votar pelo Bloco 02, Ap 305", sem pedir o documento de novo.
 */
export function TelaComprovante({
  comprovante,
  proximos,
  anteriores,
  aoVotarProximo,
  aoConcluir,
}: {
  comprovante: Comprovante;
  proximos: Proximo[];
  /** Outros comprovantes deste aparelho, na ordem em que saíram. */
  anteriores: Comprovante[];
  aoVotarProximo: (proximo: Proximo) => void;
  aoConcluir: () => void;
}) {
  return (
    <>
      <div className={e.cabeca} aria-live="polite">
        <SeloIcone icone="circle-check" tom="sucesso" />
        <span className={e.olho}>Voto registrado</span>
        <h1 className={e.titulo}>{nomeApartamento(comprovante)}</h1>
        <p className={e.sub}>
          Registrado às {formatarHora(comprovante.horario)} de{" "}
          {formatarData(comprovante.horario)}.
        </p>
      </div>

      <div className={e.codigoCaixa}>
        <span className={e.rotulo}>Código do comprovante</span>
        <span className={e.codigo}>{comprovante.codigo}</span>
      </div>
      <p className={e.nota}>
        Tire um print desta tela para guardar o comprovante. Ele não mostra em
        quem você votou.
      </p>

      {proximos.length > 0 && (
        <section className={e.secao} aria-labelledby="proximos">
          <h2 id="proximos" className={e.rotulo}>
            Você também pode votar por
          </h2>
          {proximos.map((p, i) => (
            <Botao
              key={p.apartamentoId}
              variante={i === 0 ? "primario" : "contorno"}
              tamanho="g"
              larguraTotal
              iconeDireita="arrow-right"
              onClick={() => aoVotarProximo(p)}
            >
              Votar pelo {nomeApartamento(p)}
            </Botao>
          ))}
        </section>
      )}

      <div className={e.acoes}>
        <Botao
          variante={proximos.length > 0 ? "fantasma" : "secundario"}
          tamanho="g"
          larguraTotal
          onClick={aoConcluir}
        >
          Concluir
        </Botao>
      </div>

      {anteriores.length > 0 && (
        <section className={e.secao} aria-labelledby="anteriores">
          <h2 id="anteriores" className={e.rotulo}>
            Outros comprovantes neste aparelho
          </h2>
          <ul className={e.lista}>
            {anteriores.map((c) => (
              <li key={c.codigo}>
                <span>{nomeApartamento(c)}</span>
                <span className={e.listaValor}>
                  {c.codigo} · {formatarHora(c.horario)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
