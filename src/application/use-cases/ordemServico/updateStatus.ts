import { OrdemStatus } from "../../../domain/enums/ordemStatus";
import { prisma } from "../../../infrastructure/database/prisma";

export class UpdateStatus {
  async execute(id: string, status: OrdemStatus) {
    const ordem = await prisma.ordemServico.findUnique({
      where: { id }
    });

    if (!ordem) {
      throw new Error("Ordem não encontrada");
    }

    const allowedTransitions: Record<string, OrdemStatus[]> = {
      RECEBIDA: [OrdemStatus.DIAGNOSTICO],
      DIAGNOSTICO: [OrdemStatus.AGUARDANDO_APROVACAO],
      AGUARDANDO_APROVACAO: [OrdemStatus.EXECUCAO],
      EXECUCAO: [OrdemStatus.FINALIZADA],
      FINALIZADA: [OrdemStatus.ENTREGUE],
      ENTREGUE: []
    };

    const current = ordem.status as OrdemStatus;

    if (!allowedTransitions[current].includes(status)) {
      throw new Error(`Transição inválida de ${current} para ${status}`);
    }

    return prisma.ordemServico.update({
      where: { id },
      data: { status }
    });
  }
}