import { prisma } from "../../../infrastructure/database/prisma";

export class GetOrdemById {
  async execute(id: string) {
    const ordem = await prisma.ordemServico.findUnique({
      where: { id },
      include: {
        cliente: true,
        veiculo: true,
        servicos: {
          include: {
            servico: true
          }
        },
        pecas: {
          include: {
            peca: true
          }
        }
      }
    });

    if (!ordem) {
      throw new Error("Ordem de serviço não encontrada");
    }

    return ordem;
  }
}