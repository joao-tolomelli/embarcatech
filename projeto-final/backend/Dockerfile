# Usa uma imagem Node.js leve
FROM node:18-alpine

# Instala o OpenSSL, que é obrigatório para o Prisma funcionar no Alpine Linux
RUN apk update && apk add --no-cache openssl

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código (incluindo a pasta prisma)
COPY . .

# Gera o cliente do Prisma (necessário antes de rodar)
RUN npx prisma generate

# Expõe a porta que o servidor usa
EXPOSE 3001

# Comando para rodar as migrações e iniciar o servidor
# Usamos 'sh -c' para garantir que o migrate rode antes do start
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
