import { Request, Response } from "express";
import { CreateCliente } from "../../../application/use-cases/cliente/createCliente";
import { GetClientes } from "../../../application/use-cases/cliente/getClientes";
import { GetClienteById } from "../../../application/use-cases/cliente/getClienteById";
import { UpdateCliente } from "../../../application/use-cases/cliente/updateCliente";
import { DeleteCliente } from "../../../application/use-cases/cliente/deleteCliente";
import { createClienteSchema, updateClienteSchema } from "../../../application/dtos/cliente.dto";

export class ClienteController {
  async create(req: Request, res: Response) {
    const data = createClienteSchema.parse(req.body);
    const result = await new CreateCliente().execute(data);
    return res.status(201).json(result);
  }

  async getAll(res: Response) {
    const result = await new GetClientes().execute();
    return res.json(result);
  }

  async getById(req: Request, res: Response) {
    const id = String(req.params.id);
    const result = await new GetClienteById().execute(id);
    return res.json(result);
  }

  async update(req: Request, res: Response) {
    const id = String(req.params.id);
    const data = updateClienteSchema.parse(req.body);
    const result = await new UpdateCliente().execute(id, data);
    return res.json(result);
  }

  async delete(req: Request, res: Response) {
    const id = String(req.params.id);
    const result = await new DeleteCliente().execute(id);
    return res.json(result);
  }
}