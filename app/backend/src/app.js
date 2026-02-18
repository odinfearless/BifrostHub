const fastify = require('fastify');
const cors = require('./plugins/cors');
const prismaPlugin = require('./plugins/prisma');

const agendamentosRoutes = require('./modules/agendamentos/agendamentos.routes');
const clientesRoutes = require('./modules/clientes/clientes.routes');
const servicosRoutes = require('./modules/servicos/servicos.routes');

function buildApp() {
  const app = fastify({ logger: true });

  app.register(cors);
  app.register(prismaPlugin);

  app.register(agendamentosRoutes, { prefix: '/api/agendamentos' });
  app.register(clientesRoutes, { prefix: '/api/clientes' });
  app.register(servicosRoutes, { prefix: '/api/servicos' });

  return app;
}

module.exports = buildApp;
