// bot.js
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// --- Pequeno servidor web para keep-alive (UptimeRobot)
const app = express();
app.get('/', (req, res) => {
  res.send('OK - bot-whatsapp running');
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

// --- Cria o cliente com autenticação local (LocalAuth grava sessão na pasta do Repl)
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

// QR code (ASCII) no console
client.on('qr', qr => {
  console.log('--- QR Code gerado (escaneie com o WhatsApp) ---');
  qrcode.generate(qr, { small: true });
  console.log('--- Fim do QR Code ---');
});

// Log quando pronto
client.on('ready', () => {
  console.log('Bot está pronto! (client ready)');
});

// Tratar autenticação falhada
client.on('auth_failure', msg => {
  console.error('Falha na autenticação:', msg);
});

// Tratar desconexões (só log)
client.on('disconnected', reason => {
  console.log('Client desconectado:', reason);
});

// Mensagens automáticas
const respostas = {
  'oi': 'Olá! Seja bem-vindo ao nosso atendimento 😊',
  'suco': 'Temos sucos de: Laranja, Abacaxi e Morango 🥤',
  'pizza': 'Temos pizzas de: Calabresa, Frango com Catupiry e Margherita 🍕',
  'refrigerante': 'Temos refrigerantes: Coca-Cola, Guaraná e Fanta 🥤',
  'hamburguer': 'Temos hambúrgueres de: X-Burger, X-Salada e X-Tudo 🍔',
  'salgado': 'Temos salgados de: Coxinha, Pastel e Esfiha 🥟',
  'tchau': 'Obrigado pelo contato! Até logo 👋'
};

client.on('message', async message => {
  try {
    const msg = (message.body || '').toLowerCase();
    console.log(`Mensagem recebida de ${message.from}: ${msg}`);

    for (let chave in respostas) {
      if (msg.includes(chave)) {
        await message.reply(respostas[chave]);
        console.log(`Bot respondeu: ${respostas[chave]}`);
        return;
      }
    }

    // Mensagem padrão
    await message.reply('Desculpe, não entendi. Pode escolher uma opção do menu: suco, pizza, refrigerante, hamburguer, salgado.');
  } catch (err) {
    console.error('Erro ao processar mensagem:', err);
  }
});

// Inicializa o client
client.initialize();

// Tratamento global de erros (ajuda a não crashar o processo)
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});
process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});
