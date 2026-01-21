# RELATÓRIO - TASK 12: Criar src/bots/commandHandler.js

## 📋 Descrição
Criar handler para processar comandos recebidos via WhatsApp.

## ✅ Ações Realizadas
1. Criado arquivo commandHandler.js em src/bots
2. Implementada classe CommandHandler
3. Criado método principal handleCommand() para roteamento
4. Implementados handlers para cada comando específico
5. Adicionado tratamento de erros e validações

## 📄 Métodos Implementados

### Roteamento
| Método | Descrição |
|--------|-----------|
| **handleCommand(message)** | Roteia comandos para handlers específicos |

### Comandos Suportados
| Método | Comando | Descrição |
|--------|---------|-----------|
| **handlePriceCommand()** | `preço <produto>` | Busca em 3 lojas |
| **handleHelpCommand()** | `ajuda`, `help` | Mostra ajuda |
| **handleStatusCommand()** | `status` | Verifica status |

## 🎯 Lógica de Roteamento

```javascript
const text = message.body.toLowerCase().trim();

if (text.startsWith('preço ') || text.startsWith('preco ')) {
  // Handler de preço
}
else if (text === 'ajuda' || text === 'help') {
  // Handler de ajuda
}
else if (text === 'status') {
  // Handler de status
}
else {
  // Comando não reconhecido
}
```

## 📋 Comandos Implementados

### preço <produto>
```javascript
// Exemplo: "preço GPU RTX 4070"

1. Valida: produto tem pelo menos 2 caracteres
2. Envia: "⏳ Buscando 'GPU RTX 4070' em 3 lojas..."
3. Busca: scraperService.searchMultipleSites()
4. Formata: mensagem com lista de lojas
5. Envia: mensagem + screenshots
```

### ajuda / help
```javascript
📋 *COMANDOS DISPONÍVEIS*

🔍 *preço <produto>*
   Busca preço em múltiplas lojas
   Exemplo: preço GPU RTX 4070

ℹ️ *status*
   Verifica se o bot está funcionando

❓ *ajuda*
   Mostra esta mensagem
```

### status
```javascript
✅ *BOT ATIVO*

🤖 Status: FUNCIONANDO
⏰ Horário: 21/01/2026, 09:16:00
📱 Chat: 5511999999999@c.us
```

## 📋 Dependências
- `../services/scraper`: Busca em múltiplos sites
- `../services/messagingService`: Envio de mensagens
- `../services/priceExtractor`: Extração de preços
- `../utils/logger`: Sistema de logging

## 💡 Padrões Utilizados
- **Singleton Pattern**: Módulo exporta instância única
- **Command Pattern**: Roteamento baseado em comandos
- **Error Handling**: Try-catch com feedback ao usuário
- **Input Validation**: Validação de entrada antes de processar

## 🎨 Formatação de Mensagens

### Markdown para WhatsApp
```javascript
📋 *COMANDOS DISPONÍVEIS*  // * para negrito
🔍 *preço <produto>*        // Emoji para ícones
```

### Listas Numeradas
```javascript
${resultados.map((r, i) => `${i + 1}️⃣ ${r.site}`).join('\n')}
```

## 📁 Estrutura
```
src/
├── config/
├── utils/
├── services/
└── bots/
    └── commandHandler.js
```

## 📅 Status
✅ **CONCLUÍDO** - 21/01/2026 09:16

## 🔍 Próximos Passos
- Criar ponto de entrada (index.js)
- Criar documentação (README.md)

---
Gerado automaticamente por Sisyphus
