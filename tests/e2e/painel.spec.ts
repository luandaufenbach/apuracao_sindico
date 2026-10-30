// Fluxos que passam pelo painel: desbloquear (operador), anular e voto pela
// mesa (godmode). O eleitor fica no celular; o painel, num contexto de desktop.
import { expect, test } from "@playwright/test";

import {
  cpfEstranho,
  FATIA,
  fecharBanco,
  lerCadastro,
  situacaoDoApto,
  votosDoApto,
} from "./dados";
import {
  abrirApto,
  enviarDocumento,
  erroNaTela,
  entrarNoPainel,
  escolherEConfirmar,
} from "./passos";

test.afterAll(fecharBanco);

test("3 erros bloqueiam e o operador desbloqueia", async ({
  page,
  browser,
}) => {
  const { eleicaoId, cpfUnico } = await lerCadastro();
  const apto = cpfUnico[FATIA.bloqueio];
  const nome = `${apto.bloco}, ${apto.rotulo}`;

  await abrirApto(page, apto);
  await enviarDocumento(page, await cpfEstranho(10));
  await expect(erroNaTela(page)).toHaveText(
    "Documento não confere. Restam 2 tentativas.",
  );
  await enviarDocumento(page, await cpfEstranho(11));
  await expect(erroNaTela(page)).toHaveText(
    "Documento não confere. Resta 1 tentativa.",
  );
  await enviarDocumento(page, await cpfEstranho(12));
  await expect(
    page.getByRole("heading", {
      name: "Apartamento bloqueado. Procure a mesa.",
    }),
  ).toBeVisible();
  expect(await situacaoDoApto(eleicaoId, apto.id)).toEqual({
    tentativas_falhas: 3,
    bloqueado: true,
  });

  // Bloqueado, nem o documento certo passa.
  await abrirApto(page, apto);
  await expect(
    page.getByRole("heading", {
      name: "Apartamento bloqueado. Procure a mesa.",
    }),
  ).toBeVisible();

  const painel = await entrarNoPainel(browser, "operador");
  await painel.goto(`/admin/eleicoes/${eleicaoId}/painel`);
  const cartao = painel.locator("section", {
    has: painel.getByRole("heading", { name: /^Bloqueados \(\d+\)$/ }),
  });
  const linha = cartao.locator("div", { hasText: nome }).last();
  await expect(linha).toBeVisible();
  await linha.getByRole("button", { name: "Desbloquear" }).click();
  await expect(cartao.getByText(nome)).toHaveCount(0);
  expect(await situacaoDoApto(eleicaoId, apto.id)).toEqual({
    tentativas_falhas: 0,
    bloqueado: false,
  });
  await painel.context().close();

  // Desbloqueado, o comprador vota.
  await abrirApto(page, apto);
  await enviarDocumento(page, apto.documentos[0]);
  await escolherEConfirmar(page, apto);
  const votos = await votosDoApto(eleicaoId, apto.id);
  expect(votos.map((v) => v.status)).toEqual(["valido"]);
});

test("anular no godmode e votar de novo", async ({ page, browser }) => {
  const { eleicaoId, cpfUnico } = await lerCadastro();
  const apto = cpfUnico[FATIA.anular];

  await abrirApto(page, apto);
  await enviarDocumento(page, apto.documentos[0]);
  const primeiro = await escolherEConfirmar(page, apto);

  const god = await entrarNoPainel(browser, "god");
  await god.goto(`/admin/eleicoes/${eleicaoId}/god?aba=buscar`);
  await god.getByLabel("Por comprovante").fill(primeiro);
  await god
    .locator("form", { has: god.getByLabel("Por comprovante") })
    .getByRole("button", { name: "Buscar" })
    .click();
  // O cartão do voto; a aba inteira também é uma <section>.
  const cartao = god
    .locator("section:not([role])")
    .filter({ hasText: /Candidato escolhido/ });
  await expect(cartao).toContainText(primeiro);
  await expect(cartao).toContainText("Válido");
  await cartao.getByRole("button", { name: "Anular" }).click();

  const dialogo = god.getByRole("dialog");
  await expect(dialogo).toContainText("Anular o voto do");
  await dialogo
    .getByLabel("Motivo")
    .fill("Teste e2e: comprador pediu para refazer.");
  await dialogo.getByRole("button", { name: "Anular voto" }).click();
  await expect(
    god.getByText(/anulado\. O apartamento pode votar de novo\./),
  ).toBeVisible();
  await expect(cartao).toContainText("Anulado");
  await god.context().close();

  // O mesmo celular vota de novo pelo apartamento.
  await abrirApto(page, apto);
  await enviarDocumento(page, apto.documentos[0]);
  const segundo = await escolherEConfirmar(page, apto);
  expect(segundo).not.toBe(primeiro);

  const votos = await votosDoApto(eleicaoId, apto.id);
  expect(votos.map((v) => [v.status, v.comprovante])).toEqual([
    ["anulado", primeiro],
    ["valido", segundo],
  ]);
});

test("voto pela mesa em lote no godmode", async ({ page, browser }) => {
  const { eleicaoId, soMesa } = await lerCadastro();
  const lote = soMesa.slice(0, 3);

  const god = await entrarNoPainel(browser, "god");
  await god.goto(`/admin/eleicoes/${eleicaoId}/god?aba=mesa`);
  for (const a of lote) {
    await god
      .getByRole("button", { name: `${a.bloco}, ${a.rotulo}, só pela mesa` })
      .click();
  }
  await expect(god.getByText("3 apartamentos", { exact: true })).toBeVisible();
  await god.getByLabel("Nome de quem vota").fill("Dono Fictício da Permuta");
  await god.getByLabel("CPF ou CNPJ").fill(await cpfEstranho(20));
  await god
    .getByRole("textbox", { name: /^Motivo/ })
    .fill("Teste e2e: permuta sem documento no cadastro.");
  await god.getByRole("button", { name: "Escolher candidato" }).click();

  const cabine = god.locator("dialog[open]").first();
  await expect(
    cabine.getByRole("heading", { name: "Escolha o candidato" }),
  ).toBeVisible();
  await cabine
    .getByRole("button")
    .filter({ hasText: "Transparência nas contas" })
    .click();
  const confirmar = god.getByRole("dialog", { name: /^Confirmar voto em/ });
  await confirmar.getByRole("button", { name: "Confirmar voto" }).click();
  await expect(
    god.getByRole("heading", { name: "Voto registrado" }),
  ).toBeVisible();
  await expect(god.getByText("3 votos gravados")).toBeVisible();
  await god.getByRole("button", { name: "Concluir" }).click();
  await god.context().close();

  for (const a of lote) {
    const votos = await votosDoApto(eleicaoId, a.id);
    expect(votos.map((v) => [v.status, v.origem])).toEqual([
      ["valido", "mesa"],
    ]);
  }

  // No celular, os apartamentos do lote aparecem como "já votou".
  await abrirApto(page, lote[0]);
  await expect(
    page.getByRole("heading", { name: "Este apartamento já votou" }),
  ).toBeVisible();
});
