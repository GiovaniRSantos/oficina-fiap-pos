import { z } from "zod";

export const createOrdemServicoSchema = z.object({
  clienteId: z.string().uuid(),
  veiculoId: z.string().uuid(),

  servicos: z.array(z.string().uuid()).min(1),

  pecas: z.array(
    z.object({
      id: z.string().uuid(),
      quantidade: z.number().int().positive()
    })
  ).optional()
});