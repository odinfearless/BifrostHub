async function routes(fastify) {

    // Buscar todos os serviços (Para o Select do Modal)
    fastify.get('/', async () => {
    return await fastify.prisma.servicos_salao.findMany();
    });

}

module.exports = routes;
