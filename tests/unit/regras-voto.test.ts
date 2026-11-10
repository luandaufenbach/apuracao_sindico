import { and, eq } from "drizzle-orm";
import { afterAll, describe, expect, it } from "vitest";

import { db } from "@/db";
import { eleicao, logAuditoria, situacaoApartamento, voto } from "@/db/schema";
import { registrarAuditoria } from "@/lib/auditoria";
import { AcessoNegado, EntradaInvalida, violacaoUnica } from "@/lib/erros";
import {
  anularVoto,
  desbloquearApartamento,
  gerarComprovante,
  moverVoto,
  verificarDocumento,
  votar,
  votarPelaMesa,
} from "@/lib/regras-voto";

import { type Cenario, criarCenario, limparCenarios } from "./cenario";

afterAll(limparCenarios);

const votosValidos = (c: Cenario, apartamentoId: number) =>
  db
    .select()
    .from(voto)
    .where(
      and(
        eq(voto.eleicaoId, c.eleicaoId),
        eq(voto.apartamentoId, apartamentoId),
        eq(voto.status, "valido"),
      ),
    );

const situacao = async (c: Cenario, apartamentoId: number) =>
  (
    await db
      .select()
      .from(situacaoApartamento)
      .where(
        and(
          eq(situacaoApartamento.eleicaoId, c.eleicaoId),
          eq(situacaoApartamento.apartamentoId, apartamentoId),
        ),
      )
  )[0];

const logs = (c: Cenario, acao: string) =>
  db
    .select()
    .from(logAuditoria)
    .where(
      and(eq(logAuditoria.eleicaoId, c.eleicaoId), eq(logAuditoria.acao, acao)),
    );

const votar101 = (c: Cenario, candidato = 0) =>
  votar({
    eleicaoId: c.eleicaoId,
    apartamentoId: c.apto.a101,
    compradorId: c.comprador.c101,
    candidatoId: c.candidatos[candidato],
  });

async function votoNo101(c: Cenario): Promise<number> {
  const r = await votar101(c);
  if (!r.ok) throw new Error(`voto não gravou: ${r.erro}`);
  return r.votoId;
}

describe("R1: um voto válido por apartamento", () => {
  it("o índice um_voto_por_apto barra o segundo voto válido direto no banco", async () => {
    const c = await criarCenario();
    const linha = {
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a101,
      candidatoId: c.candidatos[0],
      documento: c.doc.a101,
      nome: "Comprador 101",
      origem: "documento" as const,
    };
    await db.insert(voto).values({ ...linha, comprovante: gerarComprovante() });
    const erro = await db
      .insert(voto)
      .values({ ...linha, comprovante: gerarComprovante() })
      .catch((e: unknown) => e);
    expect(violacaoUnica(erro)).toBe("um_voto_por_apto");
    // Voto anulado não conta para o índice.
    await db
      .insert(voto)
      .values({ ...linha, comprovante: gerarComprovante(), status: "anulado" });
    expect(await votosValidos(c, c.apto.a101)).toHaveLength(1);
  });

  it("segundo voto no mesmo apartamento vira ja_votou", async () => {
    const c = await criarCenario();
    const primeiro = await votar101(c);
    expect(primeiro).toMatchObject({ ok: true, proximos: [] });
    if (primeiro.ok)
      expect(primeiro.comprovante).toMatch(/^[2-9A-HJ-NP-Z]{6}$/);
    expect(await votar101(c, 1)).toEqual({ ok: false, erro: "ja_votou" });
    const [v] = await votosValidos(c, c.apto.a101);
    expect(v.candidatoId).toBe(c.candidatos[0]);
  });

  it("dois votos simultâneos no mesmo apartamento: só um grava", async () => {
    const c = await criarCenario();
    const resultados = await Promise.all([votar101(c, 0), votar101(c, 1)]);
    expect(resultados.filter((r) => r.ok)).toHaveLength(1);
    expect(resultados.filter((r) => !r.ok)).toEqual([
      { ok: false, erro: "ja_votou" },
    ]);
    expect(await votosValidos(c, c.apto.a101)).toHaveLength(1);
  });

  it("dez votos simultâneos no mesmo apartamento: só um grava", async () => {
    const c = await criarCenario();
    const resultados = await Promise.all(
      Array.from({ length: 10 }, (_, i) => votar101(c, i % 2)),
    );
    expect(resultados.filter((r) => r.ok)).toHaveLength(1);
    expect(await votosValidos(c, c.apto.a101)).toHaveLength(1);
  });

  it("quem tem vários apartamentos vota uma vez por apartamento", async () => {
    const c = await criarCenario();
    const r201 = await votar({
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a201,
      compradorId: c.comprador.c201,
      candidatoId: c.candidatos[0],
    });
    expect(r201).toMatchObject({
      ok: true,
      proximos: [{ apartamentoId: c.apto.a202, compradorId: c.comprador.c202 }],
    });
    const r202 = await votar({
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a202,
      compradorId: c.comprador.c202,
      candidatoId: c.candidatos[1],
    });
    expect(r202).toMatchObject({ ok: true, proximos: [] });
    expect(await votosValidos(c, c.apto.a201)).toHaveLength(1);
    expect(await votosValidos(c, c.apto.a202)).toHaveLength(1);
  });
});

