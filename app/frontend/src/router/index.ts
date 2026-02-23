import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
   
    {
      path: '/salon/calendar',
      name: 'Calendario',           
      component: () => import('../views/Calendar/Calendar.vue'),
      meta: { title: 'Agenda de Serviços' },
    },

    {
      path: '/salon/customers',
      name: 'Clientes',           
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: { title: 'Pagina de clientes' },
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
      name: 'Dashboard',
      // TODO: Certifique-se de criar a pasta 'Inventory' e o arquivo 'POSView.vue'
      component: () => import('../views/Ecommerce.vue'),
      meta: { title: 'Dashboard' },
    },
  ],
})

// Guarda de rota para atualizar o título da página dinamicamente
router.beforeEach((to, from, next) => {
  // TODO: Alterar 'TailAdmin' para 'BifrostHub' no título final
  document.title = `BifrostHub - ${to.meta.title}`
  next()
})

export default router