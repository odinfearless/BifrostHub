# Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
# Usamos 'npm ci' que é mais rápido e seguro para CI/CD
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Remove a config padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia os arquivos do build Vue
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia a nossa config personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]