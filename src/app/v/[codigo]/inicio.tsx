import type { Apartamento, Eleicao } from "@/lib/api-publica";
import { Brilho } from "@/ui/brilho";
import { Icone } from "@/ui/icone";
import { Selo } from "@/ui/selo";

import type { Comprovante } from "./comprovantes";
import e from "./eleitor.module.css";
import { formatarHora, nomeApartamento } from "./formato";

const ESTADO = {
  rascunho: {
    selo: <Selo tom="aviso" vivo>Aguardando abertura</Selo>,
    titulo: "A votação ainda não começou",
    texto: "Esta tela se atualiza sozinha quando a votação abrir.",
  },
  aberta: {
    selo: (
      <Selo tom="sucesso" vivo>
        Votação aberta
      </Selo>
    ),
    titulo: null,
    texto:
      "Um voto por apartamento. Tenha em mãos o CPF do comprador ou o CNPJ da empresa.",
  },
  encerrada: {
    selo: <Selo>Votação encerrada</Selo>,
    titulo: "Votação encerrada",
    texto: "Obrigado por participar. O resultado sai no telão.",
  },
  publicada: {
    selo: <Selo tom="info">Resultado publicado</Selo>,
    titulo: "Votação encerrada",
    texto: "Obrigado por participar. O resultado está no telão.",
  },
};

/** Blocos na ordem da API, com quantos apartamentos cada um tem. */
function blocosDe(apartamentos: Apartamento[]) {
  const contagem = new Map<string, number>();
  for (const a of apartamentos) {
    contagem.set(a.bloco, (contagem.get(a.bloco) ?? 0) + 1);
  }
  return [...contagem];
}

export function Inicio({
  eleicao,
  apartamentos,
  comprovantes,
  aoEscolherBloco,
}: {
  eleicao: Eleicao;
  apartamentos: Apartamento[];
  comprovantes: Comprovante[];
  aoEscolherBloco: (bloco: string) => void;
}) {
  const estado = ESTADO[eleicao.status];
  const aberta = eleicao.status === "aberta";
  return (
    <>
      <Brilho className={e.heroi}>
        <span className={e.empreendimento}>{eleicao.empreendimento}</span>
        <h1 className={e.tituloEleicao}>{eleicao.titulo}</h1>
        {estado.selo}
        <div className={e.estado} aria-live="polite">
          {estado.titulo && <h2 className={e.estadoTitulo}>{estado.titulo}</h2>}
          <p className={e.sub}>{estado.texto}</p>
        </div>
      </Brilho>

      {aberta && (
        <section className={e.secao} aria-labelledby="escolha-bloco">
          <h2 id="escolha-bloco" className={e.rotulo}>
            Escolha o bloco
          </h2>
          <div className={e.blocos}>
            {blocosDe(apartamentos).map(([bloco, total]) => (
              <button
                key={bloco}
                type="button"
                className={e.bloco}
                onClick={() => aoEscolherBloco(bloco)}
              >
                <span>
                  <span className={e.blocoNome}>{bloco}</span>
                  <span className={e.blocoInfo}>
                    {total === 1 ? "1 apartamento" : `${total} apartamentos`}
                  </span>
                </span>
                <Icone nome="chevron-right" className={e.blocoSeta} />
              </button>
            ))}
          </div>
        </section>
      )}

      {comprovantes.length > 0 && (
        <section className={e.secao} aria-labelledby="seus-comprovantes">
          <h2 id="seus-comprovantes" className={e.rotulo}>
            Seus comprovantes neste aparelho
          </h2>
          <ul className={e.lista}>
            {comprovantes.map((c) => (
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
