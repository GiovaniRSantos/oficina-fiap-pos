import { prisma } from "../../../infrastructure/database/prisma";

export class CreateVeiculo {
  async execute(data: {
    placa: string;
    marca: string;
    modelo: string;
    ano: number;
    clienteId: string;
  }) {
    const cliente = await prisma.cliente.findUnique({
      where: { id: data.clienteId }
    });

    if (!cliente) {
      throw new Error("Cliente não encontrado");
    }

    const existing = await prisma.veiculo.findUnique({
      where: { placa: data.placa }
    });

    if (existing) {
      throw new Error("Já existe um veículo com essa placa");
    }

    return prisma.veiculo.create({
      data
    });
  }
}