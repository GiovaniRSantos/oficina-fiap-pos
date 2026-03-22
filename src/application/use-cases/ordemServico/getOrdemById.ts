import { prisma } from "../../../infrastructure/database/prisma";

export class GetOrdemServicoById {
  async execute(id: string) {
    const ordem = await prisma.ordemServico.findFirst({
      where: {
        id,
        deletedAt: null 
      }
    });

    if (!ordem) {
      throw new Error("Ordem não encontrada");
    }

    return ordem;
  }
}