// Testes de integração das rotas do godmode: papel conferido no servidor,
// motivo obrigatório, anular, mover, voto pela mesa, reabrir, excluir
// empreendimento, auditoria e usuários, e cada ação listada no relatório. O
// cookie da sessão fica num pote em memória no lugar do `cookies()` do Next.
import bcrypt from "bcryptjs";
import { and, eq, inArray } from "drizzle-orm";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const pote = vi.hoisted(() => new Map<string, string>());
vi.mock("next/headers", () => ({
  cookies: async () => ({
    get: (name: string) =>
      pote.has(name) ? { name, value: pote.get(name)! } : undefined,
    getAll: () => [...pote].map(([name, value]) => ({ name, value })),
    set: (name: string, value: string, opcoes?: { maxAge?: number }) => {
      if (!value || opcoes?.maxAge === 0) pote.delete(name);
      else pote.set(name, value);
    },
    delete: (name: string) => pote.delete(name),
  }),
}));

import { GET as getAuditoria } from "@/app/api/admin/auditoria/route";
import { POST as postReabrir } from "@/app/api/admin/eleicoes/[id]/reabrir/route";
import { GET as getRelatorio } from "@/app/api/admin/eleicoes/[id]/relatorio/route";
import { POST as postMesa } from "@/app/api/admin/eleicoes/[id]/voto-mesa/route";
import { GET as getVotos } from "@/app/api/admin/eleicoes/[id]/votos/route";
import { GET as getPorDocumento } from "@/app/api/admin/eleicoes/[id]/votos-por-documento/route";
import { POST as postExcluir } from "@/app/api/admin/empreendimentos/[id]/excluir/route";
import { GET as getEleicoes } from "@/app/api/admin/eleicoes/route";
import { POST as postLogin } from "@/app/api/admin/login/route";
import { POST as postDesativar } from "@/app/api/admin/usuarios/[id]/desativar/route";
import {
  GET as getUsuarios,
  POST as postUsuario,
} from "@/app/api/admin/usuarios/route";
import { POST as postAnular } from "@/app/api/admin/votos/[id]/anular/route";
import { POST as postMover } from "@/app/api/admin/votos/[id]/mover/route";
import { db } from "@/db";
import {
  apartamento,
  candidato,
  comprador,
  eleicao,
  empreendimento,
  logAuditoria,
  situacaoApartamento,
  usuarioAdmin,
  voto,
} from "@/db/schema";
import { exigirUsuarioPagina } from "@/lib/auth";
import { verificarDocumento, votar } from "@/lib/regras-voto";

import {
  type Cenario,
  criarCenario,
  limparCenarios,
  registrarUsuario,
} from "./cenario";

afterAll(limparCenarios);
beforeEach(() => pote.clear());

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Corpo = Record<string, any>;

const BASE = "http://localhost:3000/api/admin";
const MESMA_ORIGEM = {
  origin: "http://localhost:3000",
  host: "localhost:3000",
};
const params = <P>(p: P) => ({ params: Promise.resolve(p) });

async function ler(resposta: Promise<Response>) {
  const r = await resposta;
  return { status: r.status, corpo: (await r.json()) as Corpo };
}

const post = (url: string, corpo: unknown) =>
  new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...MESMA_ORIGEM },
    body: JSON.stringify(corpo),
  });
const get = (url: string) =>
  new Request(url, { headers: { host: "localhost:3000" } });

const SENHA = "senha-de-teste-123";

async function entrarComo(c: Cenario, quem: "operador" | "god") {
  const id = quem === "operador" ? c.operadorId : c.godId;
  const [u] = await db
    .update(usuarioAdmin)
    .set({ senhaHash: await bcrypt.hash(SENHA, 4) })
    .where(eq(usuarioAdmin.id, id))
    .returning({ email: usuarioAdmin.email });
  const r = await ler(
    postLogin(post(`${BASE}/login`, { email: u.email, senha: SENHA })),
  );
  expect(r.status).toBe(200);
}

