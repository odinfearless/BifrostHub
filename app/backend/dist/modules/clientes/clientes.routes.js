"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = clientesRoutes;
const paginate_js_1 = require("../../utils/paginate.js");
async function clientesRoutes(fastify) {
    /*
    =============================
    📌 GET - Listar com paginação
    =============================
    */
    fastify.get('/', async (request) => {
        const { page = '1', limit = '10', search } = request.query;
        return (0, paginate_js_1.paginate)(fastify.prisma.clientes, {
            page: Number(page),
            limit: Number(limit),
            where: {
                ativo: true,
                ...(search && {
                    nome: {
                        contains: search,
                        mode: 'insensitive'
                    }
                })
            },
            orderBy: { id: 'desc' }
        });
    });
    /*
    =============================
    📌 GET - Buscar por ID
    =============================
    */
    fastify.get('/:id', async (request, reply) => {
        const id = Number(request.params.id);
        const cliente = await fastify.prisma.clientes.findUnique({
            where: { id }
        });
        if (!cliente) {
            return reply.status(404).send({
                message: 'Cliente não encontrado'
            });
        }
        return cliente;
    });
    /*
    =============================
    📌 POST - Criar
    =============================
    */
    fastify.post('/', async (request, reply) => {
        const { nome, telefone, endereco } = request.body;
        const cliente = await fastify.prisma.clientes.create({
            data: {
                nome,
                telefone,
                endereco,
                ativo: true
            }
        });
        return reply.status(201).send(cliente);
    });
    /*
    =============================
    📌 PUT - Atualizar
    =============================
    */
    fastify.put('/:id', async (request, reply) => {
        const id = Number(request.params.id);
        const clienteExistente = await fastify.prisma.clientes.findUnique({
            where: { id }
        });
        if (!clienteExistente) {
            return reply.status(404).send({
                message: 'Cliente não encontrado'
            });
        }
        const clienteAtualizado = await fastify.prisma.clientes.update({
            where: { id },
            data: request.body
        });
        return clienteAtualizado;
    });
    /*
    =============================
    📌 DELETE - Soft delete
    =============================
    */
    fastify.delete('/:id', async (request, reply) => {
        const id = Number(request.params.id);
        const clienteExistente = await fastify.prisma.clientes.findUnique({
            where: { id }
        });
        if (!clienteExistente) {
            return reply.status(404).send({
                message: 'Cliente não encontrado'
            });
        }
        await fastify.prisma.clientes.update({
            where: { id },
            data: { ativo: false }
        });
        return reply.status(204).send();
    });
}
