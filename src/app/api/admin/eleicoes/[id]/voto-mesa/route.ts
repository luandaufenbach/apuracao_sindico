import { z } from "zod";

import { EntradaInvalida, idBanco } from "@/lib/erros";
import { apartamentosComVoto } from "@/lib/godmode";
import { votarPelaMesa } from "@/lib/regras-voto";

import { ErroHttp, idDaRota, lerCorpo, rotaGod } from "../../../comum";

const corpoMesa = z.object({
  apartamentoIds: z.array(idBanco),
  candidatoId: idBanco,
  nome: z.string(),
  documento: z.string(),
  motivo: z.string(),
});

/** Voto pela mesa em lote (R12): um voto por apartamento, todos ou nenhum. */
export async function POST(
  req: Request,
  ctx: RouteContext<"/api/admin/eleicoes/[id]/voto-mesa">,
) {
  return rotaGod(req, async (usuario) => {
    const eleicaoId = await idDaRota(ctx.params);
    const corpo = await lerCorpo(req, corpoMesa);
    const r = await votarPelaMesa({
      ...corpo,
      eleicaoId,
      usuarioId: usuario.id,
    });
    if (r.ok) return { votos: r.votos };
    if (r.erro === "documento_invalido") {
      throw new EntradaInvalida("Documento inválido. Confira o CPF ou o CNPJ.");
    }
    if (r.erro === "eleicao_fechada") {
      throw new ErroHttp(409, "A votação não está aberta.");
    }
    const jaVotaram = await apartamentosComVoto(
      eleicaoId,
      corpo.apartamentoIds,
    );
    throw new ErroHttp(
      409,
      jaVotaram.length === 0
        ? "Um dos apartamentos já votou. Nenhum voto foi gravado."
        : `${jaVotaram.join("; ")} já ${jaVotaram.length === 1 ? "votou" : "votaram"}. Nenhum voto foi gravado.`,
    );
  });
}
