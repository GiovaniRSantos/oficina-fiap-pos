import request from "supertest";
import { app } from "../../src/server";

describe("🔥 Fluxo E2E completo", () => {
  let token: string;

  let clienteId: string;
  let veiculoId: string;
  let servicoId: string;
  let pecaId: string;
  let ordemId: string;

  const unique = Date.now();

  beforeAll(async () => {
    const res = await request(app).post("/auth/login").send({
      email: "admin@admin.com",
      password: "123456"
    });

    token = res.body.token;
  });

  it("deve criar cliente", async () => {
    const res = await request(app)
      .post("/clientes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: `Teste E2E ${unique}`,
        cpfCnpj: `${unique}` 
      });

    expect(res.status).toBe(201);
    clienteId = res.body.id;
  });

  it("deve criar veículo", async () => {
    const res = await request(app)
      .post("/veiculos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        placa: `ZZZ${unique.toString().slice(-4)}`, 
        marca: "Honda",
        modelo: "Civic",
        ano: 2022,
        clienteId
      });

    expect(res.status).toBe(201);
    veiculoId = res.body.id;
  });

  it("deve criar serviço", async () => {
    const res = await request(app)
      .post("/servicos")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: `Alinhamento ${unique}`,
        preco: 100
      });

    expect(res.status).toBe(201);
    servicoId = res.body.id;
  });

  it("deve criar peça", async () => {
    const res = await request(app)
      .post("/pecas")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: `Filtro ${unique}`, 
        preco: 80,
        estoque: 10
      });

    expect(res.status).toBe(201);
    pecaId = res.body.id;
  });

  it("deve criar ordem de serviço", async () => {
    const res = await request(app)
      .post("/ordens")
      .set("Authorization", `Bearer ${token}`)
      .send({
        clienteId,
        veiculoId,
        servicos: [servicoId],
        pecas: [
          {
            id: pecaId,
            quantidade: 2
          }
        ]
      });

    expect(res.status).toBe(201);
    ordemId = res.body.id;
  });

  it("deve buscar ordem por id", async () => {
    const res = await request(app)
      .get(`/ordens/${ordemId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(ordemId);
  });

  it("deve atualizar status corretamente", async () => {
    const steps = [
      "DIAGNOSTICO",
      "AGUARDANDO_APROVACAO",
      "EXECUCAO",
      "FINALIZADA",
      "ENTREGUE"
    ];

    for (const status of steps) {
      const res = await request(app)
        .patch(`/ordens/${ordemId}/status`)
        .set("Authorization", `Bearer ${token}`)
        .send({ status });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe(status);
    }
  });
});