import { z } from "zod";

export const createVeiculoSchema = z.object({
  placa: z.string().min(7).max(7),
  marca: z.string().min(2),
  modelo: z.string().min(2),
  ano: z.number().min(1900),
  clienteId: z.string().uuid()
});

export const updateVeiculoSchema = z.object({
  placa: z.string().min(7).max(7).optional(),
  marca: z.string().optional(),
  modelo: z.string().optional(),
  ano: z.number().optional()
});