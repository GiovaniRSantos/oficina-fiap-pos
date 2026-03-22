import { prisma } from "../../../infrastructure/database/prisma";

export class CreatePeca {
  async execute(data: {
    nome: string;
    preco: number;
    estoque: number;
  }) {
    const existing = await prisma.peca.findFirst({
      where: {
        nome: {
          equals: data.nome,
          mode: "insensitive"
        }
      }
    });

    if (existing) {
      throw new Error("Já existe uma peça com esse nome");
    }

    return prisma.peca.create({
      data
    });
  }
}