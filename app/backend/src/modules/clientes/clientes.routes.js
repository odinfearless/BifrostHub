async function routes(fastify) {

    fastify.get('/', async () => {
    return await fastify.prisma.clientes.findMany();
    });

}

module.exports = routes;