describe("R2: só aceita voto com a eleição aberta", () => {
  it.each(["rascunho", "encerrada", "publicada"] as const)(
    "eleição %s recusa verificar e votar",
    async (status) => {
      const c = await criarCenario(status);
      expect(
        await verificarDocumento({
          eleicaoId: c.eleicaoId,
          apartamentoId: c.apto.a101,
          documento: c.doc.a101,
        }),
      ).toEqual({ ok: false, erro: "eleicao_fechada" });
      expect(await votar101(c)).toEqual({ ok: false, erro: "eleicao_fechada" });
      expect(await votosValidos(c, c.apto.a101)).toHaveLength(0);
    },
  );

  it("confere o status na hora de gravar, não na verificação", async () => {
    const c = await criarCenario();
    const v = await verificarDocumento({
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a101,
      documento: c.doc.a101,
    });
    expect(v.ok).toBe(true);
    await db
      .update(eleicao)
      .set({ status: "encerrada" })
      .where(eq(eleicao.id, c.eleicaoId));
    expect(await votar101(c)).toEqual({ ok: false, erro: "eleicao_fechada" });
    expect(await votosValidos(c, c.apto.a101)).toHaveLength(0);
  });
});

describe("R3: documento de um comprador do apartamento", () => {
  it("compara só letras e dígitos", async () => {
    const c = await criarCenario();
    const formatado = `${c.doc.a101.slice(0, 3)}.${c.doc.a101.slice(3, 6)}.${c.doc.a101.slice(6, 9)}-${c.doc.a101.slice(9)}`;
    expect(
      await verificarDocumento({
        eleicaoId: c.eleicaoId,
        apartamentoId: c.apto.a101,
        documento: formatado,
      }),
    ).toEqual({ ok: true, compradorId: c.comprador.c101 });
  });

  it("aceita qualquer um dos compradores e devolve o comprador certo", async () => {
    const c = await criarCenario();
    expect(
      await verificarDocumento({
        eleicaoId: c.eleicaoId,
        apartamentoId: c.apto.a102,
        documento: c.doc.a102c2,
      }),
    ).toEqual({ ok: true, compradorId: c.comprador.c102b });
  });

  it("aceita CNPJ alfanumérico com pontuação e minúsculas", async () => {
    const c = await criarCenario();
    expect(
      await verificarDocumento({
        eleicaoId: c.eleicaoId,
        apartamentoId: c.apto.a301,
        documento: "12.abc.345/01de-35",
      }),
    ).toEqual({ ok: true, compradorId: c.comprador.c301 });
  });

  it("documento válido de fora do empreendimento não confere", async () => {
    const c = await criarCenario();
    expect(
      await verificarDocumento({
        eleicaoId: c.eleicaoId,
        apartamentoId: c.apto.a101,
        documento: c.doc.estranho,
      }),
    ).toEqual({ ok: false, erro: "nao_confere", tentativasRestantes: 2 });
  });

  it("votar recusa comprador de outro apartamento", async () => {
    const c = await criarCenario();
    await expect(
      votar({
        eleicaoId: c.eleicaoId,
        apartamentoId: c.apto.a101,
        compradorId: c.comprador.c102a,
        candidatoId: c.candidatos[0],
      }),
    ).rejects.toBeInstanceOf(EntradaInvalida);
  });

  it("apartamento de outro empreendimento é entrada inválida", async () => {
    const c = await criarCenario();
    const outro = await criarCenario();
    await expect(
      verificarDocumento({
        eleicaoId: c.eleicaoId,
        apartamentoId: outro.apto.a101,
        documento: c.doc.a101,
      }),
    ).rejects.toBeInstanceOf(EntradaInvalida);
  });
});

