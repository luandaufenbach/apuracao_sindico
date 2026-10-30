// Importação de apartamentos e compradores de .xlsx ou .csv
// (docs/ESPECIFICACAO.md, "Admin" e "Planilha Controle de Vendas"). Ler o
// arquivo e montar a prévia não grava nada; gravar é um passo à parte, depois
// que o operador confere a prévia.
import { eq, inArray, sql } from "drizzle-orm";
import ExcelJS from "exceljs";
import { z } from "zod";

import { db, type Executor, type Transacao } from "@/db";
import { apartamento, comprador, eleicao, voto } from "@/db/schema";

import { agrupar } from "./agrupar";
import { registrarAuditoria } from "./auditoria";
import { normalizarDocumento, validarDocumento } from "./documento";
import { EntradaInvalida, idBanco, validar } from "./erros";
import { ordemApartamento } from "./ordem-apartamento";

/** Limites contra arquivo enorme ou malformado. */
export const TAMANHO_MAXIMO_ARQUIVO = 5 * 1024 * 1024;
const MAXIMO_LINHAS = 5000;
const MAXIMO_COLUNAS = 60;

// --- Ler o arquivo -----------------------------------------------------------

export type Aba = {
  nome: string;
  oculta: boolean;
  /** linhas[0] é a linha 1 da planilha; colunas[0] é a coluna A. */
  linhas: string[][];
};

export type Planilha = { abas: Aba[] };

export { letraColuna } from "./colunas";

function textoCelula(valor: ExcelJS.CellValue): string {
  if (valor === null || valor === undefined) return "";
  if (typeof valor === "string") return valor;
  if (typeof valor === "number" || typeof valor === "boolean") {
    return String(valor);
  }
  if (valor instanceof Date) return valor.toISOString().slice(0, 10);
  if ("richText" in valor) return valor.richText.map((t) => t.text).join("");
  if ("hyperlink" in valor) return valor.text;
  if ("formula" in valor || "sharedFormula" in valor) {
    return valor.result === undefined ? "" : textoCelula(valor.result);
  }
  return ""; // erro de fórmula
}

const limpar = (texto: string) => texto.replace(/\s+/g, " ").trim();

async function lerXlsx(conteudo: Uint8Array): Promise<Planilha> {
  const livro = new ExcelJS.Workbook();
  try {
    await livro.xlsx.load(Buffer.from(conteudo) as unknown as ExcelJS.Buffer);
  } catch {
    throw new EntradaInvalida("Não deu para ler o arquivo .xlsx.");
  }
  const abas = livro.worksheets.map((aba) => {
    const totalLinhas = Math.min(aba.rowCount, MAXIMO_LINHAS);
    const totalColunas = Math.min(aba.columnCount, MAXIMO_COLUNAS);
    const linhas: string[][] = [];
    for (let l = 1; l <= totalLinhas; l++) {
      const linha = aba.getRow(l);
      const celulas: string[] = [];
      for (let c = 1; c <= totalColunas; c++) {
        celulas.push(limpar(textoCelula(linha.getCell(c).value)));
      }
      linhas.push(celulas);
    }
    return { nome: limpar(aba.name), oculta: aba.state !== "visible", linhas };
  });
  return { abas };
}

/** Excel no Brasil salva CSV em Windows-1252 e com `;`; aceita os dois jeitos. */
function decodificarTexto(conteudo: Uint8Array): string {
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(conteudo);
  } catch {
    return new TextDecoder("windows-1252").decode(conteudo);
  }
}

