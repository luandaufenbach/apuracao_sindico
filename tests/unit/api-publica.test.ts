// Testes de integração da API pública: chamam os handlers das rotas contra o
// banco de dev, cada um num cenário próprio (ver cenario.ts).
import { eq } from "drizzle-orm";
import { decodeJwt } from "jose";
import { afterAll, describe, expect, it } from "vitest";

import { GET as getEleicao } from "@/app/api/e/[codigo]/route";
import { GET as getApartamentos } from "@/app/api/e/[codigo]/apartamentos/route";
import { GET as getDica } from "@/app/api/e/[codigo]/apartamentos/[id]/dica/route";
import { GET as getTelao } from "@/app/api/e/[codigo]/telao/route";
import { POST as postVerificar } from "@/app/api/e/[codigo]/verificar/route";
import { POST as postVotar } from "@/app/api/e/[codigo]/votar/route";
import { db } from "@/db";
import { comprador, eleicao, voto } from "@/db/schema";
import { anularVoto } from "@/lib/regras-voto";
import { lerToken } from "@/lib/token";

import { type Cenario, criarCenario, limparCenarios } from "./cenario";

afterAll(limparCenarios);

// Corpo JSON livre: cada teste confere os campos que importam.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Corpo = Record<string, any>;
type Resposta = { status: number; corpo: Corpo };

const URL_BASE = "http://localhost/api/e";
const IP = { "x-forwarded-for": "177.10.20.30" };
const params = <P>(p: P) => ({ params: Promise.resolve(p) });

async function ler(resposta: Promise<Response>): Promise<Resposta> {
  const r = await resposta;
  return { status: r.status, corpo: await r.json() };
}

const post = (url: string, corpo: unknown) =>
  new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...IP },
    body: typeof corpo === "string" ? corpo : JSON.stringify(corpo),
  });
const get = (url: string) => new Request(url, { headers: IP });

const api = {
  eleicao: (codigo: string) =>
    ler(getEleicao(get(`${URL_BASE}/${codigo}`), params({ codigo }))),
  apartamentos: (codigo: string) =>
    ler(
      getApartamentos(
        get(`${URL_BASE}/${codigo}/apartamentos`),
        params({ codigo }),
      ),
    ),
  dica: (codigo: string, id: number | string) =>
    ler(
      getDica(
        get(`${URL_BASE}/${codigo}/apartamentos/${id}/dica`),
        params({ codigo, id: String(id) }),
      ),
    ),
  verificar: (codigo: string, corpo: unknown) =>
    ler(
      postVerificar(
        post(`${URL_BASE}/${codigo}/verificar`, corpo),
        params({ codigo }),
      ),
    ),
  votar: (codigo: string, corpo: unknown) =>
    ler(
      postVotar(post(`${URL_BASE}/${codigo}/votar`, corpo), params({ codigo })),
    ),
  telao: (codigo: string) =>
    ler(getTelao(get(`${URL_BASE}/${codigo}/telao`), params({ codigo }))),
};

type Preparado = Cenario & { codigo: string };

async function preparar(
  status?: Parameters<typeof criarCenario>[0],
): Promise<Preparado> {
  const c = await criarCenario(status);
  const [el] = await db
    .select({ codigo: eleicao.codigo })
    .from(eleicao)
    .where(eq(eleicao.id, c.eleicaoId));
  return { ...c, codigo: el.codigo };
}

const mudarStatus = (c: Cenario, status: "encerrada" | "publicada") =>
  db.update(eleicao).set({ status }).where(eq(eleicao.id, c.eleicaoId));

