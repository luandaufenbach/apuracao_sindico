// Usuários do painel (docs/ESPECIFICACAO.md, "Quem vê o quê"): só o god cria
// e desativa, sempre com motivo. Usuário nunca é apagado, porque o log de
// auditoria aponta para ele; desativado, perde o acesso na hora (auth.ts).
import bcrypt from "bcryptjs";
import { asc, desc, eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import { usuarioAdmin } from "@/db/schema";

import { registrarAuditoria } from "./auditoria";
import {
  AcessoNegado,
  EntradaInvalida,
  idBanco,
  validar,
  violacaoUnica,
} from "./erros";
import { exigirPapel, motivo } from "./regras-voto";

export function listarUsuarios() {
  return db
    .select({
      id: usuarioAdmin.id,
      nome: usuarioAdmin.nome,
      email: usuarioAdmin.email,
      papel: usuarioAdmin.papel,
      ativo: usuarioAdmin.ativo,
    })
    .from(usuarioAdmin)
    .orderBy(desc(usuarioAdmin.ativo), asc(usuarioAdmin.nome), usuarioAdmin.id);
}

const entradaNovoUsuario = z.object({
  nome: z.string().trim().min(1, "Informe o nome.").max(120),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Informe um e-mail válido.").max(200)),
  // O bcrypt só usa os primeiros 72 bytes da senha: acima disso, o resto seria
  // ignorado sem aviso. Letra acentuada ocupa 2 bytes.
  senha: z
    .string()
    .min(8, "A senha precisa de pelo menos 8 caracteres.")
    .max(72, "A senha tem no máximo 72 caracteres.")
    .refine(
      (s) => new TextEncoder().encode(s).length <= 72,
      "A senha é longa demais: use até 72 caracteres sem acento.",
    ),
  papel: z.enum(["operador", "god"]),
  motivo,
  usuarioId: idBanco,
});

export async function criarUsuario(
  // O papel chega como texto do formulário; o Zod confere.
  entrada: Omit<z.input<typeof entradaNovoUsuario>, "papel"> & {
    papel: string;
  },
): Promise<{ id: number }> {
  const e = validar(entradaNovoUsuario, entrada);
  const senhaHash = await bcrypt.hash(e.senha, 12);
  try {
    return await db.transaction(async (tx) => {
      await exigirPapel(tx, e.usuarioId, ["god"]);
      const [u] = await tx
        .insert(usuarioAdmin)
        .values({ nome: e.nome, email: e.email, papel: e.papel, senhaHash })
        .returning({ id: usuarioAdmin.id });
      await registrarAuditoria(
        {
          usuarioId: e.usuarioId,
          acao: "usuario.criar",
          alvo: `usuario:${u.id}`,
          motivo: e.motivo,
          dados: { nome: e.nome, email: e.email, papel: e.papel },
        },
        tx,
      );
      return u;
    });
  } catch (erro) {
    if (violacaoUnica(erro) === "usuario_admin_email_unique") {
      throw new EntradaInvalida("Já existe um usuário com este e-mail.");
    }
    throw erro;
  }
}

const entradaDesativar = z.object({
  alvoId: idBanco,
  usuarioId: idBanco,
  motivo,
});

/**
 * Desativa um usuário. Ninguém desativa a si mesmo, então sempre sobra ao
 * menos um god ativo, mesmo com dois gods desativando um ao outro ao mesmo
 * tempo: as duas linhas são travadas na mesma ordem e o segundo já não é god
 * ativo quando chega a vez dele.
 */
export async function desativarUsuario(
  entrada: z.input<typeof entradaDesativar>,
): Promise<void> {
  const e = validar(entradaDesativar, entrada);
  if (e.alvoId === e.usuarioId) {
    throw new EntradaInvalida("Você não pode desativar o próprio usuário.");
  }
  await db.transaction(async (tx) => {
    const linhas = await tx
      .select({
        id: usuarioAdmin.id,
        nome: usuarioAdmin.nome,
        email: usuarioAdmin.email,
        papel: usuarioAdmin.papel,
        ativo: usuarioAdmin.ativo,
      })
      .from(usuarioAdmin)
      .where(inArray(usuarioAdmin.id, [e.alvoId, e.usuarioId]))
      .orderBy(usuarioAdmin.id)
      .for("update");
    const quem = linhas.find((u) => u.id === e.usuarioId);
    const alvo = linhas.find((u) => u.id === e.alvoId);
    if (!quem?.ativo || quem.papel !== "god") throw new AcessoNegado();
    if (!alvo) throw new EntradaInvalida("Usuário não encontrado.");
    if (!alvo.ativo) {
      throw new EntradaInvalida("Este usuário já está desativado.");
    }
    await tx
      .update(usuarioAdmin)
      .set({ ativo: false })
      .where(eq(usuarioAdmin.id, e.alvoId));
    await registrarAuditoria(
      {
        usuarioId: e.usuarioId,
        acao: "usuario.desativar",
        alvo: `usuario:${e.alvoId}`,
        motivo: e.motivo,
        dados: { nome: alvo.nome, email: alvo.email, papel: alvo.papel },
      },
      tx,
    );
  });
}