async function votarPeloDocumento(
  c: Cenario,
  apartamentoId: number,
  documento: string,
  candidato = 0,
): Promise<number> {
  const v = await verificarDocumento({
    eleicaoId: c.eleicaoId,
    apartamentoId,
    documento,
  });
  if (!v.ok) throw new Error(`verificação falhou: ${v.erro}`);
  const r = await votar({
    eleicaoId: c.eleicaoId,
    apartamentoId,
    compradorId: v.compradorId,
    candidatoId: c.candidatos[candidato],
  });
  if (!r.ok) throw new Error(`voto não gravou: ${r.erro}`);
  return r.votoId;
}

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

const naEleicao = (c: Cenario) => params({ id: String(c.eleicaoId) });
const noVoto = (votoId: number) => params({ id: String(votoId) });

const mesa = (c: Cenario, corpo: Corpo) =>
  ler(
    postMesa(
      post(`${BASE}/eleicoes/${c.eleicaoId}/voto-mesa`, {
        candidatoId: c.candidatos[1],
        nome: "Dono da permuta",
        documento: c.doc.estranho,
        motivo: "Permuta sem documento no cadastro",
        ...corpo,
      }),
      naEleicao(c),
    ),
  );

const relatorio = async (c: Cenario) =>
  (
    await ler(
      getRelatorio(
        get(`${BASE}/eleicoes/${c.eleicaoId}/relatorio`),
        naEleicao(c),
      ),
    )
  ).corpo;

describe("papel god conferido no servidor", () => {
  it("operador recebe 403 em todas as rotas god e nada muda", async () => {
    const c = await criarCenario();
    const votoId = await votarPeloDocumento(c, c.apto.a101, c.doc.a101);
    await entrarComo(c, "operador");
    const motivo = { motivo: "Tentativa do operador" };
    const e = `${BASE}/eleicoes/${c.eleicaoId}`;

    const respostas = await Promise.all([
      ler(
        postMesa(
          post(`${e}/voto-mesa`, {
            apartamentoIds: [c.apto.a401],
            candidatoId: c.candidatos[0],
            nome: "Alguém",
            documento: c.doc.estranho,
            ...motivo,
          }),
          naEleicao(c),
        ),
      ),
      ler(getPorDocumento(get(`${e}/votos-por-documento`), naEleicao(c))),
      ler(
        getVotos(get(`${e}/votos?apartamentoId=${c.apto.a101}`), naEleicao(c)),
      ),
      ler(postReabrir(post(`${e}/reabrir`, motivo), naEleicao(c))),
      ler(
        postExcluir(
          post(`${BASE}/empreendimentos/${c.empreendimentoId}/excluir`, {
            ...motivo,
            confirmacao: `x`,
          }),
          params({ id: String(c.empreendimentoId) }),
        ),
      ),
      ler(
        postAnular(
          post(`${BASE}/votos/${votoId}/anular`, motivo),
          noVoto(votoId),
        ),
      ),
      ler(
        postMover(
          post(`${BASE}/votos/${votoId}/mover`, {
            apartamentoDestinoId: c.apto.a401,
            ...motivo,
          }),
          noVoto(votoId),
        ),
      ),
      ler(getAuditoria(get(`${BASE}/auditoria?eleicaoId=${c.eleicaoId}`))),
      ler(getUsuarios(get(`${BASE}/usuarios`))),
      ler(
        postUsuario(
          post(`${BASE}/usuarios`, {
            nome: "Intruso",
            email: `intruso-${c.eleicaoId}@teste.test`,
            senha: "senha-longa-123",
            papel: "god",
            ...motivo,
          }),
        ),
      ),
      ler(
        postDesativar(
          post(`${BASE}/usuarios/${c.godId}/desativar`, motivo),
          params({ id: String(c.godId) }),
        ),
      ),
    ]);
    expect(respostas.map((r) => r.status)).toEqual(
      Array(respostas.length).fill(403),
    );
    // Nenhuma resposta vaza candidato ou documento.
    expect(JSON.stringify(respostas)).not.toMatch(/Candidato A|Candidato B/);

    const [v] = await db.select().from(voto).where(eq(voto.id, votoId));
    expect(v).toMatchObject({ status: "valido", apartamentoId: c.apto.a101 });
    expect(await votosValidos(c, c.apto.a401)).toHaveLength(0);
    const [god] = await db
      .select({ ativo: usuarioAdmin.ativo })
      .from(usuarioAdmin)
      .where(eq(usuarioAdmin.id, c.godId));
    expect(god.ativo).toBe(true);
    const intruso = await db
      .select()
      .from(usuarioAdmin)
      .where(eq(usuarioAdmin.email, `intruso-${c.eleicaoId}@teste.test`));
    expect(intruso).toHaveLength(0);
    expect(
      await db
        .select()
        .from(empreendimento)
        .where(eq(empreendimento.id, c.empreendimentoId)),
    ).toHaveLength(1);
  });

  it("sem sessão, as rotas god respondem 401", async () => {
    const c = await criarCenario();
    const r = await ler(
      getPorDocumento(
        get(`${BASE}/eleicoes/${c.eleicaoId}/votos-por-documento`),
        naEleicao(c),
      ),
    );
    expect(r.status).toBe(401);
  });
});

