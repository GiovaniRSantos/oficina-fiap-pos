import { Request, Response } from "express";
import { CreateVeiculo } from "../../../application/use-cases/veiculo/createVeiculo";
import { GetVeiculos } from "../../../application/use-cases/veiculo/getVeiculos";
import { GetVeiculoById } from "../../../application/use-cases/veiculo/getVeiculoById";
import { UpdateVeiculo } from "../../../application/use-cases/veiculo/updateVeiculo";
import { DeleteVeiculo } from "../../../application/use-cases/veiculo/deleteVeiculo";
import { createVeiculoSchema, updateVeiculoSchema } from "../../../application/dtos/veiculo.dto";

export class VeiculoController {
  async create(req: Request, res: Response) {
    const data = createVeiculoSchema.parse(req.body);
    const result = await new CreateVeiculo().execute(data);
    return res.status(201).json(result);
  }

  async getAll(req: Request, res: Response) {
    const result = await new GetVeiculos().execute();
    return res.json(result);
  }

  async getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const result = await new GetVeiculoById().execute(id);
    return res.json(result);
  }

  async update(req: Request, res: Response) {
    const id = String(req.params.id);
    const data = updateVeiculoSchema.parse(req.body);
    const result = await new UpdateVeiculo().execute(id, data);
    return res.json(result);
  }

  async delete(req: Request, res: Response) {
    const id = String(req.params.id);
    const result = await new DeleteVeiculo().execute(id);
    return res.json(result);
  }
}