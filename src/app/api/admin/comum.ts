// Peças comuns da API do painel (docs/ESPECIFICACAO.md, "API → Admin").
// Toda rota confere a sessão e o papel no servidor; todo POST confere a Origin.
import { DrizzleQueryError } from "drizzle-orm";

import { ErroHttp } from "@/app/api/e/comum";
import {
  conferirOrigem,
  exigirUsuario,
  OrigemRecusada,
  type Papel,
  SemSessao,
  type Usuario,
} from "@/lib/auth";
import { AcessoNegado, EntradaInvalida, idBanco } from "@/lib/erros";

export { ErroHttp, lerCorpo } from "@/app/api/e/comum";

const semCache = { "Cache-Control": "no-store" };

function statusDoErro(erro: unknown): number | null {
  if (erro instanceof ErroHttp) return erro.status;
  if (erro instanceof EntradaInvalida) return 400;
  if (erro instanceof SemSessao) return 401;
  if (erro instanceof AcessoNegado || erro instanceof OrigemRecusada) {
    return 403;
  }
  return null;
}

/** Roda a rota e responde em JSON; erros conhecidos saem com `{ mensagem }`. */
export async function responder(rota: () => Promise<unknown>) {
  try {
    return Response.json((await rota()) ?? { ok: true }, { headers: semCache });
  } catch (erro) {
    const status = statusDoErro(erro);
    if (status !== null) {
      return Response.json(
        { mensagem: (erro as Error).message },
        { status, headers: semCache },
      );
    }
    // A mensagem do DrizzleQueryError traz os parâmetros da consulta, que
    // podem ter documento de comprador: o log fica só com o erro do driver.
    console.error(erro instanceof DrizzleQueryError ? erro.cause : erro);
    return Response.json(
      { mensagem: "Erro interno. Tente de novo." },
      { status: 500, headers: semCache },
    );
  }
}

/**
 * Rota do painel: confere a Origin (fora do GET), a sessão e o papel, e só
 * então roda. Por padrão vale para operador e god.
 */
export function rotaAdmin(
  req: Request,
  rota: (usuario: Usuario) => Promise<unknown>,
  papeis?: Papel[],
) {
  return responder(async () => {
    if (req.method !== "GET" && req.method !== "HEAD") conferirOrigem(req);
    return rota(await exigirUsuario(papeis));
  });
}

/** Rota do godmode: só o papel god, conferido no servidor a cada requisição. */
export function rotaGod(
  req: Request,
  rota: (usuario: Usuario) => Promise<unknown>,
) {
  return rotaAdmin(req, rota, ["god"]);
}

/** Id da URL (`id` ou outro segmento); fora do formato vira 404. */
export async function idDaRota<P extends Record<string, string>>(
  params: Promise<P>,
  chave: keyof P = "id",
) {
  const id = (await params)[chave];
  const lido = idBanco.safeParse(/^\d{1,10}$/.test(id) ? Number(id) : NaN);
  if (!lido.success) throw new ErroHttp(404, "Registro não encontrado.");
  return lido.data;
}
