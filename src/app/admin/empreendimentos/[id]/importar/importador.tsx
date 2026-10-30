"use client";

import Link from "next/link";
import { useState } from "react";

import type {
  Comparacao,
  MapeamentoColunas,
  OpcaoImportacao,
  Previa,
} from "@/lib/importacao";
import { letraColuna } from "@/lib/colunas";
import { Botao } from "@/ui/botao";
import { Selo } from "@/ui/selo";

import estilos from "../../../admin.module.css";
import { chamarApi, mensagemDe } from "../../../cliente";
import { contar, pontuarDocumento } from "../../../formato";
import { Alerta, Campo } from "../../../pecas";
import proprio from "./importar.module.css";

type Aba = { nome: string; oculta: boolean; amostra: string[][] };
type RespostaPrevia = { previa: Previa; comparacao: Comparacao };

type Colunas = MapeamentoColunas["colunas"];
const CAMPOS: { chave: keyof Colunas; rotulo: string; opcional: boolean }[] = [
  { chave: "unidade", rotulo: "Unidade (Ap 101)", opcional: false },
  { chave: "comprador1", rotulo: "Comprador", opcional: false },
  { chave: "documento1", rotulo: "CPF ou CNPJ do comprador", opcional: false },
  { chave: "comprador2", rotulo: "Cônjuge", opcional: true },
  { chave: "documento2", rotulo: "CPF do cônjuge", opcional: true },
  { chave: "status", rotulo: "Status (informativo)", opcional: true },
];

