import { z } from "zod";

import { criarEleicao, listarEleicoes } from "@/lib/eleicoes";

import { lerCorpo, rotaAdmin } from "../comum";

export async function GET(req: Request) {
  return rotaAdmin(req, () => listarEleicoes());
}

const corpoEleicao = z.object({
  empreendimentoId: z.number(),
  titulo: z.string(),
  teste: z.boolean(),
});

export async function POST(req: Request) {
  return rotaAdmin(req, async (usuario) =>
    criarEleicao(await lerCorpo(req, corpoEleicao), usuario.id),
  );
}
