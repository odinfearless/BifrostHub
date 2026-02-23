<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div class="custom-calendar">
        <FullCalendar ref="calendarRef" class="min-h-screen" :options="calendarOptions" />
      </div>

      <!-- Modal -->
      <Modal v-model="isOpen">
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <h5 class="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
            {{ form.event_id ? 'Editar Agenda' : 'Criar Agenda' }}
          </h5>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Crie ou edite seus compromissos
          </p>

          <div class="mt-8">
            <div>
              <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                Titulo
              </label>
              <input v-model="form.title" type="text"
                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
            </div>

            <div class="mt-6">
              <label class="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-400">
                Cor
              </label>
              <div class="flex flex-wrap items-center gap-4 sm:gap-5">
                <div v-for="(value, key) in calendarsEvents" :key="key" class="n-chk">
                  <div :class="`form-check form-check-${value} form-check-inline`">
                    <label class="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                      :for="`modal${key}`">
                      <span class="relative">
                        <input type="radio" :name="'event-level'" :value="key" :id="`modal${key}`" v-model="form.level"
                          class="sr-only form-check-input" />
                        <span
                          class="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                          <span class="w-2 h-2 bg-white rounded-full dark:bg-transparent"></span>
                        </span>
                      </span>
                      {{ value }}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-[1fr_1fr_auto]">
              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Data Inicial
                </label>
                <div class="relative">
                  <flat-pickr v-model="form.start" :config="flatpickrConfig"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    placeholder="Selecione a data Inicial" />
                  <CalenderIcon
                    class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  </CalenderIcon>
                </div>
              </div>
              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Data Final
                </label>
                <div class="relative">
                  <flat-pickr v-model="form.end" :config="flatpickrConfig"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pl-4 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    placeholder="Selecione a data Inicial" />
                  <CalenderIcon
                    class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  </CalenderIcon>
                </div>
              </div>
              <div class="mt-6 flex items-end">
                <button @click="form.start = ''; form.end = ''"
                  class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto">
                  <RefreshIcon></RefreshIcon>
                </button>
              </div>
            </div>

            <div v-if="form.addService" class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-[1fr_1fr_auto]">
              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Cliente
                </label>
                <div class="relative z-20 bg-transparent">
                  <select required v-model="form.cliente_id"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    :class="{ 'text-gray-800 dark:text-white/90': form.cliente_id }">
                    <option value="" selected>Selecione...</option>
                    <option v-for="c in clientes" :key="c.id" :value="c.id" class="dark:bg-gray-900 dark:text-white">
                      {{ c.nome }}</option>
                  </select>
                  <UserCircleIcon
                    class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  </UserCircleIcon>
                </div>
              </div>
              <div class="mt-6">
                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                  Serviços
                </label>

                <div class="relative z-20 bg-transparent">
                  <select required v-model="form.servico_id"
                    class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
                    :class="{ 'text-gray-800 dark:text-white/90': form.servico_id }">
                    <option value="" :key="0" selected>Selecione...</option>
                    <option v-for="c in servicos" :key="c.id" :value="c.id" class="dark:bg-gray-900 dark:text-white">
                      {{ c.nome }}</option>
                  </select>
                  <ListIcon
                    class="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                  </ListIcon>
                </div>
              </div>

              <div class="mt-6 flex items-end">
                <button v-if="form.addService" @click="form.addService = false"
                  class="flex w-full justify-center rounded-lg border border-error-500 bg-error-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-error-600 sm:w-auto">
                  -
                </button>
              </div>

            </div>

            <div v-if="!form.addService" class="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-1">
              <div class="relative z-20 bg-transparent">
                <button @click="form.addService = true"
                  class="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 w-full">
                  Adicionar Serviço
                </button>
              </div>
            </div>

          </div>

          <div class="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button @click="closeModal"
              class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto">
              Close
            </button>

            <button @click="handleAddOrUpdateEvent"
              class="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto">
              {{ form.event_id ? 'Update Changes' : 'Add Event' }}
            </button>
            <button v-if="form.event_id" @click="handleDeleteEvent"
              class="flex w-full justify-center rounded-lg border border-error-500 bg-error-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-error-600 sm:w-auto">
              Delete Event
            </button>
          </div>
        </div>
      </Modal>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import AdminLayout from '@/components/layout/AdminLayout.vue'
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue'
import { ref, onMounted, nextTick, computed, reactive } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Modal from '@/components/profile/Modal.vue'
import ptBrLocale from '@fullcalendar/core/locales/pt-br'
import flatpickr from 'flatpickr'
import flatPickr from 'vue-flatpickr-component'
import { Portuguese } from 'flatpickr/dist/l10n/pt.js'
import confirmDatePlugin from "flatpickr/dist/plugins/confirmDate/confirmDate"
import "flatpickr/dist/plugins/confirmDate/confirmDate.css"
import { CalenderIcon, UserCircleIcon, ListIcon, RefreshIcon } from '@/icons'
import type {
  EventInput,
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventContentArg
} from '@fullcalendar/core'
import type { Instance } from 'flatpickr/dist/types/instance'
import api from '@/services/api'