export function Importador({ empreendimentoId }: { empreendimentoId: number }) {
  const url = `/api/admin/empreendimentos/${empreendimentoId}/importacao`;
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [modelo, setModelo] =
    useState<OpcaoImportacao["modelo"]>("controle_vendas");
  const [abas, setAbas] = useState<Aba[] | null>(null);
  const [mapa, setMapa] = useState<MapeamentoColunas | null>(null);
  const [resposta, setResposta] = useState<RespostaPrevia | null>(null);
  const [gravado, setGravado] = useState<Comparacao | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<string | null>(null);

  const opcao = (): OpcaoImportacao =>
    modelo === "manual" && mapa
      ? { modelo: "manual", mapeamento: mapa }
      : { modelo: "controle_vendas" };

  async function enviar<T>(etapa: string, extra?: OpcaoImportacao) {
    const form = new FormData();
    form.set("arquivo", arquivo!);
    form.set("etapa", etapa);
    if (extra) form.set("opcao", JSON.stringify(extra));
    return chamarApi<T>(url, { formulario: form });
  }

  async function executar(etapa: string, acao: () => Promise<void>) {
    setEnviando(etapa);
    setErro(null);
    try {
      await acao();
    } catch (falha) {
      setErro(mensagemDe(falha));
    } finally {
      setEnviando(null);
    }
  }

  function recomecar(novo: File | null, novoModelo = modelo) {
    setArquivo(novo);
    setModelo(novoModelo);
    setAbas(null);
    setMapa(null);
    setResposta(null);
    setGravado(null);
    setErro(null);
  }

  const lerEstrutura = () =>
    executar("estrutura", async () => {
      const { estrutura } = await enviar<{ estrutura: Aba[] }>("estrutura");
      setAbas(estrutura);
      const visiveis = estrutura.filter((a) => !a.oculta && a.amostra.length);
      setMapa({
        linhaCabecalho: 1,
        abas: visiveis.map((a) => a.nome),
        colunas: {
          bloco: null,
          unidade: 0,
          status: null,
          comprador1: 1,
          documento1: 2,
          comprador2: null,
          documento2: null,
        },
      });
    });

  const verPrevia = () =>
    executar("previa", async () => {
      setResposta(await enviar<RespostaPrevia>("previa", opcao()));
    });

  const confirmar = () =>
    executar("confirmar", async () => {
      const r = await enviar<{ comparacao: Comparacao }>("confirmar", opcao());
      setGravado(r.comparacao);
      setResposta(null);
    });

  if (gravado) {
    return (
      <section className={estilos.cartao}>
        <Alerta tom="sucesso">
          Importação gravada: {gravado.novos} apartamentos novos e{" "}
          {gravado.atualizados} atualizados.
        </Alerta>
        <div className={estilos.acoes}>
          <Link
            href={`/admin/empreendimentos/${empreendimentoId}`}
            className={proprio.link}
          >
            Ver os apartamentos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className={estilos.pilha}>
      <section className={estilos.cartao}>
        <h2 className={estilos.cartaoTitulo}>1. Arquivo e modelo</h2>
        <div className={estilos.grade2}>
          <Campo rotulo="Planilha" dica=".xlsx ou .csv, até 5 MB.">
            <input
              className={`${estilos.controle} ${proprio.arquivo}`}
              type="file"
              accept=".xlsx,.csv"
              onChange={(e) => recomecar(e.target.files?.[0] ?? null)}
            />
          </Campo>
          <Campo rotulo="Modelo de colunas">
            <select
              className={estilos.controle}
              value={modelo}
              onChange={(e) =>
                recomecar(arquivo, e.target.value as OpcaoImportacao["modelo"])
              }
            >
              <option value="controle_vendas">
                Controle de Vendas (padrão)
              </option>
              <option value="manual">Outra planilha: mapear colunas</option>
            </select>
          </Campo>
        </div>
        <p className={estilos.texto}>
          {modelo === "controle_vendas"
            ? "Uma aba por bloco (Bloco 01, Bloco 02...), cabeçalho na linha 6, unidade na coluna A, comprador em E e F, cônjuge em H e I. As outras colunas nunca são importadas."
            : "Escolha a linha do cabeçalho e as colunas de cada informação. O bloco vem de uma coluna ou do nome da aba."}
        </p>
        <div className={estilos.acoes}>
          {modelo === "manual" && !abas ? (
            <Botao
              disabled={!arquivo}
              carregando={enviando === "estrutura"}
              onClick={lerEstrutura}
            >
              Ler colunas
            </Botao>
          ) : (
            modelo === "controle_vendas" && (
              <Botao
                disabled={!arquivo}
                carregando={enviando === "previa"}
                onClick={verPrevia}
              >
                Ver prévia
              </Botao>
            )
          )}
        </div>
        {erro && !resposta && <Alerta>{erro}</Alerta>}
      </section>

      {modelo === "manual" && abas && mapa && (
        <Mapeamento
          abas={abas}
          mapa={mapa}
          aoMudar={(m) => {
            setMapa(m);
            setResposta(null);
          }}
          aoVerPrevia={verPrevia}
          carregando={enviando === "previa"}
        />
      )}

      {resposta && (
        <PreviaImportacao
          {...resposta}
          erro={erro}
          carregando={enviando === "confirmar"}
          aoConfirmar={confirmar}
        />
      )}
    </div>
  );
}

function Mapeamento({
  abas,
  mapa,
  aoMudar,
  aoVerPrevia,
  carregando,
}: {
  abas: Aba[];
  mapa: MapeamentoColunas;
  aoMudar: (m: MapeamentoColunas) => void;
  aoVerPrevia: () => void;
  carregando: boolean;
}) {
  const primeira = abas.find((a) => mapa.abas.includes(a.nome)) ?? abas[0];
  const cabecalho =
    mapa.linhaCabecalho > 0
      ? (primeira?.amostra[mapa.linhaCabecalho - 1] ?? [])
      : [];
  const totalColunas = Math.max(
    1,
    ...abas.flatMap((a) => a.amostra.map((l) => l.length)),
  );
  const opcoes = Array.from({ length: totalColunas }, (_, i) => (
    <option key={i} value={i}>
      {letraColuna(i)}
      {cabecalho[i] ? ` · ${cabecalho[i]}` : ""}
    </option>
  ));
  const mudarColuna = (chave: keyof Colunas, valor: string) =>
    aoMudar({
      ...mapa,
      colunas: {
        ...mapa.colunas,
        [chave]: valor === "" ? null : Number(valor),
      },
    });

  return (
    <section className={estilos.cartao}>
      <h2 className={estilos.cartaoTitulo}>2. Colunas</h2>
      <fieldset className={proprio.abas}>
        <legend className={estilos.rotuloCampo}>Abas a importar</legend>
        {abas.map((a) => (
          <label key={a.nome} className={estilos.marcar}>
            <input
              type="checkbox"
              checked={mapa.abas.includes(a.nome)}
              onChange={(e) =>
                aoMudar({
                  ...mapa,
                  abas: e.target.checked
                    ? [...mapa.abas, a.nome]
                    : mapa.abas.filter((n) => n !== a.nome),
                })
              }
            />
            {a.nome}
            {a.oculta && <Selo>Oculta</Selo>}
          </label>
        ))}
      </fieldset>
      <div className={estilos.grade3}>
        <Campo
          rotulo="Linha do cabeçalho"
          dica="Os dados começam na linha seguinte. 0: sem cabeçalho."
        >
          <input
            className={estilos.controle}
            type="number"
            min={0}
            max={100}
            value={mapa.linhaCabecalho}
            onChange={(e) =>
              aoMudar({
                ...mapa,
                linhaCabecalho: Math.max(
                  0,
                  Math.min(100, Number(e.target.value) || 0),
                ),
              })
            }
          />
        </Campo>
        <Campo rotulo="Bloco">
          <select
            className={estilos.controle}
            value={mapa.colunas.bloco ?? ""}
            onChange={(e) => mudarColuna("bloco", e.target.value)}
          >
            <option value="">Nome da aba</option>
            {opcoes}
          </select>
        </Campo>
        {CAMPOS.map((c) => (
          <Campo key={c.chave} rotulo={c.rotulo}>
            <select
              className={estilos.controle}
              value={mapa.colunas[c.chave] ?? ""}
              onChange={(e) => mudarColuna(c.chave, e.target.value)}
            >
              {c.opcional && <option value="">Não tem</option>}
              {opcoes}
            </select>
          </Campo>
        ))}
      </div>
      {primeira && (
        <div className={proprio.amostraCaixa}>
          <p className={estilos.linhaMeta}>{primeira.nome}: primeiras linhas</p>
          <div className={proprio.rolagem}>
            <table className={proprio.amostra}>
              <thead>
                <tr>
                  <th />
                  {Array.from({ length: totalColunas }, (_, i) => (
                    <th key={i}>{letraColuna(i)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {primeira.amostra.map((linha, i) => (
                  <tr
                    key={i}
                    className={
                      i + 1 === mapa.linhaCabecalho
                        ? proprio.linhaCabecalho
                        : ""
                    }
                  >
                    <th>{i + 1}</th>
                    {Array.from({ length: totalColunas }, (_, j) => (
                      <td key={j}>{linha[j] ?? ""}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <div className={estilos.acoes}>
        <Botao
          disabled={mapa.abas.length === 0}
          carregando={carregando}
          onClick={aoVerPrevia}
        >
          Ver prévia
        </Botao>
      </div>
    </section>
  );
}

function PreviaImportacao({
  previa,
  comparacao,
  erro,
  carregando,
  aoConfirmar,
}: RespostaPrevia & {
  erro: string | null;
  carregando: boolean;
  aoConfirmar: () => void;
}) {
  const { resumo } = previa;
  const comAviso = previa.apartamentos.filter((a) => a.avisos.length > 0);
  return (
    <section className={estilos.cartao}>
      <h2 className={estilos.cartaoTitulo}>3. Prévia</h2>
      <div className={estilos.numeros}>
        <Numero rotulo="Apartamentos" valor={resumo.apartamentos} destaque />
        <Numero rotulo="Votam por CPF" valor={resumo.porCpf} />
        <Numero rotulo="Votam por CNPJ" valor={resumo.porCnpj} />
        <Numero rotulo="Só pela mesa" valor={resumo.soMesa} />
      </div>
      <p className={estilos.texto}>
        {comparacao.novos} novos e {comparacao.atualizados} já cadastrados
        (serão atualizados).{" "}
        {resumo.documentosEmVariosAptos > 0 &&
          `${contar(resumo.documentosEmVariosAptos, "documento aparece", "documentos aparecem")} em mais de um apartamento, o que é normal. `}
        {previa.abasIgnoradas.length > 0 &&
          `Abas ignoradas: ${previa.abasIgnoradas.join(", ")}.`}
      </p>
      {comparacao.foraDaPlanilha.length > 0 && (
        <Alerta tom="aviso">
          {comparacao.foraDaPlanilha.length} apartamentos do cadastro não estão
          na planilha e ficam como estão:{" "}
          {comparacao.foraDaPlanilha
            .slice(0, 10)
            .map((a) => `${a.bloco}, ${a.rotulo}`)
            .join("; ")}
          {comparacao.foraDaPlanilha.length > 10 && "..."}
        </Alerta>
      )}

      {previa.erros.length > 0 && (
        <Grupo
          titulo={`Linhas com erro, que ficam de fora (${previa.erros.length})`}
        >
          {previa.erros.map((e) => (
            <Item
              key={e.origem}
              origem={e.origem}
              textos={[e.motivo]}
              tom="perigo"
            />
          ))}
        </Grupo>
      )}
      {previa.ignorados.length > 0 && (
        <Grupo titulo={`Ignoradas (${previa.ignorados.length})`}>
          {previa.ignorados.map((e) => (
            <Item key={e.origem} origem={e.origem} textos={[e.motivo]} />
          ))}
        </Grupo>
      )}
      {comAviso.length > 0 && (
        <Grupo titulo={`Apartamentos com aviso (${comAviso.length})`}>
          {comAviso.map((a) => (
            <Item
              key={a.origem}
              origem={`${a.bloco}, ${a.rotulo} · ${a.origem}`}
              textos={a.avisos}
              tom={a.soMesa ? "aviso" : "info"}
            />
          ))}
        </Grupo>
      )}

      <details className={proprio.todos}>
        <summary>Ver os {previa.apartamentos.length} apartamentos</summary>
        <div className={estilos.lista}>
          {previa.apartamentos.map((a) => (
            <div key={a.origem} className={estilos.linha}>
              <span className={proprio.rotuloPrevia}>
                {a.bloco}, {a.rotulo}
              </span>
              <div className={estilos.linhaPrincipal}>
                {a.compradores.map((c, i) => (
                  <span key={i} className={proprio.compradorPrevia}>
                    {c.nome}{" "}
                    <span className={estilos.linhaMeta}>
                      {c.documento
                        ? pontuarDocumento(c.documento)
                        : "sem documento"}
                    </span>
                  </span>
                ))}
              </div>
              {a.status && <Selo>{a.status}</Selo>}
              {a.soMesa && <Selo tom="aviso">Só pela mesa</Selo>}
            </div>
          ))}
        </div>
      </details>

      {erro && <Alerta>{erro}</Alerta>}
      <div className={estilos.acoes}>
        <Botao
          carregando={carregando}
          disabled={resumo.apartamentos === 0}
          onClick={aoConfirmar}
        >
          Confirmar importação
        </Botao>
      </div>
    </section>
  );
}

function Numero({
  rotulo,
  valor,
  destaque,
}: {
  rotulo: string;
  valor: number;
  destaque?: boolean;
}) {
  return (
    <div
      className={`${estilos.numero} ${destaque ? estilos.numeroDestaque : ""}`}
    >
      <span className={estilos.olho}>{rotulo}</span>
      <span className={estilos.numeroValor}>{valor}</span>
    </div>
  );
}

function Grupo({
  titulo,
  children,
}: {
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <details className={proprio.grupo} open>
      <summary>{titulo}</summary>
      <div className={estilos.lista}>{children}</div>
    </details>
  );
}

function Item({
  origem,
  textos,
  tom = "neutro",
}: {
  origem: string;
  textos: string[];
  tom?: "neutro" | "aviso" | "perigo" | "info";
}) {
  return (
    <div className={estilos.linha}>
      <div className={estilos.linhaPrincipal}>
        <span className={estilos.linhaMeta}>{origem}</span>
        {textos.map((t) => (
          <span key={t} className={proprio[`texto_${tom}`]}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
