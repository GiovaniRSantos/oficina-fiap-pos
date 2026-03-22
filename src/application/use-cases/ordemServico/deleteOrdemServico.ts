import { prisma } from "../../../infrastructure/database/prisma";

export class DeleteOrdemServico {
  async execute(id: string) {
    const ordem = await prisma.ordemServico.findUnique({
      where: { id }
    });

    if (!ordem) {
      throw new Error("Ordem não encontrada");
    }

    await prisma.ordemServico.update({
      where: { id },
      data: {
        deletedAt: new Date() 
      }
    });
  }
}