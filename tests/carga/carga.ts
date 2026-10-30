// Carga na API pública (docs/ROTEIRO.md, F6): 300 votos em 60 s, com votos
// repetidos no mesmo apartamento. No fim, a consulta de duplicidade do roteiro
// precisa voltar vazia, e cada apartamento atacado tem exatamente um voto
// válido: nem duplicado, nem perdido.
//
//   npm run test:carga -- [--url http://localhost:3000] [--codigo demo]
//                         [--votos 300] [--segundos 60]
//
// Só roda em eleição de teste aberta. Rode `npm run db:seed` antes, para a
// eleição começar sem votos, e de novo depois, para limpar.
import "../../src/db/carregar-env";

import { parseArgs } from "node:util";

import { Pool } from "pg";

const { values: opcoes } = parseArgs({
  options: {
    url: { type: "string", default: "http://localhost:3000" },
    codigo: { type: "string", default: "demo" },
    votos: { type: "string", default: "300" },
    segundos: { type: "string", default: "60" },
  },
});
const URL_BASE = opcoes.url.replace(/\/$/, "");
const CODIGO = opcoes.codigo;
const TOTAL_VOTOS = Number(opcoes.votos);
const DURACAO_MS = Number(opcoes.segundos) * 1000;

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 2 });
const consultar = async <T>(sql: string, params: unknown[] = []) =>
  (await pool.query(sql, params)).rows as T[];

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

// --- Cliente da API pública ------------------------------------------------

type Medida = { rota: string; status: number; ms: number };
const medidas: Medida[] = [];

