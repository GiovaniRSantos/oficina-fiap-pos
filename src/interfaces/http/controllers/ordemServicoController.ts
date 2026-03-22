import { Request, Response } from "express";
import { CreateOrdemServico } from "../../../application/use-cases/ordemServico/createOrdemServico";
import { GetOrdens } from "../../../application/use-cases/ordemServico/getOrdens";
import { GetOrdemById } from "../../../application/use-cases/ordemServico/getOrdemById";
import { UpdateStatus } from "../../../application/use-cases/ordemServico/updateStatus";
import { createOrdemServicoSchema } from "../../../application/dtos/ordemServico.dto";
import { updateStatusSchema } from "../../../application/dtos/updateStatus.dto";
import { OrdemStatus } from "@/domain/enums/ordemStatus";

export class OrdemServicoController {
  async create(req: Request, res: Response) {
    const data = createOrdemServicoSchema.parse(req.body);
    const result = await new CreateOrdemServico().execute(data);
    return res.status(201).json(result);
  }

  async getAll(req: Request, res: Response) {
    const result = await new GetOrdens().execute();
    return res.json(result);
  }

  async getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const result = await new GetOrdemById().execute(id);
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
}