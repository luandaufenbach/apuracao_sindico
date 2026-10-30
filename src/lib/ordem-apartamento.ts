import { sql } from "drizzle-orm";

import { apartamento } from "@/db/schema";

/** Ordem de exibição: bloco e número (101 antes de 1001). */
export const ordemApartamento = [
  apartamento.bloco,
  sql`length(${apartamento.numero})`,
  apartamento.numero,
];
