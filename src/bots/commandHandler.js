const scraperService = require('../services/scraper');
const messagingService = require('../services/messagingService');
const priceExtractor = require('../services/priceExtractor');
const logger = require('../utils/logger');

class CommandHandler {
  async handleCommand(message) {
    const text = message.body.toLowerCase().trim();
    const sender = message.from;

    logger.info(`📨 Comando recebido de ${sender}: ${text}`);

    if (text.startsWith('preço ') || text.startsWith('preco ')) {
      const produto = text.replace(/^preco\s+|^preço\s+/i, '').trim();
      await this.handlePriceCommand(sender, produto, message);
    }

    else if (text === 'ajuda' || text === 'help') {
      await this.handleHelpCommand(sender);
    }

    else if (text === 'status') {
      await this.handleStatusCommand(sender, message);
    }

    else {
      await messagingService.sendSimpleMessage(
        sender,
        '❓ Comando não reconhecido.\nDigite "ajuda" para ver comandos disponíveis.'
      );
    }
  }

  async handlePriceCommand(chatId, produto, originalMessage) {
    try {
      if (!produto || produto.length < 2) {
        await messagingService.sendSimpleMessage(
          chatId,
          '❌ Digite o nome do produto.\nExemplo: preço GPU RTX 4070'
        );
        return;
      }

      await messagingService.sendWaiting(chatId, `Buscando "${produto}" em 3 lojas...`);

      logger.info(`🔍 Buscando: ${produto}`);
      const resultados = await scraperService.searchMultipleSites(produto);

      if (!resultados || resultados.length === 0) {
        await messagingService.sendError(chatId, 'Nenhum resultado encontrado');
        return;
      }

      const mensagem = `
✅ Encontrei "${produto}" em ${resultados.length} loja(s)!

${resultados.map((r, i) => `${i + 1}️⃣ ${r.site}`).join('\n')}

📸 Veja as fotos abaixo para detalhes!
      `;

      const screenshots = resultados.map(r => r.screenshot);
      await messagingService.sendMultipleScreenshots(chatId, mensagem, screenshots);

    } catch (error) {
      logger.error(`Erro no comando preço: ${error.message}`);
      await messagingService.sendError(chatId, error.message);
    }
  }

  async handleHelpCommand(chatId) {
    const ajuda = `
📋 *COMANDOS DISPONÍVEIS*

🔍 *preço <produto>*
   Busca preço em múltiplas lojas
   Exemplo: preço GPU RTX 4070

ℹ️ *status*
   Verifica se o bot está funcionando

❓ *ajuda*
   Mostra esta mensagem

---
💡 Exemplo de uso:
   Você: "preço SSD 1TB"
   Bot: Busca em ML, Shopee, Amazon
   Bot: Envia 3 screenshots com preços
    `;

    await messagingService.sendSimpleMessage(chatId, ajuda);
  }

  async handleStatusCommand(chatId, message) {
    const status = `
✅ *BOT ATIVO*

🤖 Status: FUNCIONANDO
⏰ Horário: ${new Date().toLocaleString('pt-BR')}
📱 Chat: ${message.from}

Pronto para receber comandos!
    `;

    await messagingService.sendSimpleMessage(chatId, status);
  }
}

module.exports = new CommandHandler();