describe("R4: dígito verificador inválido não conta tentativa", () => {
  it("cinco documentos inválidos não bloqueiam", async () => {
    const c = await criarCenario();
    const invalidos = [
      "111.444.777-36",
      "11144477",
      "123456789012",
      "",
      "ABCDEFGHIJK",
    ];
    for (const documento of invalidos) {
      expect(
        await verificarDocumento({
          eleicaoId: c.eleicaoId,
          apartamentoId: c.apto.a101,
          documento,
        }),
      ).toEqual({ ok: false, erro: "documento_invalido" });
    }
    expect(await situacao(c, c.apto.a101)).toBeUndefined();
  });
});

describe("R5: três documentos que não conferem bloqueiam", () => {
  it("bloqueia na 3ª falha até o operador desbloquear", async () => {
    const c = await criarCenario();
    const tentar = (documento: string) =>
      verificarDocumento({
        eleicaoId: c.eleicaoId,
        apartamentoId: c.apto.a101,
        documento,
      });

    expect(await tentar(c.doc.estranho)).toMatchObject({
      tentativasRestantes: 2,
    });
    expect(await tentar(c.doc.estranho)).toMatchObject({
      tentativasRestantes: 1,
    });
    expect(await tentar(c.doc.estranho)).toEqual({
      ok: false,
      erro: "bloqueado",
    });
    // Bloqueado, nem o documento certo passa.
    expect(await tentar(c.doc.a101)).toEqual({ ok: false, erro: "bloqueado" });
    expect(await situacao(c, c.apto.a101)).toMatchObject({
      tentativasFalhas: 3,
      bloqueado: true,
    });

    await desbloquearApartamento({
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a101,
      usuarioId: c.operadorId,
    });
    expect(await situacao(c, c.apto.a101)).toMatchObject({
      tentativasFalhas: 0,
      bloqueado: false,
    });
    expect(await tentar(c.doc.a101)).toEqual({
      ok: true,
      compradorId: c.comprador.c101,
    });
  });

  it("falhas simultâneas sobem o contador sem perder nenhuma e param em 3", async () => {
    const c = await criarCenario();
    const resultados = await Promise.all(
      Array.from({ length: 6 }, () =>
        verificarDocumento({
          eleicaoId: c.eleicaoId,
          apartamentoId: c.apto.a101,
          documento: c.doc.estranho,
        }),
      ),
    );
    const restantes = resultados
      .filter((r) => !r.ok && r.erro === "nao_confere")
      .map((r) => (r as { tentativasRestantes: number }).tentativasRestantes)
      .sort();
    expect(restantes).toEqual([1, 2]);
    const s = await situacao(c, c.apto.a101);
    expect(s.bloqueado).toBe(true);
    // Falha que chega com o apartamento já bloqueado não conta.
    expect(s.tentativasFalhas).toBe(3);
    expect(
      resultados.filter((r) => !r.ok && r.erro === "bloqueado"),
    ).toHaveLength(4);
  });

  it("só operador ou god ativo desbloqueia", async () => {
    const c = await criarCenario();
    await expect(
      desbloquearApartamento({
        eleicaoId: c.eleicaoId,
        apartamentoId: c.apto.a101,
        usuarioId: c.godInativoId,
      }),
    ).rejects.toBeInstanceOf(AcessoNegado);
  });

  it("apartamento bloqueado não vota nem aparece nos próximos", async () => {
    const c = await criarCenario();
    for (let i = 0; i < 3; i++) {
      await verificarDocumento({
        eleicaoId: c.eleicaoId,
        apartamentoId: c.apto.a202,
        documento: c.doc.estranho,
      });
    }
    const r201 = await votar({
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a201,
      compradorId: c.comprador.c201,
      candidatoId: c.candidatos[0],
    });
    expect(r201).toMatchObject({ ok: true, proximos: [] });
    expect(
      await votar({
        eleicaoId: c.eleicaoId,
        apartamentoId: c.apto.a202,
        compradorId: c.comprador.c202,
        candidatoId: c.candidatos[0],
      }),
    ).toEqual({ ok: false, erro: "bloqueado" });
    expect(await votosValidos(c, c.apto.a202)).toHaveLength(0);
  });
});

