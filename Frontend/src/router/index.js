import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { useAuthStore } from '@/stores/publicStores/auth.js'

// Layouts
import PublicLayout from '@/layouts/PublicLayout.vue'
import AppLayout from '@/layouts/AppLayout.vue'

// Públicas
import HomeView from '@/views/HomeView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'

// Helpers de roles
const R = {
  all:       ['admin', 'staff', 'orador', 'asistente'],
  adminOnly: ['admin'],
  staffOnly: ['staff'],
  adminStaff:['admin', 'staff'],
  orador:    ['orador'],
  asistente: ['asistente'],
}

const routes = [
  // Públicas
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'Home', component: HomeView, meta: { public: true, title: 'Inicio' } },
      { path: 'login', name: 'Login', component: Login, meta: { public: true, title: 'Iniciar sesión' } },
      { path: 'register', name: 'Register', component: Register, meta: { public: true, title: 'Crear cuenta' } },
    ],
  },

  // App privada
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true, roles: R.all },
    children: [
      // Dashboard
      { path: '', redirect: { name: 'Dashboard' } },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { title: 'Dashboard', roles: R.all },
      },

      // Gestión (admin / staff)
      { path: 'agenda',     name: 'Agenda',     component: () => import('@/views/Agenda.vue'),     meta: { title: 'Agenda',     roles: R.adminStaff } },
      { path: 'charlas',    name: 'Charlas',    component: () => import('@/views/Charlas.vue'),    meta: { title: 'Charlas',    roles: R.adminStaff } },
      { path: 'oradores',   name: 'Oradores',   component: () => import('@/views/Oradores.vue'),   meta: { title: 'Oradores',   roles: R.adminStaff } },
      { path: 'materiales', name: 'Materiales', component: () => import('@/views/Materiales.vue'), meta: { title: 'Materiales', roles: R.adminStaff } },
      { path: 'votaciones', name: 'Votaciones', component: () => import('@/views/Votaciones.vue'), meta: { title: 'Votaciones', roles: R.adminStaff } },
      { path: 'asistentes', name: 'Asistentes', component: () => import('@/views/Asistentes.vue'), meta: { title: 'Asistentes', roles: R.adminStaff } },

      // Orador
      // Vista “Mi agenda” (dos formas: menú/agenda dentro del componente)
      { path: 'orador/mi-agenda', name: 'OradorMiAgenda', component: () => import('@/views/orador/MiAgenda.vue'), meta: { title: 'Mi agenda', roles: R.orador } },
      { path: 'orador/nueva-charla', name: 'NuevaCharla', component: () => import('@/views/orador/NuevaCharla.vue'), meta: { title: 'Crear charla', roles: R.orador } },
      { path: 'orador/mis-materiales', name: 'MisMateriales', component: () => import('@/views/orador/MisMateriales.vue'), meta: { title: 'Mis materiales', roles: R.orador } },

      // Asistente
      { path: 'asistente/explorar',          name: 'Explorar',         component: () => import('@/views/asistente/Explorar.vue'),         meta: { title: 'Explorar agenda', roles: R.asistente } },
      { path: 'asistente/mis-inscripciones', name: 'MisInscripciones', component: () => import('@/views/asistente/MisInscripciones.vue'), meta: { title: 'Mis inscripciones', roles: R.asistente } },
      { path: 'asistente/votaciones',        name: 'VotacionesAsis',   component: () => import('@/views/asistente/Votaciones.vue'),       meta: { title: 'Votaciones', roles: R.asistente } },
      // Historial de charlas finalizadas (asistente)
      { path: 'asistente/historial',         name: 'HistorialAsis',    component: () => import('@/views/asistente/Historial.vue'),        meta: { title: 'Historial', roles: R.asistente } },

      // Común
      { path: 'ajustes', name: 'Ajustes', component: () => import('@/views/Ajustes.vue'), meta: { title: 'Ajustes', roles: R.all } },
    ],
  },

  // Atajos opcionales
  { path: '/usuarios', redirect: { name: 'Asistentes' } },
  { path: '/dashboard', redirect: { name: 'Dashboard' } },

  // Fallback
  { path: '/:pathMatch(.*)*', redirect: '/app/dashboard' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.hash) return { el: to.hash, top: 88, behavior: 'smooth' }
    return { top: 0 }
  },
})

// NProgress
NProgress.configure({ showSpinner: false, trickleSpeed: 120 })
let firstStatusCheck = false

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const base = 'AbrahamEventSphere'
  document.title = to.meta?.title ? `${to.meta.title} — ${base}` : base

  const auth = useAuthStore()

  // Restaurar sesión 1 vez
  if (!firstStatusCheck) {
    firstStatusCheck = true
    try { await auth.fetchStatus() } catch {}
  }

  // Rutas públicas
  if (to.matched.some(r => r.meta?.public)) {
    if (auth.user && (to.name === 'Login' || to.name === 'Register')) {
      return next({ name: 'Dashboard' })
    }
    return next()
  }

  // Requiere sesión
  if (to.matched.some(r => r.meta?.requiresAuth) && !auth.user) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  // Chequear roles
  const allowedRoles = to.matched.flatMap(r => r.meta?.roles || [])
  if (allowedRoles.length && auth.role && !allowedRoles.includes(auth.role)) {
    return next({ name: 'Dashboard' })
  }

  next()
})

router.afterEach(() => {
  NProgress.done()
  setTimeout(() => {
    const main = document.querySelector('main#main')
    if (main) main.focus({ preventScroll: true })
  }, 0)
})

export default router