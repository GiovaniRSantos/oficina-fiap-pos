import { prisma } from "../../../infrastructure/database/prisma";

export class UpdateCliente {
  async execute(
    id: string,
    data: { nome?: string; cpfCnpj?: string }
  ) {
    const cliente = await prisma.cliente.findUnique({
      where: { id }
    });

    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    if (data.cpfCnpj) {
      const existing = await prisma.cliente.findUnique({
        where: { cpfCnpj: data.cpfCnpj }
      });

      if (existing && existing.id !== id) {
        throw new Error("CPF/CNPJ já em uso");
      }
    }

    return prisma.cliente.update({
      where: { id },
      data
    });
  }
}