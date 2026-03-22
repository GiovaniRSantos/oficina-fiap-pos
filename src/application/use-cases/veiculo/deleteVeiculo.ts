import { prisma } from "../../../infrastructure/database/prisma";

export class DeleteVeiculo {
  async execute(id: string) {
    const veiculo = await prisma.veiculo.findUnique({
      where: { id },
      include: {
        ordens: true
      }
    });

    if (!veiculo) {
      throw new Error("Veículo não encontrado");
    }

    if (veiculo.ordens.length > 0) {
      throw new Error(
        "Não é possível excluir veículo com ordens de serviço vinculadas"
      );
    }

    await prisma.veiculo.delete({
      where: { id }
    });

    return { message: "Veículo removido com sucesso" };
  }
}