import { defineConfig } from "drizzle-kit";

import "./src/db/carregar-env";

const url = process.env.DATABASE_URL;
if (!url) {
  throw new Error(
    "DATABASE_URL não definida. Copie .env.example para .env e preencha.",
  );
}

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dbCredentials: { url },
});
