import type { CSSProperties } from "react";

import type { Apartamento } from "@/lib/api-publica";

import e from "./eleitor.module.css";
import { Cabeca } from "./pecas";

/** Andar pelo número do rótulo (`Ap 502 PCD` é do 5º): centenas em diante. */
function andarDe(rotulo: string): string {
  const numero = /\d+/.exec(rotulo)?.[0] ?? "";
  return numero.length > 2 ? numero.slice(0, -2) : "";
}

const SITUACAO = {
  jaVotou: { texto: "Já votou", classe: e.votou },
  bloqueado: { texto: "Procure a mesa", classe: e.bloqueado },
  soMesa: { texto: "Vote na mesa", classe: e.mesa },
};

const situacaoDe = (a: Apartamento) =>
  a.jaVotou
    ? SITUACAO.jaVotou
    : a.bloqueado
      ? SITUACAO.bloqueado
      : a.soMesa
        ? SITUACAO.soMesa
        : null;

export function Grade({
  bloco,
  apartamentos,
  aoEscolher,
}: {
  bloco: string;
  apartamentos: Apartamento[];
  aoEscolher: (apartamento: Apartamento) => void;
}) {
  const doBloco = apartamentos.filter((a) => a.bloco === bloco);
  // Uma coluna por apartamento do andar (de 3 a 5), para a grade lembrar a
  // fachada: cada andar começa numa linha nova.
  const porAndar = new Map<string, number>();
  for (const a of doBloco) {
    const andar = andarDe(a.rotulo);
    porAndar.set(andar, (porAndar.get(andar) ?? 0) + 1);
  }
  const colunas = Math.min(5, Math.max(3, ...porAndar.values()));
  const faltam = doBloco.filter((a) => !a.jaVotou).length;

  return (
    <>
      <Cabeca olho={bloco} titulo="Escolha o apartamento">
        {faltam === 0
          ? "Todos os apartamentos deste bloco já votaram."
          : "Toque no seu apartamento."}
      </Cabeca>
      <div
        className={e.grade}
        style={{ "--colunas": colunas } as CSSProperties}
      >
        {doBloco.map((a, i) => {
          const situacao = situacaoDe(a);
          const novoAndar =
            i > 0 && andarDe(a.rotulo) !== andarDe(doBloco[i - 1].rotulo);
          return (
            <button
              key={a.id}
              type="button"
              className={`${e.apto} ${novoAndar ? e.novoAndar : ""}`}
              disabled={a.jaVotou}
              onClick={() => aoEscolher(a)}
              aria-label={
                situacao ? `${a.rotulo}: ${situacao.texto}` : a.rotulo
              }
            >
              <span>{a.rotulo}</span>
              {situacao && (
                <span className={`${e.aptoSituacao} ${situacao.classe}`}>
                  {situacao.texto}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
