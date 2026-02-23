import Fastify from 'fastify'
import prismaPlugin from './plugins/prisma'
import cors from './plugins/cors.js';
import clientesRoutes from './modules/clientes/clientes.routes'
import servicosSalaoRoutes from './modules/servicos/servicos_salao.routes'
import agendamentosRoutes from './modules/agendamentos/agendamentos.routes'

const app = Fastify({ logger: true })

app.register(prismaPlugin)
app.register(cors)
app.register(clientesRoutes, { prefix: '/api/clientes' })
app.register(servicosSalaoRoutes, { prefix: '/api/servicos_salao' })
app.register(agendamentosRoutes, { prefix: '/api/agendamentos' })

export default app
