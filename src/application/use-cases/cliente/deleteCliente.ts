import { prisma } from "../../../infrastructure/database/prisma";

export class DeleteCliente {
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

    if (cliente.veiculos.length > 0 || cliente.ordens.length > 0) {
      throw new Error(
        "Não é possível excluir cliente com veículos ou ordens de serviço"
      );
    }

    await prisma.cliente.delete({
      where: { id }
    });

    return { message: "Cliente removido com sucesso" };
  }
}