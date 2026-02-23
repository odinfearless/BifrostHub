import app from './app.js'
import { logger } from './plugins/logger'

const HOST = process.env.HOST || 'app.bifrosthub.com'
const PORT = Number(process.env.PORT) || 3000

app.listen({ port: PORT, host: HOST }).then(() => {
  logger.info(`🚀 Server running on http://${HOST}:${PORT}`)
})


