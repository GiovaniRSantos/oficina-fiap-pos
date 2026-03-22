import { z } from "zod";

export const createServicoSchema = z.object({
  nome: z.string().min(2),
  preco: z.number().positive()
});

export const updateServicoSchema = z.object({
  nome: z.string().optional(),
  preco: z.number().positive().optional()
});