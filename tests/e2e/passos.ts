// Passos comuns dos testes e2e: o eleitor no celular e o painel no desktop.
import { type Browser, expect, type Page } from "@playwright/test";

import { type AptoE2e, CODIGO } from "./dados";

/** Abre a tela do documento do apartamento direto pelo link. */
export async function abrirApto(page: Page, apto: AptoE2e) {
  await page.goto(`/v/${CODIGO}?apto=${apto.id}`);
}

/** Digita o documento no campo, que pode vir com o prefixo da dica. */
export async function digitarDocumento(page: Page, documento: string) {
  const campo = page.locator('input[name="documento"]');
  await expect(campo).toBeVisible();
  // Apaga pelo teclado, como a pessoa faria: o fill("") não limpa o campo
  // controlado que já veio com o prefixo da dica.
  await campo.click();
  await campo.press("ControlOrMeta+A");
  await campo.press("Backspace");
  await expect(campo).toHaveValue("");
  await campo.pressSequentially(documento);
}

/** Erro da tela do eleitor (fora o anunciador de rotas do Next). */
export const erroNaTela = (page: Page) =>
  page.locator("main").getByRole("alert");

export async function enviarDocumento(page: Page, documento: string) {
  await digitarDocumento(page, documento);
  await page.getByRole("button", { name: "Continuar" }).click();
}

/**
 * Escolhe o candidato pela proposta (o 1º do seed), confirma e devolve o
 * código do comprovante.
 */
export async function escolherEConfirmar(page: Page, apto: AptoE2e) {
  await expect(
    page.getByRole("heading", { name: "Escolha o candidato" }),
  ).toBeVisible();
  await page
    .getByRole("button")
    .filter({ hasText: "Transparência nas contas" })
    .click();
  const dialogo = page.getByRole("dialog");
  await expect(dialogo).toContainText(`pelo ${apto.bloco}, ${apto.rotulo}?`);
  await dialogo.getByRole("button", { name: "Confirmar voto" }).click();
  return lerComprovante(page, apto);
}

export async function lerComprovante(page: Page, apto: AptoE2e) {
  await expect(page.getByText("Voto registrado")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: `${apto.bloco}, ${apto.rotulo}` }),
  ).toBeVisible();
  const codigo = (await page
    .getByText("Código do comprovante")
    .locator("xpath=following-sibling::*[1]")
    .textContent())!.trim();
  // 6 caracteres, sem 0/O/1/I.
  expect(codigo).toMatch(/^[2-9A-HJ-NP-Z]{6}$/);
  return codigo;
}

/** Contexto de desktop com o painel logado como operador ou god. */
export async function entrarNoPainel(
  browser: Browser,
  papel: "operador" | "god",
) {
  const senha = process.env.SEED_SENHA;
  if (!senha) throw new Error("Defina SEED_SENHA no .env para os testes e2e.");
  const contexto = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
  });
  const page = await contexto.newPage();
  await page.goto("/admin/login");
  await page.getByLabel("E-mail").fill(`${papel}@exemplo.test`);
  await page.getByLabel("Senha").fill(senha);
  await page.getByRole("button", { name: "Entrar" }).click();
  await page.waitForURL("**/admin/eleicoes");
  return page;
}
