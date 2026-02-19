<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import flatpickr from 'flatpickr'

// Componentes e Ícones
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import Modal from '@/components/profile/Modal.vue'
import { TableIcon } from "../../icons"
import api from '@/services/api'
import { Portuguese } from 'flatpickr/dist/l10n/pt.js'
import Alert from '@/components/ui/Alert.vue'

// --- ESTADOS ---
const calendarRef = ref<any>(null)
const calendarEvents = ref<any[]>([])
const showModal = ref(false)
const clientes = ref<any[]>([])
const servicos = ref<any[]>([])
const datePickerBtn = ref<HTMLElement | null>(null)

const form = reactive({
  cliente_id: '',
  servico_id: '',
  data_inicio: '',
  data_fim: ''
})

onMounted(() => {
  fetchData()
  if (datePickerBtn.value) {
    flatpickr(datePickerBtn.value, {
      locale: Portuguese,
      dateFormat: 'Y-m-d',
      disableMobile: true,
      onChange: (selectedDates, dateStr) => {
        if (calendarRef.value) {
          const calendarApi = calendarRef.value.getApi()
          calendarApi.gotoDate(dateStr)
        }
      }
    })
  }
})

const fetchData = async () => {
  try {   
    const [resAgendamentos, resClientes, resServicos] = await Promise.all([
      api.get('/agendamentos'),
      api.get('/clientes'),
      api.get('/servicos')      
    ])
    
    const agendamentos = [...resAgendamentos.data]
    calendarEvents.value = agendamentos.map((ag: any) => ({
      id: ag.id,
      title: `${ag.clientes?.nome || 'Cliente'} - ${ag.servicos_salao?.codigo || 'ST'}`,
      start: ag.data_hora_inicio,
      end: ag.data_hora_fim,
      backgroundColor: ag.pago ? '#10B981' : '#F59E0B',
      borderColor: 'transparent'
    }))
    clientes.value = resClientes.data
    servicos.value = resServicos.data
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
  }
}

const handleSelect = (info: any) => {
  form.data_inicio = info.startStr
  form.data_fim = info.endStr
  showModal.value = true
}

const salvarAgendamento = async () => {
  try {
    await api.post('/agendamentos', form)
    showModal.value = false
    fetchData()
    alert('Erro ao guardar agendamento')
  } catch (error) {
    alert('Erro ao guardar agendamento')
  }
}
</script>

<template>
  <AdminLayout>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-4">
        <PageBreadcrumb pageTitle="Agenda do Salão" />
        <button ref="datePickerBtn" type="button" class="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-primary dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400 dark:hover:bg-white/[0.08]">
          <component :is="TableIcon" class="h-6 w-6" />
        </button>
      </div>
    </div>


    <div class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="custom-calendar">
        <FullCalendar ref="calendarRef" class="min-h-[650px]" :options="{
          plugins: [timeGridPlugin, interactionPlugin],
          initialView: 'timeGridWeek',
          locale: ptBrLocale,
          slotDuration: '00:30:00',
          slotMinTime: '08:00:00',
          slotMaxTime: '18:00:00',
          hiddenDays: [1],
          allDaySlot: false,
          selectable: true,
          events: calendarEvents,
          select: handleSelect,
          headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridWeek,timeGridDay'
          }
        }" />
      </div>
    </div>

    <Modal v-if="showModal" @close="showModal = false">
      <template #body> 
        <div class="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-11 text-left">
          <h5 class="mb-2 font-semibold text-gray-800 text-theme-xl dark:text-white/90 lg:text-2xl">Novo Agendamento</h5>
          <form @submit.prevent="salvarAgendamento">
            <div class="space-y-6 mt-8">
              <div>
                <label class="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Cliente</label>
                <select v-model="form.cliente_id" required class="w-full rounded-xl border border-gray-300 bg-transparent px-5 py-3.5 outline-none dark:border-gray-700 dark:bg-white/[0.03] dark:text-white">
                  <option value="" disabled class="dark:bg-gray-900">Selecione o cliente</option>
                  <option v-for="c in clientes" :key="c.id" :value="c.id" class="dark:bg-gray-900 dark:text-white">{{ c.nome }}</option>
                </select>
              </div>
              <div>
                <label class="mb-2.5 block text-sm font-medium text-gray-700 dark:text-gray-400">Serviço</label>
                <select v-model="form.servico_id" required class="w-full rounded-xl border border-gray-300 bg-transparent px-5 py-3.5 outline-none dark:border-gray-700 dark:bg-white/[0.03] dark:text-white">
                  <option value="" disabled class="dark:bg-gray-900">Selecione o serviço</option>
                  <option v-for="s in servicos" :key="s.id" :value="s.id" class="dark:bg-gray-900 dark:text-white">{{ s.codigo }} - {{ s.nome }}</option>
                </select>
              </div>
            </div>
            <div class="mt-10 flex items-center gap-4">
              <button type="button" @click="showModal = false" class="flex w-full justify-center rounded-xl border border-gray-300 p-4 font-semibold text-gray-700 dark:text-white">Cancelar</button>
              <button type="submit" class="flex w-full justify-center rounded-xl bg-primary p-4 font-semibold text-white">Confirmar</button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<style scoped>
/* ===== TEXTOS DO CALENDÁRIO ===== */

/* Toolbar (Título, dias, horas) */
:global(.dark) :deep(.fc-toolbar-title),
:global(.dark) :deep(.fc-col-header-cell-cushion),
:global(.dark) :deep(.fc-timegrid-axis-cushion),
:global(.dark) :deep(.fc-timegrid-slot-label-cushion),
:global(.dark) :deep(.fc-list-day-text),
:global(.dark) :deep(.fc-list-day-side-text) {
  color: #ffffff !important;
  font-weight: 600;
}

/* Horários laterais */
:global(.dark) :deep(.fc-timegrid-slot-label) {
  color: #94a3b8 !important; /* gray-400 */
}

/* ===== GRID E FUNDO ===== */

:global(.dark) :deep(.fc-theme-standard td),
:global(.dark) :deep(.fc-theme-standard th),
:global(.dark) :deep(.fc-theme-standard .fc-scrollgrid) {
  border-color: #2e3a47 !important;
}

:global(.dark) :deep(.fc-timegrid-slot) {
  background-color: transparent !important;
}

/* ===== EVENTOS ===== */
:global(.dark) :deep(.fc-event-title),
:global(.dark) :deep(.fc-event-time) {
  color: #ffffff !important;
}

/* ===== BOTÕES ===== */
:global(.dark) :deep(.fc-button) {
  background-color: rgba(255,255,255,0.05) !important;
  border-color: #2e3a47 !important;
  color: #ffffff !important;
}

:deep(.fc-button-active) {
  background-color: #3c50e0 !important;
  border-color: #3c50e0 !important;
  color: #ffffff !important;
}
</style>