export function lerCsv(texto: string): string[][] {
  texto = texto.replace(/^﻿/, "");
  const primeira = texto.slice(0, texto.search(/\r?\n|$/));
  const conta = (c: string) => primeira.split(c).length - 1;
  const separador = [";", ",", "\t"].reduce((a, b) =>
    conta(b) > conta(a) ? b : a,
  );

  const linhas: string[][] = [];
  let linha: string[] = [];
  let campo = "";
  let aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) {
      if (c === '"' && texto[i + 1] === '"') {
        campo += '"';
        i++;
      } else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"' && campo === "") aspas = true;
    else if (c === separador) {
      linha.push(campo);
      campo = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && texto[i + 1] === "\n") i++;
      linha.push(campo);
      linhas.push(linha);
      linha = [];
      campo = "";
      if (linhas.length >= MAXIMO_LINHAS) break;
    } else campo += c;
  }
  if (campo !== "" || linha.length > 0) linhas.push([...linha, campo]);
  return linhas.map((l) => l.slice(0, MAXIMO_COLUNAS).map(limpar));
}

/** Lê .xlsx ou .csv. O CSV vira uma aba só, com o nome do arquivo. */
export async function lerArquivo(
  nomeArquivo: string,
  conteudo: Uint8Array,
): Promise<Planilha> {
  if (conteudo.byteLength > TAMANHO_MAXIMO_ARQUIVO) {
    throw new EntradaInvalida("O arquivo passa de 5 MB.");
  }
  const extensao = nomeArquivo.toLowerCase().split(".").pop();
  if (extensao === "xlsx") return lerXlsx(conteudo);
  if (extensao === "csv") {
    const nome = limpar(nomeArquivo.replace(/\.csv$/i, "")) || "CSV";
    return {
      abas: [
        { nome, oculta: false, linhas: lerCsv(decodificarTexto(conteudo)) },
      ],
    };
  }
  throw new EntradaInvalida("Envie um arquivo .xlsx ou .csv.");
}

// --- Modelos de colunas -----------------------------------------------------

const coluna = z
  .int()
  .min(0)
  .max(MAXIMO_COLUNAS - 1);

export const mapeamentoColunas = z.object({
  /** Linha do cabeçalho (1 = primeira); os dados começam na seguinte. 0 = sem cabeçalho. */
  linhaCabecalho: z.int().min(0).max(100),
  /** Abas lidas. As demais são ignoradas e aparecem na prévia. */
  abas: z.array(z.string().max(100)).min(1, "Escolha ao menos uma aba."),
  colunas: z.object({
    /** Sem coluna de bloco, o bloco é o nome da aba. */
    bloco: coluna.nullable(),
    unidade: coluna,
    status: coluna.nullable(),
    comprador1: coluna,
    documento1: coluna,
    comprador2: coluna.nullable(),
    documento2: coluna.nullable(),
  }),
});

export type MapeamentoColunas = z.infer<typeof mapeamentoColunas>;

export const opcaoImportacao = z.discriminatedUnion("modelo", [
  z.object({ modelo: z.literal("controle_vendas") }),
  z.object({ modelo: z.literal("manual"), mapeamento: mapeamentoColunas }),
]);

export type OpcaoImportacao = z.infer<typeof opcaoImportacao>;

/**
 * Planilha "Controle de Vendas": uma aba por bloco, cabeçalho na linha 6 e
 * colunas pela posição (há dois cabeçalhos "CPF"): A unidade, B status,
 * E comprador, F CPF/CNPJ, H cônjuge, I CPF do cônjuge.
 */
export function mapeamentoControleVendas(
  planilha: Planilha,
): MapeamentoColunas {
  return {
    linhaCabecalho: 6,
    abas: planilha.abas
      .filter((a) => !a.oculta && /^bloco\s*\d+$/i.test(a.nome))
      .map((a) => a.nome),
    colunas: {
      bloco: null,
      unidade: 0,
      status: 1,
      comprador1: 4,
      documento1: 5,
      comprador2: 7,
      documento2: 8,
    },
  };
}

// --- Prévia ------------------------------------------------------------------

export type CompradorImportado = { nome: string; documento: string | null };

export type ApartamentoImportado = {
  bloco: string;
  numero: string;
  rotulo: string;
  status: string | null;
  compradores: CompradorImportado[];
  soMesa: boolean;
  /** Onde está na planilha: `Bloco 01, linha 12`. */
  origem: string;
  avisos: string[];
};

