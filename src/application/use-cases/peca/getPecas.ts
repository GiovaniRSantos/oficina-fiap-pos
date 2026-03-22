import { prisma } from "../../../infrastructure/database/prisma";

export class GetPecas {
  async execute() {
    return prisma.peca.findMany({
      orderBy: {
        nome: "asc"
      }
    });
  }
}