/* ======================================================
   TYPES
====================================================== */

type EventLevel = 'Danger' | 'Success' | 'Primary' | 'Warning'

interface EventForm {
  event_id: string | null
  cliente_id: number | null
  servico_id: number | null
  title: string
  start: string
  end: string
  level: EventLevel
  addService: boolean

}


const calendarsEvents = reactive({ Danger: 'Alerta', Success: 'Sucesso', Primary: 'Primario', Warning: 'Aviso', })

/* ======================================================
   STATE
====================================================== */

const currentPageTitle = ref('Agenda')
const calendarRef = ref<InstanceType<typeof FullCalendar> | null>(null)

const isOpen = ref(false)

const clientes = ref<any[]>([])
const servicos = ref<any[]>([])
const calendarEvents = ref<EventInput[]>([])

const isSaving = ref(false)
let pickerInstance: Instance | null = null

const flatpickrConfig = {
  locale: Portuguese,
  altInput: true,
  altFormat: 'd/m/Y H:i',
  wrap: true,
  enableTime: true,
  time_24hr: true,
  plugins: [confirmDatePlugin({ confirmText: "OK", showAlways: true })]
}


/* ======================================================
   FORM FACTORY
====================================================== */

function createDefaultForm(): EventForm {
  return {
    event_id: null,
    cliente_id: null,
    servico_id: null,
    title: '',
    start: '',
    end: '',
    level: 'Primary',
    addService: false
  }
}

const form = ref<EventForm>(createDefaultForm())

/* ======================================================
   UTIL
====================================================== */

function mapAgendamentoToCalendarEvent(ag: any): EventInput {
 
  return {
    id: String(ag.id),
    title: `${ag.clientes?.nome ?? 'Cliente'} - ${ag.servicos_salao?.codigo ?? 'ST'}`,
    start: ag.data_hora_inicio,
    end: ag.data_hora_fim,
    allDay: !ag.data_hora_fim?.includes('T'),
    extendedProps: {
      calendar: ag.level ?? 'Primary',
      clientes: ag.clientes,
      servicos: ag.servicos_salao
    }
  }
}

/* ======================================================
   FETCH
====================================================== */

async function fetchData() {
  try {
    const [resAgendamentos, resClientes, resServicos] = await Promise.all([
      api.get('/agendamentos'),
      api.get('/clientes'),
      api.get('/servicos_salao')
    ])

   
    calendarEvents.value = resAgendamentos.data.data.map(mapAgendamentoToCalendarEvent)
    clientes.value = resClientes.data.data
    servicos.value = resServicos.data.data

  } catch (error) {
    console.error('Erro ao buscar dados:', error)
  }
}

onMounted(fetchData)

/* ======================================================
   MODAL CONTROL
====================================================== */

function openModal() {
  isOpen.value = true
}

function closeModal() {
  isOpen.value = false
  resetModalFields()
}

function resetModalFields() {
  form.value = createDefaultForm()
}

/* ======================================================
   FULLCALENDAR EVENTS
====================================================== */

function handleDateSelect(selectInfo: DateSelectArg) {
  resetModalFields()

  form.value.start = selectInfo.startStr
  form.value.end = selectInfo.endStr ?? selectInfo.startStr
  openModal()
}

function handleEventClick(clickInfo: EventClickArg) {
  const event = clickInfo.event
  form.value = {
    event_id: String(event.id) ?? null,
    cliente_id: event.extendedProps.clientes?.id ?? null,
    servico_id: event.extendedProps.servicos?.id ?? null,
    title: event.title,
    start: event.startStr,
    end: event.endStr ?? event.startStr,
    level: event.extendedProps.calendar as EventLevel,
    addService: event.extendedProps.servicos ? true : false
  }

  openModal()
}

/* ======================================================
   CRUD
====================================================== */

