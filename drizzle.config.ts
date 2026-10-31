import { defineConfig } from "drizzle-kit";

import "./src/db/carregar-env";

// No Neon da Vercel, DATABASE_URL passa pelo pooler; a migração usa a conexão
// direta (DATABASE_URL_UNPOOLED) quando ela existe.
const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;
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
