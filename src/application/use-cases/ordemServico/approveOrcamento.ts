import { OrdemStatus } from "../../../domain/enums/ordemStatus";
import { prisma } from "../../../infrastructure/database/prisma";

export class ApproveOrcamento {
  async execute(id: string, approved: boolean) {
    const ordem = await prisma.ordemServico.findUnique({
      where: { id }
    });

    if (!ordem) {
      throw new Error("Ordem não encontrada");
    }

    if (ordem.status !== OrdemStatus.AGUARDANDO_APROVACAO) {
      throw new Error("Ordem não está aguardando aprovação");
    }

    return prisma.ordemServico.update({
      where: { id },
      data: {
        status: approved
          ? OrdemStatus.EXECUCAO
          : OrdemStatus.FINALIZADA
      }
    });
  }
}