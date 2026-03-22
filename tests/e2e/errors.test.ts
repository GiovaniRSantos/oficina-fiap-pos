import request from "supertest";
import { app } from "../../src/server";

describe("💣 Cenários de erro", () => {
  let token: string;

  beforeAll(async () => {
    const res = await request(app).post("/auth/login").send({
      email: "admin@admin.com",
      password: "123456"
    });

    token = res.body.token;
  });

  it("não deve criar cliente duplicado", async () => {
    await request(app)
      .post("/clientes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Dup",
        cpfCnpj: "11111111111"
      });

    const res = await request(app)
      .post("/clientes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Dup",
        cpfCnpj: "11111111111"
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("não deve criar ordem com peça inexistente", async () => {
    const res = await request(app)
      .post("/ordens")
      .set("Authorization", `Bearer ${token}`)
      .send({
        clienteId: "fake",
        veiculoId: "fake",
        servicos: [],
        pecas: [{ id: "fake", quantidade: 1 }]
      });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("não deve acessar rota sem token", async () => {
    const res = await request(app).get("/clientes");

    expect(res.status).toBe(401);
  });

  it("não deve acessar com token inválido", async () => {
    const res = await request(app)
      .get("/clientes")
      .set("Authorization", "Bearer token_fake");

    expect(res.status).toBe(401);
  });
});