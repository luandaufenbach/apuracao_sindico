// Testes de integração da API do painel: sessão, papéis, Origin e uma eleição
// conduzida do início ao fim. O cookie da sessão fica num pote em memória no
// lugar do `cookies()` do Next.
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
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

import { POST as postCandidato } from "@/app/api/admin/eleicoes/[id]/candidatos/route";
import { POST as postDesbloquear } from "@/app/api/admin/eleicoes/[id]/desbloquear/route";
import { GET as getPainel } from "@/app/api/admin/eleicoes/[id]/painel/route";
import { GET as getRelatorio } from "@/app/api/admin/eleicoes/[id]/relatorio/route";
import { POST as postStatus } from "@/app/api/admin/eleicoes/[id]/status/route";
import {
  GET as getEleicoes,
  POST as postEleicao,
} from "@/app/api/admin/eleicoes/route";
import { POST as postLogin } from "@/app/api/admin/login/route";
import { POST as postLogout } from "@/app/api/admin/logout/route";
import { db } from "@/db";
import { logAuditoria, usuarioAdmin } from "@/db/schema";
import { verificarDocumento, votar } from "@/lib/regras-voto";

import { type Cenario, criarCenario, limparCenarios } from "./cenario";

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

const post = (
  url: string,
  corpo: unknown,
  cabecalhos: Record<string, string> = MESMA_ORIGEM,
) =>
  new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json", ...cabecalhos },
    body: JSON.stringify(corpo),
  });
const get = (url: string) =>
  new Request(url, { headers: { host: "localhost:3000" } });

const SENHA = "senha-de-teste-123";

/** Dá ao operador do cenário uma senha de verdade e faz login. */
async function entrarComo(c: Cenario, quem: "operador" | "god" = "operador") {
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
  return u.email;
}

describe("login e sessão", () => {
  it("sem sessão, as rotas respondem 401", async () => {
    const r = await ler(getEleicoes(get(`${BASE}/eleicoes`)));
    expect(r.status).toBe(401);
  });

  it("senha errada não abre sessão", async () => {
    const c = await criarCenario();
    const email = await entrarComo(c);
    pote.clear();
    const r = await ler(
      postLogin(post(`${BASE}/login`, { email, senha: "outra" })),
    );
    expect(r.status).toBe(401);
    expect(pote.size).toBe(0);
  });

  it("login grava log, abre sessão e logout fecha", async () => {
    const c = await criarCenario();
    await entrarComo(c);
    expect(pote.size).toBe(1);
    expect((await ler(getEleicoes(get(`${BASE}/eleicoes`)))).status).toBe(200);
    const logs = await db
      .select({ acao: logAuditoria.acao })
      .from(logAuditoria)
      .where(eq(logAuditoria.usuarioId, c.operadorId));
    expect(logs.map((l) => l.acao)).toContain("sessao.entrar");

    await ler(postLogout(post(`${BASE}/logout`, {})));
    expect(pote.size).toBe(0);
    expect((await ler(getEleicoes(get(`${BASE}/eleicoes`)))).status).toBe(401);
  });

  it("usuário desativado perde o acesso na hora", async () => {
    const c = await criarCenario();
    await entrarComo(c);
    await db
      .update(usuarioAdmin)
      .set({ ativo: false })
      .where(eq(usuarioAdmin.id, c.operadorId));
    expect((await ler(getEleicoes(get(`${BASE}/eleicoes`)))).status).toBe(401);
  });
});

describe("Origin", () => {
  it("POST sem Origin ou de outra origem dá 403 e não grava", async () => {
    const c = await criarCenario();
    await entrarComo(c);
    const corpo = {
      empreendimentoId: c.empreendimentoId,
      titulo: "Não pode",
      teste: true,
    };
    const semOrigem = await ler(
      postEleicao(post(`${BASE}/eleicoes`, corpo, { host: "localhost:3000" })),
    );
    expect(semOrigem.status).toBe(403);
    const outra = await ler(
      postEleicao(
        post(`${BASE}/eleicoes`, corpo, {
          origin: "https://site-malicioso.test",
          host: "localhost:3000",
        }),
      ),
    );
    expect(outra.status).toBe(403);
    const login = await ler(
      postLogin(
        post(
          `${BASE}/login`,
          { email: "x@exemplo.test", senha: "x" },
          { origin: "https://site-malicioso.test", host: "localhost:3000" },
        ),
      ),
    );
    expect(login.status).toBe(403);
  });
});

