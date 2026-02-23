"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = servicosSalaoRoutes;
const paginate_js_1 = require("../../utils/paginate.js");
async function servicosSalaoRoutes(fastify) {
    /*
    =============================
    📌 GET - Listar com paginação
    =============================
    */
    fastify.get('/', async (request) => {
        const { page = '1', limit = '10', search } = request.query;
        const where = {
            ativo: true,
            ...(search && {
                OR: [
                    {
                        nome: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    },
                    {
                        codigo: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                ]
            })
        };
        return (0, paginate_js_1.paginate)(fastify.prisma.servicos_salao, {
            page: Number(page),
            limit: Number(limit),
            where,
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
        const servico = await fastify.prisma.servicos_salao.findUnique({
            where: { id }
        });
        if (!servico) {
            return reply.status(404).send({
                message: 'Serviço não encontrado'
            });
        }
        return servico;
    });
    /*
    =============================
    📌 POST - Criar
    =============================
    */
    fastify.post('/', async (request, reply) => {
        const { codigo, nome, valor, duracao_slots } = request.body;
        const servico = await fastify.prisma.servicos_salao.create({
            data: {
                codigo,
                nome,
                valor: Number(valor),
                duracao_slots: Number(duracao_slots) || 1,
                ativo: true
            }
        });
        return reply.status(201).send(servico);
    });
    /*
    =============================
    📌 PUT - Atualizar
    =============================
    */
    fastify.put('/:id', async (request, reply) => {
        const id = Number(request.params.id);
        const servicoExistente = await fastify.prisma.servicos_salao.findUnique({
            where: { id }
        });
        if (!servicoExistente) {
            return reply.status(404).send({
                message: 'Serviço não encontrado'
            });
        }
        const { codigo, nome, valor, duracao_slots, ativo } = request.body;
        const servicoAtualizado = await fastify.prisma.servicos_salao.update({
            where: { id },
            data: {
                codigo,
                nome,
                valor: valor !== undefined ? Number(valor) : undefined,
                duracao_slots: duracao_slots !== undefined
                    ? Number(duracao_slots)
                    : undefined,
                ativo
            }
        });
        return servicoAtualizado;
    });
    /*
    =============================
    📌 DELETE - Soft delete
    =============================
    */
    fastify.delete('/:id', async (request, reply) => {
        const id = Number(request.params.id);
        const servicoExistente = await fastify.prisma.servicos_salao.findUnique({
            where: { id }
        });
        if (!servicoExistente) {
            return reply.status(404).send({
                message: 'Serviço não encontrado'
            });
        }
        await fastify.prisma.servicos_salao.update({
            where: { id },
            data: { ativo: false }
        });
        return reply.status(204).send();
    });
}
