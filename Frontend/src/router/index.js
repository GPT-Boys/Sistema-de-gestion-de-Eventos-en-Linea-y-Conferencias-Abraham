import { createRouter, createWebHistory } from 'vue-router';
import GestionUsuarios from '@/views/GestionUsuarios.vue';

const routes = [
  {

    path: '/',
    // '/usuarios'.
    redirect: '/usuarios'
  },
  {
    path: '/usuarios',
    name: 'GestionUsuarios',
    component: GestionUsuarios,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});

export default router;