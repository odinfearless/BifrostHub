import { FastifyInstance } from 'fastify'
import { paginate } from '../../utils/paginate.js'
import { Prisma } from '@prisma/client'

interface ListServicosQuery {
  page?: string
  limit?: string
  search?: string
}

interface CreateServicoBody {
  codigo: string
  nome: string
  valor: number
  duracao_slots?: number
}

interface UpdateServicoBody {
  codigo?: string
  nome?: string
  valor?: number
  duracao_slots?: number
  ativo?: boolean
}

export default async function servicosSalaoRoutes(
  fastify: FastifyInstance
) {

  /*
  =============================
  📌 GET - Listar com paginação
  =============================
  */
  fastify.get<{ Querystring: ListServicosQuery }>(
    '/',
    async (request) => {

      const { page = '1', limit = '10', search } = request.query

      const where: Prisma.servicos_salaoWhereInput = {
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
      }

      return paginate(fastify.prisma.servicos_salao, {
        page: Number(page),
        limit: Number(limit),
        where,
        orderBy: { id: 'desc' }
      })
    }
  )

  /*
  =============================
  📌 GET - Buscar por ID
  =============================
  */
  fastify.get<{ Params: { id: string } }>(
    '/:id',
    async (request, reply) => {

      const id = Number(request.params.id)

      const servico =
        await fastify.prisma.servicos_salao.findUnique({
          where: { id }
        })

      if (!servico) {
        return reply.status(404).send({
          message: 'Serviço não encontrado'
        })
      }

      return servico
    }
  )

  /*
  =============================
  📌 POST - Criar
  =============================
  */
  fastify.post<{ Body: CreateServicoBody }>(
    '/',
    async (request, reply) => {

      const {
        codigo,
        nome,
        valor,
        duracao_slots
      } = request.body

      const servico =
        await fastify.prisma.servicos_salao.create({
          data: {
            codigo,
            nome,
            valor: Number(valor),
            duracao_slots: Number(duracao_slots) || 1,
            ativo: true
          }
        })

      return reply.status(201).send(servico)
    }
  )

  /*
  =============================
  📌 PUT - Atualizar
  =============================
  */
  fastify.put<{
    Params: { id: string }
    Body: UpdateServicoBody
  }>(
    '/:id',
    async (request, reply) => {

      const id = Number(request.params.id)

      const servicoExistente =
        await fastify.prisma.servicos_salao.findUnique({
          where: { id }
        })

      if (!servicoExistente) {
        return reply.status(404).send({
          message: 'Serviço não encontrado'
        })
      }

      const {
        codigo,
        nome,
        valor,
        duracao_slots,
        ativo
      } = request.body

      const servicoAtualizado =
        await fastify.prisma.servicos_salao.update({
          where: { id },
          data: {
            codigo,
            nome,
            valor: valor !== undefined ? Number(valor) : undefined,
            duracao_slots:
              duracao_slots !== undefined
                ? Number(duracao_slots)
                : undefined,
            ativo
          }
        })

      return servicoAtualizado
    }
  )

  /*
  =============================
  📌 DELETE - Soft delete
  =============================
  */
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    async (request, reply) => {

      const id = Number(request.params.id)

      const servicoExistente =
        await fastify.prisma.servicos_salao.findUnique({
          where: { id }
        })

      if (!servicoExistente) {
        return reply.status(404).send({
          message: 'Serviço não encontrado'
        })
      }

      await fastify.prisma.servicos_salao.update({
        where: { id },
        data: { ativo: false }
      })

      return reply.status(204).send()
    }
  )
}