describe("R6: documento de outro apartamento sugere o certo", () => {
  it("lista todos os apartamentos do documento e não conta tentativa", async () => {
    const c = await criarCenario();
    const r = await verificarDocumento({
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a101,
      documento: c.doc.multi,
    });
    expect(r).toEqual({
      ok: false,
      erro: "outro_apto",
      sugestoes: [
        {
          apartamentoId: c.apto.a201,
          bloco: "Bloco 01",
          rotulo: "Ap 201",
          votouEm: null,
        },
        {
          apartamentoId: c.apto.a202,
          bloco: "Bloco 01",
          rotulo: "Ap 202",
          votouEm: null,
        },
      ],
    });
    expect(await situacao(c, c.apto.a101)).toBeUndefined();
  });

  it("mostra o horário de quem já votou", async () => {
    const c = await criarCenario();
    await votar({
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a201,
      compradorId: c.comprador.c201,
      candidatoId: c.candidatos[0],
    });
    const r = await verificarDocumento({
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a101,
      documento: c.doc.multi,
    });
    if (r.ok || r.erro !== "outro_apto") throw new Error("esperava outro_apto");
    expect(r.sugestoes[0].votouEm).toBeInstanceOf(Date);
    expect(r.sugestoes[1].votouEm).toBeNull();
  });
});

describe("R7: voto anulado nunca é apagado", () => {
  it("anular mantém o voto e libera o apartamento", async () => {
    const c = await criarCenario();
    const votoId = await votoNo101(c);
    expect(
      await anularVoto({
        votoId,
        usuarioId: c.godId,
        motivo: "Votou pelo apto errado",
      }),
    ).toEqual({ ok: true });
    const [anulado] = await db.select().from(voto).where(eq(voto.id, votoId));
    expect(anulado.status).toBe("anulado");

    expect((await votar101(c, 1)).ok).toBe(true);
    expect(
      await anularVoto({ votoId, usuarioId: c.godId, motivo: "De novo" }),
    ).toEqual({ ok: false, erro: "ja_anulado" });
  });

  it("mover leva o voto para apartamento livre e falha se o destino já votou", async () => {
    const c = await criarCenario();
    const votoId = await votoNo101(c);
    expect(
      await moverVoto({
        votoId,
        apartamentoDestinoId: c.apto.a401,
        usuarioId: c.godId,
        motivo: "Mesa registrou no apto errado",
      }),
    ).toEqual({ ok: true });
    const [movido] = await votosValidos(c, c.apto.a401);
    // O comprador era do 101: sai do voto, que mantém quem votou.
    expect(movido).toMatchObject({ compradorId: null, documento: c.doc.a101 });
    expect(await votosValidos(c, c.apto.a101)).toHaveLength(0);

    const outro = await votoNo101(c);
    expect(
      await moverVoto({
        votoId: outro,
        apartamentoDestinoId: c.apto.a401,
        usuarioId: c.godId,
        motivo: "Teste",
      }),
    ).toEqual({ ok: false, erro: "destino_ja_votou" });
    const [v] = await db.select().from(voto).where(eq(voto.id, outro));
    expect(v).toMatchObject({ apartamentoId: c.apto.a101, status: "valido" });
  });
});

describe("R8: toda ação de operador ou god grava log", () => {
  it("anular, mover e desbloquear gravam usuário, alvo e motivo", async () => {
    const c = await criarCenario();
    const votoId = await votoNo101(c);
    await moverVoto({
      votoId,
      apartamentoDestinoId: c.apto.a102,
      usuarioId: c.godId,
      motivo: "Apto trocado",
    });
    await anularVoto({ votoId, usuarioId: c.godId, motivo: "Voto duplicado" });
    await desbloquearApartamento({
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a101,
      usuarioId: c.operadorId,
    });

    expect(await logs(c, "voto.mover")).toMatchObject([
      {
        usuarioId: c.godId,
        alvo: `voto:${votoId}`,
        motivo: "Apto trocado",
        dados: { de: c.apto.a101, para: c.apto.a102 },
      },
    ]);
    expect(await logs(c, "voto.anular")).toMatchObject([
      { usuarioId: c.godId, alvo: `voto:${votoId}`, motivo: "Voto duplicado" },
    ]);
    expect(await logs(c, "apto.desbloquear")).toMatchObject([
      { usuarioId: c.operadorId, alvo: `apartamento:${c.apto.a101}` },
    ]);
  });

  it("falha de documento grava log sem usuário (eleitor)", async () => {
    const c = await criarCenario();
    await verificarDocumento({
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a101,
      documento: c.doc.estranho,
    });
    expect(await logs(c, "documento.falha")).toMatchObject([
      { usuarioId: null, dados: { tentativas: 1, bloqueado: false } },
    ]);
  });

  it("ação de godmode sem motivo é recusada e não muda nada", async () => {
    const c = await criarCenario();
    const votoId = await votoNo101(c);
    await expect(
      anularVoto({ votoId, usuarioId: c.godId, motivo: "   " }),
    ).rejects.toBeInstanceOf(EntradaInvalida);
    await expect(
      registrarAuditoria({
        eleicaoId: c.eleicaoId,
        usuarioId: c.godId,
        acao: "eleicao.reabrir",
      }),
    ).rejects.toBeInstanceOf(EntradaInvalida);
    expect(await votosValidos(c, c.apto.a101)).toHaveLength(1);
    expect(await logs(c, "voto.anular")).toHaveLength(0);
  });

  it("operador não executa ação de godmode", async () => {
    const c = await criarCenario();
    const votoId = await votoNo101(c);
    await expect(
      anularVoto({ votoId, usuarioId: c.operadorId, motivo: "Tentativa" }),
    ).rejects.toBeInstanceOf(AcessoNegado);
    await expect(
      moverVoto({
        votoId,
        apartamentoDestinoId: c.apto.a401,
        usuarioId: c.operadorId,
        motivo: "Tentativa",
      }),
    ).rejects.toBeInstanceOf(AcessoNegado);
  });
});

