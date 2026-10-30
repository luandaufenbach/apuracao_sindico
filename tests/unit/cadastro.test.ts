// Cadastro pelo painel: apartamentos, compradores e candidatos, e a
// reimportação, que nunca troca a pessoa de um comprador que já votou.
import { eq } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";

import { db } from "@/db";
import { comprador, eleicao, voto } from "@/db/schema";
import { removerApartamento, salvarApartamento } from "@/lib/cadastro";
import { removerCandidato } from "@/lib/eleicoes";
import { EntradaInvalida } from "@/lib/erros";
import {
  analisarPlanilha,
  gravarImportacao,
  lerArquivo,
} from "@/lib/importacao";
import { verificarDocumento, votar } from "@/lib/regras-voto";

import { type Cenario, criarCenario, limparCenarios } from "./cenario";

afterAll(limparCenarios);

const compradoresDo = (apartamentoId: number) =>
  db
    .select({
      id: comprador.id,
      nome: comprador.nome,
      documento: comprador.documento,
    })
    .from(comprador)
    .where(eq(comprador.apartamentoId, apartamentoId))
    .orderBy(comprador.id);

async function votarNo102(c: Cenario) {
  const v = await verificarDocumento({
    eleicaoId: c.eleicaoId,
    apartamentoId: c.apto.a102,
    documento: c.doc.a102c1,
  });
  if (!v.ok) throw new Error("verificação falhou");
  await votar({
    eleicaoId: c.eleicaoId,
    apartamentoId: c.apto.a102,
    compradorId: v.compradorId,
    candidatoId: c.candidatos[0],
  });
}

describe("apartamentos e compradores", () => {
  it("cria, edita, recusa duplicado e documento inválido", async () => {
    const c = await criarCenario();
    const base = {
      empreendimentoId: c.empreendimentoId,
      usuarioId: c.operadorId,
    };
    const { id } = await salvarApartamento({
      ...base,
      bloco: "Bloco 09",
      numero: "901",
      rotulo: "Ap 901",
      compradores: [{ nome: "Pessoa Fictícia", documento: "529.982.247-25" }],
    });
    expect(await compradoresDo(id)).toMatchObject([
      { nome: "Pessoa Fictícia", documento: "52998224725" },
    ]);

    await expect(
      salvarApartamento({
        ...base,
        bloco: "Bloco 09",
        numero: "901",
        rotulo: "Ap 901",
        compradores: [],
      }),
    ).rejects.toThrow(/Já existe/);
    await expect(
      salvarApartamento({
        ...base,
        apartamentoId: id,
        bloco: "Bloco 09",
        numero: "901",
        rotulo: "Ap 901",
        compradores: [{ nome: "X", documento: "123.456.789-00" }],
      }),
    ).rejects.toBeInstanceOf(EntradaInvalida);

    // Documento em branco: só pela mesa.
    const [antes] = await compradoresDo(id);
    await salvarApartamento({
      ...base,
      apartamentoId: id,
      bloco: "Bloco 09",
      numero: "901",
      rotulo: "Ap 901",
      compradores: [{ id: antes.id, nome: "Pessoa Fictícia", documento: "" }],
    });
    expect(await compradoresDo(id)).toEqual([
      { id: antes.id, nome: "Pessoa Fictícia", documento: null },
    ]);

    await removerApartamento({ ...base, apartamentoId: id });
    expect(await compradoresDo(id)).toEqual([]);
  });

  it("não tira do cadastro o comprador que já votou nem o apartamento com voto", async () => {
    const c = await criarCenario();
    await votarNo102(c);
    const base = {
      empreendimentoId: c.empreendimentoId,
      apartamentoId: c.apto.a102,
      usuarioId: c.operadorId,
    };
    // Só o cônjuge fica; sairia o comprador que votou.
    await expect(
      salvarApartamento({
        ...base,
        bloco: "Bloco 01",
        numero: "102",
        rotulo: "Ap 102",
        compradores: [
          {
            id: c.comprador.c102b,
            nome: "Cônjuge 102",
            documento: c.doc.a102c2,
          },
        ],
      }),
    ).rejects.toThrow(/já votou/);
    expect(await compradoresDo(c.apto.a102)).toHaveLength(2);
    await expect(removerApartamento(base)).rejects.toThrow(/não pode sair/);
  });

  it("comprador de outro apartamento não entra pela edição", async () => {
    const c = await criarCenario();
    await expect(
      salvarApartamento({
        empreendimentoId: c.empreendimentoId,
        apartamentoId: c.apto.a101,
        usuarioId: c.operadorId,
        bloco: "Bloco 01",
        numero: "101",
        rotulo: "Ap 101",
        compradores: [{ id: c.comprador.c201, nome: "Invasor", documento: "" }],
      }),
    ).rejects.toThrow(/não é deste apartamento/);
  });
});

describe("reimportação", () => {
  it("casa compradores por documento: trocar a ordem não troca a pessoa", async () => {
    const c = await criarCenario("encerrada");
    await db
      .update(eleicao)
      .set({ status: "aberta" })
      .where(eq(eleicao.id, c.eleicaoId));
    await votarNo102(c);
    await db
      .update(eleicao)
      .set({ status: "encerrada" })
      .where(eq(eleicao.id, c.eleicaoId));

    // A planilha traz o cônjuge primeiro e o comprador que votou depois.
    const csv = [
      "Bloco;Ap;Nome 1;Doc 1;Nome 2;Doc 2",
      `Bloco 01;102;Cônjuge 102;${c.doc.a102c2};Comprador 102;${c.doc.a102c1}`,
    ].join("\n");
    const planilha = await lerArquivo("r.csv", new TextEncoder().encode(csv));
    const previa = analisarPlanilha(planilha, {
      modelo: "manual",
      mapeamento: {
        linhaCabecalho: 1,
        abas: ["r"],
        colunas: {
          bloco: 0,
          unidade: 1,
          status: null,
          comprador1: 2,
          documento1: 3,
          comprador2: 4,
          documento2: 5,
        },
      },
    });
    await gravarImportacao({
      empreendimentoId: c.empreendimentoId,
      usuarioId: c.operadorId,
      previa,
      arquivo: "r.csv",
    });

    const [v] = await db
      .select({ compradorId: voto.compradorId })
      .from(voto)
      .where(eq(voto.apartamentoId, c.apto.a102));
    const linhas = await compradoresDo(c.apto.a102);
    expect(linhas.find((l) => l.id === v.compradorId)).toMatchObject({
      nome: "Comprador 102",
      documento: c.doc.a102c1,
    });
    expect(linhas).toHaveLength(2);
  });
});

describe("candidatos", () => {
  it("só sai com a eleição em rascunho", async () => {
    const c = await criarCenario("aberta");
    await expect(
      removerCandidato({
        eleicaoId: c.eleicaoId,
        candidatoId: c.candidatos[1],
        usuarioId: c.operadorId,
      }),
    ).rejects.toThrow(/rascunho/);

    const r = await criarCenario("rascunho");
    await removerCandidato({
      eleicaoId: r.eleicaoId,
      candidatoId: r.candidatos[1],
      usuarioId: r.operadorId,
    });
    await expect(
      removerCandidato({
        eleicaoId: r.eleicaoId,
        candidatoId: r.candidatos[1],
        usuarioId: r.operadorId,
      }),
    ).rejects.toThrow(/não encontrado/);
  });
});