describe("anular e mover", () => {
  it("anular exige motivo, libera o apartamento e aparece no relatório", async () => {
    const c = await criarCenario();
    const votoId = await votarPeloDocumento(c, c.apto.a101, c.doc.a101);
    await entrarComo(c, "god");
    const anular = (motivo: string) =>
      ler(
        postAnular(
          post(`${BASE}/votos/${votoId}/anular`, { motivo }),
          noVoto(votoId),
        ),
      );

    expect((await anular("   ")).status).toBe(400);
    expect(await votosValidos(c, c.apto.a101)).toHaveLength(1);

    expect((await anular("Votou pelo apartamento errado")).status).toBe(200);
    const [anulado] = await db.select().from(voto).where(eq(voto.id, votoId));
    expect(anulado.status).toBe("anulado");
    expect((await anular("De novo")).status).toBe(409);

    // O apartamento vota de novo.
    await votarPeloDocumento(c, c.apto.a101, c.doc.a101, 1);
    expect(await votosValidos(c, c.apto.a101)).toHaveLength(1);

    expect((await relatorio(c)).acoesGod).toMatchObject([
      {
        acao: "voto.anular",
        motivo: "Votou pelo apartamento errado",
        usuario: "God",
        detalhe: "Bloco 01, Ap 101",
      },
    ]);
  });

  it("mover para apartamento que já tem voto válido falha", async () => {
    const c = await criarCenario();
    const votoId = await votarPeloDocumento(c, c.apto.a101, c.doc.a101);
    await votarPeloDocumento(c, c.apto.a102, c.doc.a102c1);
    await entrarComo(c, "god");
    const mover = (apartamentoDestinoId: number, motivo = "Apto trocado") =>
      ler(
        postMover(
          post(`${BASE}/votos/${votoId}/mover`, {
            apartamentoDestinoId,
            motivo,
          }),
          noVoto(votoId),
        ),
      );

    const ocupado = await mover(c.apto.a102);
    expect(ocupado.status).toBe(409);
    expect(ocupado.corpo.mensagem).toMatch(/destino já tem voto/);
    const [v] = await db.select().from(voto).where(eq(voto.id, votoId));
    expect(v).toMatchObject({ apartamentoId: c.apto.a101, status: "valido" });

    expect((await mover(c.apto.a401, "")).status).toBe(400);
    expect((await mover(c.apto.a401)).status).toBe(200);
    expect(await votosValidos(c, c.apto.a401)).toHaveLength(1);
    expect(await votosValidos(c, c.apto.a101)).toHaveLength(0);

    // A busca pelo apartamento de origem ainda acha o voto, com o histórico.
    const busca = await ler(
      getVotos(
        get(
          `${BASE}/eleicoes/${c.eleicaoId}/votos?apartamentoId=${c.apto.a101}`,
        ),
        naEleicao(c),
      ),
    );
    expect(busca.corpo.votos).toMatchObject([
      {
        id: votoId,
        apartamentoId: c.apto.a401,
        candidato: "Candidato A",
        historico: [
          {
            acao: "voto.mover",
            motivo: "Apto trocado",
            detalhe: "de Bloco 01, Ap 101 para Bloco 01, Ap 401",
          },
        ],
      },
    ]);

    expect((await relatorio(c)).acoesGod).toMatchObject([
      { acao: "voto.mover", motivo: "Apto trocado" },
    ]);
  });
});

