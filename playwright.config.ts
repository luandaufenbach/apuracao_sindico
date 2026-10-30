import { defineConfig, devices } from "@playwright/test";

// Testes de ponta a ponta (docs/ROTEIRO.md, F6) contra o `next dev` e o banco
// do .env. O globalSetup roda o seed antes: os testes usam a eleição de teste
// "demo" e cada um escolhe apartamentos diferentes, então rodam em paralelo.
// E2E_URL aponta para um servidor já rodando (ex.: outro `next dev` desta
// pasta), que precisa usar o mesmo DATABASE_URL do .env. Sem ela, o Playwright
// sobe o `next dev` na porta 3000 ou reaproveita o que já estiver lá.
const URL_EXTERNA = process.env.E2E_URL;
const URL_BASE = URL_EXTERNA ?? "http://localhost:3000";

export default defineConfig({
  testDir: "tests/e2e",
  globalSetup: "./tests/e2e/preparar.ts",
  fullyParallel: true,
  workers: 3,
  forbidOnly: !!process.env.CI,
  retries: 0,
  // O dev compila cada rota na primeira visita.
  timeout: 90_000,
  expect: { timeout: 15_000 },
  reporter: [["list"]],
  use: {
    baseURL: URL_BASE,
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "celular",
      use: { ...devices["Pixel 7"], viewport: { width: 375, height: 812 } },
    },
  ],
  webServer: URL_EXTERNA
    ? undefined
    : {
        command: "npm run dev",
        url: URL_BASE,
        reuseExistingServer: true,
        timeout: 180_000,
      },
});