async function handleAddOrUpdateEvent() {
  try {
    isSaving.value = true

    const payload = {
      cliente_id: form.value.cliente_id,
      servico_id: form.value.servico_id,
      data_hora_inicio: form.value.start,
      data_hora_fim: form.value.end,
      level: form.value.level
    }

    if (!form.value.addService) {
      form.value.servico_id = null
      form.value.cliente_id = null
    }
    // UPDATE
    if (form.value.event_id) {
     
      const { data } = await api.put(
        `/agendamentos/${form.value.event_id}`,
        payload
      )

      const updated = mapAgendamentoToCalendarEvent(data)

      const index = calendarEvents.value.findIndex(
        e => e.id === updated.id
      )

      if (index !== -1) {
        calendarEvents.value[index] = updated
      }
    }
    // CREATE
    else {

      const { data } = await api.post('/agendamentos', payload)

      const newEvent = mapAgendamentoToCalendarEvent(data)
      calendarEvents.value.push(newEvent)
    }

    closeModal()

  } catch (error) {
    console.error('Erro ao salvar evento:', error)
  } finally {
    isSaving.value = false
  }
}

async function handleDeleteEvent() {
  if (!form.value.event_id) return

  try {
    await api.delete(`/agendamentos/${form.value.event_id}`)

    calendarEvents.value = calendarEvents.value.filter(
      e => e.id !== form.value.event_id
    )

    closeModal()

  } catch (error) {
    console.error('Erro ao deletar evento:', error)
  }
}

/* ======================================================
   RENDER EVENT
====================================================== */

function renderEventContent(eventInfo: EventContentArg) {
  const level =
    `fc-bg-${eventInfo.event.extendedProps.calendar?.toLowerCase() ?? 'primary'}`

  const text = eventInfo.timeText
    ? `${eventInfo.timeText} - ${eventInfo.event.title}`
    : eventInfo.event.title

  return {
    html: `
      <div class="event-fc-color flex fc-event-main ${level} p-1 rounded-sm event-border">
        <div class="fc-daygrid-event-dot"></div>
        <div class="fc-event-title event-text">${text}</div>
      </div>
    `
  }
}

/* ======================================================
   CALENDAR OPTIONS
====================================================== */

const calendarOptions = computed<CalendarOptions>(() => ({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  locale: ptBrLocale,
  selectable: true,
  events: calendarEvents.value,

  slotDuration: '00:30:00',
  slotMinTime: '08:00:00',
  slotMaxTime: '18:00:00',
  slotLabelInterval: '00:30:00',
  allDayText: 'Dia Inteiro',
  slotLabelFormat: { hour: '2-digit', minute: '2-digit', hour24: true },

  contentHeight: 'auto',

  select: handleDateSelect,
  eventClick: handleEventClick,
  eventContent: renderEventContent,

  headerToolbar: {
    left: 'datePickerButton today prev,next addEventButton',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  },

  customButtons: {
    addEventButton: {
      text: 'Criar',
      click: openModal
    },

    datePickerButton: {
      text: '📅',
      click: async (ev: MouseEvent) => {
        await nextTick()

        const buttonEl = ev.currentTarget as HTMLElement

        if (!pickerInstance) {
          pickerInstance = flatpickr(buttonEl, {
            locale: Portuguese,
            dateFormat: 'Y-m-d',
            positionElement: buttonEl,
            allowInput: false,
            onChange: (selectedDates: Date[]) => {
              if (!calendarRef.value) return

              const calendarApi = calendarRef.value.getApi()
              calendarApi.gotoDate(selectedDates[0])
              calendarApi.changeView('timeGridDay')
            }
          })
        }

        pickerInstance.open()
      }
    }
  }
}))
</script>
<style>
/*todos e não tem texto*/
.fc .fc-event .fc-event-main {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

}

.fc .event-border {
  border: 1px solid rgba(0, 0, 0, 0.199);
}

.fc .fc-bg-warning {
  background-color: rgb(255, 255, 200);
}

.fc-event:hover .event-border {
  background-color: rgb(216, 216, 216);

}

.dark .flatpickr-current-month .flatpickr-monthDropdown-months {
  background-color: #101828;
}


/* Quando passar o mouse */
.fc .fc-timegrid-event-harness:hover {
  z-index: 9999 !important;
}

.fc .fc-timegrid-event:hover {
  z-index: 10000 !important;
}

/* so timegrid  allday = false*/
.fc .fc-timegrid-event {
  box-shadow: none;
  border: none;
  background-color: transparent;
}

.fc-daygrid-block-event {
  margin-bottom: 5px;
}

a.fc-event:hover {
  background-color: transparent;
}

.fc-timegrid-event .event-border {
  padding: 3px 0 0 10px;
}

.flatpickr-calendar.hasTime {
  width: 100% !important;
  max-width: 340px !important;
}
</style>