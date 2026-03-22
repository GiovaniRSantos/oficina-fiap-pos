import { prisma } from "../../../infrastructure/database/prisma";

export class DeletePeca {
  async execute(id: string) {
    const peca = await prisma.peca.findUnique({
      where: { id },
      include: {
        ordens: true
      }
    });

    if (!peca) {
      throw new Error("Peça não encontrada");
    }

    if (peca.ordens.length > 0) {
      throw new Error(
        "Não é possível excluir peça vinculada a ordens de serviço"
      );
    }

    await prisma.peca.delete({
      where: { id }
    });

    return { message: "Peça removida com sucesso" };
  }
}