<script setup lang="ts">
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'

// --- ESTADO ---
const calendarOptions = ref({
  plugins: [timeGridPlugin, interactionPlugin],
  initialView: 'timeGridWeek',
  locale: ptBrLocale,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'timeGridWeek,timeGridDay'
  },
  
  // Configurações de Horário (Sua Regra de Negócio)
  slotDuration: '00:30:00', // Cada slot tem 30 min
  slotMinTime: '08:00:00',  // Começa às 08h
  slotMaxTime: '18:00:00',  // Termina às 18h
  allDaySlot: false,
  hiddenDays: [1],          // 0=Dom, 1=Seg... (Esconde Segunda-feira)

  // Interações
  selectable: true,
  editable: true,
  
  // TODO: Implementar lógica para abrir modal de novo agendamento ao selecionar
  select: (info: any) => {
    alert('Abrir Modal para: ' + info.startStr)
    console.log('Informações do slot:', info)
  },

  // TODO: Implementar clique no agendamento existente para ver detalhes/pagamento
  eventClick: (info: any) => {
    alert('Serviço: ' + info.event.title + '\nStatus: ' + info.event.extendedProps.status)
  },

  // TODO: Criar a conexão com o backend Node/Postgres
  // GET /api/agendamentos
  events: [
    {
      id: '1',
      title: 'João - CT1 (Corte)',
      start: '2026-02-17T10:00:00',
      end: '2026-02-17T10:30:00',
      extendedProps: { status: 'PAGO', servico: 'CT1' },
      backgroundColor: '#10B981' // Verde para pago
    },
    {
      id: '2',
      title: 'Maria - CT2 (Corte+Barba)',
      start: '2026-02-17T11:00:00',
      end: '2026-02-17T12:00:00', // 2 slots de 30min
      extendedProps: { status: 'PENDENTE', servico: 'CT2' },
      backgroundColor: '#F59E0B' // Amarelo para pendente
    }
  ]
})
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 class="text-title-md2 font-bold text-black dark:text-white">
        Agenda Bifrost Salão
      </h2>
      
      <div class="flex gap-2">
        <span class="flex items-center gap-2 text-sm font-medium">
          <span class="block h-3 w-3 rounded-full bg-[#10B981]"></span> Pago
        </span>
        <span class="flex items-center gap-2 text-sm font-medium">
          <span class="block h-3 w-3 rounded-full bg-[#F59E0B]"></span> Pendente
        </span>
      </div>
    </div>

    <div class="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark md:p-6">
      <div class="calendar-container">
        <FullCalendar :options="calendarOptions" />
      </div>
    </div>
  </div>
</template>

<style>
/* Estilização para o FullCalendar se adaptar ao tema dark do TailAdmin */
.fc {
  --fc-border-color: #e2e8f0;
  --fc-today-bg-color: rgba(60, 80, 224, 0.05);
}

.dark .fc {
  --fc-border-color: #313d4a;
  --fc-list-event-hover-bg-color: #24303f;
  color: #aeb7c0;
}

.fc .fc-toolbar-title {
  @apply text-xl font-bold text-black dark:text-white;
}

.fc .fc-button-primary {
  @apply bg-primary border-primary hover:bg-opacity-90;
}
</style>