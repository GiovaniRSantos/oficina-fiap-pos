import { prisma } from "../../../infrastructure/database/prisma";

export class DeleteServico {
  async execute(id: string) {
    const servico = await prisma.servico.findUnique({
      where: { id },
      include: {
        ordens: true
      }
    });

    if (!servico) {
      throw new Error("Serviço não encontrado");
    }

    if (servico.ordens.length > 0) {
      throw new Error(
        "Não é possível excluir serviço vinculado a ordens de serviço"
      );
    }

    await prisma.servico.delete({
      where: { id }
    });

    return { message: "Serviço removido com sucesso" };
  }
}