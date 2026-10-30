"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import type { StatusEleicao } from "@/lib/eleicoes";
import { Botao } from "@/ui/botao";
import { Dialogo } from "@/ui/dialogo";
import { FotoCandidato } from "@/ui/foto-candidato";

import estilos from "../../admin.module.css";
import { chamarApi, mensagemDe } from "../../cliente";
import { Alerta, Campo } from "../../pecas";
import proprio from "./eleicao.module.css";

type Candidato = {
  id: number;
  nome: string;
  apartamentoId: number | null;
  bloco: string | null;
  rotulo: string | null;
  foto: string | null;
  proposta: string | null;
  ordem: number;
};

type Edicao = Omit<Candidato, "id" | "bloco" | "rotulo" | "proposta"> & {
  id?: number;
  proposta: string;
};

const LADO_FOTO = 400;
const LIMITE_PROPOSTA = 300;

/** Corta no centro e reduz para 400 × 400 px em JPEG. */
async function redimensionarFoto(arquivo: File): Promise<string> {
  const imagem = await createImageBitmap(arquivo);
  const lado = Math.min(imagem.width, imagem.height);
  const tela = document.createElement("canvas");
  tela.width = LADO_FOTO;
  tela.height = LADO_FOTO;
  const ctx = tela.getContext("2d");
  if (!ctx) throw new Error("Sem canvas");
  ctx.drawImage(
    imagem,
    (imagem.width - lado) / 2,
    (imagem.height - lado) / 2,
    lado,
    lado,
    0,
    0,
    LADO_FOTO,
    LADO_FOTO,
  );
  imagem.close();
  return tela.toDataURL("image/jpeg", 0.85);
}

export function Candidatos({
  eleicaoId,
  status,
  candidatos,
  apartamentos,
}: {
  eleicaoId: number;
  status: StatusEleicao;
  candidatos: Candidato[];
  apartamentos: { id: number; nome: string }[];
}) {
  const [edicao, setEdicao] = useState<Edicao | null>(null);
  const rascunho = status === "rascunho";
  const editavel = rascunho || status === "aberta";

  return (
    <section className={estilos.cartao}>
      <div className={estilos.cartaoCabeca}>
        <h2 className={estilos.cartaoTitulo}>Candidatos</h2>
        {rascunho && (
          <Botao
            variante="contorno"
            tamanho="p"
            iconeEsquerda="plus"
            onClick={() =>
              setEdicao({
                nome: "",
                apartamentoId: null,
                foto: null,
                proposta: "",
                ordem: (candidatos.at(-1)?.ordem ?? 0) + 1,
              })
            }
          >
            Novo candidato
          </Botao>
        )}
      </div>
      {!rascunho && (
        <p className={estilos.texto}>
          {editavel
            ? "Com a votação aberta, dá para corrigir nome, foto e proposta, mas não incluir nem tirar candidatos."
            : "Depois de encerrada, os candidatos não mudam."}
        </p>
      )}
      {candidatos.length === 0 ? (
        <p className={estilos.vazio}>Nenhum candidato ainda.</p>
      ) : (
        <div className={estilos.lista}>
          {candidatos.map((c) => (
            <div key={c.id} className={`${estilos.linha} ${proprio.candidato}`}>
              <FotoCandidato
                candidato={c}
                classeFoto={proprio.foto}
                classeIniciais={proprio.iniciais}
              />
              <div className={estilos.linhaPrincipal}>
                <span className={estilos.linhaTitulo}>{c.nome}</span>
                <span className={estilos.linhaMeta}>
                  Nº {c.ordem}
                  {c.rotulo && ` · ${c.bloco}, ${c.rotulo}`}
                </span>
                {c.proposta && (
                  <span className={proprio.proposta}>{c.proposta}</span>
                )}
              </div>
              {editavel && (
                <Botao
                  variante="fantasma"
                  tamanho="p"
                  onClick={() =>
                    setEdicao({
                      id: c.id,
                      nome: c.nome,
                      apartamentoId: c.apartamentoId,
                      foto: c.foto,
                      proposta: c.proposta ?? "",
                      ordem: c.ordem,
                    })
                  }
                >
                  Editar
                </Botao>
              )}
            </div>
          ))}
        </div>
      )}
      {edicao && (
        <EditarCandidato
          key={edicao.id ?? "novo"}
          eleicaoId={eleicaoId}
          inicial={edicao}
          podeRemover={rascunho}
          apartamentos={apartamentos}
          aoFechar={() => setEdicao(null)}
        />
      )}
    </section>
  );
}

