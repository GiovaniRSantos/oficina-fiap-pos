import { prisma } from "../../../infrastructure/database/prisma";

export class UpdateVeiculo {
  async execute(
    id: string,
    data: {
      placa?: string;
      marca?: string;
      modelo?: string;
      ano?: number;
    }
  ) {
    const veiculo = await prisma.veiculo.findUnique({
      where: { id }
    });

    if (!veiculo) {
      throw new Error("Veículo não encontrado");
    }

    if (data.placa) {
      const existing = await prisma.veiculo.findUnique({
        where: { placa: data.placa }
      });

      if (existing && existing.id !== id) {
        throw new Error("Placa já está em uso");
      }
    }

    return prisma.veiculo.update({
      where: { id },
      data
    });
  }
}