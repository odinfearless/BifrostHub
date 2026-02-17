const fastify = require('fastify')({ logger: true });
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Habilita o CORS para o seu Frontend conseguir acessar o Backend
fastify.register(require('@fastify/cors'), { 
  origin: "*" 
});

// --- ROTA DE TESTE ---
fastify.get('/', async () => {
  return { message: "BifrostHub Backend Online!" };
});

// --- ROTAS DO SALÃO ---

// Buscar todos os agendamentos (Para o FullCalendar)
fastify.get('/agendamentos', async (request, reply) => {
  try {
    const agendamentos = await prisma.agendamentos.findMany({
      include: {
        clientes: true,       // Inclui dados do cliente (nome, etc)
        servicos_salao: true  // Inclui dados do serviço (CT1, CT2...)
      }
    });
    return agendamentos;
  } catch (err) {
    reply.status(500).send(err);
  }
});

// Buscar todos os clientes (Para o Select do Modal)
fastify.get('/clientes', async () => {
  return await prisma.clientes.findMany();
});

// Buscar todos os serviços (Para o Select do Modal)
fastify.get('/servicos', async () => {
  return await prisma.servicos_salao.findMany();
});

// Criar um novo agendamento
fastify.post('/agendamentos', async (request, reply) => {
  try {
    const { cliente_id, servico_id, data_inicio, data_fim } = request.body;
    const novo = await prisma.agendamentos.create({
      data: {
        cliente_id: Number(cliente_id),
        servico_id: Number(servico_id),
        data_hora_inicio: new Date(data_inicio),
        data_hora_fim: new Date(data_fim),
        status: 'AGENDADO'
      }
    });
    return novo;
  } catch (err) {
    reply.status(400).send(err);
  }
});

// Iniciar o Servidor
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Servidor rodando em http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();