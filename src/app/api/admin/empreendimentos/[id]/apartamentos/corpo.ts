import { z } from "zod";

// Formato do corpo; o conteúdo é validado em src/lib/cadastro.ts.
export const corpoApartamento = z.object({
  bloco: z.string(),
  numero: z.string(),
  rotulo: z.string(),
  compradores: z.array(
    z.object({
      id: z.number().optional(),
      nome: z.string(),
      documento: z.string(),
    }),
  ),
});
