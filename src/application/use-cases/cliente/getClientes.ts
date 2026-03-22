import { prisma } from "../../../infrastructure/database/prisma";

export class GetClientes {
  async execute() {
    return prisma.cliente.findMany({
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}