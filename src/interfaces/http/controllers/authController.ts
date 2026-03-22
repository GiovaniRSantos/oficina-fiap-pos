import { Request, Response } from "express";
import { loginSchema } from "../../../application/dtos/auth.dto";
import { Login } from "../../../application/use-cases/auth/login";

export class AuthController {
  async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);

    const result = await new Login().execute(data);

    return res.json(result);
  }
}