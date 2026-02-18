# ---------- BUILD FRONTEND ----------
FROM node:22-alpine AS frontend-build

WORKDIR /app
COPY ../frontend ./
RUN npm ci
RUN npm run build

# ---------- NGINX ----------
FROM nginx:stable-alpine

# Remove a config padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
