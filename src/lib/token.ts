// Token do voto (docs/ESPECIFICACAO.md, "API → Pública"): o verificar confere
// o documento e devolve este JWT; o votar só aceita o voto com ele. Leva só
// ids, nunca nome nem documento (R10).
import { jwtVerify, SignJWT } from "jose";
import { z } from "zod";

const ALGORITMO = "HS256";
const VALIDADE = "10m";

const conteudoToken = z.object({
  eleicaoId: z.int().positive(),
  apartamentoId: z.int().positive(),
  compradorId: z.int().positive(),
});

export type ConteudoToken = z.infer<typeof conteudoToken>;

function chave(): Uint8Array {
  const segredo = process.env.VOTO_TOKEN_SECRET;
  if (!segredo || segredo.length < 32) {
    throw new Error(
      "VOTO_TOKEN_SECRET ausente ou curto: precisa de pelo menos 32 caracteres.",
    );
  }
  return new TextEncoder().encode(segredo);
}

export async function assinarToken(conteudo: ConteudoToken): Promise<string> {
  const { eleicaoId, apartamentoId, compradorId } =
    conteudoToken.parse(conteudo);
  return new SignJWT({ eleicaoId, apartamentoId, compradorId })
    .setProtectedHeader({ alg: ALGORITMO })
    .setIssuedAt()
    .setExpirationTime(VALIDADE)
    .sign(chave());
}

/** Conteúdo do token, ou null se for inválido, adulterado ou vencido. */
export async function lerToken(token: string): Promise<ConteudoToken | null> {
  // Fora do try: segredo ausente é erro de configuração, não token inválido.
  const k = chave();
  try {
    const { payload } = await jwtVerify(token, k, {
      algorithms: [ALGORITMO],
      requiredClaims: ["exp"],
    });
    const lido = conteudoToken.safeParse(payload);
    return lido.success ? lido.data : null;
  } catch {
    return null;
  }
}
