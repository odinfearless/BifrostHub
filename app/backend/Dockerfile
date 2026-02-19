# ---------- BUILD STAGE ----------
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

# ---------- PRODUCTION STAGE ----------
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=build /app ./

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "src/server.js", "0.0.0.0" , "3000"]
