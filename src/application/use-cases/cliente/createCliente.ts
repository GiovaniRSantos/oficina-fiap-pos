import { prisma } from "../../../infrastructure/database/prisma";

export class CreateCliente {
  async execute(data: { nome: string; cpfCnpj: string }) {
    const existing = await prisma.cliente.findUnique({
      where: { cpfCnpj: data.cpfCnpj }
    });

    if (existing) {
      throw new Error("Cliente já cadastrado com este CPF/CNPJ");
    }

    return prisma.cliente.create({
      data
    });
  }
}