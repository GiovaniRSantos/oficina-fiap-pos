import { OrdemStatus } from "../../../domain/enums/ordemStatus";
import { prisma } from "../../../infrastructure/database/prisma";
import { EmailService } from "../../ports/emailService";

export class UpdateStatus {
  constructor(private emailService: EmailService) { }

  async execute(id: string, status: OrdemStatus) {
    const ordem = await prisma.ordemServico.findUnique({
      where: { id },
      include: {
        cliente: true,
      },
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
      ENTREGUE: [],
    };

    const current = ordem.status as OrdemStatus;

    if (!allowedTransitions[current].includes(status)) {
      throw new Error(`Transição inválida de ${current} para ${status}`);
    }

    const updated = await prisma.ordemServico.update({
      where: { id },
      data: { status },
    });

    try {
      const email = ordem.cliente?.email;

      if (!email) {
        console.warn("Cliente sem email, não enviando notificação");
      } else {
        await this.emailService.sendStatusUpdateEmail({
          to: email,
          clienteNome: ordem.cliente.nome,
          ordemId: ordem.id,
          novoStatus: status,
        });
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error);
    }

    return updated;
  }
}