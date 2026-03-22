import { generateToken } from "../../../infrastructure/auth/jwt";

export class Login {
  async execute(data: { email: string; password: string }) {
    if (data.email !== "admin@admin.com" || data.password !== "123456") {
      throw new Error("Credenciais inválidas");
    }

    const token = generateToken({
      userId: "1",
      role: "admin"
    });

    return {
      token
    };
  }
}