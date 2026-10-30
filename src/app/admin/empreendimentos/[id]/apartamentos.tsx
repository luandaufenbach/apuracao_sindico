"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useDeferredValue, useState } from "react";

import { agrupar } from "@/lib/agrupar";
import type { ApartamentoCadastro } from "@/lib/cadastro";
import { Botao } from "@/ui/botao";
import { Dialogo } from "@/ui/dialogo";
import { Icone } from "@/ui/icone";
import { Selo } from "@/ui/selo";

import estilos from "../../admin.module.css";
import { chamarApi, mensagemDe } from "../../cliente";
import { pontuarDocumento } from "../../formato";
import { Alerta, Campo } from "../../pecas";
import proprio from "./empreendimento.module.css";

type Edicao = {
  /** Sem id: apartamento novo. */
  id?: number;
  bloco: string;
  numero: string;
  rotulo: string;
  compradores: { id?: number; nome: string; documento: string }[];
};

const novaEdicao = (bloco = ""): Edicao => ({
  bloco,
  numero: "",
  rotulo: "",
  compradores: [{ nome: "", documento: "" }],
});

export function Apartamentos({
  empreendimentoId,
  apartamentos,
}: {
  empreendimentoId: number;
  apartamentos: ApartamentoCadastro[];
}) {
  const [busca, setBusca] = useState("");
  const termo = useDeferredValue(busca.trim().toLowerCase());
  const [edicao, setEdicao] = useState<Edicao | null>(null);

  const filtrados = termo
    ? apartamentos.filter((a) =>
        [
          a.bloco,
          a.rotulo,
          ...a.compradores.flatMap((c) => [c.nome, c.documento ?? ""]),
        ].some(
          (t) =>
            t.toLowerCase().includes(termo.replace(/[.\-/]/g, "")) ||
            t.toLowerCase().includes(termo),
        ),
      )
    : apartamentos;
  const blocos = agrupar(filtrados, (a) => a.bloco);

  return (
    <section className={estilos.cartao}>
      <div className={estilos.cartaoCabeca}>
        <h2 className={estilos.cartaoTitulo}>Apartamentos</h2>
        <Botao
          variante="contorno"
          tamanho="p"
          iconeEsquerda="plus"
          onClick={() =>
            setEdicao(novaEdicao(apartamentos.at(-1)?.bloco ?? "Bloco 01"))
          }
        >
          Novo apartamento
        </Botao>
      </div>
      {apartamentos.length > 0 && (
        <label className={proprio.busca}>
          <Icone nome="search" tamanho={16} />
          <input
            className={`${estilos.controle} ${proprio.buscaCampo}`}
            type="search"
            placeholder="Buscar por apartamento, nome ou documento"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            aria-label="Buscar apartamento"
          />
        </label>
      )}

      {apartamentos.length === 0 && (
        <p className={estilos.vazio}>
          Sem apartamentos. Importe a planilha ou cadastre um por um.
        </p>
      )}
      {apartamentos.length > 0 && filtrados.length === 0 && (
        <p className={estilos.vazio}>Nada encontrado para “{busca}”.</p>
      )}

      {[...blocos].map(([bloco, aptos]) => (
        <div key={bloco} className={proprio.bloco}>
          <h3 className={proprio.blocoTitulo}>
            {bloco} <span>{aptos.length} aptos</span>
          </h3>
          <div className={estilos.lista}>
            {aptos.map((a) => {
              const soMesa = !a.compradores.some((c) => c.documento);
              return (
                <div key={a.id} className={estilos.linha}>
                  <div className={proprio.rotulo}>{a.rotulo}</div>
                  <div className={estilos.linhaPrincipal}>
                    {a.compradores.length === 0 && (
                      <span className={estilos.linhaMeta}>Sem comprador</span>
                    )}
                    {a.compradores.map((c) => (
                      <span key={c.id} className={proprio.comprador}>
                        <span>{c.nome}</span>
                        <span className={estilos.linhaMeta}>
                          {c.documento
                            ? pontuarDocumento(c.documento)
                            : "sem documento"}
                        </span>
                      </span>
                    ))}
                  </div>
                  {soMesa && <Selo tom="aviso">Só pela mesa</Selo>}
                  <Botao
                    variante="fantasma"
                    tamanho="p"
                    onClick={() =>
                      setEdicao({
                        id: a.id,
                        bloco: a.bloco,
                        numero: a.numero,
                        rotulo: a.rotulo,
                        compradores: a.compradores.map((c) => ({
                          id: c.id,
                          nome: c.nome,
                          documento: pontuarDocumento(c.documento),
                        })),
                      })
                    }
                  >
                    Editar
                  </Botao>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {edicao && (
        <EditarApartamento
          key={edicao.id ?? "novo"}
          empreendimentoId={empreendimentoId}
          inicial={edicao}
          aoFechar={() => setEdicao(null)}
        />
      )}
    </section>
  );
}

function EditarApartamento({
  empreendimentoId,
  inicial,
  aoFechar,
}: {
  empreendimentoId: number;
  inicial: Edicao;
  aoFechar: () => void;
}) {
  const router = useRouter();
  const [a, setA] = useState(inicial);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<"salvar" | "remover" | null>(null);
  const [confirmarRemocao, setConfirmarRemocao] = useState(false);
  const base = `/api/admin/empreendimentos/${empreendimentoId}/apartamentos`;

  const mudarComprador = (
    i: number,
    campo: "nome" | "documento",
    valor: string,
  ) =>
    setA((x) => ({
      ...x,
      compradores: x.compradores.map((c, j) =>
        j === i ? { ...c, [campo]: valor } : c,
      ),
    }));

  async function enviar(acao: "salvar" | "remover") {
    setEnviando(acao);
    setErro(null);
    try {
      if (acao === "salvar") {
        await chamarApi(a.id ? `${base}/${a.id}` : base, {
          corpo: {
            bloco: a.bloco,
            numero: a.numero,
            rotulo: a.rotulo || `Ap ${a.numero}`,
            compradores: a.compradores,
          },
        });
      } else {
        await chamarApi(`${base}/${a.id}`, { metodo: "DELETE" });
      }
      aoFechar();
      router.refresh();
    } catch (falha) {
      setErro(mensagemDe(falha));
      setEnviando(null);
    }
  }

  return (
    <Dialogo
      aberto
      aoFechar={aoFechar}
      fixo={enviando !== null}
      titulo={
        a.id ? `Editar ${inicial.bloco}, ${inicial.rotulo}` : "Novo apartamento"
      }
      descricao="Documento em branco: o comprador só vota pela mesa."
    >
      <form
        id="form-apartamento"
        className={estilos.formulario}
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          enviar("salvar");
        }}
      >
        <div className={estilos.grade3}>
          <Campo rotulo="Bloco">
            <input
              className={estilos.controle}
              value={a.bloco}
              onChange={(e) => setA({ ...a, bloco: e.target.value })}
              required
              maxLength={50}
            />
          </Campo>
          <Campo rotulo="Número">
            <input
              className={estilos.controle}
              value={a.numero}
              onChange={(e) => setA({ ...a, numero: e.target.value })}
              required
              inputMode="numeric"
              pattern="\d{1,6}"
              title="Só dígitos"
            />
          </Campo>
          <Campo rotulo="Rótulo">
            <input
              className={estilos.controle}
              value={a.rotulo}
              onChange={(e) => setA({ ...a, rotulo: e.target.value })}
              placeholder={a.numero ? `Ap ${a.numero}` : "Ap 101"}
              maxLength={50}
            />
          </Campo>
        </div>

        {a.compradores.map((c, i) => (
          <fieldset key={c.id ?? `novo-${i}`} className={proprio.compradorForm}>
            <legend className={proprio.legenda}>
              Comprador {i + 1}
              <button
                type="button"
                className={proprio.tirar}
                onClick={() =>
                  setA({
                    ...a,
                    compradores: a.compradores.filter((_, j) => j !== i),
                  })
                }
                aria-label={`Tirar comprador ${i + 1}`}
              >
                <Icone nome="x" tamanho={16} />
              </button>
            </legend>
            <Campo rotulo="Nome">
              <input
                className={estilos.controle}
                value={c.nome}
                onChange={(e) => mudarComprador(i, "nome", e.target.value)}
                required
                maxLength={200}
              />
            </Campo>
            <Campo rotulo="CPF ou CNPJ">
              <input
                className={estilos.controle}
                value={c.documento}
                onChange={(e) => mudarComprador(i, "documento", e.target.value)}
                maxLength={32}
                autoComplete="off"
                spellCheck={false}
              />
            </Campo>
          </fieldset>
        ))}
        <Botao
          variante="fantasma"
          tamanho="p"
          iconeEsquerda="plus"
          onClick={() =>
            setA({
              ...a,
              compradores: [...a.compradores, { nome: "", documento: "" }],
            })
          }
          disabled={a.compradores.length >= 10}
        >
          Adicionar comprador
        </Botao>

        {erro && <Alerta>{erro}</Alerta>}
        {confirmarRemocao && (
          <Alerta tom="aviso">
            Remover {inicial.bloco}, {inicial.rotulo} e os compradores? Só dá
            para remover apartamento sem voto, candidato ou tentativa.
          </Alerta>
        )}
      </form>
      <div className={proprio.rodapeDialogo}>
        {a.id &&
          (confirmarRemocao ? (
            <Botao
              variante="contorno"
              carregando={enviando === "remover"}
              onClick={() => enviar("remover")}
            >
              Confirmar remoção
            </Botao>
          ) : (
            <Botao
              variante="fantasma"
              onClick={() => setConfirmarRemocao(true)}
            >
              Remover
            </Botao>
          ))}
        <span className={proprio.espaco} />
        <Botao variante="contorno" onClick={aoFechar} disabled={!!enviando}>
          Cancelar
        </Botao>
        <Botao
          type="submit"
          form="form-apartamento"
          carregando={enviando === "salvar"}
        >
          Salvar
        </Botao>
      </div>
    </Dialogo>
  );
}
