import { z } from "zod";

export const updateStatusSchema = z.object({
  status: z.enum([
    "RECEBIDA",
    "DIAGNOSTICO",
    "AGUARDANDO_APROVACAO",
    "EXECUCAO",
    "FINALIZADA",
    "ENTREGUE"
  ])
});