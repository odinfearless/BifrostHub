const fp = require('fastify-plugin');
const cors = require('@fastify/cors');

async function corsPlugin(fastify) {
  await fastify.register(cors, {
    origin: true, // permite qualquer origem (útil em dev)
    credentials: true
  });
}

module.exports = fp(corsPlugin);
