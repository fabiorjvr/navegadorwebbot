# 🤖 Bot WhatsApp + Agent-Browser

Bot automático que busca preços em múltiplas lojas via WhatsApp Web usando Agent-Browser para scraping.

## 📋 Requisitos

- Node.js 16+
- npm
- agent-browser instalado globalmente

## 🚀 Instalação

### 1. Instalar Agent-Browser Globalmente

```bash
npm install -g agent-browser
```

### 2. Instalar Dependências do Projeto

```bash
npm install
```

### 3. Configurar .env

O arquivo `.env` já vem pré-configurado, mas você pode editar se necessário:

```env
AGENT_BROWSER_TIMEOUT=10000
AGENT_BROWSER_HEADLESS=false
WHATSAPP_SESSION_NAME=bot-session
WHATSAPP_DEBUG=true
NODE_ENV=development
LOG_LEVEL=info
```

## ▶️ Como Usar

### 1. Iniciar o Bot

```bash
npm start
```

### 2. Escanear QR Code

Quando o QR code aparecer no terminal, escaneie com seu telefone.

### 3. Enviar Comandos

No WhatsApp, digite:

#### Buscar Preços
```
preço GPU RTX 4070
```
O bot buscará em Mercado Livre, Shopee e Amazon e enviará screenshots com os resultados.

#### Ajuda
```
ajuda
```
Mostra todos os comandos disponíveis.

#### Status
```
status
```
Verifica se o bot está funcionando.

## 📁 Estrutura do Projeto

```
navegador-web/
├── src/
│   ├── config/
│   │   ├── environment.js      # Configurações centralizadas
│   │   ├── agentBrowser.js     # Integração Agent-Browser
│   │   └── whatsappBot.js      # Integração WhatsApp Web
│   ├── utils/
│   │   ├── logger.js           # Sistema de logs
│   │   └── helpers.js          # Funções utilitárias
│   ├── services/
│   │   ├── priceExtractor.js   # Extração de preços
│   │   ├── messagingService.js # Serviço de mensagens
│   │   └── scraper.js          # Scraping de múltiplos sites
│   ├── bots/
│   │   └── commandHandler.js   # Handler de comandos
│   └── index.js                # Ponto de entrada
├── screenshots/                # Screenshots capturados
├── logs/                       # Logs da aplicação
├── RELATORIOS/                 # Relatórios de desenvolvimento
├── .env                        # Variáveis de ambiente
├── .gitignore                  # Arquivos ignorados no git
├── package.json                # Dependências
└── README.md                   # Este arquivo
```

## ⚙️ Configuração

### Agent-Browser

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `AGENT_BROWSER_TIMEOUT` | 10000 | Timeout em milissegundos |
| `AGENT_BROWSER_HEADLESS` | false | Modo headless (sem UI) |

### WhatsApp

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `WHATSAPP_SESSION_NAME` | bot-session | Nome da sessão |
| `WHATSAPP_DEBUG` | true | Logs detalhados |

### Aplicação

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `NODE_ENV` | development | Ambiente (development/production) |
| `LOG_LEVEL` | info | Nível de log (info/debug) |

## 🛠️ Desenvolvimento

### Estrutura pronta para adicionar:

- ✅ Mais sites de busca
- ✅ Extração automática de preços
- ✅ Histórico de preços
- ✅ Alertas de preço
- ✅ Integração com banco de dados

## 📝 Logs

Todos os logs são exibidos no console com timestamps.

Formato: `[HH:MM:SS] [LEVEL] mensagem`

Níveis:
- `INFO`: Informações gerais
- `SUCCESS`: Operações bem-sucedidas (verde)
- `WARN`: Avisos (amarelo)
- `ERROR`: Erros (vermelho)
- `DEBUG`: Detalhes de debug (ciano)

## ⚠️ Limitações Conhecidas

- Requer WhatsApp Web ativo
- Agent-browser precisa de Chromium
- Velocidade depende da conexão internet
- Rate limiting do WhatsApp pode bloquear envios em massa

## 🔒 Segurança

- ✅ Não armazena senhas
- ✅ Sessão do WhatsApp armazenada localmente
- ✅ Sem dados enviados para servidores externos
- ✅ Arquivos .env excluídos do git

## 🎯 Sites Suportados

| Site | Status |
|------|--------|
| Mercado Livre | ✅ Ativo |
| Shopee | ✅ Ativo |
| Amazon Brasil | ✅ Ativo |

## 📦 Dependências

| Pacote | Versão | Uso |
|--------|--------|-----|
| express | ^4.18.2 | Servidor HTTP |
| dotenv | ^16.3.1 | Variáveis de ambiente |
| axios | ^1.6.0 | Requisições HTTP |
| whatsapp-web.js | ^1.27.0 | Integração WhatsApp |
| qrcode-terminal | ^0.12.0 | QR Code no terminal |

## 🚨 Solução de Problemas

### agent-browser não está instalado

```bash
npm install -g agent-browser
```

### QR Code não aparece

1. Verifique se o WhatsApp Web não está aberto em outro local
2. Tente reiniciar o bot
3. Verifique logs de erro

### Screenshots não aparecem

1. Verifique se a pasta `screenshots/` existe
2. Verifique permissões de escrita
3. Aumente `AGENT_BROWSER_TIMEOUT` no .env

## 📄 Licença

ISC

## 👨‍💻 Autor

Desenvolvido com ❤️ para Fábio | 2026

---

**Relatórios de desenvolvimento disponíveis em [`RELATORIOS/`](./RELATORIOS/)**