function EditarCandidato({
  eleicaoId,
  inicial,
  podeRemover,
  apartamentos,
  aoFechar,
}: {
  eleicaoId: number;
  inicial: Edicao;
  podeRemover: boolean;
  apartamentos: { id: number; nome: string }[];
  aoFechar: () => void;
}) {
  const router = useRouter();
  const [c, setC] = useState(inicial);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState<"salvar" | "remover" | null>(null);
  const [lendoFoto, setLendoFoto] = useState(false);
  const base = `/api/admin/eleicoes/${eleicaoId}/candidatos`;

  async function escolherFoto(arquivo: File | undefined) {
    if (!arquivo) return;
    setLendoFoto(true);
    setErro(null);
    try {
      setC((x) => ({ ...x, foto: null }));
      const foto = await redimensionarFoto(arquivo);
      setC((x) => ({ ...x, foto }));
    } catch {
      setErro("Não deu para ler a imagem. Use uma foto JPG ou PNG.");
    } finally {
      setLendoFoto(false);
    }
  }

  async function enviar(acao: "salvar" | "remover") {
    setEnviando(acao);
    setErro(null);
    try {
      if (acao === "salvar") {
        await chamarApi(c.id ? `${base}/${c.id}` : base, {
          corpo: {
            nome: c.nome,
            apartamentoId: c.apartamentoId,
            foto: c.foto,
            proposta: c.proposta,
            ordem: c.ordem,
          },
        });
      } else {
        await chamarApi(`${base}/${c.id}`, { metodo: "DELETE" });
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
      titulo={c.id ? "Editar candidato" : "Novo candidato"}
    >
      <form
        id="form-candidato"
        className={estilos.formulario}
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          enviar("salvar");
        }}
      >
        <div className={proprio.fotoCampo}>
          <FotoCandidato
            candidato={{ nome: c.nome || "?", foto: c.foto }}
            classeFoto={proprio.fotoGrande}
            classeIniciais={proprio.iniciaisGrande}
          />
          <div className={estilos.campo}>
            <span className={estilos.rotuloCampo}>Foto</span>
            <input
              className={proprio.arquivoFoto}
              type="file"
              accept="image/*"
              onChange={(e) => escolherFoto(e.target.files?.[0])}
            />
            <span className={estilos.dica}>
              {lendoFoto
                ? "Preparando a foto..."
                : "Cortada no centro e reduzida para 400 × 400 px."}
            </span>
            {c.foto && (
              <Botao
                variante="fantasma"
                tamanho="p"
                onClick={() => setC({ ...c, foto: null })}
              >
                Tirar foto
              </Botao>
            )}
          </div>
        </div>
        <Campo rotulo="Nome">
          <input
            className={estilos.controle}
            value={c.nome}
            onChange={(e) => setC({ ...c, nome: e.target.value })}
            required
            maxLength={120}
          />
        </Campo>
        <div className={estilos.grade2}>
          <Campo rotulo="Apartamento" dica="Opcional.">
            <select
              className={estilos.controle}
              value={c.apartamentoId ?? ""}
              onChange={(e) =>
                setC({
                  ...c,
                  apartamentoId: e.target.value ? Number(e.target.value) : null,
                })
              }
            >
              <option value="">Sem apartamento</option>
              {apartamentos.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nome}
                </option>
              ))}
            </select>
          </Campo>
          <Campo rotulo="Ordem de exibição">
            <input
              className={estilos.controle}
              type="number"
              min={0}
              max={999}
              value={c.ordem}
              onChange={(e) =>
                setC({ ...c, ordem: Number(e.target.value) || 0 })
              }
            />
          </Campo>
        </div>
        <Campo
          rotulo="Proposta"
          dica={`${c.proposta.length} de ${LIMITE_PROPOSTA} caracteres.`}
        >
          <textarea
            className={estilos.controle}
            value={c.proposta}
            onChange={(e) => setC({ ...c, proposta: e.target.value })}
            maxLength={LIMITE_PROPOSTA}
            rows={4}
          />
        </Campo>
        {erro && <Alerta>{erro}</Alerta>}
      </form>
      <div className={proprio.rodapeDialogo}>
        {c.id && podeRemover && (
          <Botao
            variante="fantasma"
            carregando={enviando === "remover"}
            disabled={enviando === "salvar"}
            onClick={() => enviar("remover")}
          >
            Remover
          </Botao>
        )}
        <span className={proprio.espaco} />
        <Botao variante="contorno" onClick={aoFechar} disabled={!!enviando}>
          Cancelar
        </Botao>
        <Botao
          type="submit"
          form="form-candidato"
          carregando={enviando === "salvar"}
          disabled={lendoFoto}
        >
          Salvar
        </Botao>
      </div>
    </Dialogo>
  );
}
