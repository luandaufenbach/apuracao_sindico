// Login e sessão do painel (docs/ESPECIFICACAO.md, "Papéis" e "Segurança").
// A sessão guarda só o id do usuário; papel e `ativo` são relidos do banco a
// cada requisição, então desativar um usuário corta o acesso na hora.
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { z } from "zod";

import { db } from "@/db";
import { usuarioAdmin } from "@/db/schema";

import { registrarAuditoria } from "./auditoria";
import { AcessoNegado, validar } from "./erros";

export type Papel = "operador" | "god";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  papel: Papel;
};

/** Usuário sem sessão válida (HTTP 401). */
export class SemSessao extends Error {
  constructor() {
    super("Sua sessão terminou. Entre de novo.");
    this.name = "SemSessao";
  }
}

/** POST de outra origem (HTTP 403). */
export class OrigemRecusada extends Error {
  constructor() {
    super("Origem da requisição não permitida.");
    this.name = "OrigemRecusada";
  }
}

type DadosSessao = { usuarioId: number };

// 12 h cobrem o dia do evento; depois, login de novo.
const DURACAO_SESSAO = 60 * 60 * 12;

function opcoesSessao(): SessionOptions {
  const segredo = process.env.SESSION_SECRET;
  if (!segredo || segredo.length < 32) {
    throw new Error(
      "SESSION_SECRET ausente ou curto: precisa de pelo menos 32 caracteres.",
    );
  }
  return {
    cookieName: "apuracao_sessao",
    password: segredo,
    ttl: DURACAO_SESSAO,
    // Navegadores aceitam cookie `secure` em http://localhost, então vale no dev.
    cookieOptions: { httpOnly: true, secure: true, sameSite: "lax", path: "/" },
  };
}

const lerSessao = async () =>
  getIronSession<DadosSessao>(await cookies(), opcoesSessao());

// --- Login -------------------------------------------------------------------

const entradaLogin = z.object({
  email: z.email("Informe um e-mail válido.").trim().toLowerCase().max(200),
  senha: z.string().min(1, "Informe a senha.").max(200),
});

// Hash de uma senha qualquer: e-mail inexistente leva o mesmo tempo que senha
// errada, então a resposta não revela quem tem conta.
let hashFalso: Promise<string> | undefined;

/** Confere e-mail e senha. Devolve o usuário ativo, ou null. */
export async function autenticar(
  entrada: z.input<typeof entradaLogin>,
): Promise<Usuario | null> {
  const { email, senha } = validar(entradaLogin, entrada);
  const [u] = await db
    .select({
      id: usuarioAdmin.id,
      nome: usuarioAdmin.nome,
      email: usuarioAdmin.email,
      papel: usuarioAdmin.papel,
      ativo: usuarioAdmin.ativo,
      senhaHash: usuarioAdmin.senhaHash,
    })
    .from(usuarioAdmin)
    .where(eq(usuarioAdmin.email, email));
  hashFalso ??= bcrypt.hash("senha-que-nao-existe", 12);
  const confere = await bcrypt.compare(
    senha,
    u?.senhaHash ?? (await hashFalso),
  );
  if (!u || !confere || !u.ativo) return null;
  return { id: u.id, nome: u.nome, email: u.email, papel: u.papel };
}

/** Confere a senha e abre a sessão no cookie. */
export async function entrar(
  entrada: z.input<typeof entradaLogin>,
): Promise<Usuario | null> {
  const usuario = await autenticar(entrada);
  if (!usuario) return null;
  const sessao = await lerSessao();
  sessao.usuarioId = usuario.id;
  await sessao.save();
  await registrarAuditoria({ usuarioId: usuario.id, acao: "sessao.entrar" });
  return usuario;
}

export async function sair(): Promise<void> {
  const sessao = await lerSessao();
  const usuarioId = sessao.usuarioId;
  sessao.destroy();
  if (usuarioId) await registrarAuditoria({ usuarioId, acao: "sessao.sair" });
}

// --- Quem está logado --------------------------------------------------------

/** Usuário da sessão, se existir e estiver ativo. Uma consulta por requisição. */
export const usuarioAtual = cache(async (): Promise<Usuario | null> => {
  const { usuarioId } = await lerSessao();
  if (!usuarioId) return null;
  const [u] = await db
    .select({
      id: usuarioAdmin.id,
      nome: usuarioAdmin.nome,
      email: usuarioAdmin.email,
      papel: usuarioAdmin.papel,
      ativo: usuarioAdmin.ativo,
    })
    .from(usuarioAdmin)
    .where(eq(usuarioAdmin.id, usuarioId));
  if (!u?.ativo) return null;
  return { id: u.id, nome: u.nome, email: u.email, papel: u.papel };
});

const TODOS: Papel[] = ["operador", "god"];

/** Para rotas da API: sem sessão lança SemSessao (401); sem papel, AcessoNegado (403). */
export async function exigirUsuario(papeis: Papel[] = TODOS): Promise<Usuario> {
  const usuario = await usuarioAtual();
  if (!usuario) throw new SemSessao();
  if (!papeis.includes(usuario.papel)) throw new AcessoNegado();
  return usuario;
}

/** Para páginas: sem sessão vai para o login; sem papel, 404. */
export async function exigirUsuarioPagina(
  papeis: Papel[] = TODOS,
): Promise<Usuario> {
  const usuario = await usuarioAtual();
  if (!usuario) redirect("/admin/login");
  if (!papeis.includes(usuario.papel)) notFound();
  return usuario;
}

// --- Origem ------------------------------------------------------------------

/**
 * Todo POST do painel vem do próprio site: o header Origin precisa ter o mesmo
 * host da requisição. Sem Origin, recusa (navegadores sempre mandam no POST).
 */
export function conferirOrigem(req: Request): void {
  const origem = req.headers.get("origin");
  if (!origem) throw new OrigemRecusada();
  let host: string;
  try {
    host = new URL(origem).host;
  } catch {
    throw new OrigemRecusada();
  }
  const aceitos = [
    req.headers.get("host"),
    req.headers.get("x-forwarded-host"),
  ];
  if (!aceitos.includes(host)) throw new OrigemRecusada();
}
