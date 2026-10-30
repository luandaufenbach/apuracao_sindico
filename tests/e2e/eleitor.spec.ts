// Fluxo do eleitor no celular (docs/ESPECIFICACAO.md, "Fluxo do eleitor").
import { expect, test } from "@playwright/test";

import {
  CODIGO,
  comDigitoErrado,
  cpfEstranho,
  FATIA,
  fecharBanco,
  lerCadastro,
  situacaoDoApto,
  votosDoApto,
} from "./dados";
import {
  abrirApto,
  digitarDocumento,
  enviarDocumento,
  erroNaTela,
  escolherEConfirmar,
  lerComprovante,
} from "./passos";

test.afterAll(fecharBanco);

test("voto com CPF, do início ao comprovante", async ({ page }) => {
  const { eleicaoId, cpfUnico } = await lerCadastro();
  const apto = cpfUnico[FATIA.cpf];
  const cpf = apto.documentos[0];

  await page.goto(`/v/${CODIGO}`);
  await expect(page.getByText("Votação aberta")).toBeVisible();
  await page
    .getByRole("button", { name: new RegExp(`^${apto.bloco}`) })
    .click();
  await expect(
    page.getByRole("heading", { name: "Escolha o apartamento" }),
  ).toBeVisible();
  await page.getByRole("button", { name: apto.rotulo, exact: true }).click();

  // Um comprador: o campo já vem com os 3 primeiros números.
  const campo = page.locator('input[name="documento"]');
  await expect(campo).toHaveValue(cpf.slice(0, 3));
  await campo.pressSequentially(cpf.slice(3));
  await page.getByRole("button", { name: "Continuar" }).click();

  const codigo = await escolherEConfirmar(page, apto);
  const votos = await votosDoApto(eleicaoId, apto.id);
  expect(votos).toEqual([
    expect.objectContaining({
      status: "valido",
      origem: "documento",
      comprovante: codigo,
    }),
  ]);
});

test("voto com CNPJ alfanumérico", async ({ page }) => {
  const { eleicaoId, cnpj } = await lerCadastro();
  const apto = cnpj.find((a) => /[A-Z]/.test(a.documentos[0])) ?? cnpj[0];

  await abrirApto(page, apto);
  await expect(page.getByLabel("CNPJ da empresa")).toBeVisible();
  await expect(
    page.getByText("Apartamento comprado por empresa"),
  ).toBeVisible();
  await enviarDocumento(page, apto.documentos[0]);

  const codigo = await escolherEConfirmar(page, apto);
  const votos = await votosDoApto(eleicaoId, apto.id);
  expect(votos.map((v) => [v.status, v.comprovante])).toEqual([
    ["valido", codigo],
  ]);
});

test("documento inválido não conta tentativa", async ({ page, request }) => {
  const { eleicaoId, cpfUnico } = await lerCadastro();
  const apto = cpfUnico[FATIA.invalido];
  const errado = comDigitoErrado(apto.documentos[0]);

  await abrirApto(page, apto);
  await enviarDocumento(page, errado);
  await expect(erroNaTela(page)).toHaveText(
    "Documento inválido. Confira os números.",
  );
  await digitarDocumento(page, errado.slice(0, 7));
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(erroNaTela(page)).toHaveText("Faltam 4 números.");

  // O servidor também recusa sem contar tentativa (R4).
  for (let i = 0; i < 4; i++) {
    const r = await request.post(`/api/e/${CODIGO}/verificar`, {
      data: { apartamentoId: apto.id, documento: errado },
    });
    expect(await r.json()).toEqual({ ok: false, erro: "documento_invalido" });
  }
  expect(await situacaoDoApto(eleicaoId, apto.id)).toEqual({
    tentativas_falhas: 0,
    bloqueado: false,
  });

  // O documento certo ainda passa.
  await enviarDocumento(page, apto.documentos[0]);
  await expect(
    page.getByRole("heading", { name: "Escolha o candidato" }),
  ).toBeVisible();
});

test("documento de outro apartamento sugere o certo", async ({ page }) => {
  const { eleicaoId, cpfUnico } = await lerCadastro();
  const aqui = cpfUnico[FATIA.outroApto];
  const dono = cpfUnico[FATIA.outroApto + 1];

  await abrirApto(page, aqui);
  await enviarDocumento(page, dono.documentos[0]);
  await expect(
    page.getByRole("heading", {
      name: `Este CPF é do ${dono.bloco}, ${dono.rotulo}`,
    }),
  ).toBeVisible();
  await expect(page.getByText(`Votar pelo ${dono.rotulo}?`)).toBeVisible();
  // R6: não conta tentativa no apartamento escolhido.
  expect((await situacaoDoApto(eleicaoId, aqui.id)).tentativas_falhas).toBe(0);

  await page
    .getByRole("button", { name: `Votar pelo ${dono.rotulo}`, exact: true })
    .click();
  await expect(page).toHaveURL(new RegExp(`apto=${dono.id}&etapa=candidato`));
  const codigo = await escolherEConfirmar(page, dono);

  expect(await votosDoApto(eleicaoId, aqui.id)).toEqual([]);
  expect(
    (await votosDoApto(eleicaoId, dono.id)).map((v) => v.comprovante),
  ).toEqual([codigo]);

  // De novo, agora com o dono já votado: a sugestão avisa e não oferece voto.
  await abrirApto(page, aqui);
  await enviarDocumento(page, dono.documentos[0]);
  await expect(
    page.getByText(
      new RegExp(
        `O ${dono.rotulo} já votou às \\d\\d:\\d\\d\\. Procure a mesa\\.`,
      ),
    ),
  ).toBeVisible();
  await expect(
    page.getByRole("button", {
      name: `Votar pelo ${dono.rotulo}`,
      exact: true,
    }),
  ).toHaveCount(0);
});

