const config = require('../config/environment');

class Logger {
  log(level, message, data = '') {
    const timestamp = new Date().toLocaleTimeString('pt-BR');
    const prefix = `[${timestamp}] [${level}]`;

    if (data) {
      console.log(`${prefix} ${message}`, data);
    } else {
      console.log(`${prefix} ${message}`);
    }
  }

  info(message, data) {
    this.log('INFO', message, data);
  }

  success(message, data) {
    console.log(`\x1b[32m[✓ SUCCESS]\x1b[0m ${message}`, data || '');
  }

  warn(message, data) {
    console.log(`\x1b[33m[⚠ WARN]\x1b[0m ${message}`, data || '');
  }

  error(message, data) {
    console.log(`\x1b[31m[✗ ERROR]\x1b[0m ${message}`, data || '');
  }

  debug(message, data) {
    if (config.app.logLevel === 'debug') {
      console.log(`\x1b[36m[DEBUG]\x1b[0m ${message}`, data || '');
    }
  }
}

module.exports = new Logger();
