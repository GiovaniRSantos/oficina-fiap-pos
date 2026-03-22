import { prisma } from "../../../infrastructure/database/prisma";

export class GetVeiculos {
  async execute() {
    return prisma.veiculo.findMany({
      include: {
        cliente: true
      },
      orderBy: {
        marca: "asc"
      }
    });
  }
}