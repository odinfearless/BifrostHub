<script setup lang="ts">
// TODO: Criar lógica para mudar status da OS (Ordem de Serviço)
// TODO: Conectar com a tabela 'ordens_servico_lavagem' do Postgres
// TODO: Integrar com a tabela de veículos para buscar pela Placa
</script>

<template>
  <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
    <div class="bg-gray-200 p-4">Fila</div>
    <div class="bg-blue-200 p-4">Lavando</div>
    <div class="bg-green-200 p-4">Pronto / Entregue</div>
  </div>
</template>