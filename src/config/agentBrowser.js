const { spawnSync } = require('child_process');
const config = require('./environment');
const logger = require('../utils/logger');

class AgentBrowserConfig {
  constructor() {
    this.timeout = config.agentBrowser.timeout;
    this.sessions = {};
  }

  checkInstallation() {
    try {
      const result = spawnSync('npm', ['list', '-g', 'agent-browser'], {
        encoding: 'utf8',
        shell: true
      });

      if (result.stdout.includes('agent-browser')) {
        logger.info(`✅ agent-browser instalado`);
        return true;
      } else {
        logger.error('❌ agent-browser não encontrado!');
        return false;
      }
    } catch (error) {
      logger.error(`❌ Erro ao verificar: ${error.message}`);
      return false;
    }
  }

  executeCommand(commandArgs, sessionName = 'default') {
    try {
      let args = Array.isArray(commandArgs) ? commandArgs : [commandArgs];

      if (sessionName && sessionName !== 'default') {
        args.push(`--session=${sessionName}`);
      }

      logger.debug(`⚡ Executando: agent-browser ${args.join(' ')}`);

      const result = spawnSync('npx', ['agent-browser', ...args], {
        encoding: 'utf8',
        shell: true,
        timeout: this.timeout,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      if (result.error) {
        throw result.error;
      }

      if (result.status !== 0 && result.stderr) {
        logger.error(`❌ Erro: ${result.stderr}`);
        throw new Error(result.stderr);
      }

      return (result.stdout || '').trim();
    } catch (error) {
      logger.error(`❌ Erro ao executar: ${error.message}`);
      throw error;
    }
  }

  openSite(url, sessionName = 'default') {
    logger.info(`🌐 Abrindo: ${url}`);
    return this.executeCommand(['open', url], sessionName);
  }

  takeScreenshot(filename, sessionName = 'default') {
    logger.info(`📸 Capturando: ${filename}`);
    return this.executeCommand(['screenshot', filename], sessionName);
  }

  getSnapshot(sessionName = 'default') {
    logger.debug('📋 Obtendo snapshot...');
    return this.executeCommand(['snapshot', '-i'], sessionName);
  }

  typeText(inputRef, text, sessionName = 'default') {
    logger.info(`✍️  Digitando em ${inputRef}: ${text.substring(0, 50)}...`);
    return this.executeCommand(['type', inputRef, text], sessionName);
  }

  clickElement(ref, sessionName = 'default') {
    logger.info(`🖱️  Clicando em: ${ref}`);
    return this.executeCommand(['click', ref], sessionName);
  }

  pressKey(key, sessionName = 'default') {
    logger.info(`⌨️  Pressionando: ${key}`);
    return this.executeCommand(['press', key], sessionName);
  }

  closeBrowser(sessionName = 'default') {
    logger.info(`🔴 Fechando navegador: ${sessionName}`);
    return this.executeCommand(['close'], sessionName);
  }

  wait(ms, sessionName = 'default') {
    logger.debug(`⏳ Aguardando ${ms}ms...`);
    return this.executeCommand(['wait', ms], sessionName);
  }
}

module.exports = new AgentBrowserConfig();
