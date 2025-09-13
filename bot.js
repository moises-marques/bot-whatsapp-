js
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const app = express();

let qrCodeImage = '';

// --- Pequeno servidor web para keep-alive (UptimeRobot)
app.get('/', (req, res) => {
  res.send('OK - bot-whatsapp running');
});

// rota para mostrar QRCode no navegador
app.get('/qrcode', (req, res) => {
  if (qrCodeImage) {
    res.send(`<h2>Escaneie o QRCode com o WhatsApp</h2><img src="${qrCodeImage}" />`);
  } else {
    res.send('<h2>QR Code ainda não gerado, aguarde...</h2>');
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

// --- Cria o cliente com autenticação local (LocalAuth)
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-background-networking',
      '--disable-sync',
      '--disable-translate',
      '--hide-scrollbars',
      '--mute-audio'
    ]
  }
});

// converte QR para imagem base64 e guarda
client.on('qr', qr => {
  console.log('QR Code gerado, acesse /qrcode para escanear');
  qrcode.toDataURL(qr, (err, url) => {
    if (err) return console.error(err);
    qrCodeImage = url;
  });
});

// Log quando pronto
client.on('ready', () => {
  console.log('Bot está pronto! (client ready)');
});

// Outras events e handlers (auth_failure, disconnected…)

client.initialize();
