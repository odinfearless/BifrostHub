# ---------- BUILD STAGE ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm prisma db pull
RUN npx prisma generate

# ---------- PRODUCTION STAGE ----------
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app ./

ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.js"]