async function chamar(rota: string, corpo?: unknown) {
  const inicio = performance.now();
  let status = 0;
  try {
    const r = await fetch(`${URL_BASE}/api/e/${CODIGO}${rota}`, {
      method: corpo ? "POST" : "GET",
      headers: corpo ? { "Content-Type": "application/json" } : undefined,
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
    status = r.status;
    return { status, corpo: await r.json() };
  } catch (erro) {
    return { status, corpo: { falha: String(erro) } };
  } finally {
    medidas.push({ rota, status, ms: performance.now() - inicio });
  }
}

async function verificar(apartamentoId: number, documento: string) {
  const r = await chamar("/verificar", { apartamentoId, documento });
  return r.corpo?.ok === true ? (r.corpo.token as string) : null;
}

type RespostaVoto =
  | { tipo: "ok"; comprovante: string }
  | { tipo: "ja_votou" }
  | { tipo: "outro"; status: number; corpo: unknown };

async function votar(
  token: string,
  candidatoId: number,
): Promise<RespostaVoto> {
  const r = await chamar("/votar", { token, candidatoId });
  if (r.status === 200 && r.corpo.ok === true) {
    return { tipo: "ok", comprovante: r.corpo.comprovante };
  }
  if (r.status === 200 && r.corpo.erro === "ja_votou")
    return { tipo: "ja_votou" };
  return { tipo: "outro", status: r.status, corpo: r.corpo };
}

// --- Plano -------------------------------------------------------------------

type Alvo = { apartamentoId: number; rotulo: string; documento: string };

/**
 * Como os votos repetidos chegam:
 * - simultaneo: vários tokens tirados antes, e todos os votos no mesmo instante
 *   (o duplo toque e vários celulares da mesma família);
 * - atrasado: um token tirado antes do 1º voto e usado depois que ele gravou
 *   (a aba esquecida aberta no outro celular).
 */
type Grupo = {
  alvo: Alvo;
  votos: number;
  modo: "unico" | "simultaneo" | "atrasado";
};

function planejar(alvos: Alvo[]): Grupo[] {
  if (TOTAL_VOTOS < alvos.length) alvos = alvos.slice(0, TOTAL_VOTOS);
  const grupos: Grupo[] = alvos.map((alvo) => ({
    alvo,
    votos: 1,
    modo: "unico",
  }));
  // Os votos que sobram viram repetidos, de 2 a 4 por apartamento, em cerca
  // de 45% dos apartamentos (o resto vota uma vez só).
  let sobra = TOTAL_VOTOS - grupos.length;
  const comRepetido = Math.max(
    Math.ceil(grupos.length * 0.45),
    Math.ceil(sobra / 3),
  );
  if (sobra > Math.min(comRepetido, grupos.length) * 3) {
    throw new Error("Votos demais para os apartamentos livres.");
  }
  for (let i = 0; sobra > 0; i = (i + 1) % comRepetido) {
    const g = grupos[i];
    if (g.votos >= 4) continue;
    g.votos++;
    sobra--;
  }
  grupos.forEach((g, i) => {
    if (g.votos > 1) g.modo = i % 3 === 0 ? "atrasado" : "simultaneo";
  });
  return grupos;
}

// --- Execução ----------------------------------------------------------------

type Resultado = { alvo: Alvo; respostas: RespostaVoto[]; semToken: number };

async function rodarGrupo(g: Grupo, candidatos: number[]): Promise<Resultado> {
  const tokens = await Promise.all(
    Array.from({ length: g.votos }, () =>
      verificar(g.alvo.apartamentoId, g.alvo.documento),
    ),
  );
  const validos = tokens.filter((t): t is string => t !== null);
  const candidato = (i: number) =>
    candidatos[(g.alvo.apartamentoId + i) % candidatos.length];
  let respostas: RespostaVoto[];
  if (g.modo === "atrasado") {
    const [primeiro, ...resto] = validos;
    respostas = primeiro ? [await votar(primeiro, candidato(0))] : [];
    await esperar(500);
    respostas.push(
      ...(await Promise.all(resto.map((t, i) => votar(t, candidato(i + 1))))),
    );
  } else {
    respostas = await Promise.all(
      validos.map((t, i) => votar(t, candidato(i))),
    );
  }
  return { alvo: g.alvo, respostas, semToken: g.votos - validos.length };
}

function percentil(ms: number[], p: number) {
  const ordem = [...ms].sort((a, b) => a - b);
  return (
    ordem[Math.min(ordem.length - 1, Math.floor((p / 100) * ordem.length))] ?? 0
  );
}

async function main() {
  const [el] = await consultar<{
    id: number;
    empreendimento_id: number;
    status: string;
    teste: boolean;
  }>(
    "SELECT id, empreendimento_id, status, teste FROM eleicao WHERE codigo = $1",
    [CODIGO],
  );
  if (!el) throw new Error(`Eleição "${CODIGO}" não encontrada.`);
  if (!el.teste) throw new Error("A carga só roda em eleição de teste.");
  if (el.status !== "aberta")
    throw new Error(`A eleição está ${el.status}, não aberta.`);

  // Um documento por apartamento que ainda pode votar pelo celular.
  const alvos = await consultar<Alvo>(
    `SELECT DISTINCT ON (a.id) a.id AS "apartamentoId",
            a.bloco || ', ' || a.rotulo AS rotulo, c.documento
       FROM apartamento a
       JOIN comprador c ON c.apartamento_id = a.id AND c.documento IS NOT NULL
       LEFT JOIN situacao_apartamento s
              ON s.apartamento_id = a.id AND s.eleicao_id = $1
      WHERE a.empreendimento_id = $2
        AND NOT coalesce(s.bloqueado, false)
        AND NOT EXISTS (SELECT 1 FROM voto v WHERE v.eleicao_id = $1
                          AND v.apartamento_id = a.id AND v.status = 'valido')
      ORDER BY a.id, c.id`,
    [el.id, el.empreendimento_id],
  );
  if (alvos.length === 0)
    throw new Error("Nenhum apartamento livre: rode npm run db:seed.");

  const eleicao = await chamar("");
  if (eleicao.status !== 200)
    throw new Error(`GET /api/e/${CODIGO}: HTTP ${eleicao.status}`);
  const candidatos = (eleicao.corpo.candidatos as { id: number }[]).map(
    (c) => c.id,
  );
  medidas.length = 0;

  const grupos = planejar(alvos);
  const contagem = (m: Grupo["modo"]) =>
    grupos.filter((g) => g.modo === m).length;
  console.log(
    `Carga: ${TOTAL_VOTOS} votos em ${DURACAO_MS / 1000} s contra ${URL_BASE}, eleição "${CODIGO}".\n` +
      `${grupos.length} apartamentos: ${contagem("unico")} com 1 voto, ` +
      `${contagem("simultaneo")} com repetidos simultâneos, ${contagem("atrasado")} com repetido atrasado.`,
  );

  // Os grupos começam espalhados pela duração, em ordem embaralhada.
  const ordem = grupos
    .map((g, i) => ({ g, chave: (i * 7919) % grupos.length }))
    .sort((a, b) => a.chave - b.chave)
    .map((x) => x.g);
  const intervalo = DURACAO_MS / ordem.length;
  const inicio = performance.now();
  const resultados = await Promise.all(
    ordem.map(async (g, i) => {
      await esperar(i * intervalo);
      return rodarGrupo(g, candidatos);
    }),
  );
  const duracao = (performance.now() - inicio) / 1000;

  // --- Conferência -----------------------------------------------------------
  const problemas: string[] = [];
  let ok = 0;
  let jaVotou = 0;
  let outros = 0;
  let semToken = 0;
  const comprovantes: string[] = [];
  for (const r of resultados) {
    semToken += r.semToken;
    const oks = r.respostas.filter((x) => x.tipo === "ok");
    ok += oks.length;
    jaVotou += r.respostas.filter((x) => x.tipo === "ja_votou").length;
    for (const x of r.respostas) {
      if (x.tipo === "outro") {
        outros++;
        problemas.push(
          `${r.alvo.rotulo}: resposta inesperada HTTP ${x.status} ${JSON.stringify(x.corpo)}`,
        );
      }
      if (x.tipo === "ok") comprovantes.push(x.comprovante);
    }
    if (oks.length !== 1) {
      problemas.push(
        `${r.alvo.rotulo}: ${oks.length} votos aceitos (esperado 1).`,
      );
    }
  }
  if (semToken > 0) problemas.push(`${semToken} verificações sem token.`);

  const duplicados = await consultar<{ apartamento_id: number; count: string }>(
    `SELECT apartamento_id, count(*)
       FROM voto
      WHERE eleicao_id = $1 AND status = 'valido'
      GROUP BY apartamento_id
     HAVING count(*) > 1`,
    [el.id],
  );
  const gravados = await consultar<{
    apartamento_id: number;
    comprovante: string;
  }>(
    `SELECT apartamento_id, comprovante FROM voto
      WHERE eleicao_id = $1 AND status = 'valido' AND apartamento_id = ANY($2)`,
    [el.id, grupos.map((g) => g.alvo.apartamentoId)],
  );
  const noBanco = new Set(gravados.map((v) => v.comprovante));
  const perdidos = comprovantes.filter((c) => !noBanco.has(c));
  if (perdidos.length > 0)
    problemas.push(`${perdidos.length} comprovantes sem voto válido no banco.`);
  if (gravados.length !== grupos.length) {
    problemas.push(
      `${gravados.length} votos válidos no banco para ${grupos.length} apartamentos.`,
    );
  }

  const votosMs = medidas.filter((m) => m.rota === "/votar").map((m) => m.ms);
  const verificarMs = medidas
    .filter((m) => m.rota === "/verificar")
    .map((m) => m.ms);
  const erros5xx = medidas.filter(
    (m) => m.status === 0 || m.status >= 500,
  ).length;
  if (erros5xx > 0)
    problemas.push(`${erros5xx} respostas 5xx ou sem resposta.`);

  console.log(
    `\nTerminou em ${duracao.toFixed(1)} s. POST /votar: ${votosMs.length} ` +
      `(${ok} aceitos, ${jaVotou} ja_votou, ${outros} outros). POST /verificar: ${verificarMs.length}.`,
  );
  console.log(
    `Latência /votar: p50 ${percentil(votosMs, 50).toFixed(0)} ms, p95 ${percentil(votosMs, 95).toFixed(0)} ms, ` +
      `máx ${percentil(votosMs, 100).toFixed(0)} ms. /verificar: p50 ${percentil(verificarMs, 50).toFixed(0)} ms, ` +
      `p95 ${percentil(verificarMs, 95).toFixed(0)} ms.`,
  );
  console.log(
    `Votos válidos no banco para os apartamentos da carga: ${gravados.length}.`,
  );
  console.log(`\nConsulta de duplicidade (eleicao_id = ${el.id}):`);
  console.table(duplicados);
  console.log(
    duplicados.length === 0
      ? "(0 linhas)"
      : `${duplicados.length} apartamentos com voto duplicado!`,
  );
  if (duplicados.length > 0)
    problemas.push(
      `${duplicados.length} apartamentos com mais de um voto válido.`,
    );

  if (problemas.length > 0) {
    console.error(`\nFALHOU:\n- ${problemas.slice(0, 30).join("\n- ")}`);
    process.exitCode = 1;
  } else {
    console.log(
      "\nOK: um voto válido por apartamento, nenhum duplicado e nenhum perdido.",
    );
  }
}

main()
  .catch((erro) => {
    console.error(erro);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
