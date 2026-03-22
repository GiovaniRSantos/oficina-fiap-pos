import { Request, Response } from "express";
import { CreateOrdemServico } from "../../../application/use-cases/ordemServico/createOrdemServico";
import { UpdateStatus } from "../../../application/use-cases/ordemServico/updateStatus";
import { createOrdemServicoSchema } from "../../../application/dtos/ordemServico.dto";
import { updateStatusSchema } from "../../../application/dtos/updateStatus.dto";
import { OrdemStatus } from "@/domain/enums/ordemStatus";
import { updateAprovacaoSchema } from "@/application/dtos/updateAprovacao.dto";
import { ApproveOrdemServico } from "@/application/use-cases/ordemServico/approveOrdemServico";
import { GetAllOrdemServico } from "@/application/use-cases/ordemServico/getAllOrdemServico";
import { DeleteOrdemServico } from "@/application/use-cases/ordemServico/deleteOrdemServico";
import { GetOrdemServicoById } from "@/application/use-cases/ordemServico/getOrdemById";

export class OrdemServicoController {
  async create(req: Request, res: Response) {
    const data = createOrdemServicoSchema.parse(req.body);
    const result = await new CreateOrdemServico().execute(data);
    return res.status(201).json(result);
  }

  async getAll(req: Request, res: Response) {
    const result = await new GetAllOrdemServico().execute();
    return res.json(result);
  }

  async getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const result = await new GetOrdemServicoById().execute(id);
    return res.json(result);
  }

  async updateStatus(req: Request, res: Response) {
    const id = String(req.params.id);
    const { status } = updateStatusSchema.parse(req.body);
    const result = await new UpdateStatus().execute(
      id,
      status as OrdemStatus
    );
    return res.json(result);
  }

  async approve(req: Request, res: Response) {
    const id = String(req.params.id);

    const { aprovado } = updateAprovacaoSchema.parse(req.body);

    const result = await new ApproveOrdemServico().execute(id, aprovado);

    return res.json(result);
  }

  async delete(req: Request, res: Response) {
    const id = String(req.params.id);

    await new DeleteOrdemServico().execute(id);

    return res.status(204).send();
  }
}