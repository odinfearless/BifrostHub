async function routes(fastify) {

  fastify.get('/', async () => {
    return await fastify.prisma.agendamentos.findMany({
      include: {
        clientes: true,
        servicos_salao: true
      }
    });
  });

  fastify.post('/', async (request, reply) => {
    const { cliente_id, servico_id, data_inicio, data_fim } = request.body;

    return await fastify.prisma.agendamentos.create({
      data: {
        cliente_id: Number(cliente_id),
        servico_id: Number(servico_id),
        data_hora_inicio: new Date(data_inicio),
        data_hora_fim: new Date(data_fim),
        status: 'AGENDADO'
      }
    });
  });
}

module.exports = routes;
