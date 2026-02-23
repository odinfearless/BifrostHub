"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const prisma_1 = __importDefault(require("./plugins/prisma"));
const cors_js_1 = __importDefault(require("./plugins/cors.js"));
const clientes_routes_1 = __importDefault(require("./modules/clientes/clientes.routes"));
const servicos_salao_routes_1 = __importDefault(require("./modules/servicos/servicos_salao.routes"));
const agendamentos_routes_1 = __importDefault(require("./modules/agendamentos/agendamentos.routes"));
const app = (0, fastify_1.default)({ logger: true });
app.register(prisma_1.default);
app.register(cors_js_1.default);
app.register(clientes_routes_1.default, { prefix: '/api/clientes' });
app.register(servicos_salao_routes_1.default, { prefix: '/api/servicos_salao' });
app.register(agendamentos_routes_1.default, { prefix: '/api/agendamentos' });
exports.default = app;
