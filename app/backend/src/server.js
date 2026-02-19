const buildApp = require('./app');

const start = async () => {
  const app = buildApp();

const HOST = process.argv[2] || 'localhost';
const PORT = process.argv[3] || 3000;

  try {
    await app.listen({ port: PORT, host: HOST });
    console.log('🚀 Backend rodando na porta 3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
