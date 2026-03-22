import { prisma } from "../../../infrastructure/database/prisma";

export class GetServicoById {
  async execute(id: string) {
    const servico = await prisma.servico.findUnique({
      where: { id },
      include: {
        ordens: true
      }
    });

    if (!servico) {
      throw new Error("Serviço não encontrado");
    }

    return servico;
  }
}