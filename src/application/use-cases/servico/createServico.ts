import { prisma } from "../../../infrastructure/database/prisma";

export class CreateServico {
  async execute(data: { nome: string; preco: number }) {
    const existing = await prisma.servico.findFirst({
      where: {
        nome: {
          equals: data.nome,
          mode: "insensitive"
        }
      }
    });

    if (existing) {
      throw new Error("Já existe um serviço com esse nome");
    }

    return prisma.servico.create({
      data
    });
  }
}