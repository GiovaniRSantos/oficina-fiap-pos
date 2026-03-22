import { z } from "zod";

export const createPecaSchema = z.object({
  nome: z.string().min(2),
  preco: z.number().positive(),
  estoque: z.number().int().nonnegative()
});

export const updatePecaSchema = z.object({
  nome: z.string().optional(),
  preco: z.number().positive().optional(),
  estoque: z.number().int().nonnegative().optional()
});