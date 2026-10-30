"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { agrupar } from "@/lib/agrupar";
import { validarDocumento } from "@/lib/documento";
import { Botao } from "@/ui/botao";
import { Dialogo } from "@/ui/dialogo";
import { FotoCandidato } from "@/ui/foto-candidato";
import { Icone } from "@/ui/icone";

import estilos from "../../../admin.module.css";
import { chamarApi, ErroApi } from "../../../cliente";
import { contar, hora, rotuloCurto } from "../../../formato";
import { Alerta, Campo } from "../../../pecas";
import proprio from "./god.module.css";
import {
  type ApartamentoGod,
  type CandidatoGod,
  type EleicaoGod,
  nomeApto,
} from "./tipos";

type Filtro = "mesa" | "bloqueados" | "todos";
const FILTROS: { valor: Filtro; rotulo: string }[] = [
  { valor: "mesa", rotulo: "Só pela mesa" },
  { valor: "bloqueados", rotulo: "Bloqueados" },
  { valor: "todos", rotulo: "Todos sem voto" },
];
const passa = (a: ApartamentoGod, f: Filtro) =>
  f === "todos" || (f === "mesa" ? a.soMesa : a.bloqueado);

type Etapa = "dados" | "cabine" | "feito";
type Comprovante = {
  apartamentoId: number;
  rotulo: string;
  comprovante: string;
  horario: string;
};

/**
 * Voto pela mesa em lote (R12). O god escolhe os apartamentos sem voto e
 * informa quem vota e o motivo; a pessoa escolhe o candidato na cabine, que
 * ocupa a tela inteira do tablet e não mostra o resto do painel. Grava um voto
 * por apartamento, todos ou nenhum.
 */
