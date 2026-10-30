import { z } from "zod";

// Formato do corpo; o conteúdo é validado em src/lib/eleicoes.ts.
export const corpoCandidato = z.object({
  nome: z.string(),
  apartamentoId: z.number().nullable(),
  foto: z.string().nullable(),
  proposta: z.string(),
  ordem: z.number(),
});
