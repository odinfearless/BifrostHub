import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    // Módulo: Salão de Cabelo
    {
      path: '/salon/calendar',
      name: 'SalonCalendar',
      // TODO: Certifique-se de criar a pasta 'Salon' e o arquivo 'CalendarView.vue'
      component: () => import('../views/Salon/CalendarView.vue'),
      meta: { title: 'Agenda do Salão' },
    },

    // Módulo: Lava Rápido
    {
      path: '/carwash/orders',
      name: 'CarWashOrders',
      // TODO: Certifique-se de criar a pasta 'CarWash' e o arquivo 'OrdersView.vue'
      component: () => import('../views/CarWash/OrdersView.vue'),
      meta: { title: 'Lava Rápido' },
    },

    // Módulo: Conveniência/Estoque
    {
      path: '/inventory/pos',
      name: 'StorePOS',
      // TODO: Certifique-se de criar a pasta 'Inventory' e o arquivo 'POSView.vue'
      component: () => import('../views/Inventory/POSView.vue'),
      meta: { title: 'Caixa Conveniência' },
    },
    
    // Rota Padrão (Redirecionamento caso queira que o sistema comece na agenda)
    {
      path: '/',
      redirect: '/salon/calendar'
    }
  ],
})

// Guarda de rota para atualizar o título da página dinamicamente
router.beforeEach((to, from, next) => {
  // TODO: Alterar 'TailAdmin' para 'BifrostHub' no título final
  document.title = `BifrostHub - ${to.meta.title}`
  next()
})

export default router