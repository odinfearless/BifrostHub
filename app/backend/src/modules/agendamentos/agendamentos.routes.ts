import { FastifyInstance } from 'fastify'
import { paginate } from '../../utils/paginate.js'
import { status_agendamento } from '@prisma/client'
import { logger } from '../../plugins/logger'

interface ListAgendamentosQuery {
  page?: string
  limit?: string
  search?: string
}

interface CreateAgendamentoBody {
  cliente_id: number
  servico_id: number
  data_hora_inicio: string
  data_hora_fim: string
}

interface UpdateAgendamentoBody {
  cliente_id?: number
  servico_id?: number
  data_hora_inicio?: string
  data_hora_fim?: string
  status?: status_agendamento
}

export default async function agendamentosRoutes(
  fastify: FastifyInstance
) {

  /*
  =============================
  📌 GET - Listar com paginação
  =============================
  */
  fastify.get<{ Querystring: ListAgendamentosQuery }>(
    '/',
    async (request) => {

      const { page = '1', limit = '10' } = request.query

      return paginate(fastify.prisma.agendamentos, {
        page: Number(page),
        limit: Number(limit),
        include: {
          clientes: true,
          servicos_salao: true
        },
        orderBy: {
          data_hora_inicio: 'desc'
        }
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

      const agendamento =
        await fastify.prisma.agendamentos.findUnique({
          where: { id },
          include: {
            clientes: true,
            servicos_salao: true
          }
        })

      if (!agendamento) {
        return reply.status(404).send({
          message: 'Agendamento não encontrado'
        })
      }

      return agendamento
    }
  )

  /*
  =============================
  📌 POST - Criar
  =============================
  */
  fastify.post<{ Body: CreateAgendamentoBody }>(
    '/',
    async (request, reply) => {

      const {
        cliente_id,
        servico_id,
        data_hora_inicio,
        data_hora_fim
      } = request.body



      const data: any = {
        cliente_id: Number(cliente_id),
        servico_id: Number(servico_id),
        data_hora_inicio: new Date(data_hora_inicio),
        data_hora_fim: new Date(data_hora_fim),
        status: 'AGENDADO'
      }    

      const novoAgendamento =
        await fastify.prisma.agendamentos.create({
          data: data
        })

      return reply.status(201).send(novoAgendamento)
    }
  )

  /*
  =============================
  📌 PUT - Atualizar
  =============================
  */
  fastify.put<{
    Params: { id: string }
    Body: UpdateAgendamentoBody
  }>(
    '/:id',
    async (request, reply) => {

      const id = Number(request.params.id)

      const agendamentoExistente =
        await fastify.prisma.agendamentos.findUnique({
          where: { id }
        })

      if (!agendamentoExistente) {
        return reply.status(404).send({
          message: 'Agendamento não encontrado'
        })
      }

      const {
        cliente_id,
        servico_id,
        data_hora_inicio,
        data_hora_fim,
        status
      } = request.body

      const agendamentoAtualizado =
        await fastify.prisma.agendamentos.update({
          where: { id },
          data: {
            cliente_id: cliente_id !== undefined ? Number(cliente_id) : undefined,
            servico_id: servico_id !== undefined ? Number(servico_id) : undefined,
            data_hora_inicio: data_hora_inicio ? new Date(data_hora_inicio) : undefined,
            data_hora_fim: data_hora_fim ? new Date(data_hora_fim) : undefined,
            status: status ?? undefined
          }
        })

      return agendamentoAtualizado
    }
  )

  /*
  =============================
  📌 DELETE - Remover
  =============================
  */
  fastify.delete<{ Params: { id: string } }>(
    '/:id',
    async (request, reply) => {

      const id = Number(request.params.id)

      const agendamentoExistente =
        await fastify.prisma.agendamentos.findUnique({
          where: { id }
        })

      if (!agendamentoExistente) {
        return reply.status(404).send({
          message: 'Agendamento não encontrado'
        })
      }

      await fastify.prisma.agendamentos.delete({
        where: { id }
      })

      return reply.status(204).send()
    }
  )
}