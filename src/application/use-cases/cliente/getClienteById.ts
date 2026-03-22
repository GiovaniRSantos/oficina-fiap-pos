import { prisma } from "../../../infrastructure/database/prisma";

export class GetClienteById {
  async execute(id: string) {
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        veiculos: true,
        ordens: true
      }
    });

    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    return cliente;
  }
}