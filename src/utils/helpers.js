const fs = require('fs');
const path = require('path');
const logger = require('./logger');

class Helpers {
  ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      logger.info(`📁 Pasta criada: ${dirPath}`);
    }
  }

  extractPrice(text) {
    const priceRegex = /R\$\s*[\d.,]+/gi;
    const matches = text.match(priceRegex);
    if (matches && matches.length > 0) {
      return matches[0];
    }
    return null;
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  sanitizeFilename(filename) {
    return filename
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .substring(0, 50);
  }

  readFile(filepath) {
    try {
      return fs.readFileSync(filepath, 'utf8');
    } catch (error) {
      logger.error(`Erro ao ler arquivo: ${error.message}`);
      return null;
    }
  }

  writeFile(filepath, content) {
    try {
      fs.writeFileSync(filepath, content, 'utf8');
      logger.info(`📄 Arquivo salvo: ${filepath}`);
    } catch (error) {
      logger.error(`Erro ao escrever arquivo: ${error.message}`);
    }
  }
}

module.exports = new Helpers();
