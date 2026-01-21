const agentBrowserConfig = require('./config/agentBrowser');
const whatsappBotConfig = require('./config/whatsappBot');
const commandHandler = require('./bots/commandHandler');
const helpers = require('./utils/helpers');
const logger = require('./utils/logger');
const config = require('./config/environment');

function printBanner() {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║     🤖 BOT WHATSAPP + AGENT-BROWSER                  ║
║                                                       ║
║     Status: INICIANDO...                             ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
}

async function initialize() {
  printBanner();

  logger.info('⏳ Inicializando aplicação...');

  logger.info('📁 Criando estrutura de pastas...');
  helpers.ensureDir(config.paths.screenshots);
  helpers.ensureDir(config.paths.logs);

  logger.info('🔍 Verificando agent-browser...');
  const agentBrowserOk = agentBrowserConfig.checkInstallation();

  if (!agentBrowserOk) {
    logger.error('Instale agent-browser e tente novamente!');
    process.exit(1);
  }

  logger.info('📱 Conectando ao WhatsApp Web...');
  whatsappBotConfig.initialize();

  await whatsappBotConfig.waitForReady();

  logger.info('🎯 Registrando handlers de mensagem...');

  whatsappBotConfig.client.on('message', async (message) => {
    try {
      await commandHandler.handleCommand(message);
    } catch (error) {
      logger.error(`Erro ao processar mensagem: ${error.message}`);
    }
  });

  logger.success('✅ Bot totalmente operacional!');

  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║     ✅ BOT ATIVO E AGUARDANDO MENSAGENS              ║
║                                                       ║
║     Tipo "ajuda" no WhatsApp para ver comandos       ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
}

process.on('unhandledRejection', (error) => {
  logger.error(`❌ Erro não capturado: ${error.message}`);
});

process.on('SIGINT', () => {
  logger.warn('⚠️  Encerrando bot...');
  if (whatsappBotConfig.client) {
    whatsappBotConfig.client.destroy();
  }
  process.exit(0);
});

initialize().catch(error => {
  logger.error(`Erro na inicialização: ${error.message}`);
  process.exit(1);
});