export type LinhaIgnorada = { origem: string; motivo: string };

export type Previa = {
  apartamentos: ApartamentoImportado[];
  /** Linhas que não são apartamento (Box Extra) e ficam de fora. */
  ignorados: LinhaIgnorada[];
  /** Linhas com problema que impede a importação delas. */
  erros: LinhaIgnorada[];
  abasIgnoradas: string[];
  resumo: {
    apartamentos: number;
    porCpf: number;
    porCnpj: number;
    soMesa: number;
    comAviso: number;
    /** Documentos que aparecem em mais de um apartamento. */
    documentosEmVariosAptos: number;
  };
};

/** Linha que não vira apartamento: box (ignorada) ou com erro. */
type Descartada = LinhaIgnorada & { box: boolean };

const CESSAO = /^(.*?)\s*-\s*cess[ãa]o\b\s*(.*)$/i;

/** Documento como veio; inválido vira null com aviso (entra "só pela mesa"). */
function lerDocumento(
  texto: string,
  quem: string,
  avisos: string[],
): string | null {
  if (!texto) return null;
  const doc = validarDocumento(texto);
  if (doc) return doc.documento;
  const tamanho = normalizarDocumento(texto).length;
  const motivo =
    tamanho === 11 || tamanho === 14
      ? "dígito verificador errado"
      : `${tamanho} caracteres`;
  avisos.push(`Documento ${quem} inválido (${motivo}): entra sem documento.`);
  return null;
}

function lerApartamento(
  celulas: string[],
  m: MapeamentoColunas,
  blocoDaAba: string,
  origem: string,
): ApartamentoImportado | Descartada | null {
  const cel = (c: number | null) => (c === null ? "" : (celulas[c] ?? ""));
  const unidade = cel(m.colunas.unidade);
  const nome1 = cel(m.colunas.comprador1);
  const doc1 = cel(m.colunas.documento1);
  if (!unidade) {
    if (!nome1 && !doc1) return null; // linha vazia
    return { origem, motivo: "Linha sem unidade.", box: false };
  }
  if (/^box\b/i.test(unidade)) {
    return {
      origem,
      motivo: `${unidade}: box não é apartamento e não vota.`,
      box: true,
    };
  }
  const numero = /\d+/.exec(unidade)?.[0];
  if (!numero) {
    return { origem, motivo: `${unidade}: unidade sem número.`, box: false };
  }
  const bloco = m.colunas.bloco === null ? blocoDaAba : cel(m.colunas.bloco);
  if (!bloco) {
    return { origem, motivo: `${unidade}: linha sem bloco.`, box: false };
  }

  const avisos: string[] = [];
  const compradores: CompradorImportado[] = [];

  let nomeComprador = nome1;
  const cessao = CESSAO.exec(nome1);
  if (cessao) {
    nomeComprador = cessao[2] || cessao[1];
    avisos.push(
      "Unidade em cessão: confira se o CPF e o cônjuge já são do novo " +
        "comprador. Cônjuge do comprador antigo não pode continuar cadastrado.",
    );
  }
  const documento1 = lerDocumento(doc1, "do comprador", avisos);
  if (nomeComprador || documento1) {
    if (!nomeComprador) avisos.push("Comprador sem nome.");
    compradores.push({
      nome: nomeComprador || "Comprador sem nome",
      documento: documento1,
    });
  }

  const nome2 = cel(m.colunas.comprador2);
  const documento2 = lerDocumento(
    cel(m.colunas.documento2),
    "do cônjuge",
    avisos,
  );
  if (nome2 || documento2) {
    if (!nome2) avisos.push("Cônjuge sem nome.");
    compradores.push({
      nome: nome2 || "Cônjuge sem nome",
      documento: documento2,
    });
  }

  if (compradores.length === 0) avisos.push("Unidade sem comprador.");
  // Este aviso fica por último: o resumo conta à parte quem só tem ele.
  const soMesa = !compradores.some((c) => c.documento);
  if (soMesa) avisos.push("Sem documento válido: só vota pela mesa.");

  const status = cel(m.colunas.status).toUpperCase() || null;
  return {
    bloco,
    numero,
    rotulo: unidade,
    status,
    compradores,
    soMesa,
    origem,
    avisos,
  };
}

