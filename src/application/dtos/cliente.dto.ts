import { z } from "zod";

export const createClienteSchema = z.object({
  nome: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  cpfCnpj: z.string().min(11).max(14)
});

export const updateClienteSchema = z.object({
  nome: z.string().min(3).optional(),
  cpfCnpj: z.string().min(11).max(14).optional()
});