describe("resultado publicado", () => {
  it("não anula mais: o total do telão é o final", async () => {
    const c = await criarCenario();
    const votoId = await votarPeloDocumento(c, c.apto.a101, c.doc.a101);
    await db
      .update(eleicao)
      .set({ status: "publicada" })
      .where(eq(eleicao.id, c.eleicaoId));
    await entrarComo(c, "god");
    const r = await ler(
      postAnular(
        post(`${BASE}/votos/${votoId}/anular`, { motivo: "Tarde demais" }),
        noVoto(votoId),
      ),
    );
    expect(r.status).toBe(409);
    expect(r.corpo.mensagem).toMatch(/publicado/);
    expect(await votosValidos(c, c.apto.a101)).toHaveLength(1);
  });
});

describe("voto pela mesa em lote", () => {
  it("grava um voto por apartamento e recusa apartamento que já votou", async () => {
    const c = await criarCenario();
    await votarPeloDocumento(c, c.apto.a101, c.doc.a101);
    await entrarComo(c, "god");

    const recusa = await mesa(c, {
      apartamentoIds: [c.apto.a401, c.apto.a101],
    });
    expect(recusa.status).toBe(409);
    expect(recusa.corpo.mensagem).toBe(
      "Bloco 01, Ap 101 já votou. Nenhum voto foi gravado.",
    );
    expect(await votosValidos(c, c.apto.a401)).toHaveLength(0);

    expect(
      (await mesa(c, { apartamentoIds: [c.apto.a401], motivo: " " })).status,
    ).toBe(400);
    expect(
      (
        await mesa(c, {
          apartamentoIds: [c.apto.a401],
          documento: "111.111.111-11",
        })
      ).status,
    ).toBe(400);

    const lote = await mesa(c, { apartamentoIds: [c.apto.a401, c.apto.a301] });
    expect(lote.status).toBe(200);
    expect(lote.corpo.votos).toHaveLength(2);
    for (const apto of [c.apto.a401, c.apto.a301]) {
      const votos = await votosValidos(c, apto);
      expect(votos).toHaveLength(1);
      expect(votos[0]).toMatchObject({
        origem: "mesa",
        compradorId: null,
        nome: "Dono da permuta",
        documento: c.doc.estranho,
        candidatoId: c.candidatos[1],
      });
    }
    expect(
      (await mesa(c, { apartamentoIds: [c.apto.a401] })).corpo.mensagem,
    ).toMatch(/Ap 401 já votou/);

    const [acao] = (await relatorio(c)).acoesGod;
    expect(acao).toMatchObject({
      acao: "voto.mesa",
      motivo: "Permuta sem documento no cadastro",
    });
    expect(acao.detalhe).toContain("Bloco 01, Ap 301");
    expect(acao.detalhe).toContain("Bloco 01, Ap 401");

    // A busca por comprovante mostra o candidato e o motivo da mesa.
    const busca = await ler(
      getVotos(
        get(
          `${BASE}/eleicoes/${c.eleicaoId}/votos?comprovante=${lote.corpo.votos[0].comprovante.toLowerCase()}`,
        ),
        naEleicao(c),
      ),
    );
    expect(busca.corpo.votos).toMatchObject([
      {
        candidato: "Candidato B",
        origem: "mesa",
        historico: [
          { acao: "voto.mesa", motivo: "Permuta sem documento no cadastro" },
        ],
      },
    ]);
    expect(busca.corpo.votos[0].documento).toBe(
      `${c.doc.estranho.slice(0, 3)}.***.***-**`,
    );
  });

  it("com a votação fechada, recusa sem gravar", async () => {
    const c = await criarCenario("encerrada");
    await entrarComo(c, "god");
    const r = await mesa(c, { apartamentoIds: [c.apto.a401] });
    expect(r.status).toBe(409);
    expect(await votosValidos(c, c.apto.a401)).toHaveLength(0);
  });

  it("apartamento bloqueado vota pela mesa ('procure a mesa')", async () => {
    const c = await criarCenario();
    for (let i = 0; i < 3; i++) {
      await verificarDocumento({
        eleicaoId: c.eleicaoId,
        apartamentoId: c.apto.a102,
        documento: c.doc.estranho,
      });
    }
    await entrarComo(c, "god");
    expect((await mesa(c, { apartamentoIds: [c.apto.a102] })).status).toBe(200);
    expect(await votosValidos(c, c.apto.a102)).toMatchObject([
      { origem: "mesa" },
    ]);
  });
});