describe("R12: voto pela mesa", () => {
  const mesa = (c: Cenario, apartamentoIds: number[], usuarioId = c.godId) =>
    votarPelaMesa({
      eleicaoId: c.eleicaoId,
      apartamentoIds,
      candidatoId: c.candidatos[0],
      nome: "Dono da permuta",
      documento: c.doc.estranho,
      motivo: "Permuta sem documento",
      usuarioId,
    });

  it("grava um voto por apartamento, com origem mesa e log", async () => {
    const c = await criarCenario();
    const r = await mesa(c, [c.apto.a401, c.apto.a301]);
    expect(r.ok && r.votos).toHaveLength(2);
    const [v] = await votosValidos(c, c.apto.a401);
    expect(v).toMatchObject({
      origem: "mesa",
      compradorId: null,
      nome: "Dono da permuta",
      documento: c.doc.estranho,
    });
    const votoIds = r.ok
      ? r.votos.map((x) => x.votoId).sort((a, b) => a - b)
      : [];
    expect(await logs(c, "voto.mesa")).toMatchObject([
      {
        usuarioId: c.godId,
        motivo: "Permuta sem documento",
        dados: { votoIds },
      },
    ]);
  });

  it("lotes simultâneos com apartamentos em comum: só um grava", async () => {
    const c = await criarCenario();
    const resultados = await Promise.all([
      mesa(c, [c.apto.a301, c.apto.a401]),
      mesa(c, [c.apto.a401, c.apto.a301]),
    ]);
    expect(resultados.filter((r) => r.ok)).toHaveLength(1);
    expect(resultados.filter((r) => !r.ok)).toEqual([
      { ok: false, erro: "ja_votou" },
    ]);
    expect(await votosValidos(c, c.apto.a401)).toHaveLength(1);
  });

  it("se um apartamento já votou, não grava nenhum", async () => {
    const c = await criarCenario();
    await votoNo101(c);
    expect(await mesa(c, [c.apto.a401, c.apto.a101])).toEqual({
      ok: false,
      erro: "ja_votou",
    });
    expect(await votosValidos(c, c.apto.a401)).toHaveLength(0);
  });

  it("só god vota pela mesa", async () => {
    const c = await criarCenario();
    await expect(mesa(c, [c.apto.a401], c.operadorId)).rejects.toBeInstanceOf(
      AcessoNegado,
    );
  });
});

describe("ids fora do INT do PostgreSQL", () => {
  it("id maior que 2147483647 é entrada inválida, não erro do banco", async () => {
    const c = await criarCenario();
    const gigante = 2_147_483_648;
    await expect(
      desbloquearApartamento({
        eleicaoId: c.eleicaoId,
        apartamentoId: gigante,
        usuarioId: c.operadorId,
      }),
    ).rejects.toBeInstanceOf(EntradaInvalida);
    await expect(
      anularVoto({ votoId: gigante, usuarioId: c.godId, motivo: "Teste" }),
    ).rejects.toBeInstanceOf(EntradaInvalida);
    await expect(
      registrarAuditoria({ eleicaoId: gigante, acao: "apto.desbloquear" }),
    ).rejects.toBeInstanceOf(EntradaInvalida);
  });

  it("2147483647 ainda é um id aceito", async () => {
    const c = await criarCenario();
    await expect(
      desbloquearApartamento({
        eleicaoId: c.eleicaoId,
        apartamentoId: 2_147_483_647,
        usuarioId: c.operadorId,
      }),
    ).rejects.toThrow("Apartamento não encontrado neste empreendimento.");
  });
});
