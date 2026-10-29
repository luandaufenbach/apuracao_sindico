import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle({ client: pool, schema });

export type Banco = typeof db;
export type Transacao = Parameters<Parameters<Banco["transaction"]>[0]>[0];
/** O banco ou uma transação aberta: funções que gravam junto com outra ação aceitam os dois. */
export type Executor = Banco | Transacao;
