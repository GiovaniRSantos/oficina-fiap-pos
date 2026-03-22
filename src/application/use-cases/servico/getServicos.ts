import { prisma } from "../../../infrastructure/database/prisma";

export class GetServicos {
  async execute() {
    return prisma.servico.findMany({
      orderBy: {
        nome: "asc"
      }
    });
  }
}