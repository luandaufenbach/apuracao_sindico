import { z } from "zod";

// Mensagens do Zod em português.
z.config(z.locales.pt());

/** Entrada malformada ou que aponta para registro inexistente (HTTP 400/404). */
export class EntradaInvalida extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = "EntradaInvalida";
  }
}

/** Usuário inexistente, desativado ou sem o papel exigido (HTTP 403). */
export class AcessoNegado extends Error {
  constructor(mensagem = "Acesso negado.") {
    super(mensagem);
    this.name = "AcessoNegado";
  }
}

/** Valida com Zod e lança EntradaInvalida se não passar. */
export function validar<T extends z.ZodType>(
  schema: T,
  entrada: unknown,
): z.output<T> {
  const resultado = schema.safeParse(entrada);
  if (!resultado.success) {
    throw new EntradaInvalida(z.prettifyError(resultado.error));
  }
  return resultado.data;
}

/**
 * Nome da restrição única violada (código 23505 do PostgreSQL), ou null.
 * O Drizzle embrulha o erro do driver em `cause`.
 */
export function violacaoUnica(erro: unknown): string | null {
  for (let e = erro; e instanceof Error; e = e.cause) {
    const pg = e as Error & { code?: string; constraint?: string };
    if (pg.code === "23505") return pg.constraint ?? null;
  }
  return null;
}