export function Mesa({
  eleicao,
  candidatos,
  apartamentos,
}: {
  eleicao: EleicaoGod;
  candidatos: CandidatoGod[];
  apartamentos: ApartamentoGod[];
}) {
  const router = useRouter();
  const idCabine = useId();
  const cabine = useRef<HTMLDialogElement>(null);
  const [filtro, setFiltro] = useState<Filtro>("mesa");
  const [selecionados, setSelecionados] = useState<ReadonlySet<number>>(
    () => new Set(),
  );
  const [nome, setNome] = useState("");
  const [documento, setDocumento] = useState("");
  const [motivo, setMotivo] = useState("");
  const [conferir, setConferir] = useState(false);
  const [etapa, setEtapa] = useState<Etapa>("dados");
  const [escolhido, setEscolhido] = useState<CandidatoGod | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  // Recusado pelo servidor: a lista pode ter mudado (algum apartamento votou),
  // então a pessoa volta à cabine e confirma de novo vendo o lote novo.
  const [recusado, setRecusado] = useState(false);
  const [feitos, setFeitos] = useState<Comprovante[]>([]);

  const livres = apartamentos.filter((a) => !a.votou);
  const visiveis = livres.filter((a) => passa(a, filtro));
  // Apartamento que votou por outro caminho sai da seleção sozinho.
  const escolhidos = livres.filter((a) => selecionados.has(a.id));
  const docValido = validarDocumento(documento) !== null;
  const aberta = eleicao.status === "aberta";
  const problemas = [
    escolhidos.length === 0 && "Selecione ao menos um apartamento.",
    !nome.trim() && "Informe o nome de quem vota.",
    !docValido && "Informe um CPF ou CNPJ válido.",
    !motivo.trim() && "Informe o motivo.",
  ].filter((p): p is string => !!p);

  const naCabine = etapa !== "dados";
  useEffect(() => {
    const d = cabine.current;
    if (!d) return;
    if (naCabine && !d.open) d.showModal();
    if (!naCabine && d.open) d.close();
  }, [naCabine]);

  function alternar(id: number) {
    setSelecionados((s) => {
      const novo = new Set(s);
      if (!novo.delete(id)) novo.add(id);
      return novo;
    });
  }

  function continuar() {
    setConferir(true);
    setErro(null);
    if (aberta && problemas.length === 0) setEtapa("cabine");
  }

  function concluir() {
    setSelecionados(new Set());
    setNome("");
    setDocumento("");
    setMotivo("");
    setConferir(false);
    setEscolhido(null);
    setFeitos([]);
    setErro(null);
    setEtapa("dados");
  }

  async function votar() {
    if (!escolhido) return;
    setEnviando(true);
    setErro(null);
    try {
      const r = await chamarApi<{ votos: Omit<Comprovante, "rotulo">[] }>(
        `/api/admin/eleicoes/${eleicao.id}/voto-mesa`,
        {
          corpo: {
            apartamentoIds: escolhidos.map((a) => a.id),
            candidatoId: escolhido.id,
            nome: nome.trim(),
            documento,
            motivo: motivo.trim(),
          },
        },
      );
      const rotulos = new Map(apartamentos.map((a) => [a.id, nomeApto(a)]));
      setFeitos(
        r.votos.map((v) => ({
          ...v,
          rotulo: rotulos.get(v.apartamentoId) ?? "",
        })),
      );
      setEscolhido(null);
      setEtapa("feito");
      router.refresh();
    } catch (falha) {
      if (falha instanceof ErroApi) {
        setErro(falha.message);
        setRecusado(true);
        // Algum apartamento votou ou a votação fechou: a lista se atualiza.
        if (falha.status === 409) router.refresh();
      } else {
        setErro(
          "Sem conexão com o servidor. O voto pode ter sido gravado: confira em Buscar voto antes de tentar de novo.",
        );
      }
    } finally {
      setEnviando(false);
    }
  }

  const listaEscolhidos = (
    etapa === "feito" ? feitos.map((f) => f.rotulo) : escolhidos.map(nomeApto)
  ).join(" · ");

  return (
    <div className={estilos.duas}>
      <section className={estilos.cartao} aria-labelledby={`${idCabine}-aptos`}>
        <div className={estilos.cartaoCabeca}>
          <h2 id={`${idCabine}-aptos`} className={estilos.cartaoTitulo}>
            Apartamentos sem voto
          </h2>
          <div className={proprio.segmentado} role="group" aria-label="Mostrar">
            {FILTROS.map((f) => (
              <button
                key={f.valor}
                type="button"
                aria-pressed={filtro === f.valor}
                onClick={() => setFiltro(f.valor)}
              >
                {f.rotulo}
                <span>{livres.filter((a) => passa(a, f.valor)).length}</span>
              </button>
            ))}
          </div>
        </div>
        {visiveis.length === 0 ? (
          <p className={estilos.vazio}>
            {filtro === "mesa"
              ? "Nenhum apartamento só pela mesa sem voto."
              : filtro === "bloqueados"
                ? "Nenhum apartamento bloqueado."
                : "Todos os apartamentos já votaram."}
          </p>
        ) : (
          <>
            <div className={proprio.acoesSelecao}>
              <Botao
                variante="contorno"
                tamanho="p"
                onClick={() =>
                  setSelecionados(
                    (s) => new Set([...s, ...visiveis.map((a) => a.id)]),
                  )
                }
              >
                Marcar os {visiveis.length}
              </Botao>
              {selecionados.size > 0 && (
                <Botao
                  variante="fantasma"
                  tamanho="p"
                  onClick={() => setSelecionados(new Set())}
                >
                  Limpar seleção
                </Botao>
              )}
            </div>
            {[...agrupar(visiveis, (a) => a.bloco)].map(([bloco, aptos]) => (
              <div key={bloco} className={proprio.bloco}>
                <h3 className={proprio.blocoTitulo}>{bloco}</h3>
                <div className={proprio.grade}>
                  {aptos.map((a) => {
                    const marcado = selecionados.has(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        className={proprio.apto}
                        aria-pressed={marcado}
                        aria-label={`${nomeApto(a)}${a.bloqueado ? ", bloqueado" : ""}${a.soMesa ? ", só pela mesa" : ""}`}
                        onClick={() => alternar(a.id)}
                      >
                        {marcado && (
                          <Icone nome="check" tamanho={12} traco={2} />
                        )}
                        {rotuloCurto(a.rotulo)}
                        {a.bloqueado && !marcado && (
                          <Icone nome="lock" tamanho={12} traco={2} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </>
        )}
      </section>

      <section className={estilos.cartao} aria-labelledby={`${idCabine}-quem`}>
        <h2 id={`${idCabine}-quem`} className={estilos.cartaoTitulo}>
          Quem vota
        </h2>
        {!aberta && (
          <Alerta tom="info">
            O voto pela mesa só vale com a votação aberta.
          </Alerta>
        )}
        <div>
          <p className={estilos.olho}>
            {contar(escolhidos.length, "apartamento", "apartamentos")}
          </p>
          <p className={proprio.resumo}>
            {escolhidos.length === 0
              ? "Nenhum selecionado."
              : escolhidos.map(nomeApto).join(" · ")}
          </p>
        </div>
        <div className={estilos.formulario}>
          <Campo rotulo="Nome de quem vota">
            <input
              className={estilos.controle}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              maxLength={200}
              autoComplete="off"
            />
          </Campo>
          <Campo
            rotulo="CPF ou CNPJ"
            dica={
              conferir && documento && !docValido
                ? "Documento inválido. Confira os números."
                : "Documento de quem vota, conferido na mesa."
            }
          >
            <input
              className={estilos.controle}
              value={documento}
              onChange={(e) => setDocumento(e.target.value)}
              maxLength={32}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              aria-invalid={conferir && !docValido}
            />
          </Campo>
          <Campo
            rotulo="Motivo"
            dica="Ex.: permuta sem documento no cadastro. Fica no log e no relatório."
          >
            <textarea
              className={estilos.controle}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </Campo>
          {conferir && problemas.length > 0 && (
            <Alerta tom="aviso">{problemas.join(" ")}</Alerta>
          )}
          <Botao
            larguraTotal
            tamanho="g"
            iconeDireita="arrow-right"
            disabled={!aberta}
            onClick={continuar}
          >
            Escolher candidato
          </Botao>
        </div>
      </section>

      <dialog
        ref={cabine}
        className={proprio.cabine}
        aria-labelledby={`${idCabine}-titulo`}
        onCancel={(e) => {
          if (enviando) e.preventDefault();
        }}
        onClose={(e) => {
          if (e.target !== e.currentTarget) return;
          if (etapa === "feito") concluir();
          else if (etapa === "cabine") setEtapa("dados");
        }}
      >
        <div className={proprio.cabineConteudo}>
          <p className={estilos.olho}>
            Voto pela mesa ·{" "}
            {contar(
              etapa === "feito" ? feitos.length : escolhidos.length,
              "apartamento",
              "apartamentos",
            )}
          </p>
          {etapa === "feito" ? (
            <>
              <span className={proprio.seloOk}>
                <Icone nome="circle-check" tamanho={28} />
              </span>
              <h2 id={`${idCabine}-titulo`} className={proprio.cabineTitulo}>
                Voto registrado
              </h2>
              <p className={estilos.sub}>
                {contar(feitos.length, "voto gravado", "votos gravados")} pela
                mesa. Guarde os comprovantes.
              </p>
              <ul className={proprio.comprovantes}>
                {feitos.map((f) => (
                  <li key={f.apartamentoId}>
                    <span>{f.rotulo}</span>
                    <span className={proprio.codigo}>{f.comprovante}</span>
                    <span className={estilos.mono}>{hora(f.horario)}</span>
                  </li>
                ))}
              </ul>
              <Botao larguraTotal tamanho="g" onClick={concluir}>
                Concluir
              </Botao>
            </>
          ) : (
            <>
              <h2 id={`${idCabine}-titulo`} className={proprio.cabineTitulo}>
                Escolha o candidato
              </h2>
              {escolhidos.length === 0 ? (
                <Alerta tom="aviso">
                  Os apartamentos selecionados já votaram. Volte e confira a
                  seleção.
                </Alerta>
              ) : (
                <p className={estilos.sub}>
                  {nome.trim()} vota por {listaEscolhidos}.
                </p>
              )}
              <div className={proprio.candidatos}>
                {candidatos.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    className={proprio.candidato}
                    disabled={escolhidos.length === 0}
                    onClick={() => {
                      setErro(null);
                      setRecusado(false);
                      setEscolhido(c);
                    }}
                  >
                    <FotoCandidato
                      candidato={c}
                      classeFoto={proprio.foto}
                      classeIniciais={proprio.iniciais}
                    />
                    <span>
                      <span className={proprio.candidatoNome}>{c.nome}</span>
                      {c.apartamento && (
                        <span className={proprio.candidatoApto}>
                          {c.apartamento}
                        </span>
                      )}
                    </span>
                    {c.proposta && (
                      <span className={proprio.proposta}>{c.proposta}</span>
                    )}
                  </button>
                ))}
              </div>
              <Botao
                variante="contorno"
                iconeEsquerda="arrow-left"
                onClick={() => setEtapa("dados")}
              >
                Voltar
              </Botao>
            </>
          )}
        </div>
      </dialog>

      {escolhido && (
        <Dialogo
          aberto
          aoFechar={() => setEscolhido(null)}
          fixo={enviando}
          titulo={`Confirmar voto em ${escolhido.nome}?`}
          descricao={`Pelos apartamentos ${listaEscolhidos}: um voto por apartamento.`}
          rodape={
            <>
              <Botao
                variante="contorno"
                onClick={() => setEscolhido(null)}
                disabled={enviando}
              >
                Voltar
              </Botao>
              <Botao carregando={enviando} disabled={recusado} onClick={votar}>
                Confirmar voto
              </Botao>
            </>
          }
        >
          {erro && <Alerta>{erro}</Alerta>}
        </Dialogo>
      )}
    </div>
  );
}
