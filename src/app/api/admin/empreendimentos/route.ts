import { z } from "zod";

import { criarEmpreendimento, listarEmpreendimentos } from "@/lib/cadastro";

import { lerCorpo, rotaAdmin } from "../comum";

export async function GET(req: Request) {
  return rotaAdmin(req, () => listarEmpreendimentos());
}

const corpoEmpreendimento = z.object({ nome: z.string() });

export async function POST(req: Request) {
  return rotaAdmin(req, async (usuario) =>
    criarEmpreendimento(await lerCorpo(req, corpoEmpreendimento), usuario.id),
  );
}
