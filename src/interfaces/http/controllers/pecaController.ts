import { Request, Response } from "express";
import { CreatePeca } from "../../../application/use-cases/peca/createPeca";
import { GetPecas } from "../../../application/use-cases/peca/getPecas";
import { GetPecaById } from "../../../application/use-cases/peca/getPecaById";
import { UpdatePeca } from "../../../application/use-cases/peca/updatePeca";
import { DeletePeca } from "../../../application/use-cases/peca/deletePeca";
import { createPecaSchema, updatePecaSchema } from "../../../application/dtos/peca.dto";

export class PecaController {
  async create(req: Request, res: Response) {
    const data = createPecaSchema.parse(req.body);
    const result = await new CreatePeca().execute(data);
    return res.status(201).json(result);
  }

  async getAll(res: Response) {
    const result = await new GetPecas().execute();
    return res.json(result);
  }

  async getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const result = await new GetPecaById().execute(id);
    return res.json(result);
  }

  async update(req: Request, res: Response) {
    const id = String(req.params.id);
    const data = updatePecaSchema.parse(req.body);
    const result = await new UpdatePeca().execute(id, data);
    return res.json(result);
  }

  async delete(req: Request, res: Response) {
    const id = String(req.params.id);
    const result = await new DeletePeca().execute(id);
    return res.json(result);
  }
}