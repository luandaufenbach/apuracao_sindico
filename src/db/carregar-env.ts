import { loadEnvConfig } from "@next/env";

// Scripts fora do Next (drizzle-kit, seed) leem os arquivos .env com as
// mesmas regras do `next dev`. Importe este módulo antes de qualquer código que
// leia process.env (por exemplo, antes de importar `./index`).
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production", {
  info: () => {},
  error: console.error,
});
