import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import { defineConfig } from "vitest/config";

// O Vitest define NODE_ENV=test: carrega .env.test.local, .env.test e .env,
// com as mesmas regras do Next. O @next/env é CommonJS, por isso o import default.
nextEnv.loadEnvConfig(process.cwd(), false, {
  info: () => {},
  error: console.error,
});

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
  },
});
