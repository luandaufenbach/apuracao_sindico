// Importação da planilha fictícia no layout "Controle de Vendas" e de CSV com
// mapeamento manual. A planilha é gerada por código (tests/fixtures).
import { eq } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";

import { db } from "@/db";
import { apartamento, comprador, empreendimento } from "@/db/schema";
import { EntradaInvalida } from "@/lib/erros";
import {
  analisarPlanilha,
  gravarImportacao,
  lerArquivo,
  lerCsv,
  letraColuna,
  type Previa,
} from "@/lib/importacao";

import {
  DOCUMENTOS,
  ESPERADO,
  gerarPlanilhaControleVendas,
} from "../fixtures/planilha-controle-vendas";
import {
  criarCenario,
  limparCenarios,
  registrarEmpreendimento,
} from "./cenario";

afterAll(limparCenarios);

async function previaControleVendas(): Promise<Previa> {
  const planilha = await lerArquivo(
    "controle.xlsx",
    await gerarPlanilhaControleVendas(),
  );
  return analisarPlanilha(planilha, { modelo: "controle_vendas" });
}

const achar = (p: Previa, bloco: string, numero: string) =>
  p.apartamentos.find((a) => a.bloco === bloco && a.numero === numero)!;

describe("modelo Controle de Vendas", () => {
  it("lê as 4 abas de bloco e ignora Folha1 (oculta) e 0 (vazia)", async () => {
    const p = await previaControleVendas();
    expect([...new Set(p.apartamentos.map((a) => a.bloco))]).toEqual(
      ESPERADO.blocos,
    );
    expect(p.abasIgnoradas).toEqual(ESPERADO.abasIgnoradas);
    expect(p.resumo).toMatchObject({
      apartamentos: ESPERADO.apartamentos,
      porCnpj: ESPERADO.porCnpj,
      soMesa: ESPERADO.soMesa,
      porCpf: ESPERADO.apartamentos - ESPERADO.soMesa - ESPERADO.porCnpj,
      documentosEmVariosAptos: ESPERADO.documentosEmVariosAptos,
    });
    expect(p.erros).toEqual([]);
  });

  it("ignora as linhas de Box Extra e lista na prévia", async () => {
    const p = await previaControleVendas();
    expect(p.ignorados).toHaveLength(ESPERADO.boxes);
    expect(p.ignorados[0]).toMatchObject({ origem: "Bloco 01, linha 19" });
    expect(p.apartamentos.some((a) => /box/i.test(a.rotulo))).toBe(false);
  });

  it("mantém o rótulo com PCD e tira o número do primeiro grupo de dígitos", async () => {
    const a = achar(await previaControleVendas(), "Bloco 01", "102");
    expect(a.rotulo).toBe("Ap 102 PCD");
  });

  it("documento vazio, com 10 ou 12 dígitos ou DV errado entra só pela mesa, com aviso", async () => {
    const p = await previaControleVendas();
    for (const numero of ["103", "104", "201"]) {
      expect(achar(p, "Bloco 01", numero)).toMatchObject({ soMesa: true });
    }
    expect(achar(p, "Bloco 01", "202").avisos).toContain(
      "Documento do comprador inválido (10 caracteres): entra sem documento.",
    );
    expect(achar(p, "Bloco 01", "203").avisos).toContain(
      "Documento do comprador inválido (12 caracteres): entra sem documento.",
    );
    const dv = achar(p, "Bloco 01", "204");
    expect(dv.soMesa).toBe(true);
    expect(dv.avisos[0]).toMatch(/dígito verificador errado/);
    expect(dv.compradores[0].documento).toBeNull();
  });

  it("status em minúsculas sai normalizado e não muda nada", async () => {
    const p = await previaControleVendas();
    expect(achar(p, "Bloco 01", "103").status).toBe("PERMUTA");
    expect(achar(p, "Bloco 01", "201").status).toBe("VENDIDO");
  });

  it("CNPJ na coluna de CPF vale como documento da empresa", async () => {
    const a = achar(await previaControleVendas(), "Bloco 01", "301");
    expect(a.compradores).toEqual([
      { nome: "Empresa Fictícia Ltda", documento: DOCUMENTOS.cnpj },
    ]);
    expect(a.soMesa).toBe(false);
  });

  it("cessão usa o nome depois de 'Cessão' e avisa para conferir", async () => {
    const a = achar(await previaControleVendas(), "Bloco 01", "302");
    expect(a.compradores[0].nome).toBe("Comprador Novo Fictício");
    expect(a.avisos[0]).toMatch(/cessão/i);
  });

  it("o mesmo CPF em vários apartamentos é normal", async () => {
    const p = await previaControleVendas();
    const doInvestidor = p.apartamentos.filter((a) =>
      a.compradores.some((c) => c.documento === DOCUMENTOS.investidor),
    );
    expect(doInvestidor.map((a) => a.bloco)).toEqual([
      "Bloco 01",
      "Bloco 02",
      "Bloco 03",
    ]);
  });

  it("nunca importa e-mail, telefone, valor nem corretor", async () => {
    const p = await previaControleVendas();
    const tudo = JSON.stringify(p);
    expect(tudo).not.toMatch(/exemplo\.test|90000|350\.000|Corretor/);
  });

  it("arquivo sem abas de bloco pede o mapeamento manual", async () => {
    const planilha = await lerArquivo(
      "outra.csv",
      new TextEncoder().encode("Unidade;Nome;CPF\nAp 101;Fulano;\n"),
    );
    expect(() =>
      analisarPlanilha(planilha, { modelo: "controle_vendas" }),
    ).toThrow(/mapeamento manual/);
  });
});

