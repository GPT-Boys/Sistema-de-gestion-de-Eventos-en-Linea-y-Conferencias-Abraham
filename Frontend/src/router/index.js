import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// Públicas
import HomeView from '@/views/HomeView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

// App interna
import Dashboard from '@/views/Dashboard.vue'
import GestionUsuarios from '@/views/GestionUsuarios.vue'

// Layouts
import PublicLayout from '@/layouts/PublicLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'

const routes = [
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', name: 'Home', component: HomeView, meta: { public: true } },
        { path: 'login', name: 'Login', component: Login, meta: { public: true } },
        { path: 'register', name: 'Register', component: Register, meta: { public: true } },
      ],
    },
    {
      path: '/app',
      component: AppLayout,
      children: [
        { path: '', redirect: { name: 'Dashboard' } },                // /app → /app/dashboard
        { path: 'dashboard', name: 'Dashboard', component: Dashboard },
        { path: 'usuarios', name: 'Usuarios', component: GestionUsuarios },
      ],
    },

    // opcional: que /usuarios también funcione
    { path: '/usuarios', redirect: { name: 'Usuarios' } },
    { path: '/dashboard', redirect: { name: 'Dashboard' } },

    // opcional 404
    // { path: '/:pathMatch(.*)*', component: NotFound },
  ]
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 1) Navegación atrás/adelante preserva scroll
    if (savedPosition) return savedPosition

    // 2) Anclas (#id) con offset del header
    if (to.hash) {
      return {
        el: to.hash,
        top: 88,                 // ≈ altura del header (ajústalo si usas otra)
        behavior: 'smooth',
      }
    }

    // 3) Por defecto, al top
    return { top: 0 }
  },
})

// --- NProgress ---
NProgress.configure({ showSpinner: false, trickleSpeed: 120 })

router.beforeEach((to, from, next) => {
  NProgress.start()
  const base = 'AbrahamEventSphere'
  document.title = to.meta?.title ? `${to.meta.title} — ${base}` : base
  next()
})

router.afterEach(() => {
  NProgress.done()
  // Accesibilidad: enfoca el <main> de la vista activa
  setTimeout(() => {
    const main = document.querySelector('main#main')
    if (main) main.focus({ preventScroll: true })
  }, 0)
})

export default router

