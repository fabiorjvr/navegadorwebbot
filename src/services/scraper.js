const agentBrowser = require('../config/agentBrowser');
const logger = require('../utils/logger');
const helpers = require('../utils/helpers');

class ScraperService {
  constructor() {
    this.sessionName = 'scraper-session';
  }

  async searchMercadoLivre(produto) {
    logger.info(`🔍 Buscando em Mercado Livre: ${produto}`);

    try {
      const url = `https://listado.mercadolivre.com.br/${encodeURIComponent(produto)}`;

      agentBrowser.openSite(url, this.sessionName);
      agentBrowser.wait(3000, this.sessionName);

      const snapshot = agentBrowser.getSnapshot(this.sessionName);

      const screenshotPath = `screenshots/mercadolivre_${helpers.sanitizeFilename(produto)}.png`;
      agentBrowser.takeScreenshot(screenshotPath, this.sessionName);

      agentBrowser.closeBrowser(this.sessionName);

      return {
        site: 'Mercado Livre',
        produto,
        screenshot: screenshotPath,
        snapshot: snapshot.substring(0, 500)
      };
    } catch (error) {
      logger.error(`Erro em Mercado Livre: ${error.message}`);
      return null;
    }
  }

  async searchShopee(produto) {
    logger.info(`🔍 Buscando em Shopee: ${produto}`);

    try {
      const url = `https://shopee.com.br/search?keyword=${encodeURIComponent(produto)}`;

      agentBrowser.openSite(url, this.sessionName);
      agentBrowser.wait(3000, this.sessionName);

      const snapshot = agentBrowser.getSnapshot(this.sessionName);

      const screenshotPath = `screenshots/shopee_${helpers.sanitizeFilename(produto)}.png`;
      agentBrowser.takeScreenshot(screenshotPath, this.sessionName);

      agentBrowser.closeBrowser(this.sessionName);

      return {
        site: 'Shopee',
        produto,
        screenshot: screenshotPath,
        snapshot: snapshot.substring(0, 500)
      };
    } catch (error) {
      logger.error(`Erro em Shopee: ${error.message}`);
      return null;
    }
  }

  async searchAmazon(produto) {
    logger.info(`🔍 Buscando em Amazon: ${produto}`);

    try {
      const url = `https://www.amazon.com.br/s?k=${encodeURIComponent(produto)}`;

      agentBrowser.openSite(url, this.sessionName);
      agentBrowser.wait(3000, this.sessionName);

      const snapshot = agentBrowser.getSnapshot(this.sessionName);

      const screenshotPath = `screenshots/amazon_${helpers.sanitizeFilename(produto)}.png`;
      agentBrowser.takeScreenshot(screenshotPath, this.sessionName);

      agentBrowser.closeBrowser(this.sessionName);

      return {
        site: 'Amazon',
        produto,
        screenshot: screenshotPath,
        snapshot: snapshot.substring(0, 500)
      };
    } catch (error) {
      logger.error(`Erro em Amazon: ${error.message}`);
      return null;
    }
  }

  async searchMultipleSites(produto) {
    logger.info(`🕷️  Iniciando busca em múltiplos sites: ${produto}`);

    const resultados = await Promise.all([
      this.searchMercadoLivre(produto),
      this.searchShopee(produto),
      this.searchAmazon(produto)
    ]);

    return resultados.filter(r => r !== null);
  }
}

module.exports = new ScraperService();