describe("páginas do godmode", () => {
  it("operador recebe 404 nas páginas que exigem god", async () => {
    const c = await criarCenario();
    await entrarComo(c, "operador");
    // A página do godmode e a de usuários abrem com exigirUsuarioPagina(["god"]).
    await expect(exigirUsuarioPagina(["god"])).rejects.toMatchObject({
      digest: "NEXT_HTTP_ERROR_FALLBACK;404",
    });
    pote.clear();
    await entrarComo(c, "god");
    await expect(exigirUsuarioPagina(["god"])).resolves.toMatchObject({
      id: c.godId,
      papel: "god",
    });
  });
});

describe("votos por documento", () => {
  it("documento mascarado, apartamentos do cadastro e quem votou", async () => {
    const c = await criarCenario();
    await votarPeloDocumento(c, c.apto.a201, c.doc.multi);
    await votarPeloDocumento(c, c.apto.a102, c.doc.a102c2);
    await entrarComo(c, "god");
    await mesa(c, { apartamentoIds: [c.apto.a401] });

    const r = await ler(
      getPorDocumento(
        get(`${BASE}/eleicoes/${c.eleicaoId}/votos-por-documento`),
        naEleicao(c),
      ),
    );
    expect(r.status).toBe(200);
    const docs = r.corpo.documentos as Corpo[];
    // Nenhum documento inteiro sai da API.
    const texto = JSON.stringify(docs);
    for (const d of Object.values(c.doc)) expect(texto).not.toContain(d);

    // Do maior para o menor: o investidor tem 2 apartamentos.
    expect(docs[0]).toMatchObject({
      documento: `${c.doc.multi.slice(0, 3)}.***.***-**`,
      nome: "Investidor",
      cadastro: 2,
      votaram: 1,
      foraDoCadastro: 0,
    });
    expect(docs[0].apartamentos).toMatchObject([
      {
        rotulo: "Bloco 01, Ap 201",
        noCadastro: true,
        voto: { nome: "Investidor", origem: "documento", comEste: true },
      },
      { rotulo: "Bloco 01, Ap 202", noCadastro: true, voto: null },
    ]);

    // O 102 votou com o cônjuge: o outro comprador vê o voto, de outra pessoa.
    const comprador102 = docs.find((d) => d.nome === "Comprador 102")!;
    expect(comprador102).toMatchObject({ cadastro: 1, votaram: 1 });
    expect(comprador102.apartamentos[0].voto).toMatchObject({
      nome: "Cônjuge 102",
      comEste: false,
    });

    // Quem votou pela mesa sem estar no cadastro também aparece.
    // Fora do cadastro não conta como "votaram", que é só do cadastro.
    expect(docs.find((d) => d.nome === "Dono da permuta")).toMatchObject({
      cadastro: 0,
      votaram: 0,
      foraDoCadastro: 1,
      apartamentos: [{ rotulo: "Bloco 01, Ap 401", noCadastro: false }],
    });
    // CNPJ alfanumérico também é mascarado.
    expect(docs.find((d) => d.nome === "Empresa Fictícia Ltda")).toMatchObject({
      documento: "12.A**.***/****-**",
    });
  });
});

