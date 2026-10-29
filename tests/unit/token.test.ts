import { decodeJwt, SignJWT, UnsecuredJWT } from "jose";
import { describe, expect, it } from "vitest";

import { assinarToken, lerToken } from "@/lib/token";

const conteudo = { eleicaoId: 1, apartamentoId: 2, compradorId: 3 };
const chave = (segredo: string) => new TextEncoder().encode(segredo);

describe("token do voto", () => {
  it("assina e lê eleicaoId, apartamentoId e compradorId", async () => {
    const token = await assinarToken(conteudo);
    expect(await lerToken(token)).toEqual(conteudo);
  });

  it("vale 10 minutos e só leva ids", async () => {
    const lido = decodeJwt(await assinarToken(conteudo));
    expect(lido.exp! - lido.iat!).toBe(600);
    expect(Object.keys(lido).sort()).toEqual(
      ["apartamentoId", "compradorId", "eleicaoId", "exp", "iat"].sort(),
    );
  });

  it("recusa token adulterado", async () => {
    const [cabecalho, , assinatura] = (await assinarToken(conteudo)).split(".");
    const outro = Buffer.from(
      JSON.stringify({ ...conteudo, apartamentoId: 99 }),
    ).toString("base64url");
    expect(await lerToken(`${cabecalho}.${outro}.${assinatura}`)).toBeNull();
    expect(await lerToken("lixo")).toBeNull();
  });

  it("recusa token de outro segredo, vencido ou sem assinatura", async () => {
    const outroSegredo = await new SignJWT(conteudo)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("10m")
      .sign(chave("x".repeat(32)));
    expect(await lerToken(outroSegredo)).toBeNull();

    const agora = Math.floor(Date.now() / 1000);
    const vencido = await new SignJWT(conteudo)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt(agora - 660)
      .setExpirationTime(agora - 60)
      .sign(chave(process.env.VOTO_TOKEN_SECRET!));
    expect(await lerToken(vencido)).toBeNull();

    const semAssinatura = new UnsecuredJWT(conteudo)
      .setExpirationTime("10m")
      .encode();
    expect(await lerToken(semAssinatura)).toBeNull();
  });

  it("recusa token sem algum dos ids", async () => {
    const incompleto = await new SignJWT({ eleicaoId: 1, apartamentoId: 2 })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("10m")
      .sign(chave(process.env.VOTO_TOKEN_SECRET!));
    expect(await lerToken(incompleto)).toBeNull();

    const semValidade = await new SignJWT(conteudo)
      .setProtectedHeader({ alg: "HS256" })
      .sign(chave(process.env.VOTO_TOKEN_SECRET!));
    expect(await lerToken(semValidade)).toBeNull();
  });

  it("não assina id inválido", async () => {
    await expect(
      assinarToken({ ...conteudo, compradorId: 0 }),
    ).rejects.toThrow();
  });

  it("falha alto sem VOTO_TOKEN_SECRET", async () => {
    const segredo = process.env.VOTO_TOKEN_SECRET;
    process.env.VOTO_TOKEN_SECRET = "";
    try {
      await expect(assinarToken(conteudo)).rejects.toThrow(/VOTO_TOKEN_SECRET/);
      await expect(lerToken("a.b.c")).rejects.toThrow(/VOTO_TOKEN_SECRET/);
    } finally {
      process.env.VOTO_TOKEN_SECRET = segredo;
    }
  });
});
