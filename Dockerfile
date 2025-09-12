# Usa Node 18 (versão LTS mais recente) como base
FROM node:18-slim

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json primeiro (para cache de dependências)
COPY package*.json ./

# Instala dependências do Node
RUN npm install --omit=dev

# Copia todo o resto do projeto
COPY . .

# Instala bibliotecas do sistema necessárias para o Puppeteer
RUN apt-get update && apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    lsb-release \
    xdg-utils \
    wget \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Expõe a porta (se necessário, mas para bot WhatsApp não é obrigatório)
EXPOSE 3000

# Comando para rodar o bot
CMD ["node", "bot.js"]