describe("CSV e mapeamento manual", () => {
  it("lê CSV com ; , aspas e Windows-1252", async () => {
    expect(lerCsv('a;"b;c";"d ""e"""\r\n1;2;3')).toEqual([
      ["a", "b;c", 'd "e"'],
      ["1", "2", "3"],
    ]);
    expect(lerCsv("x,y\n1,2\n")).toEqual([
      ["x", "y"],
      ["1", "2"],
    ]);
    // "Cônjuge" em Windows-1252: o ô é o byte 0xF4.
    const latin1 = new Uint8Array([
      ...new TextEncoder().encode("C"),
      0xf4,
      ...new TextEncoder().encode("njuge;x"),
    ]);
    const planilha = await lerArquivo("a.csv", latin1);
    expect(planilha.abas[0].linhas[0]).toEqual(["Cônjuge", "x"]);
  });

  it("usa as colunas escolhidas, com bloco de uma coluna", async () => {
    const csv = [
      "Torre;Apto;Proprietário;Documento",
      "Torre A;101;Fulano de Tal;529.982.247-25",
      "Torre A;102;Empresa Fictícia;11.222.333/0001-81",
      "Torre B;101;Sem Documento;",
      ";;;",
    ].join("\n");
    const planilha = await lerArquivo(
      "torres.csv",
      new TextEncoder().encode(csv),
    );
    const p = analisarPlanilha(planilha, {
      modelo: "manual",
      mapeamento: {
        linhaCabecalho: 1,
        abas: ["torres"],
        colunas: {
          bloco: 0,
          unidade: 1,
          status: null,
          comprador1: 2,
          documento1: 3,
          comprador2: null,
          documento2: null,
        },
      },
    });
    expect(p.apartamentos.map((a) => [a.bloco, a.numero, a.soMesa])).toEqual([
      ["Torre A", "101", false],
      ["Torre A", "102", false],
      ["Torre B", "101", true],
    ]);
    expect(p.resumo).toMatchObject({ porCpf: 1, porCnpj: 1, soMesa: 1 });
  });

  it("apartamento repetido vira erro na prévia", async () => {
    const planilha = await lerArquivo(
      "r.csv",
      new TextEncoder().encode("Bloco;Ap;Nome;CPF\nB1;101;A;\nB1;Ap 101;B;\n"),
    );
    const p = analisarPlanilha(planilha, {
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
          comprador2: null,
          documento2: null,
        },
      },
    });
    expect(p.apartamentos).toHaveLength(1);
    expect(p.erros[0].motivo).toMatch(/repetido/);
  });

  it("recusa arquivo que não é .xlsx nem .csv", async () => {
    await expect(
      lerArquivo("planilha.pdf", new Uint8Array([1, 2, 3])),
    ).rejects.toBeInstanceOf(EntradaInvalida);
  });

  it("letraColuna", () => {
    expect([0, 5, 25, 26, 27].map(letraColuna)).toEqual([
      "A",
      "F",
      "Z",
      "AA",
      "AB",
    ]);
  });
});

describe("gravar a importação", () => {
  it("cria os 48 apartamentos e reimportar atualiza sem duplicar", async () => {
    const c = await criarCenario();
    const [emp] = await db
      .insert(empreendimento)
      .values({ nome: "Importação de teste" })
      .returning({ id: empreendimento.id });
    registrarEmpreendimento(emp.id);
    const previa = await previaControleVendas();

    const primeira = await gravarImportacao({
      empreendimentoId: emp.id,
      usuarioId: c.operadorId,
      previa,
      arquivo: "controle.xlsx",
    });
    expect(primeira).toMatchObject({ novos: 48, atualizados: 0 });

    const segunda = await gravarImportacao({
      empreendimentoId: emp.id,
      usuarioId: c.operadorId,
      previa,
      arquivo: "controle.xlsx",
    });
    expect(segunda).toMatchObject({ novos: 0, atualizados: 48 });

    const aptos = await db
      .select({ id: apartamento.id, rotulo: apartamento.rotulo })
      .from(apartamento)
      .where(eq(apartamento.empreendimentoId, emp.id));
    expect(aptos).toHaveLength(48);
    const compradores = await db
      .select({ documento: comprador.documento })
      .from(comprador)
      .innerJoin(apartamento, eq(apartamento.id, comprador.apartamentoId))
      .where(eq(apartamento.empreendimentoId, emp.id));
    expect(compradores).toHaveLength(
      previa.apartamentos.reduce((n, a) => n + a.compradores.length, 0),
    );
  });

  it("recusa importar com votação aberta no empreendimento", async () => {
    const c = await criarCenario("aberta");
    await expect(
      gravarImportacao({
        empreendimentoId: c.empreendimentoId,
        usuarioId: c.operadorId,
        previa: await previaControleVendas(),
        arquivo: "controle.xlsx",
      }),
    ).rejects.toThrow(/votação aberta/);
  });
});