describe("reabrir", () => {
  it("reabre só votação encerrada, com motivo", async () => {
    const c = await criarCenario("encerrada");
    await entrarComo(c, "god");
    const reabrir = (motivo: string) =>
      ler(
        postReabrir(
          post(`${BASE}/eleicoes/${c.eleicaoId}/reabrir`, { motivo }),
          naEleicao(c),
        ),
      );
    expect((await reabrir("")).status).toBe(400);
    const r = await reabrir("Fila na mesa no encerramento");
    expect(r).toEqual({ status: 200, corpo: { status: "aberta" } });
    const [el] = await db
      .select({ status: eleicao.status, encerradaEm: eleicao.encerradaEm })
      .from(eleicao)
      .where(eq(eleicao.id, c.eleicaoId));
    expect(el).toEqual({ status: "aberta", encerradaEm: null });
    expect((await reabrir("De novo")).status).toBe(400);

    expect((await relatorio(c)).acoesGod).toMatchObject([
      {
        acao: "eleicao.reabrir",
        motivo: "Fila na mesa no encerramento",
        detalhe: "de encerrada para aberta",
      },
    ]);
  });
});

describe("excluir empreendimento", () => {
  const nomeDe = async (c: Cenario) =>
    (
      await db
        .select({ nome: empreendimento.nome })
        .from(empreendimento)
        .where(eq(empreendimento.id, c.empreendimentoId))
    )[0]?.nome;
  const excluir = (c: Cenario, corpo: Corpo) =>
    ler(
      postExcluir(
        post(`${BASE}/empreendimentos/${c.empreendimentoId}/excluir`, corpo),
        params({ id: String(c.empreendimentoId) }),
      ),
    );

  it("recusa com voto, mesmo anulado, sem motivo ou com o nome errado", async () => {
    const c = await criarCenario();
    const nome = (await nomeDe(c))!;
    const votoId = await votarPeloDocumento(c, c.apto.a101, c.doc.a101);
    await entrarComo(c, "god");
    const motivo = "Cadastro duplicado";

    expect((await excluir(c, { motivo: "", confirmacao: nome })).status).toBe(
      400,
    );
    expect(
      (await excluir(c, { motivo, confirmacao: "Outro nome" })).status,
    ).toBe(400);
    const comVoto = await excluir(c, { motivo, confirmacao: nome });
    expect(comVoto).toEqual({
      status: 400,
      corpo: {
        mensagem:
          "O empreendimento tem eleição com votos e não pode ser excluído.",
      },
    });

    await ler(
      postAnular(
        post(`${BASE}/votos/${votoId}/anular`, { motivo: "Conferência" }),
        noVoto(votoId),
      ),
    );
    expect((await excluir(c, { motivo, confirmacao: nome })).status).toBe(400);
    expect(await nomeDe(c)).toBe(nome);
  });

  it("sem voto, apaga tudo junto e o log fica, desligado da eleição", async () => {
    const c = await criarCenario();
    const nome = (await nomeDe(c))!;
    // Tentativa errada: grava situação e log na eleição, sem voto.
    await verificarDocumento({
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a102,
      documento: c.doc.estranho,
    });
    await entrarComo(c, "god");

    const r = await excluir(c, {
      motivo: "Importado no empreendimento errado",
      confirmacao: ` ${nome} `,
    });
    expect(r).toEqual({ status: 200, corpo: { ok: true } });

    const aptoIds = Object.values(c.apto);
    expect(await nomeDe(c)).toBeUndefined();
    expect(
      await db
        .select()
        .from(apartamento)
        .where(eq(apartamento.empreendimentoId, c.empreendimentoId)),
    ).toHaveLength(0);
    expect(
      await db
        .select()
        .from(comprador)
        .where(inArray(comprador.apartamentoId, aptoIds)),
    ).toHaveLength(0);
    expect(
      await db.select().from(eleicao).where(eq(eleicao.id, c.eleicaoId)),
    ).toHaveLength(0);
    expect(
      await db
        .select()
        .from(candidato)
        .where(eq(candidato.eleicaoId, c.eleicaoId)),
    ).toHaveLength(0);
    expect(
      await db
        .select()
        .from(situacaoApartamento)
        .where(eq(situacaoApartamento.eleicaoId, c.eleicaoId)),
    ).toHaveLength(0);

    const logs = await db
      .select()
      .from(logAuditoria)
      .where(
        inArray(logAuditoria.alvo, [
          `apartamento:${c.apto.a102}`,
          `empreendimento:${c.empreendimentoId}`,
        ]),
      );
    expect(logs).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ acao: "documento.falha", eleicaoId: null }),
        expect.objectContaining({
          acao: "empreendimento.excluir",
          usuarioId: c.godId,
          motivo: "Importado no empreendimento errado",
          dados: { nome, apartamentos: 6, compradores: 7, eleicoes: 1 },
        }),
      ]),
    );

    // A exclusão aparece na auditoria, entre as ações de godmode.
    const auditoria = (
      await ler(getAuditoria(get(`${BASE}/auditoria?godmode=1`)))
    ).corpo;
    expect(
      auditoria.itens.find(
        (i: Corpo) => i.alvo === `empreendimento:${c.empreendimentoId}`,
      ),
    ).toMatchObject({ acao: "empreendimento.excluir", usuario: "God" });

    // Sem eleição, o log do eleitor não sai sozinho na limpeza do cenário.
    await db
      .delete(logAuditoria)
      .where(eq(logAuditoria.alvo, `apartamento:${c.apto.a102}`));
  });
});