test("CPF com vários apartamentos vota um por um", async ({ page }) => {
  const { eleicaoId, cpfUnico, multi } = await lerCadastro();
  const aqui = cpfUnico[FATIA.multi];
  const { documento, aptos } = multi[0];
  const [primeiro, segundo] = aptos;

  await abrirApto(page, aqui);
  await enviarDocumento(page, documento);
  await expect(
    page.getByRole("heading", { name: "Este CPF é de outros apartamentos" }),
  ).toBeVisible();
  for (const a of aptos) {
    await expect(page.getByText(`${a.bloco}, ${a.rotulo}`)).toBeVisible();
  }
  await page
    .getByRole("button", { name: `Votar pelo ${primeiro.rotulo}`, exact: true })
    .first()
    .click();
  await escolherEConfirmar(page, primeiro);

  // O comprovante oferece o próximo apartamento sem pedir o documento.
  await expect(page.getByText("Você também pode votar por")).toBeVisible();
  await page
    .getByRole("button", {
      name: `Votar pelo ${segundo.bloco}, ${segundo.rotulo}`,
    })
    .click();
  await escolherEConfirmar(page, segundo);

  for (const a of [primeiro, segundo]) {
    const votos = await votosDoApto(eleicaoId, a.id);
    expect(votos.map((v) => v.status)).toEqual(["valido"]);
  }
  expect(await votosDoApto(eleicaoId, aqui.id)).toEqual([]);
});

test("apartamento que já votou", async ({ page, request }) => {
  const { eleicaoId, cpfUnico } = await lerCadastro();
  const apto = cpfUnico[FATIA.jaVotou];
  const documento = apto.documentos[0];

  // Dois tokens tirados antes do voto: o segundo não vota de novo.
  const verificar = async () => {
    const r = await request.post(`/api/e/${CODIGO}/verificar`, {
      data: { apartamentoId: apto.id, documento },
    });
    const corpo = await r.json();
    expect(corpo.ok).toBe(true);
    return corpo.token as string;
  };
  const [t1, t2] = [await verificar(), await verificar()];
  const { candidatos } = await (await request.get(`/api/e/${CODIGO}`)).json();
  const votar = (token: string, candidatoId: number) =>
    request
      .post(`/api/e/${CODIGO}/votar`, { data: { token, candidatoId } })
      .then((r) => r.json());
  expect((await votar(t1, candidatos[0].id)).ok).toBe(true);
  expect(await votar(t2, candidatos[1].id)).toEqual({
    ok: false,
    erro: "ja_votou",
  });
  const r = await request.post(`/api/e/${CODIGO}/verificar`, {
    data: { apartamentoId: apto.id, documento },
  });
  expect(await r.json()).toEqual({ ok: false, erro: "ja_votou" });

  // Na grade, o apartamento aparece desabilitado com "já votou".
  await page.goto(`/v/${CODIGO}?bloco=${encodeURIComponent(apto.bloco)}`);
  const botao = page.getByRole("button", { name: `${apto.rotulo}: Já votou` });
  await expect(botao).toBeDisabled();

  // Pelo link direto, a tela explica e não pede documento.
  await abrirApto(page, apto);
  await expect(
    page.getByRole("heading", { name: "Este apartamento já votou" }),
  ).toBeVisible();
  await expect(page.locator('input[name="documento"]')).toHaveCount(0);

  const votos = await votosDoApto(eleicaoId, apto.id);
  expect(votos.map((v) => v.status)).toEqual(["valido"]);
});

test("apartamento só pela mesa não vota pelo celular", async ({ page }) => {
  const { soMesa } = await lerCadastro();
  // O último: o teste da mesa usa os primeiros.
  const apto = soMesa.at(-1)!;
  await abrirApto(page, apto);
  await expect(
    page.getByRole("heading", { name: "Este apartamento vota na mesa" }),
  ).toBeVisible();
});

test("CPF estranho não confere e mostra as tentativas", async ({ page }) => {
  const { eleicaoId, cpfUnico } = await lerCadastro();
  // Apartamento à parte, para não atrapalhar o teste de bloqueio.
  const apto = cpfUnico[FATIA.multi + 1];
  await abrirApto(page, apto);
  await enviarDocumento(page, await cpfEstranho(50));
  await expect(erroNaTela(page)).toHaveText(
    "Documento não confere. Restam 2 tentativas.",
  );
  expect(await situacaoDoApto(eleicaoId, apto.id)).toEqual({
    tentativas_falhas: 1,
    bloqueado: false,
  });
  // O certo ainda passa, e o voto grava.
  await enviarDocumento(page, apto.documentos[0]);
  await escolherEConfirmar(page, apto);
  await lerComprovante(page, apto);
});
