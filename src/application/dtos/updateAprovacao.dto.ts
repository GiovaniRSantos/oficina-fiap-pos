import { z } from "zod";

export const updateAprovacaoSchema = z.object({
  aprovado: z.boolean()
});