import { execSync } from "node:child_process";

/**
 * Antes dos testes: recria o seed, com a eleição de teste "demo" aberta e sem
 * votos. O seed só roda num banco de desenvolvimento (ver src/db/seed.ts).
 */
export default function preparar() {
  execSync("npm run db:seed", { stdio: "inherit" });
}
