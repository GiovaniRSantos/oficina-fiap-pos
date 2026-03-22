import { prisma } from "../../../infrastructure/database/prisma";
import { OrdemStatus } from "../../../domain/enums/ordemStatus";

export class GetAllOrdemServico {
  async execute() {
    const ordens = await prisma.ordemServico.findMany({
      where: {
        deletedAt: null, 
        status: {
          notIn: [
            OrdemStatus.FINALIZADA,
            OrdemStatus.ENTREGUE
          ]
        }
      }
    });

    const prioridade: Record<string, number> = {
      EXECUCAO: 1,
      AGUARDANDO_APROVACAO: 2,
      DIAGNOSTICO: 3,
      RECEBIDA: 4
    };

    return ordens.sort((a, b) => {
      const prioridadeDiff =
        prioridade[a.status] - prioridade[b.status];

      if (prioridadeDiff !== 0) {
        return prioridadeDiff;
      }

      return (
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime()
      );
    });
  }
}