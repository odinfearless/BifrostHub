#!/bin/bash

# --- CONFIGURAÇÕES ---
USER="ubuntu"
HOST="201.54.3.47"
DIR="~/BifrostHub"

echo "🚀 Conectando em $HOST para iniciar o deploy..."

# A flag -T evita o aviso "Pseudo-terminal will not be allocated"
ssh -T $USER@$HOST << EOF
    # Tudo aqui dentro roda na VM
    set -e # Para o script se qualquer comando falhar

    echo "📂 Entrando na pasta..."
    cd $DIR

    echo "ZG Sincronizando código (Modo FORÇADO)..."
    # Baixa as informações do remoto sem aplicar
    git fetch origin
    # FORÇA a pasta atual a ficar idêntica ao GitHub (descarta alterações locais)
    git reset --hard origin/main

    echo "Rx Reiniciando Docker..."
    docker compose down
    docker compose up --build -d

    echo "hw Limpando lixo..."
    docker image prune -f

    echo "✅ Deploy finalizado!"
EOF