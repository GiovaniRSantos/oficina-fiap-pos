import { OrdemStatus } from "../../../domain/enums/ordemStatus";
import { prisma } from "../../../infrastructure/database/prisma";

export class ApproveOrdemServico {
  async execute(id: string, aprovado: boolean) {
    const ordem = await prisma.ordemServico.findUnique({
      where: { id }
    });

    if (!ordem) {
      throw new Error("Ordem não encontrada");
    }

    if (ordem.status !== OrdemStatus.AGUARDANDO_APROVACAO) {
      throw new Error("Ordem não está aguardando aprovação");
    }

    const novoStatus = aprovado
      ? OrdemStatus.EXECUCAO
      : OrdemStatus.DIAGNOSTICO;

    const updated = await prisma.ordemServico.update({
      where: { id },
      data: {
        status: novoStatus
      }
    });

    return updated;
  }
}