import { prisma } from "../../../infrastructure/database/prisma";

export class GetOrdens {
  async execute() {
    return prisma.ordemServico.findMany({
      where: {
        status: {
          notIn: ["FINALIZADA", "ENTREGUE"]
        }
      },
      include: {
        cliente: true,
        veiculo: true
      },
      orderBy: [
        {
          status: "asc" 
        },
        {
          createdAt: "asc"
        }
      ]
    });
  }
}