describe("auditoria", () => {
  it("filtra por eleição, godmode e grupo, em páginas", async () => {
    const c = await criarCenario();
    const votoId = await votarPeloDocumento(c, c.apto.a101, c.doc.a101);
    await verificarDocumento({
      eleicaoId: c.eleicaoId,
      apartamentoId: c.apto.a102,
      documento: c.doc.estranho,
    });
    await entrarComo(c, "god");
    await mesa(c, { apartamentoIds: [c.apto.a401] });
    await ler(
      postAnular(
        post(`${BASE}/votos/${votoId}/anular`, { motivo: "Conferência" }),
        noVoto(votoId),
      ),
    );
    const auditoria = async (filtros: string) =>
      (
        await ler(
          getAuditoria(
            get(`${BASE}/auditoria?eleicaoId=${c.eleicaoId}&${filtros}`),
          ),
        )
      ).corpo;

    const god = await auditoria("godmode=1");
    expect(god.itens.map((i: Corpo) => i.acao)).toEqual([
      "voto.anular",
      "voto.mesa",
    ]);
    expect(god.itens.every((i: Corpo) => i.motivo && i.usuario === "God")).toBe(
      true,
    );

    const eleitor = await auditoria("grupo=documento");
    expect(eleitor.itens).toMatchObject([
      {
        acao: "documento.falha",
        usuario: null,
        detalhe: "Bloco 01, Ap 102 · 1 tentativa",
      },
    ]);

    const primeira = await auditoria("limite=1");
    expect(primeira.itens).toHaveLength(1);
    expect(primeira.proximo).toBe(primeira.itens[0].id);
    const segunda = await auditoria(`limite=1&antes=${primeira.proximo}`);
    expect(segunda.itens[0].id).toBeLessThan(primeira.itens[0].id);

    const invalido = await ler(getAuditoria(get(`${BASE}/auditoria?grupo=x`)));
    expect(invalido.status).toBe(400);
  });
});

