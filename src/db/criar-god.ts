import "./carregar-env";

import { createInterface } from "node:readline/promises";

import bcrypt from "bcryptjs";
import { and, DrizzleQueryError, eq } from "drizzle-orm";

import { registrarAuditoria } from "../lib/auditoria";
import { violacaoUnica } from "../lib/erros";
import { emailUsuario, nomeUsuario, senhaNova } from "../lib/usuarios";
import { db } from "./index";
import { usuarioAdmin } from "./schema";

// Cria o primeiro usuário god de um banco novo (docs/DIA-DO-EVENTO.md):
//
//   npm run prod:criar-god    (banco de produção, lido de .env.producao)
//   npm run db:criar-god      (banco do .env)
//
// Nome, e-mail e senha são pedidos no terminal. A senha não aparece na tela e
// não passa por argumento, arquivo nem histórico do shell. Se já existe god
// ativo, o script para: os próximos usuários são criados em /admin/usuarios.

/** Lê uma linha sem mostrar o que é digitado. */
function lerOculto(pergunta: string): Promise<string> {
  const entrada = process.stdin;
  return new Promise((resolve, reject) => {
    let valor = "";
    const terminar = (erro?: Error) => {
      entrada.off("data", aoDigitar);
      entrada.setRawMode(false);
      entrada.pause();
      process.stdout.write("\n");
      if (erro) reject(erro);
      else resolve(valor);
    };
    const aoDigitar = (pedaco: string) => {
      for (const c of pedaco) {
        if (c === "\r" || c === "\n") return terminar();
        if (c === "\u0003") return terminar(new Error("Cancelado."));
        if (c === "\u007f" || c === "\b") valor = valor.slice(0, -1);
        else if (c >= " ") valor += c;
      }
    };
    process.stdout.write(pergunta);
    entrada.setRawMode(true);
    entrada.setEncoding("utf8");
    entrada.on("data", aoDigitar);
    entrada.resume();
  });
}

async function main() {
  if (!process.stdin.isTTY) {
    throw new Error("Rode num terminal interativo: a senha é digitada aqui.");
  }
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não definida.");

  const terminal = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  let nome: string;
  let email: string;
  try {
    // Só o host aparece: confirma o banco sem mostrar usuário e senha da URL.
    const host = new URL(url).hostname;
    const confirma = await terminal.question(
      `Banco: ${host}\nCriar o god inicial neste banco? (s/N) `,
    );
    if (confirma.trim().toLowerCase() !== "s") {
      console.log("Nada foi criado.");
      return;
    }

    const [godAtivo] = await db
      .select({ id: usuarioAdmin.id })
      .from(usuarioAdmin)
      .where(and(eq(usuarioAdmin.papel, "god"), eq(usuarioAdmin.ativo, true)))
      .limit(1);
    if (godAtivo) {
      throw new Error(
        "Este banco já tem um god ativo. Crie os próximos usuários em /admin/usuarios.",
      );
    }

    nome = nomeUsuario.parse(await terminal.question("Nome: "));
    email = emailUsuario.parse(await terminal.question("E-mail: "));
  } finally {
    terminal.close();
  }

  const senha = await lerOculto("Senha (mín. 8 caracteres): ");
  const conferido = senhaNova.safeParse(senha);
  if (!conferido.success) throw new Error(conferido.error.issues[0].message);
  if ((await lerOculto("Repita a senha: ")) !== senha) {
    throw new Error("As senhas não conferem. Nada foi criado.");
  }

  const senhaHash = await bcrypt.hash(senha, 12);
  const id = await db.transaction(async (tx) => {
    const [u] = await tx
      .insert(usuarioAdmin)
      .values({ nome, email, papel: "god", senhaHash })
      .returning({ id: usuarioAdmin.id });
    await registrarAuditoria(
      {
        usuarioId: u.id,
        acao: "usuario.criar",
        alvo: `usuario:${u.id}`,
        motivo: "God inicial criado pelo script criar-god.",
        dados: { nome, email, papel: "god" },
      },
      tx,
    );
    return u.id;
  });
  console.log(`God criado (id ${id}): ${email}. Entre em /admin/login.`);
}

main()
  .catch((erro) => {
    if (violacaoUnica(erro) === "usuario_admin_email_unique") {
      erro = new Error("Já existe um usuário com este e-mail.");
    }
    // A mensagem do DrizzleQueryError traz os parâmetros da consulta (com o
    // hash da senha): sai só o erro do driver.
    if (erro instanceof DrizzleQueryError) erro = erro.cause;
    // Erro do Zod ou do script: só a mensagem, sem pilha nem dados digitados.
    const issues = (erro as { issues?: { message: string }[] }).issues;
    console.error(issues?.[0]?.message ?? (erro as Error).message);
    process.exitCode = 1;
  })
  .finally(() => db.$client.end());
