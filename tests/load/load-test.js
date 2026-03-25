import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "10s", target: 10 },
    { duration: "20s", target: 30 },
    { duration: "10s", target: 0 }
  ]
};

const BASE_URL = "http://localhost:3000";

export default function () {
  const loginRes = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: "admin@admin.com",
    password: "123456"
  }), { headers: { "Content-Type": "application/json" } });

  if (loginRes.status !== 200) return;

  const token = loginRes.json("token");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  const unique = Date.now() + Math.random();

  const clienteRes = http.post(`${BASE_URL}/clientes`, JSON.stringify({
    nome: `Cliente ${unique}`,
    cpfCnpj: `${unique}`
  }), { headers });

  if (clienteRes.status !== 201) return;

  const clienteId = clienteRes.json("id");

  const veiculoRes = http.post(`${BASE_URL}/veiculos`, JSON.stringify({
    placa: `LD${Math.floor(Math.random() * 9999)}`,
    marca: "VW",
    modelo: "Gol",
    ano: 2020,
    clienteId
  }), { headers });

  if (veiculoRes.status !== 201) return;

  const veiculoId = veiculoRes.json("id");

  const servicoRes = http.post(`${BASE_URL}/servicos`, JSON.stringify({
    nome: `Servico ${unique}`,
    preco: 100
  }), { headers });

  if (servicoRes.status !== 201) return;

  const servicoId = servicoRes.json("id");

  const pecaRes = http.post(`${BASE_URL}/pecas`, JSON.stringify({
    nome: `Peca ${unique}`,
    preco: 50,
    estoque: 10
  }), { headers });

  if (pecaRes.status !== 201) return;

  const pecaId = pecaRes.json("id");

  const ordemRes = http.post(`${BASE_URL}/ordens`, JSON.stringify({
    clienteId,
    veiculoId,
    servicos: [servicoId],
    pecas: [{ id: pecaId, quantidade: 1 }]
  }), { headers });

  check(ordemRes, {
    "ordem criada com sucesso": (r) => r.status === 201
  });

  sleep(1);
}