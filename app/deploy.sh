#!/bin/bash

APP_NAME="vue-app"
IMAGE_NAME="vue-app-image"
LOG_FILE="deploy.log"

echo "=====================================" | tee -a $LOG_FILE
echo "Iniciando deploy: $(date)" | tee -a $LOG_FILE
echo "=====================================" | tee -a $LOG_FILE

# Puxar alterações (se for git)
if [ -d ".git" ]; then
    echo "Atualizando repositório..." | tee -a $LOG_FILE
    git pull | tee -a $LOG_FILE
fi

echo "Parando container antigo..." | tee -a $LOG_FILE
docker compose down | tee -a $LOG_FILE

echo "Buildando nova imagem..." | tee -a $LOG_FILE
docker compose build --no-cache | tee -a $LOG_FILE

echo "Subindo nova versão..." | tee -a $LOG_FILE
docker compose up -d | tee -a $LOG_FILE

echo "Limpando imagens antigas..." | tee -a $LOG_FILE
docker image prune -f | tee -a $LOG_FILE

echo "Deploy finalizado com sucesso!" | tee -a $LOG_FILE
echo "Aplicação rodando em: PROD" | tee -a $LOG_FILE
