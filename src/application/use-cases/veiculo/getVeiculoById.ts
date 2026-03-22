import { prisma } from "../../../infrastructure/database/prisma";

export class GetVeiculoById {
  async execute(id: string) {
    const veiculo = await prisma.veiculo.findUnique({
      where: { id },
      include: {
        cliente: true,
        ordens: true
      }
    });

    if (!veiculo) {
      throw new Error("Veículo não encontrado");
    }

    return veiculo;
  }
}