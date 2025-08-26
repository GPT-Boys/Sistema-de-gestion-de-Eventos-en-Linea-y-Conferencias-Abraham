import { createRouter, createWebHistory } from 'vue-router';
import GestionUsuarios from '@/views/GestionUsuarios.vue';

const routes = [
  {
    // Esta línea es la más importante:
    // Cuando alguien entre a la página principal ('/')...
    path: '/',
    // ...redirígelo inmediatamente a '/usuarios'.
    redirect: '/usuarios'
  },
  {
    path: '/usuarios',
    name: 'GestionUsuarios',
    component: GestionUsuarios,
  },
  // Aquí pueden estar tus otras rutas como /Conferences
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL || '/'),
  routes,
});

export default router;