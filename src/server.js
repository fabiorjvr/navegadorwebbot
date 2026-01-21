const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

let qrCode = null;
let botStatus = 'Iniciando...';
let botLogs = [];

// API para receber QR Code e status
app.post('/api/qr', express.json(), (req, res) => {
  qrCode = req.body.qr;
  console.log('✅ QR Code recebido');
  res.json({ success: true });
});

app.post('/api/status', express.json(), (req, res) => {
  botStatus = req.body.status;
  botLogs.push({ time: new Date().toISOString(), message: botStatus });
  if (botLogs.length > 100) botLogs.shift(); // Manter apenas últimos 100 logs
  console.log(`[STATUS] ${botStatus}`);
  res.json({ success: true });
});

// Página principal
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bot WhatsApp - QR Code</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      color: #fff;
      padding: 20px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    h1 {
      text-align: center;
      margin-bottom: 30px;
      font-size: 2.5em;
      background: linear-gradient(90deg, #00d4ff, #7c3aed);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    .card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border-radius: 15px;
      padding: 30px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .qr-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 300px;
    }
    #qr-image {
      max-width: 300px;
      border-radius: 10px;
      box-shadow: 0 0 30px rgba(0, 212, 255, 0.3);
      background: white;
      padding: 15px;
      margin-bottom: 20px;
    }
    .status {
      font-size: 1.2em;
      padding: 15px 25px;
      border-radius: 50px;
      display: inline-block;
      margin-bottom: 20px;
    }
    .status.iniciando { background: #f59e0b; color: #000; }
    .status.conectado { background: #10b981; }
    .status.erro { background: #ef4444; }
    .logs {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      padding: 15px;
      height: 400px;
      overflow-y: auto;
      font-family: 'Courier New', monospace;
      font-size: 14px;
    }
    .log-item {
      padding: 5px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .log-time { color: #00d4ff; margin-right: 10px; }
    @media (max-width: 768px) {
      .grid { grid-template-columns: 1fr; }
      h1 { font-size: 1.8em; }
    }
    .instructions {
      background: rgba(0, 212, 255, 0.1);
      border: 1px solid rgba(0, 212, 255, 0.3);
      border-radius: 10px;
      padding: 15px;
      margin-top: 20px;
    }
    .instructions h3 { color: #00d4ff; margin-bottom: 10px; }
    .instructions p { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🤖 Bot WhatsApp + Agent-Browser</h1>

    <div class="grid">
      <div class="card">
        <div class="qr-container">
          <div id="status" class="status iniciando">⏳ ${botStatus}</div>
          <img id="qr-image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect fill='%23f0f0f0' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='16'%3EAguardando QR Code...%3C/text%3E%3C/svg%3E" alt="QR Code">
        </div>
        <div class="instructions">
          <h3>📱 Como conectar:</h3>
          <p>1. Abra o WhatsApp no celular</p>
          <p>2. Vá em: Menu → Aparelhos Conectados</p>
          <p>3. Escaneie o QR Code acima</p>
        </div>
      </div>

      <div class="card">
        <h3>📜 Logs em Tempo Real</h3>
        <div class="logs" id="logs">
          <div class="log-item"><span class="log-time">--:--:--</span>🔄 Aguardando logs...</div>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Polling para atualizar QR Code e logs
    setInterval(async () => {
      // Atualizar status e logs
      const statusRes = await fetch('/api/status');
      const statusData = await statusRes.json();
      
      if (statusData.status) {
        const statusEl = document.getElementById('status');
        statusEl.textContent = statusData.status;
        statusEl.className = 'status ' + (statusData.status.includes('conectado') ? 'conectado' : 'iniciando');
      }

      // Atualizar logs
      const logsEl = document.getElementById('logs');
      if (statusData.logs && statusData.logs.length > 0) {
        logsEl.innerHTML = statusData.logs.map(log =>
          \`<div class="log-item"><span class="log-time">\${new Date(log.time).toLocaleTimeString()}</span>\${log.message}</div>\`
        ).join('');
        logsEl.scrollTop = logsEl.scrollHeight;
      }
    }, 1000);
  </script>
</body>
</html>
  `);
});

// Endpoint para logs
app.get('/api/status', (req, res) => {
  res.json({ status: botStatus, logs: botLogs });
});

// Endpoint para QR Code atual
app.get('/api/qrcode', (req, res) => {
  if (qrCode) {
    const qrcode = require('qrcode');
    qrcode.toDataURL(qrCode, (err, url) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json({ qr: url });
      }
    });
  } else {
    res.json({ qr: null });
  }
});

// Servir imagem do QR Code
app.get('/qrcode.png', (req, res) => {
  const qrPath = path.join(__dirname, '../qrcode.png');
  if (fs.existsSync(qrPath)) {
    res.sendFile(qrPath);
  } else {
    // Retornar placeholder
    const svg = Buffer.from(`
      <svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
        <rect fill="#f0f0f0" width="300" height="300"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#999" font-size="16">Aguardando QR Code...</text>
      </svg>
    `);
    res.set('Content-Type', 'image/svg+xml');
    res.send(svg);
  }
});

app.listen(PORT, () => {
  console.log(`\n🌐 Servidor rodando em http://localhost:${PORT}\n`);
  console.log(`📱 Acesse para ver o QR Code do bot WhatsApp\n`);
});
