const buildApp = require('./app');

const start = async () => {
  const app = buildApp();

  try {
    await app.listen({ port: 3000, host: '0.0.0.0' });
    console.log('🚀 Backend rodando na porta 3000');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