/** Monta a prévia: o que entra, o que fica de fora e por quê. Não grava nada. */
export function analisarPlanilha(
  planilha: Planilha,
  opcao: OpcaoImportacao,
): Previa {
  const m =
    opcao.modelo === "controle_vendas"
      ? mapeamentoControleVendas(planilha)
      : opcao.mapeamento;
  const lidas = planilha.abas.filter((a) => m.abas.includes(a.nome));
  if (lidas.length === 0) {
    throw new EntradaInvalida(
      opcao.modelo === "controle_vendas"
        ? 'Nenhuma aba "Bloco 01", "Bloco 02"... no arquivo. Use o mapeamento manual.'
        : "Nenhuma das abas escolhidas está no arquivo.",
    );
  }

  const apartamentos: ApartamentoImportado[] = [];
  const ignorados: LinhaIgnorada[] = [];
  const erros: LinhaIgnorada[] = [];
  const vistos = new Map<string, string>();

  for (const aba of lidas) {
    for (let i = m.linhaCabecalho; i < aba.linhas.length; i++) {
      const origem = `${aba.nome}, linha ${i + 1}`;
      const lido = lerApartamento(aba.linhas[i], m, aba.nome, origem);
      if (!lido) continue;
      if (!("numero" in lido)) {
        const { box, ...linha } = lido;
        (box ? ignorados : erros).push(linha);
        continue;
      }
      const chave = `${lido.bloco}/${lido.numero}`;
      const anterior = vistos.get(chave);
      if (anterior) {
        erros.push({
          origem,
          motivo: `${lido.bloco}, ${lido.rotulo} repetido (já está em ${anterior}).`,
        });
        continue;
      }
      vistos.set(chave, origem);
      apartamentos.push(lido);
    }
  }

  const aptosPorDocumento = new Map<string, number>();
  for (const a of apartamentos) {
    for (const d of new Set(a.compradores.map((c) => c.documento))) {
      if (d) aptosPorDocumento.set(d, (aptosPorDocumento.get(d) ?? 0) + 1);
    }
  }
  const temCnpj = (a: ApartamentoImportado) =>
    a.compradores.some((c) => c.documento?.length === 14);
  const votam = apartamentos.filter((a) => !a.soMesa);

  return {
    apartamentos,
    ignorados,
    erros,
    abasIgnoradas: planilha.abas
      .filter((a) => !m.abas.includes(a.nome))
      .map((a) => a.nome),
    resumo: {
      apartamentos: apartamentos.length,
      porCnpj: votam.filter(temCnpj).length,
      porCpf: votam.filter((a) => !temCnpj(a)).length,
      soMesa: apartamentos.length - votam.length,
      comAviso: apartamentos.filter((a) => a.avisos.length > (a.soMesa ? 1 : 0))
        .length,
      documentosEmVariosAptos: [...aptosPorDocumento.values()].filter(
        (n) => n > 1,
      ).length,
    },
  };
}

// --- Comparar e gravar -------------------------------------------------------

const chaveApto = (a: { bloco: string; numero: string }) =>
  `${a.bloco}/${a.numero}`;

export type Comparacao = {
  novos: number;
  atualizados: number;
  /** No cadastro e fora da planilha: ficam como estão. */
  foraDaPlanilha: { bloco: string; rotulo: string }[];
};

type ApartamentoAtual = {
  id: number;
  bloco: string;
  numero: string;
  rotulo: string;
};

