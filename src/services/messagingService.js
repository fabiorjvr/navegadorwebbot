const whatsappBot = require('../config/whatsappBot');
const logger = require('../utils/logger');

class MessagingService {
  async sendSimpleMessage(chatId, text) {
    logger.info(`📤 Enviando para ${chatId}: ${text.substring(0, 50)}...`);
    await whatsappBot.sendMessage(chatId, text);
  }

  async sendWithScreenshot(chatId, text, screenshotPath) {
    logger.info(`📤 Enviando com screenshot...`);
    await whatsappBot.sendMessage(chatId, text);
    await whatsappBot.sendFile(chatId, screenshotPath, '📸 Resultado da busca');
  }

  async sendMultipleScreenshots(chatId, texto, screenshots) {
    logger.info(`📤 Enviando ${screenshots.length} screenshots...`);

    await whatsappBot.sendMessage(chatId, texto);

    for (const screenshot of screenshots) {
      await whatsappBot.sendFile(chatId, screenshot, '📸');

      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async sendError(chatId, error) {
    const errorMessage = `❌ Erro ao processar: ${error}\n\nTente novamente mais tarde.`;
    await whatsappBot.sendMessage(chatId, errorMessage);
  }

  async sendWaiting(chatId, mensagem = 'Processando sua solicitação...') {
    const texto = `⏳ ${mensagem}`;
    await whatsappBot.sendMessage(chatId, texto);
  }
}

module.exports = new MessagingService();