describe("eleição do início ao fim pelo painel", () => {
  it("cria, abre, recebe voto, desbloqueia, encerra, publica e relata", async () => {
    const c = await criarCenario();
    await entrarComo(c);

    const nova = await ler(
      postEleicao(
        post(`${BASE}/eleicoes`, {
          empreendimentoId: c.empreendimentoId,
          titulo: "Síndico 2027",
          teste: true,
        }),
      ),
    );
    expect(nova.status).toBe(200);
    const id = nova.corpo.id as number;
    const p = params({ id: String(id) });

    // Sem candidato, não abre.
    const cedo = await ler(
      postStatus(post(`${BASE}/eleicoes/${id}/status`, { acao: "abrir" }), p),
    );
    expect(cedo.status).toBe(400);

    const cand = await ler(
      postCandidato(
        post(`${BASE}/eleicoes/${id}/candidatos`, {
          nome: "Candidata Fictícia",
          apartamentoId: c.apto.a101,
          foto: null,
          proposta: "x".repeat(300),
          ordem: 1,
        }),
        p,
      ),
    );
    expect(cand.status).toBe(200);
    const longa = await ler(
      postCandidato(
        post(`${BASE}/eleicoes/${id}/candidatos`, {
          nome: "Outro",
          apartamentoId: null,
          foto: null,
          proposta: "x".repeat(301),
          ordem: 2,
        }),
        p,
      ),
    );
    expect(longa.status).toBe(400);

    const aberta = await ler(
      postStatus(post(`${BASE}/eleicoes/${id}/status`, { acao: "abrir" }), p),
    );
    expect(aberta.corpo).toEqual({ status: "aberta" });

    // Um voto e um apartamento bloqueado.
    const v = await verificarDocumento({
      eleicaoId: id,
      apartamentoId: c.apto.a101,
      documento: c.doc.a101,
    });
    if (!v.ok) throw new Error("verificação falhou");
    await votar({
      eleicaoId: id,
      apartamentoId: c.apto.a101,
      compradorId: v.compradorId,
      candidatoId: cand.corpo.id,
    });
    for (let i = 0; i < 3; i++) {
      await verificarDocumento({
        eleicaoId: id,
        apartamentoId: c.apto.a102,
        documento: c.doc.estranho,
      });
    }

    const painel = await ler(
      getPainel(get(`${BASE}/eleicoes/${id}/painel`), p),
    );
    expect(painel.corpo.contadores).toEqual({
      total: 6,
      votaram: 1,
      faltam: 5,
      bloqueados: 1,
      soMesa: 1,
    });
    expect(painel.corpo.ultimos[0]).toMatchObject({
      apartamentoId: c.apto.a101,
      nome: "Comprador 101",
      origem: "documento",
    });
    // O operador nunca vê em quem cada apartamento votou.
    expect(JSON.stringify(painel.corpo)).not.toMatch(
      /candidato|Candidata Fictícia/i,
    );

    const desbloqueio = await ler(
      postDesbloquear(
        post(`${BASE}/eleicoes/${id}/desbloquear`, {
          apartamentoId: c.apto.a102,
        }),
        p,
      ),
    );
    expect(desbloqueio.status).toBe(200);

    // Antes de encerrar, o relatório não tem resultado.
    const parcial = await ler(
      getRelatorio(get(`${BASE}/eleicoes/${id}/relatorio`), p),
    );
    expect(parcial.corpo.resultado).toBeNull();

    for (const acao of ["encerrar", "publicar"]) {
      const r = await ler(
        postStatus(post(`${BASE}/eleicoes/${id}/status`, { acao }), p),
      );
      expect(r.status).toBe(200);
    }
    const repetido = await ler(
      postStatus(post(`${BASE}/eleicoes/${id}/status`, { acao: "abrir" }), p),
    );
    expect(repetido.status).toBe(400);

    const relatorio = await ler(
      getRelatorio(get(`${BASE}/eleicoes/${id}/relatorio`), p),
    );
    expect(relatorio.corpo).toMatchObject({
      totalApartamentos: 6,
      resultado: [{ nome: "Candidata Fictícia", votos: 1 }],
      vencedores: [{ nome: "Candidata Fictícia" }],
    });
    expect(relatorio.corpo.votaram).toHaveLength(1);
    expect(relatorio.corpo.eleicao.abertaEm).toBeTruthy();
    expect(relatorio.corpo.eleicao.encerradaEm).toBeTruthy();

    const acoes = await db
      .select({ acao: logAuditoria.acao })
      .from(logAuditoria)
      .where(eq(logAuditoria.eleicaoId, id));
    expect(acoes.map((a) => a.acao)).toEqual(
      expect.arrayContaining([
        "eleicao.criar",
        "candidato.criar",
        "eleicao.abrir",
        "apto.desbloquear",
        "eleicao.encerrar",
        "eleicao.publicar",
      ]),
    );
  });

  it("id fora do INT na URL dá 404, não erro 500", async () => {
    const c = await criarCenario();
    await entrarComo(c);
    const r = await ler(
      getPainel(
        get(`${BASE}/eleicoes/99999999999/painel`),
        params({ id: "99999999999" }),
      ),
    );
    expect(r.status).toBe(404);
    const corpo = await ler(
      postDesbloquear(
        post(`${BASE}/eleicoes/1/desbloquear`, { apartamentoId: 2 ** 31 }),
        params({ id: "1" }),
      ),
    );
    expect(corpo.status).toBe(400);
  });
});
