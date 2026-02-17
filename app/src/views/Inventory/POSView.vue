<script setup lang="ts">
import { ref } from 'vue'

const barcodeInput = ref('')

const handleBarcodeScan = () => {
  console.log('Código lido:', barcodeInput.value)
  // TODO: Implementar busca no backend: GET /api/produtos/:codigo_barras
  // TODO: Se encontrar, adicionar ao "carrinho" da venda atual
  // TODO: Diminuir qtd_estoque no banco após confirmar a venda
  barcodeInput.value = '' // Limpa para a próxima leitura
}
</script>

<template>
  <div class="p-4">
    <input 
      v-model="barcodeInput"
      @keyup.enter="handleBarcodeScan"
      placeholder="Aguardando leitura de código de barras..."
      class="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary"
      autofocus
    />
    </div>
</template>