#!/bin/bash

# --- CONFIGURAÇÕES ---
USER="ubuntu"
HOST="201.54.3.47"
DIR="~/BifrostHub"    # Raiz do Repositório (onde roda o Git)
APP_DIR="app"         # Subpasta onde está o docker-compose.yml

echo "🚀 Conectando em $HOST para iniciar o deploy..."

ssh -T $USER@$HOST << EOF
    set -e

    echo "📂 1. Entrando na raiz do projeto..."
    cd $DIR

    echo "ZG 2. Sincronizando código (Git)..."
    git fetch origin
    git reset --hard origin/main

    echo "📂 3. Entrando na pasta da aplicação ($APP_DIR)..."
    cd $APP_DIR  # <--- AQUI ESTAVA O ERRO (Faltava entrar nesta pasta)

    echo "Rx 4. Reiniciando Docker..."
    docker compose down
    docker compose up --build -d

    echo "hw 5. Limpando lixo..."
    docker image prune -f

    echo "✅ Deploy finalizado!"
EOF