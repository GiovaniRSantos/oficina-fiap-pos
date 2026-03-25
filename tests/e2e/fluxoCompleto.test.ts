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
        cpfCnpj: `${unique}`,
        email: "teste@mailtrap.io"
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

  it("deve ir para DIAGNOSTICO", async () => {
    const res = await request(app)
      .patch(`/ordens/${ordemId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "DIAGNOSTICO" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("DIAGNOSTICO");
  });

  it("deve ir para AGUARDANDO_APROVACAO", async () => {
    const res = await request(app)
      .patch(`/ordens/${ordemId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "AGUARDANDO_APROVACAO" });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("AGUARDANDO_APROVACAO");
  });

  it("deve APROVAR orçamento", async () => {
    const res = await request(app)
      .post(`/ordens/${ordemId}/aprovacao`)
      .set("Authorization", `Bearer ${token}`)
      .send({ aprovado: true });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("EXECUCAO");
  });

  it("não deve aprovar novamente (regra de negócio)", async () => {
    const res = await request(app)
      .post(`/ordens/${ordemId}/aprovacao`)
      .set("Authorization", `Bearer ${token}`)
      .send({ aprovado: true });

    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it("deve finalizar ordem", async () => {
    const res1 = await request(app)
      .patch(`/ordens/${ordemId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "FINALIZADA" });

    expect(res1.status).toBe(200);

    const res2 = await request(app)
      .patch(`/ordens/${ordemId}/status`)
      .set("Authorization", `Bearer ${token}`)
      .send({ status: "ENTREGUE" });

    expect(res2.status).toBe(200);
  });

  it("deve buscar ordem finalizada", async () => {
    const res = await request(app)
      .get(`/ordens/${ordemId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ENTREGUE");
  });

  it("deve listar ordens ordenadas corretamente", async () => {
    const res = await request(app)
      .get("/ordens")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);

    const lista = res.body;

    for (const ordem of lista) {
      expect(["FINALIZADA", "ENTREGUE"]).not.toContain(ordem.status);
    }

    const prioridade = {
      EXECUCAO: 1,
      AGUARDANDO_APROVACAO: 2,
      DIAGNOSTICO: 3,
      RECEBIDA: 4
    } as const;

    for (let i = 0; i < lista.length - 1; i++) {
      const atual =
        prioridade[lista[i].status as keyof typeof prioridade];

      const proxima =
        prioridade[lista[i + 1].status as keyof typeof prioridade];

      expect(atual).toBeLessThanOrEqual(proxima);
    }
  });

  it("deve fazer soft delete da ordem", async () => {
    const resDelete = await request(app)
      .delete(`/ordens/${ordemId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(resDelete.status).toBe(204);

    const resGet = await request(app)
      .get(`/ordens/${ordemId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(resGet.status).toBeGreaterThanOrEqual(400);
  });
});