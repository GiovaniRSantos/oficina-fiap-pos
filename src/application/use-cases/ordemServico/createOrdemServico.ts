import { OrdemStatus } from "../../../domain/enums/ordemStatus";
import { prisma } from "../../../infrastructure/database/prisma";

export class CreateOrdemServico {
  async execute(data: {
    clienteId: string;
    veiculoId: string;
    servicos: string[];
    pecas?: { id: string; quantidade: number }[];
  }) {
    const { clienteId, veiculoId, servicos, pecas = [] } = data;

    return prisma.$transaction(async (tx) => {
      let total = 0;

      const cliente = await tx.cliente.findUnique({ where: { id: clienteId } });
      if (!cliente) throw new Error("Cliente não encontrado");

      const veiculo = await tx.veiculo.findUnique({ where: { id: veiculoId } });
      if (!veiculo) throw new Error("Veículo não encontrado");

      const servicosDB = await tx.servico.findMany({
        where: { id: { in: servicos } }
      });

      if (servicosDB.length !== servicos.length) {
        throw new Error("Serviço inválido informado");
      }

      servicosDB.forEach(s => total += s.preco);

      for (const p of pecas) {
        const peca = await tx.peca.findUnique({
          where: { id: p.id }
        });

        if (!peca) throw new Error("Peça não encontrada");

        if (peca.estoque < p.quantidade) {
          throw new Error(`Estoque insuficiente para peça ${peca.nome}`);
        }

        total += peca.preco * p.quantidade;

        await tx.peca.update({
          where: { id: p.id },
          data: {
            estoque: {
              decrement: p.quantidade
            }
          }
        });
      }

      return tx.ordemServico.create({
        data: {
          clienteId,
          veiculoId,
          status: OrdemStatus.RECEBIDA,
          total,

          servicos: {
            create: servicos.map(id => ({
              servicoId: id
            }))
          },

          pecas: {
            create: pecas.map(p => ({
              pecaId: p.id,
              quantidade: p.quantidade
            }))
          }
        }
      });
    });
  }
}