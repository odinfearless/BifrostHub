FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

RUN npx prisma generate

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "index.js"]
