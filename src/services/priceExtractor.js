const logger = require('../utils/logger');

class PriceExtractor {
  extractPriceFromSnapshot(snapshot) {
    logger.debug('💰 Extratindo preço do snapshot...');

    const pricePatterns = [
      /R\$\s*(\d+[.,]\d{2})/g,
      /R\$\s*(\d+)/g,
      /(\d+[.,]\d{2})\s*reais/gi
    ];

    for (const pattern of pricePatterns) {
      const matches = snapshot.match(pattern);
      if (matches && matches.length > 0) {
        return matches[0];
      }
    }

    return null;
  }

  formatSearchResult(resultado) {
    return {
      site: resultado.site,
      produto: resultado.produto,
      screenshot: resultado.screenshot,
      timestamp: new Date().toLocaleString('pt-BR')
    };
  }

  comparePrices(resultados) {
    logger.debug('📊 Comparando preços...');

    if (!resultados || resultados.length === 0) {
      return null;
    }

    const mensagem = resultados
      .map((r, i) => `${i + 1}️⃣ ${r.site}: R$ (Veja screenshot)`)
      .join('\n');

    return mensagem;
  }
}

module.exports = new PriceExtractor();