describe("usuários do painel", () => {
  it("god cria e desativa com motivo; desativado perde o acesso", async () => {
    const c = await criarCenario();
    // Votação aberta há um minuto: ações de usuário entram no relatório.
    await db
      .update(eleicao)
      .set({ abertaEm: new Date(Date.now() - 60_000) })
      .where(eq(eleicao.id, c.eleicaoId));
    await entrarComo(c, "god");
    const email = `mesa-${c.eleicaoId}@teste.test`;
    const novo = {
      nome: "Mesa 2",
      email: `  ${email.toUpperCase()} `,
      senha: "senha-da-mesa-2",
      papel: "operador",
      motivo: "Segundo tablet na mesa",
    };

    for (const errado of [
      { ...novo, motivo: "" },
      { ...novo, senha: "curta" },
      { ...novo, papel: "admin" },
      { ...novo, email: "sem-arroba" },
    ]) {
      expect(
        (await ler(postUsuario(post(`${BASE}/usuarios`, errado)))).status,
      ).toBe(400);
    }

    const criado = await ler(postUsuario(post(`${BASE}/usuarios`, novo)));
    expect(criado.status).toBe(200);
    const id = criado.corpo.id as number;
    registrarUsuario(id);
    expect(
      (await ler(postUsuario(post(`${BASE}/usuarios`, novo)))).corpo.mensagem,
    ).toBe("Já existe um usuário com este e-mail.");

    const lista = await ler(getUsuarios(get(`${BASE}/usuarios`)));
    expect(lista.corpo.usuarios).toContainEqual({
      id,
      nome: "Mesa 2",
      email,
      papel: "operador",
      ativo: true,
    });
    // A senha nunca sai da API.
    expect(JSON.stringify(lista.corpo)).not.toMatch(/senha/i);

    const desativar = (alvo: number, motivo = "Tablet devolvido") =>
      ler(
        postDesativar(
          post(`${BASE}/usuarios/${alvo}/desativar`, { motivo }),
          params({ id: String(alvo) }),
        ),
      );
    expect((await desativar(c.godId)).status).toBe(400);
    expect((await desativar(id, " ")).status).toBe(400);

    // O novo usuário entra e usa o painel.
    pote.clear();
    expect(
      (
        await ler(
          postLogin(post(`${BASE}/login`, { email, senha: novo.senha })),
        )
      ).status,
    ).toBe(200);
    expect((await ler(getEleicoes(get(`${BASE}/eleicoes`)))).status).toBe(200);
    const sessaoDoNovo = new Map(pote);

    await entrarComo(c, "god");
    expect((await desativar(id)).status).toBe(200);
    expect((await desativar(id)).status).toBe(400);

    // A sessão aberta cai na hora e o login não entra mais.
    pote.clear();
    for (const [k, v] of sessaoDoNovo) pote.set(k, v);
    expect((await ler(getEleicoes(get(`${BASE}/eleicoes`)))).status).toBe(401);
    expect(
      (
        await ler(
          postLogin(post(`${BASE}/login`, { email, senha: novo.senha })),
        )
      ).status,
    ).toBe(401);

    const logs = await db
      .select({ acao: logAuditoria.acao, motivo: logAuditoria.motivo })
      .from(logAuditoria)
      .where(eq(logAuditoria.alvo, `usuario:${id}`))
      .orderBy(logAuditoria.id);
    expect(logs).toEqual([
      { acao: "usuario.criar", motivo: "Segundo tablet na mesa" },
      { acao: "usuario.desativar", motivo: "Tablet devolvido" },
    ]);

    // O banco é compartilhado: outras ações de usuário no mesmo minuto também
    // entrariam, por isso o filtro pelo alvo.
    await entrarComo(c, "god");
    const acoes = (await relatorio(c)).acoesGod as Corpo[];
    expect(acoes.filter((a) => a.alvo === `usuario:${id}`)).toMatchObject([
      {
        acao: "usuario.criar",
        motivo: "Segundo tablet na mesa",
        detalhe: "Mesa 2 (operador)",
      },
      { acao: "usuario.desativar", motivo: "Tablet devolvido" },
    ]);
  });
});
