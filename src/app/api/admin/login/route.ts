import { z } from "zod";

import { conferirOrigem, entrar } from "@/lib/auth";

import { ErroHttp, lerCorpo, responder } from "../comum";

const corpoLogin = z.object({
  email: z.string().max(200),
  senha: z.string().max(200),
});

/** Confere e-mail e senha e abre a sessão no cookie. */
export async function POST(req: Request) {
  return responder(async () => {
    conferirOrigem(req);
    const usuario = await entrar(await lerCorpo(req, corpoLogin));
    if (!usuario) throw new ErroHttp(401, "E-mail ou senha não conferem.");
    return { nome: usuario.nome, papel: usuario.papel };
  });
}
