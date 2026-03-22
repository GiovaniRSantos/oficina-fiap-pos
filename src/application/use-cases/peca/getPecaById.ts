import { prisma } from "../../../infrastructure/database/prisma";

export class GetPecaById {
  async execute(id: string) {
    const peca = await prisma.peca.findUnique({
      where: { id },
      include: {
        ordens: true
      }
    });

    if (!peca) {
      throw new Error("Peça não encontrada");
    }

    return peca;
  }
}