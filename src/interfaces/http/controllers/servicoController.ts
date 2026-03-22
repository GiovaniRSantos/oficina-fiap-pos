import { Request, Response } from "express";
import { CreateServico } from "../../../application/use-cases/servico/createServico";
import { GetServicos } from "../../../application/use-cases/servico/getServicos";
import { GetServicoById } from "../../../application/use-cases/servico/getServicoById";
import { UpdateServico } from "../../../application/use-cases/servico/updateServico";
import { DeleteServico } from "../../../application/use-cases/servico/deleteServico";
import { createServicoSchema, updateServicoSchema } from "../../../application/dtos/servico.dto";

export class ServicoController {
  async create(req: Request, res: Response) {
    const data = createServicoSchema.parse(req.body);
    const result = await new CreateServico().execute(data);
    return res.status(201).json(result);
  }

  async getAll(req: Request, res: Response) {
    const result = await new GetServicos().execute();
    return res.json(result);
  }
  
  async getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const result = await new GetServicoById().execute(id);
    return res.json(result);
  }

  async update(req: Request, res: Response) {
    const id = String(req.params.id);
    const data = updateServicoSchema.parse(req.body);
    const result = await new UpdateServico().execute(id, data);
    return res.json(result);
  }

  async delete(req: Request, res: Response) {
    const id = String(req.params.id);
    const result = await new DeleteServico().execute(id);
    return res.json(result);
  }
}