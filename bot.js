// bot.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Cria o cliente com autenticação local (salva sessão)
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',                // essencial para root
            '--disable-setuid-sandbox',    // essencial para root
            '--disable-dev-shm-usage',     // evita falta de memória
            '--single-process',            // roda em um único processo
            '--disable-gpu',               // desativa GPU
            '--disable-extensions',        // desativa extensões do Chrome
            '--disable-background-networking',
            '--disable-sync',
            '--disable-translate',
            '--hide-scrollbars',
            '--mute-audio',
            '--no-first-run',
            '--no-zygote',
            '--no-default-browser-check'
        ]
    }
});


// Gera QR Code no terminal
client.on('qr', qr => {
    console.log('Escaneie este QR Code com seu WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Loga quando a sessão estiver pronta
client.on('ready', () => {
    console.log('Bot está pronto! Você pode enviar mensagens para testar.');
});

// Número do seu WhatsApp (não precisa mudar aqui)
const MEU_WHATSAPP = '552992981067373'; // Formato internacional: 55 + DDD + número

// Menu e respostas automáticas
const respostas = {
    'oi': 'Olá! Seja bem-vindo ao nosso atendimento 😊',
    'suco': 'Temos sucos de: Laranja, Abacaxi e Morango 🥤',
    'pizza': 'Temos pizzas de: Calabresa, Frango com Catupiry e Margherita 🍕',
    'refrigerante': 'Temos refrigerantes: Coca-Cola, Guaraná e Fanta 🥤',
    'hamburguer': 'Temos hambúrgueres de: X-Burger, X-Salada e X-Tudo 🍔',
    'salgado': 'Temos salgados de: Coxinha, Pastel e Esfiha 🥟',
    'tchau': 'Obrigado pelo contato! Até logo 👋'
};

// Responder mensagens automaticamente
client.on('message', message => {
    const msg = message.body.toLowerCase();
    console.log(`Mensagem recebida de ${message.from}: ${msg}`);

    for (let palavra in respostas) {
        if (msg.includes(palavra)) {
            message.reply(respostas[palavra]);
            console.log(`Bot respondeu: ${respostas[palavra]}`);
            return;
        }
    }

    // Mensagem padrão se não encontrar correspondência
    message.reply('Desculpe, não entendi. Pode escolher uma opção do menu: suco, pizza, refrigerante, hamburguer, salgado.');
});

// Inicializa o cliente
client.initialize();
