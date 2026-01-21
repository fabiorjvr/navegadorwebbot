const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcodeTerminal = require('qrcode-terminal');
const qrcode = require('qrcode');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const config = require('./environment');
const logger = require('../utils/logger');

class WhatsAppBotConfig {
  constructor() {
    this.client = null;
    this.isReady = false;
    this.currentQR = null;
    this.qrEventEmitter = null;
  }

  initialize() {
    logger.info('🔄 Inicializando WhatsApp Bot...');

    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: config.whatsapp.sessionName }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });

    this.client.on('qr', async (qr) => {
      this.currentQR = qr;
      logger.info('📱 QR CODE GERADO - Acesse http://localhost:3000 para escanear!');

      // Enviar QR Code para servidor web
      try {
        await axios.post('http://localhost:3000/api/qr', { qr });
      } catch (e) {
        // Ignora erro se servidor não estiver rodando
      }

      // Salvar QR Code como imagem PNG
      const qrPath = path.join(__dirname, '../../qrcode.png');
      await qrcode.toFile(qrPath, qr);
      logger.success(`📸 QR Code salvo: ${path.resolve(qrPath)}`);
      logger.info('🔗 http://localhost:3000 - Escaneie o QR Code no navegador!');
    });

    this.client.on('ready', async () => {
      this.isReady = true;
      logger.success('✅ WhatsApp Bot conectado!');

      // Enviar status para servidor web
      try {
        await axios.post('http://localhost:3000/api/status', { status: '✅ WhatsApp Bot conectado!' });
      } catch (e) {
        // Ignora erro se servidor não estiver rodando
      }
    });

    this.client.on('disconnected', async () => {
      this.isReady = false;
      logger.warn('⚠️  WhatsApp Bot desconectado');

      try {
        await axios.post('http://localhost:3000/api/status', { status: '⚠️  WhatsApp Bot desconectado' });
      } catch (e) {
        // Ignora erro se servidor não estiver rodando
      }
    });

    this.client.on('error', async (error) => {
      logger.error(`❌ Erro WhatsApp: ${error.message}`);

      try {
        await axios.post('http://localhost:3000/api/status', { status: `❌ Erro: ${error.message}` });
      } catch (e) {
        // Ignora erro se servidor não estiver rodando
      }
    });

    this.client.initialize();
    return this.client;
  }

  async waitForReady() {
    return new Promise((resolve) => {
      if (this.isReady) {
        resolve();
        return;
      }

      const interval = setInterval(() => {
        if (this.isReady) {
          clearInterval(interval);
          resolve();
        }
      }, 1000);
    });
  }

  async sendMessage(chatId, text) {
    try {
      await this.waitForReady();
      logger.info(`💬 Enviando mensagem para: ${chatId}`);
      await this.client.sendMessage(chatId, text);
      logger.success('✅ Mensagem enviada');
    } catch (error) {
      logger.error(`❌ Erro ao enviar: ${error.message}`);
    }
  }

  async sendFile(chatId, filepath, caption = '') {
    try {
      await this.waitForReady();
      logger.info(`📎 Enviando arquivo: ${filepath}`);
      const media = MessageMedia.fromFilePath(filepath);
      await this.client.sendMessage(chatId, media, { caption });
      logger.success('✅ Arquivo enviado');
    } catch (error) {
      logger.error(`❌ Erro ao enviar arquivo: ${error.message}`);
    }
  }

  async replyMessage(message, text) {
    try {
      logger.info('↩️  Respondendo mensagem...');
      await message.reply(text);
      logger.success('✅ Resposta enviada');
    } catch (error) {
      logger.error(`❌ Erro ao responder: ${error.message}`);
    }
  }
}

module.exports = new WhatsAppBotConfig();