const formatarCpf = (d: string) =>
  `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;

/** Verifica o documento e devolve o token; falha o teste se não conferir. */
async function tokenDe(c: Preparado, apartamentoId: number, documento: string) {
  const r = await api.verificar(c.codigo, { apartamentoId, documento });
  expect(r.corpo).toMatchObject({ ok: true });
  return r.corpo.token as string;
}

/** CPF válido, de ninguém do cenário, para contar tentativa. */
const errar = (c: Preparado, apartamentoId: number) =>
  api.verificar(c.codigo, { apartamentoId, documento: c.doc.estranho });

const SEM_CODIGO = "nao-existe-esta-eleicao";

describe("GET /api/e/[codigo]", () => {
  it("devolve empreendimento, título, status e candidatos em ordem", async () => {
    const c = await preparar();
    const r = await api.eleicao(c.codigo);
    expect(r.status).toBe(200);
    expect(r.corpo).toMatchObject({
      titulo: "Eleição de teste",
      status: "aberta",
    });
    expect(r.corpo.empreendimento).toMatch(/^Teste /);
    expect(r.corpo.candidatos).toEqual([
      {
        id: c.candidatos[0],
        nome: "Candidato A",
        foto: null,
        proposta: null,
        apartamento: null,
      },
      {
        id: c.candidatos[1],
        nome: "Candidato B",
        foto: null,
        proposta: null,
        apartamento: null,
      },
    ]);
  });

  it("mostra a eleição antes da abertura", async () => {
    const c = await preparar("rascunho");
    expect((await api.eleicao(c.codigo)).corpo.status).toBe("rascunho");
  });

  it("404 para código inexistente", async () => {
    const r = await api.eleicao(SEM_CODIGO);
    expect(r.status).toBe(404);
    expect(r.corpo.mensagem).toBeTruthy();
  });
});

describe("GET /api/e/[codigo]/apartamentos", () => {
  it("lista os apartamentos com jaVotou, bloqueado e soMesa", async () => {
    const c = await preparar();
    const antes = await api.apartamentos(c.codigo);
    expect(antes.status).toBe(200);
    expect(antes.corpo).toEqual(
      (["a101", "a102", "a201", "a202", "a301", "a401"] as const).map((k) => ({
        id: c.apto[k],
        bloco: "Bloco 01",
        rotulo: `Ap ${k.slice(1)}`,
        jaVotou: false,
        bloqueado: false,
        soMesa: k === "a401",
      })),
    );

    const token = await tokenDe(c, c.apto.a101, c.doc.a101);
    await api.votar(c.codigo, { token, candidatoId: c.candidatos[0] });
    for (let i = 0; i < 3; i++) await errar(c, c.apto.a301);

    const depois = (await api.apartamentos(c.codigo)).corpo as Corpo[];
    const de = (id: number) => depois.find((a) => a.id === id);
    expect(de(c.apto.a101)).toMatchObject({ jaVotou: true, bloqueado: false });
    expect(de(c.apto.a301)).toMatchObject({ jaVotou: false, bloqueado: true });
    expect(de(c.apto.a102)).toMatchObject({ jaVotou: false, bloqueado: false });
  });

  it("404 para código inexistente", async () => {
    expect((await api.apartamentos(SEM_CODIGO)).status).toBe(404);
  });
});

describe("GET /api/e/[codigo]/apartamentos/[id]/dica", () => {
  it("devolve só os 3 primeiros caracteres de cada documento", async () => {
    const c = await preparar();
    const dicas = async (id: number) => (await api.dica(c.codigo, id)).corpo;

    expect(await dicas(c.apto.a101)).toEqual({
      dicas: [{ tipo: "cpf", prefixo: c.doc.a101.slice(0, 3) }],
    });
    expect(await dicas(c.apto.a102)).toEqual({
      dicas: [
        { tipo: "cpf", prefixo: c.doc.a102c1.slice(0, 3) },
        { tipo: "cpf", prefixo: c.doc.a102c2.slice(0, 3) },
      ],
    });
    expect(await dicas(c.apto.a301)).toEqual({
      dicas: [{ tipo: "cnpj", prefixo: "12A" }],
    });
    // Só pela mesa: apartamento existe, sem dica. Documento inválido no
    // cadastro nunca confere, então também não vira dica.
    await db.insert(comprador).values({
      apartamentoId: c.apto.a401,
      nome: "Cadastro errado",
      documento: "12345678900",
    });
    expect(await dicas(c.apto.a401)).toEqual({ dicas: [] });
  });

  it("404 para apartamento de outro empreendimento ou id inválido", async () => {
    const c = await preparar();
    const outro = await preparar();
    for (const id of [outro.apto.a101, "abc", "0", "99999999999"]) {
      const r = await api.dica(c.codigo, id);
      expect(r.status, `id ${id}`).toBe(404);
    }
    expect((await api.dica(SEM_CODIGO, c.apto.a101)).status).toBe(404);
  });
});

describe("POST /api/e/[codigo]/verificar", () => {
  it("documento certo, com ou sem pontuação, devolve o token", async () => {
    const c = await preparar();
    const r = await api.verificar(c.codigo, {
      apartamentoId: c.apto.a101,
      documento: formatarCpf(c.doc.a101),
    });
    expect(r.status).toBe(200);
    expect(r.corpo).toEqual({ ok: true, token: expect.any(String) });
    expect(await lerToken(r.corpo.token)).toEqual({
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a101,
      compradorId: c.comprador.c101,
    });

    // Apartamento com dois compradores: o token leva o que digitou.
    const token = await tokenDe(c, c.apto.a102, c.doc.a102c2);
    expect((await lerToken(token))?.compradorId).toBe(c.comprador.c102b);
  });

  it("documento inválido não conta tentativa; 3 falhas bloqueiam", async () => {
    const c = await preparar();
    const invalido = await api.verificar(c.codigo, {
      apartamentoId: c.apto.a101,
      documento: "123.456.789-00",
    });
    expect(invalido.corpo).toEqual({ ok: false, erro: "documento_invalido" });

    expect((await errar(c, c.apto.a101)).corpo).toEqual({
      ok: false,
      erro: "nao_confere",
      tentativasRestantes: 2,
    });
    expect((await errar(c, c.apto.a101)).corpo).toMatchObject({
      tentativasRestantes: 1,
    });
    expect((await errar(c, c.apto.a101)).corpo).toEqual({
      ok: false,
      erro: "bloqueado",
    });
    // Bloqueado: nem o documento certo passa.
    const certo = await api.verificar(c.codigo, {
      apartamentoId: c.apto.a101,
      documento: c.doc.a101,
    });
    expect(certo.corpo).toEqual({ ok: false, erro: "bloqueado" });
  });

  it("documento de outro apartamento sugere os apartamentos dele", async () => {
    const c = await preparar();
    const token = await tokenDe(c, c.apto.a202, c.doc.multi);
    await api.votar(c.codigo, { token, candidatoId: c.candidatos[0] });

    const r = await api.verificar(c.codigo, {
      apartamentoId: c.apto.a101,
      documento: c.doc.multi,
    });
    expect(r.corpo).toEqual({
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
          votouEm: expect.any(String),
        },
      ],
    });
    // Sugestão não conta tentativa.
    expect((await errar(c, c.apto.a101)).corpo.tentativasRestantes).toBe(2);
  });

  it("ja_votou e eleicao_fechada", async () => {
    const c = await preparar();
    const token = await tokenDe(c, c.apto.a101, c.doc.a101);
    await api.votar(c.codigo, { token, candidatoId: c.candidatos[0] });
    const r = await api.verificar(c.codigo, {
      apartamentoId: c.apto.a101,
      documento: c.doc.a101,
    });
    expect(r.corpo).toEqual({ ok: false, erro: "ja_votou" });

    for (const status of ["rascunho", "encerrada", "publicada"] as const) {
      const f = await preparar(status);
      const fechada = await api.verificar(f.codigo, {
        apartamentoId: f.apto.a101,
        documento: f.doc.a101,
      });
      expect(fechada.corpo, status).toEqual({
        ok: false,
        erro: "eleicao_fechada",
      });
    }
  });

  it("400 para entrada inválida e 404 para código inexistente", async () => {
    const c = await preparar();
    const outro = await preparar();
    const ruins: unknown[] = [
      "{não é json",
      {},
      { apartamentoId: c.apto.a101 },
      { apartamentoId: String(c.apto.a101), documento: c.doc.a101 },
      { apartamentoId: 2 ** 31, documento: c.doc.a101 },
      { apartamentoId: c.apto.a101, documento: "1".repeat(33) },
      // Apartamento de outro empreendimento.
      { apartamentoId: outro.apto.a101, documento: outro.doc.a101 },
    ];
    for (const corpo of ruins) {
      const r = await api.verificar(c.codigo, corpo);
      expect(r.status, JSON.stringify(corpo)).toBe(400);
      expect(r.corpo.mensagem).toBeTruthy();
    }
    const r = await api.verificar(SEM_CODIGO, {
      apartamentoId: c.apto.a101,
      documento: c.doc.a101,
    });
    expect(r.status).toBe(404);
  });
});

describe("POST /api/e/[codigo]/votar", () => {
  it("vota, devolve comprovante e os próximos apartamentos com token", async () => {
    const c = await preparar();
    const token = await tokenDe(c, c.apto.a201, c.doc.multi);
    const r = await api.votar(c.codigo, {
      token,
      candidatoId: c.candidatos[0],
    });
    expect(r.status).toBe(200);
    expect(r.corpo).toEqual({
      ok: true,
      comprovante: expect.stringMatching(/^[2-9A-HJ-NP-Z]{6}$/),
      horario: expect.any(String),
      proximos: [
        {
          apartamentoId: c.apto.a202,
          bloco: "Bloco 01",
          rotulo: "Ap 202",
          token: expect.any(String),
        },
      ],
    });
    expect(Number.isNaN(Date.parse(r.corpo.horario))).toBe(false);

    const proximo = r.corpo.proximos[0].token;
    expect(await lerToken(proximo)).toEqual({
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a202,
      compradorId: c.comprador.c202,
    });
    const segundo = await api.votar(c.codigo, {
      token: proximo,
      candidatoId: c.candidatos[1],
    });
    expect(segundo.corpo).toMatchObject({ ok: true, proximos: [] });
  });

  it("token reaproveitado ou dois cliques simultâneos: só um voto grava", async () => {
    const c = await preparar();
    const token = await tokenDe(c, c.apto.a101, c.doc.a101);
    const corpo = { token, candidatoId: c.candidatos[0] };
    const [a, b] = await Promise.all([
      api.votar(c.codigo, corpo),
      api.votar(c.codigo, corpo),
    ]);
    expect([a.corpo.ok, b.corpo.ok].sort()).toEqual([false, true]);
    expect([a.corpo, b.corpo]).toContainEqual({ ok: false, erro: "ja_votou" });

    const de_novo = await api.votar(c.codigo, corpo);
    expect(de_novo.corpo).toEqual({ ok: false, erro: "ja_votou" });
    expect((await api.telao(c.codigo)).corpo.votaram).toBe(1);
  });

  it("apartamento bloqueado depois da verificação recusa o voto", async () => {
    const c = await preparar();
    const token = await tokenDe(c, c.apto.a102, c.doc.a102c1);
    for (let i = 0; i < 3; i++) await errar(c, c.apto.a102);
    const r = await api.votar(c.codigo, {
      token,
      candidatoId: c.candidatos[0],
    });
    expect(r.corpo).toEqual({ ok: false, erro: "bloqueado" });
  });

  it("eleição encerrada depois da verificação recusa o voto", async () => {
    const c = await preparar();
    const token = await tokenDe(c, c.apto.a101, c.doc.a101);
    await mudarStatus(c, "encerrada");
    const r = await api.votar(c.codigo, {
      token,
      candidatoId: c.candidatos[0],
    });
    expect(r.corpo).toEqual({ ok: false, erro: "eleicao_fechada" });
  });

  it("401 para token inválido ou de outra eleição", async () => {
    const c = await preparar();
    const outro = await preparar();
    const deOutra = await tokenDe(outro, outro.apto.a101, outro.doc.a101);
    for (const token of ["x.y.z", deOutra]) {
      const r = await api.votar(c.codigo, {
        token,
        candidatoId: c.candidatos[0],
      });
      expect(r.status).toBe(401);
      expect(r.corpo.mensagem).toBeTruthy();
    }
  });

  it("400 para entrada inválida e 404 para código inexistente", async () => {
    const c = await preparar();
    const outro = await preparar();
    const token = await tokenDe(c, c.apto.a101, c.doc.a101);
    const ruins: unknown[] = [
      "nada",
      { token },
      { token: "", candidatoId: c.candidatos[0] },
      { token, candidatoId: "1" },
      // Candidato de outra eleição.
      { token, candidatoId: outro.candidatos[0] },
    ];
    for (const corpo of ruins) {
      const r = await api.votar(c.codigo, corpo);
      expect(r.status, JSON.stringify(corpo)).toBe(400);
    }
    const r = await api.votar(SEM_CODIGO, {
      token,
      candidatoId: c.candidatos[0],
    });
    expect(r.status).toBe(404);
    // Nada disso gastou o voto.
    expect((await api.telao(c.codigo)).corpo.votaram).toBe(0);
  });
});

describe("GET /api/e/[codigo]/telao", () => {
  it("conta apartamentos que votaram", async () => {
    const c = await preparar();
    expect((await api.telao(c.codigo)).corpo).toEqual({
      totalApartamentos: 6,
      votaram: 0,
    });
    for (const [apto, doc] of [
      [c.apto.a101, c.doc.a101],
      [c.apto.a301, c.doc.cnpj],
    ] as const) {
      const token = await tokenDe(c, apto, doc);
      await api.votar(c.codigo, { token, candidatoId: c.candidatos[0] });
    }
    expect((await api.telao(c.codigo)).corpo).toEqual({
      totalApartamentos: 6,
      votaram: 2,
    });
  });

  it("voto anulado deixa de contar e libera o apartamento", async () => {
    const c = await preparar();
    const token = await tokenDe(c, c.apto.a101, c.doc.a101);
    await api.votar(c.codigo, { token, candidatoId: c.candidatos[0] });
    const [v] = await db
      .select({ id: voto.id })
      .from(voto)
      .where(eq(voto.eleicaoId, c.eleicaoId));
    const anulado = await anularVoto({
      votoId: v.id,
      usuarioId: c.godId,
      motivo: "teste",
    });
    expect(anulado).toEqual({ ok: true });

    const grade = (await api.apartamentos(c.codigo)).corpo as Corpo[];
    expect(grade.find((a) => a.id === c.apto.a101)?.jaVotou).toBe(false);
    await mudarStatus(c, "publicada");
    expect((await api.telao(c.codigo)).corpo).toMatchObject({
      votaram: 0,
      resultado: [{ votos: 0 }, { votos: 0 }],
    });
  });

  it("404 para código inexistente", async () => {
    expect((await api.telao(SEM_CODIGO)).status).toBe(404);
  });
});

describe("R9: sem limite por IP", () => {
  it("muitas pessoas no mesmo IP votam normalmente", async () => {
    const c = await preparar();
    // Bloqueio é por apartamento, não por IP.
    for (let i = 0; i < 3; i++) await errar(c, c.apto.a102);

    const leituras = await Promise.all(
      Array.from({ length: 30 }, () => api.apartamentos(c.codigo)),
    );
    expect(leituras.every((r) => r.status === 200)).toBe(true);

    for (const [apto, doc] of [
      [c.apto.a101, c.doc.a101],
      [c.apto.a201, c.doc.multi],
      [c.apto.a301, c.doc.cnpj],
    ] as const) {
      const token = await tokenDe(c, apto, doc);
      const r = await api.votar(c.codigo, {
        token,
        candidatoId: c.candidatos[0],
      });
      expect(r.status).toBe(200);
      expect(r.corpo.ok).toBe(true);
    }
  });
});

describe("R10: nada de nome nem documento na API pública", () => {
  it("nenhuma resposta do fluxo inteiro tem nome ou documento de comprador", async () => {
    const c = await preparar();
    const respostas: Resposta[] = [
      await api.eleicao(c.codigo),
      await api.apartamentos(c.codigo),
    ];
    for (const id of Object.values(c.apto)) {
      respostas.push(await api.dica(c.codigo, id));
    }
    respostas.push(
      await api.verificar(c.codigo, {
        apartamentoId: c.apto.a101,
        documento: c.doc.multi,
      }),
      await errar(c, c.apto.a102),
    );
    const token = await tokenDe(c, c.apto.a201, c.doc.multi);
    const votou = await api.votar(c.codigo, {
      token,
      candidatoId: c.candidatos[0],
    });
    respostas.push(votou);
    respostas.push(
      await api.votar(c.codigo, { token, candidatoId: c.candidatos[0] }),
    );
    await mudarStatus(c, "publicada");
    respostas.push(await api.telao(c.codigo));

    const texto = JSON.stringify(respostas);
    const nomes = [
      "Comprador",
      "Cônjuge",
      "Investidor",
      "Empresa Fictícia",
      "Permuta",
    ];
    for (const proibido of [...Object.values(c.doc), ...nomes]) {
      expect(texto).not.toContain(proibido);
    }
    // Do documento, só os 3 primeiros caracteres na dica.
    for (const r of respostas) {
      for (const d of r.corpo.dicas ?? []) expect(d.prefixo).toHaveLength(3);
    }
    // Os tokens só levam ids.
    for (const t of [token, votou.corpo.proximos[0].token]) {
      expect(Object.keys(decodeJwt(t)).sort()).toEqual(
        ["apartamentoId", "compradorId", "eleicaoId", "exp", "iat"].sort(),
      );
    }
  });
});

describe("R11: resultado só com a eleição publicada", () => {
  it("telão sem resultado até publicar, com resultado depois", async () => {
    const c = await preparar();
    const votos: [number, string, number][] = [
      [c.apto.a101, c.doc.a101, c.candidatos[1]],
      [c.apto.a102, c.doc.a102c1, c.candidatos[1]],
      [c.apto.a301, c.doc.cnpj, c.candidatos[1]],
    ];
    for (const [apto, doc, candidatoId] of votos) {
      const token = await tokenDe(c, apto, doc);
      await api.votar(c.codigo, { token, candidatoId });
    }

    const aberta = await api.telao(c.codigo);
    expect(aberta.corpo).not.toHaveProperty("resultado");
    await mudarStatus(c, "encerrada");
    const encerrada = await api.telao(c.codigo);
    expect(encerrada.corpo).not.toHaveProperty("resultado");
    expect(JSON.stringify(encerrada.corpo)).not.toContain("Candidato");

    await mudarStatus(c, "publicada");
    expect((await api.telao(c.codigo)).corpo).toEqual({
      totalApartamentos: 6,
      votaram: 3,
      resultado: [
        { candidatoId: c.candidatos[0], nome: "Candidato A", votos: 0 },
        { candidatoId: c.candidatos[1], nome: "Candidato B", votos: 3 },
      ],
    });
  });

  it("eleição em rascunho também não mostra resultado", async () => {
    const c = await preparar("rascunho");
    expect((await api.telao(c.codigo)).corpo).toEqual({
      totalApartamentos: 6,
      votaram: 0,
    });
  });
});
