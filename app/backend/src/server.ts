import app from './app.js'
import { logger } from './plugins/logger'

const HOST = process.env.HOST 
const PORT = Number(process.env.PORT)

app.listen({ port: PORT, host: HOST }).then(() => {
  logger.info(`🚀 Server running on http://${HOST}:${PORT}`)
})


