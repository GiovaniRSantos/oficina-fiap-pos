import { prisma } from "../../../infrastructure/database/prisma";

export class UpdatePeca {
  async execute(
    id: string,
    data: {
      nome?: string;
      preco?: number;
      estoque?: number;
    }
  ) {
    const peca = await prisma.peca.findUnique({
      where: { id }
    });

    if (!peca) {
      throw new Error("Peça não encontrada");
    }

    if (data.nome) {
      const existing = await prisma.peca.findFirst({
        where: {
          nome: {
            equals: data.nome,
            mode: "insensitive"
          }
        }
      });

      if (existing && existing.id !== id) {
        throw new Error("Nome de peça já está em uso");
      }
    }

    return prisma.peca.update({
      where: { id },
      data
    });
  }
}