import { Router } from "express";
import { ClienteController } from "../controllers/clienteController";
import { OrdemServicoController } from "../controllers/ordemServicoController";
import { PecaController } from "../controllers/pecaController";
import { ServicoController } from "../controllers/servicoController";
import { VeiculoController } from "../controllers/veiculoController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { AuthController } from "../controllers/authController";

const routes = Router();

const cliente = new ClienteController();
const veiculo = new VeiculoController();
const servico = new ServicoController();
const peca = new PecaController();
const ordem = new OrdemServicoController();
const auth = new AuthController();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login do sistema
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             email: admin@admin.com
 *             password: 123456
 *     responses:
 *       200:
 *         description: Token JWT gerado
 */
routes.post("/auth/login", (req, res) => auth.login(req, res));

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Criar cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             nome: João Silva
 *             cpfCnpj: 12345678900
 *     responses:
 *       201:
 *         description: Cliente criado
 */
routes.post("/clientes", authMiddleware(["admin"]), cliente.create);

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Listar clientes
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
routes.get("/clientes", authMiddleware(["admin"]), cliente.getAll);

/**
 * @swagger
 * /clientes/{id}:
 *   get:
 *     summary: Buscar cliente por ID
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cliente encontrado
 */
routes.get("/clientes/:id", authMiddleware(["admin"]), cliente.getById);

/**
 * @swagger
 * /clientes/{id}:
 *   put:
 *     summary: Atualizar cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             nome: Novo Nome
 *     responses:
 *       200:
 *         description: Cliente atualizado
 */
routes.put("/clientes/:id", authMiddleware(["admin"]), cliente.update);

/**
 * @swagger
 * /clientes/{id}:
 *   delete:
 *     summary: Remover cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Cliente removido
 */
routes.delete("/clientes/:id", authMiddleware(["admin"]), cliente.delete);

/**
 * @swagger
 * /veiculos:
 *   post:
 *     summary: Criar veículo
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             placa: ABC1234
 *             marca: Toyota
 *             modelo: Corolla
 *             ano: 2020
 *             clienteId: ID_CLIENTE
 */
routes.post("/veiculos", authMiddleware(["admin"]), veiculo.create);

/**
 * @swagger
 * /veiculos:
 *   get:
 *     summary: Listar veículos
 *     tags: [Veículos]
 *     security:
 *       - bearerAuth: []
 */
routes.get("/veiculos", authMiddleware(["admin"]), veiculo.getAll);

/**
 * @swagger
 * /servicos:
 *   post:
 *     summary: Criar serviço
 *     tags: [Serviços]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             nome: Troca de óleo
 *             preco: 150
 */
routes.post("/servicos", authMiddleware(["admin"]), servico.create);

/**
 * @swagger
 * /servicos:
 *   get:
 *     summary: Listar serviços
 *     tags: [Serviços]
 *     security:
 *       - bearerAuth: []
 */
routes.get("/servicos", authMiddleware(["admin"]), servico.getAll);

/**
 * @swagger
 * /pecas:
 *   post:
 *     summary: Criar peça
 *     tags: [Peças]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             nome: Filtro de óleo
 *             preco: 50
 *             estoque: 10
 */
routes.post("/pecas", authMiddleware(["admin"]), peca.create);

/**
 * @swagger
 * /pecas:
 *   get:
 *     summary: Listar peças
 *     tags: [Peças]
 *     security:
 *       - bearerAuth: []
 */
routes.get("/pecas", authMiddleware(["admin"]), peca.getAll);

/**
 * @swagger
 * /ordens:
 *   post:
 *     summary: Criar ordem de serviço
 *     tags: [Ordens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             clienteId: ID_CLIENTE
 *             veiculoId: ID_VEICULO
 *             servicos: ["ID_SERVICO"]
 *             pecas:
 *               - id: ID_PECA
 *                 quantidade: 2
 */
routes.post("/ordens", authMiddleware(["admin"]), ordem.create);

/**
 * @swagger
 * /ordens:
 *   get:
 *     summary: Listar ordens de serviço
 *     tags: [Ordens]
 *     security:
 *       - bearerAuth: []
 */
routes.get("/ordens", authMiddleware(["admin"]), ordem.getAll);

/**
 * @swagger
 * /ordens/{id}:
 *   get:
 *     summary: Buscar ordem por ID
 *     tags: [Ordens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 */
routes.get("/ordens/:id", authMiddleware(["admin"]), ordem.getById);

/**
 * @swagger
 * /ordens/{id}/status:
 *   patch:
 *     summary: Atualizar status da ordem
 *     tags: [Ordens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           example:
 *             status: EXECUCAO
 */
routes.patch(
  "/ordens/:id/status",
  authMiddleware(["admin"]),
  ordem.updateStatus
);

export default routes;