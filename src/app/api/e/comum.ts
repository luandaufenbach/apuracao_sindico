// Peças comuns da API pública (docs/ESPECIFICACAO.md, "API → Pública").
// R10: nenhuma rota pública devolve nome, telefone ou documento de comprador;
// do documento, só os 3 primeiros caracteres na dica.
import { DrizzleQueryError, eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { eleicao, empreendimento } from "@/db/schema";
import { EntradaInvalida, validar } from "@/lib/erros";

/** Erro com status HTTP próprio (401, 404). EntradaInvalida vira 400. */
export class ErroHttp extends Error {
  constructor(
    readonly status: number,
    mensagem: string,
  ) {
    super(mensagem);
    this.name = "ErroHttp";
  }
}

/** Id de tabela: inteiro positivo que cabe no INT do PostgreSQL. */
export const idBanco = z.int().positive().max(2_147_483_647);

const codigoEleicao = z.string().min(1).max(100);

export async function eleicaoPorCodigo(params: Promise<{ codigo: string }>) {
  const lido = codigoEleicao.safeParse((await params).codigo);
  if (!lido.success) throw new ErroHttp(404, "Eleição não encontrada.");
  const [el] = await db
    .select({
      id: eleicao.id,
      empreendimentoId: eleicao.empreendimentoId,
      empreendimento: empreendimento.nome,
      titulo: eleicao.titulo,
      status: eleicao.status,
    })
    .from(eleicao)
    .innerJoin(empreendimento, eq(empreendimento.id, eleicao.empreendimentoId))
    .where(eq(eleicao.codigo, lido.data));
  if (!el) throw new ErroHttp(404, "Eleição não encontrada.");
  return el;
}

/** Lê o corpo JSON e valida com Zod; corpo malformado vira 400. */
export async function lerCorpo<T extends z.ZodType>(
  req: Request,
  schema: T,
): Promise<z.output<T>> {
  let corpo: unknown;
  try {
    corpo = await req.json();
  } catch {
    throw new EntradaInvalida("O corpo da requisição precisa ser JSON.");
  }
  return validar(schema, corpo);
}

const semCache = { "Cache-Control": "no-store" };

/**
 * Roda a rota e responde em JSON. Recusas da regra (`{ ok: false, erro }`)
 * saem com 200; entrada inválida, token e registro inexistente saem com
 * status de erro e `{ mensagem }`.
 */
export async function responder(rota: () => Promise<unknown>) {
  try {
    return Response.json(await rota(), { headers: semCache });
  } catch (erro) {
    if (erro instanceof ErroHttp || erro instanceof EntradaInvalida) {
      return Response.json(
        { mensagem: erro.message },
        {
          status: erro instanceof ErroHttp ? erro.status : 400,
          headers: semCache,
        },
      );
    }
    // A mensagem do DrizzleQueryError traz os parâmetros da consulta (no
    // verificar, o documento digitado): o log fica só com o erro do driver.
    console.error(erro instanceof DrizzleQueryError ? erro.cause : erro);
    return Response.json(
      { mensagem: "Erro interno. Tente de novo." },
      { status: 500, headers: semCache },
    );
  }
}
