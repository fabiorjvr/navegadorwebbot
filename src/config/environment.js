require('dotenv').config();

module.exports = {
  agentBrowser: {
    timeout: parseInt(process.env.AGENT_BROWSER_TIMEOUT) || 10000,
    headless: process.env.AGENT_BROWSER_HEADLESS === 'true'
  },

  whatsapp: {
    sessionName: process.env.WHATSAPP_SESSION_NAME || 'bot-session',
    debug: process.env.WHATSAPP_DEBUG === 'true'
  },

  app: {
    environment: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'info'
  },

  paths: {
    screenshots: './screenshots',
    logs: './logs',
    src: './src'
  }
};
