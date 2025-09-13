// bot.js
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

// --- Configura o servidor Express
const app = express();
const PORT = process.env.PORT || 3000;

// variável para guardar o QRCode em base64
let qrCodeImage = '';

// --- Rota para keep-alive (UptimeRobot)
app.get('/', (req, res) => {
  res.send('OK - bot-whatsapp running');
});

// --- Rota para mostrar QRCode no navegador
app.get('/qrcode', (req, res) => {
  if (qrCodeImage) {
    res.send(`
      <h2>Escaneie o QRCode com o WhatsApp</h2>
      <img src="${qrCodeImage}" />
    `);
  } else {
    res.send('<h2>QR Code ainda não gerado, aguarde...</h2>');
  }
});

// --- Inicia o servidor
app.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

// --- Cria o cliente WhatsApp com LocalAuth
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

// --- Evento QR Code
client.on('qr', qr => {
  console.log('QR Code gerado, acesse /qrcode para escanear');
  qrcode.toDataURL(qr, (err, url) => {
    if (err) {
      console.error('Erro ao gerar QRCode:', err);
      return;
    }
    qrCodeImage = url;
  });
});

// --- Evento quando o cliente está pronto
client.on('ready', () => {
  console.log('Bot está pronto! (client ready)');
});

// --- Evento de falha na autenticação
client.on('auth_failure', msg => {
  console.error('Falha na autenticação:', msg);
});

// --- Evento quando desconecta
client.on('disconnected', reason => {
  console.log('Cliente desconectado:', reason);
});

// --- Inicializa o cliente WhatsApp
client.initialize();