const apartamentosAtuais = (ex: Executor, empreendimentoId: number) =>
  ex
    .select({
      id: apartamento.id,
      bloco: apartamento.bloco,
      numero: apartamento.numero,
      rotulo: apartamento.rotulo,
    })
    .from(apartamento)
    .where(eq(apartamento.empreendimentoId, empreendimentoId))
    .orderBy(...ordemApartamento);

function comparar(atuais: ApartamentoAtual[], previa: Previa): Comparacao {
  const naPlanilha = new Set(previa.apartamentos.map(chaveApto));
  const noCadastro = new Set(atuais.map(chaveApto));
  const atualizados = previa.apartamentos.filter((a) =>
    noCadastro.has(chaveApto(a)),
  ).length;
  return {
    novos: previa.apartamentos.length - atualizados,
    atualizados,
    foraDaPlanilha: atuais
      .filter((a) => !naPlanilha.has(chaveApto(a)))
      .map(({ bloco, rotulo }) => ({ bloco, rotulo })),
  };
}

/** O que a importação muda no cadastro atual do empreendimento. */
export async function compararComCadastro(
  empreendimentoId: number,
  previa: Previa,
): Promise<Comparacao> {
  return comparar(await apartamentosAtuais(db, empreendimentoId), previa);
}

/** Grava a prévia: cria apartamentos novos e atualiza os que já existem. */
export async function gravarImportacao(entrada: {
  empreendimentoId: number;
  usuarioId: number;
  previa: Previa;
  arquivo: string;
}): Promise<Comparacao> {
  const empreendimentoId = validar(idBanco, entrada.empreendimentoId);
  const { previa } = entrada;
  if (previa.apartamentos.length === 0) {
    throw new EntradaInvalida("A planilha não tem apartamentos para importar.");
  }

  return db.transaction(async (tx) => {
    // Trava as eleições do empreendimento: ninguém abre votação no meio.
    const eleicoes = await tx
      .select({ status: eleicao.status })
      .from(eleicao)
      .where(eq(eleicao.empreendimentoId, empreendimentoId))
      .for("update");
    if (eleicoes.some((e) => e.status === "aberta")) {
      throw new EntradaInvalida(
        "Há votação aberta neste empreendimento. Encerre antes de importar.",
      );
    }

    const atuais = await apartamentosAtuais(tx, empreendimentoId);
    const comparacao = comparar(atuais, previa);
    const idPorChave = new Map(atuais.map((a) => [chaveApto(a), a.id]));

    // Rótulos que mudaram, num UPDATE só.
    const rotuloAtual = new Map(atuais.map((a) => [chaveApto(a), a.rotulo]));
    const rotulos = previa.apartamentos.filter((a) => {
      const atual = rotuloAtual.get(chaveApto(a));
      return atual !== undefined && atual !== a.rotulo;
    });
    if (rotulos.length > 0) {
      await tx.execute(sql`
        update ${apartamento} as a set rotulo = v.rotulo
        from (values ${sql.join(
          rotulos.map(
            (r) =>
              sql`(${idPorChave.get(chaveApto(r))}::int, ${r.rotulo}::text)`,
          ),
          sql`, `,
        )}) as v(id, rotulo)
        where a.id = v.id`);
    }

    const novos = previa.apartamentos.filter(
      (a) => !idPorChave.has(chaveApto(a)),
    );
    if (novos.length > 0) {
      const inseridos = await tx
        .insert(apartamento)
        .values(
          novos.map(({ bloco, numero, rotulo }) => ({
            empreendimentoId,
            bloco,
            numero,
            rotulo,
          })),
        )
        .returning({
          id: apartamento.id,
          bloco: apartamento.bloco,
          numero: apartamento.numero,
        });
      for (const a of inseridos) idPorChave.set(chaveApto(a), a.id);
    }

    // Cada comprador da planilha atualiza o do cadastro com o mesmo documento
    // ou, sem documento igual, com o mesmo nome. Nunca pela posição: a linha
    // de quem já votou não pode virar outra pessoa. Quem não casa sai do
    // cadastro, menos quem já votou (removerCompradores recusa).
    const aptoIds = previa.apartamentos.map((a) =>
      idPorChave.get(chaveApto(a))!,
    );
    const existentes = await tx
      .select({
        id: comprador.id,
        apartamentoId: comprador.apartamentoId,
        nome: comprador.nome,
        documento: comprador.documento,
      })
      .from(comprador)
      .where(inArray(comprador.apartamentoId, aptoIds))
      .orderBy(comprador.id);
    const porApto = agrupar(existentes, (c) => c.apartamentoId);

    const atualizar: { id: number; nome: string; documento: string | null }[] =
      [];
    const inserir: (CompradorImportado & { apartamentoId: number })[] = [];
    const remover: number[] = [];
    previa.apartamentos.forEach((a, i) => {
      const apartamentoId = aptoIds[i];
      const livres = [...(porApto.get(apartamentoId) ?? [])];
      const tirar = (achar: (v: (typeof livres)[number]) => boolean) => {
        const k = livres.findIndex(achar);
        return k < 0 ? undefined : livres.splice(k, 1)[0];
      };
      // Primeiro todos os pares por documento, depois por nome.
      const pares = a.compradores.map((c) =>
        c.documento ? tirar((v) => v.documento === c.documento) : undefined,
      );
      a.compradores.forEach((c, j) => {
        const velho = pares[j] ?? tirar((v) => v.nome === c.nome);
        if (!velho) inserir.push({ apartamentoId, ...c });
        else if (velho.nome !== c.nome || velho.documento !== c.documento) {
          atualizar.push({ id: velho.id, ...c });
        }
      });
      remover.push(...livres.map((c) => c.id));
    });

    if (atualizar.length > 0) {
      await tx.execute(sql`
        update ${comprador} as c set nome = v.nome, documento = v.documento
        from (values ${sql.join(
          atualizar.map(
            (c) =>
              sql`(${c.id}::int, ${c.nome}::text, ${c.documento}::varchar)`,
          ),
          sql`, `,
        )}) as v(id, nome, documento)
        where c.id = v.id`);
    }
    if (inserir.length > 0) await tx.insert(comprador).values(inserir);
    if (remover.length > 0) {
      await removerCompradores(tx, remover);
    }

    await registrarAuditoria(
      {
        usuarioId: entrada.usuarioId,
        acao: "importacao.confirmar",
        alvo: `empreendimento:${empreendimentoId}`,
        dados: {
          arquivo: entrada.arquivo.slice(0, 200),
          novos: comparacao.novos,
          atualizados: comparacao.atualizados,
          compradoresRemovidos: remover.length,
          ...previa.resumo,
        },
      },
      tx,
    );
    return comparacao;
  });
}

/**
 * Apaga compradores; quem já votou não sai (o voto aponta para ele). Trava as
 * linhas antes de conferir: um voto em andamento termina antes e é visto.
 */
export async function removerCompradores(
  tx: Transacao,
  ids: number[],
): Promise<void> {
  await tx
    .select({ id: comprador.id })
    .from(comprador)
    .where(inArray(comprador.id, ids))
    .for("update");
  const comVoto = await tx
    .selectDistinct({ bloco: apartamento.bloco, rotulo: apartamento.rotulo })
    .from(voto)
    .innerJoin(comprador, eq(comprador.id, voto.compradorId))
    .innerJoin(apartamento, eq(apartamento.id, comprador.apartamentoId))
    .where(inArray(voto.compradorId, ids));
  if (comVoto.length > 0) {
    const aptos = comVoto.map((r) => `${r.bloco}, ${r.rotulo}`).join("; ");
    throw new EntradaInvalida(
      `Comprador que já votou não pode sair do cadastro (${aptos}).`,
    );
  }
  await tx.delete(comprador).where(inArray(comprador.id, ids));
}
