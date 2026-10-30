import { z } from "zod";

import { criarUsuario, listarUsuarios } from "@/lib/usuarios";

import { lerCorpo, rotaGod } from "../comum";

export async function GET(req: Request) {
  return rotaGod(req, async () => ({ usuarios: await listarUsuarios() }));
}

const corpoUsuario = z.object({
  nome: z.string(),
  email: z.string(),
  senha: z.string(),
  papel: z.string(),
  motivo: z.string(),
});

/** Cria um operador ou god. Só o god cria usuários. */
export async function POST(req: Request) {
  return rotaGod(req, async (usuario) =>
    criarUsuario({
      ...(await lerCorpo(req, corpoUsuario)),
      usuarioId: usuario.id,
    }),
  );
}
