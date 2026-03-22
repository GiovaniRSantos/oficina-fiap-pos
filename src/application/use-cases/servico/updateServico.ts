import { prisma } from "../../../infrastructure/database/prisma";

export class UpdateServico {
  async execute(
    id: string,
    data: { nome?: string; preco?: number }
  ) {
    const servico = await prisma.servico.findUnique({
      where: { id }
    });

    if (!servico) {
      throw new Error("Serviço não encontrado");
    }

    if (data.nome) {
      const existing = await prisma.servico.findFirst({
        where: {
          nome: {
            equals: data.nome,
            mode: "insensitive"
          }
        }
      });

      if (existing && existing.id !== id) {
        throw new Error("Nome de serviço já está em uso");
      }
    }

    return prisma.servico.update({
      where: { id },
      data
    });
  }
}