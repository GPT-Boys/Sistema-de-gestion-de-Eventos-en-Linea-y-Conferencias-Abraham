<template>
  <aside :class="['sidebar', { collapsed }]" role="navigation" aria-label="Menú lateral">
    <!-- Top: Brand + toggle -->
    <div class="top">
      <router-link to="/app/dashboard" class="brand" aria-label="Ir al dashboard">
        <picture class="logo-wrap">
          <img
            :src="logoPng"
            alt="AbrahamEventSphere"
            class="logo"
            width="320"
            height="120"
            fetchpriority="high"
            decoding="async"
            loading="eager"
            sizes="(max-width: 640px) 110px, (max-width: 900px) 140px, 180px"
          />
        </picture>
        <span class="brand-text">AbrahamEventSphere</span>
      </router-link>

      <button
        class="collapse-btn"
        type="button"
        :aria-pressed="collapsed.toString()"
        :title="collapsed ? 'Expandir' : 'Colapsar'"
        @click="collapsed = !collapsed"
      >
        <i class="bi" :class="collapsed ? 'bi-chevron-double-right' : 'bi-chevron-double-left'"></i>
      </button>
    </div>

    <!-- Menu -->
    <nav class="menu">
      <router-link
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="sb-item"
        :class="{ active: isActive(item.to) }"
        :title="collapsed ? item.label : null"
        :aria-current="isActive(item.to) ? 'page' : null"
      >
        <i :class="item.icon"></i>
        <span class="label">{{ item.label }}</span>
        <span v-if="item.badge" class="badge">{{ item.badge }}</span>
      </router-link>
    </nav>

    <div class="spacer" aria-hidden="true"></div>

    <!-- Bottom: account + logout -->
    <div class="bottom">
      <div class="sb-account" :class="{ compact: collapsed }">
        <div class="avatar">
          <img v-if="user.avatar" :src="user.avatar" alt="Foto de perfil" />
          <div v-else class="avatar-fallback">{{ initials(user.name) }}</div>
        </div>
        <div class="meta" v-if="!collapsed">
          <strong class="name">{{ user.name }}</strong>
          <small class="role">{{ user.role }}</small>
        </div>
      </div>

      <button
        class="sb-item sb-danger"
        type="button"
        @click="handleLogout"
        :title="collapsed ? 'Salir' : null"
      >
        <i class="bi bi-box-arrow-right"></i>
        <span class="label" v-if="!collapsed">Salir</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import logoPng from '@/assets/brand/Logo.png'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// ⚠️ Ajusta la ruta de import al servicio donde tengas el logout:
import { logout as logoutAPI } from '@/services/publicService' // p.ej. '@/services/auth' o '@/services/UserService'

const router = useRouter()
const route = useRoute()

// Ítems del sidebar (coinciden con tus rutas /app/*)
const items = [
  { to: '/app/dashboard', icon: 'bi bi-speedometer2', label: 'Dashboard' },
  { to: '/app/usuarios', icon: 'bi bi-people', label: 'Usuarios' },
  // { to: '/app/conferencias', icon: 'bi bi-easel',   label: 'Conferencias' },
  // { to: '/app/perfil',       icon: 'bi bi-person',  label: 'Perfil' },
]

// Estado colapsado persistente
const collapsed = ref(JSON.parse(localStorage.getItem('sb-collapsed') || 'false'))
watch(collapsed, (v) => localStorage.setItem('sb-collapsed', JSON.stringify(v)))

// Activo exacto (resalta bien el ítem)
const isActive = (to) => route.path === to || route.path.startsWith(to + '/')

// Usuario (ejemplo; cámbialo por tu store)
const user = ref({
  name: 'Admin',
  role: 'Administrador',
  avatar: null, // ej: '/team/fabrisio.jpg'
})
const initials = (n) =>
  n
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()

// Logout
const handleLogout = async () => {
  try {
    const ok = await logoutAPI()
    // si tu logout devuelve true/false o solo 200; redirigimos igual
    if (ok !== false) router.push('/login')
  } catch (e) {
    console.error(e)
    router.push('/login') // fallback
  }
}
</script>

<style scoped>
:root {
  --sidebar-w: 260px;
  --sidebar-w-collapsed: 84px;

  --bg: #ffffff;
  --ink: #0b0b0d;
  --muted: #6b7280;

  --purple-900: #4c1d95;
  --purple-700: #6d28d9;
  --purple-600: #7c3aed;
  --purple-500: #8b5cf6;

  --ring: 0 0 0 3px rgba(109, 40, 217, 0.25);
}

/* Contenedor */
.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  width: var(--sidebar-w);
  background: var(--bg);
  border-right: 1px solid #eef2f7;
  box-shadow: 0 6px 22px rgba(17, 24, 39, 0.06);
  display: flex;
  flex-direction: column;
  padding: 10px 10px 12px;
  transition: width 0.18s ease;
}
.sidebar.collapsed {
  width: var(--sidebar-w-collapsed);
}

/* Top */
.top {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border-radius: 12px;
  text-decoration: none;
  user-select: none;
}
.brand:hover {
  background: #f8fafc;
}
.brand-logo {
  height: 56px; /* tamaño cómodo en sidebar */
  width: auto;
  display: block;
}
.brand-text {
  font-weight: 800;
  color: var(--purple-900);
  white-space: nowrap;
}
.sidebar.collapsed .brand-text {
  display: none;
}

.collapse-btn {
  margin-left: auto;
  background: #fff;
  border: 1px solid #eceff3;
  border-radius: 10px;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  cursor: pointer;
}
.collapse-btn:hover {
  filter: brightness(0.98);
}
.collapse-btn:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}

/* Menú */
.menu {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 14px;
}
.sb-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  margin: 0 2px;
  color: #374151;
  text-decoration: none;
  border-radius: 12px;
  transition:
    transform 0.15s ease,
    background-color 0.15s ease,
    color 0.15s ease;
}
.sb-item i {
  font-size: 18px;
  width: 24px;
  text-align: center;
}
.sb-item .label {
  white-space: nowrap;
}
.sb-item:hover {
  background: #f8fafc;
  transform: translateY(-1px);
}
.sb-item.active {
  background: rgba(109, 40, 217, 0.12);
  color: var(--purple-700);
  font-weight: 700;
}
.badge {
  margin-left: auto;
  font-size: 11px;
  line-height: 1;
  padding: 4px 6px;
  border-radius: 8px;
  background: #eef2ff;
  color: #4338ca;
  font-weight: 700;
}
.sidebar.collapsed .sb-item {
  justify-content: center;
}
.sidebar.collapsed .sb-item .label,
.sidebar.collapsed .badge {
  display: none;
}

/* Spacer */
.spacer {
  flex: 1 1 auto;
}

/* Cuenta + logout */
.bottom {
  border-top: 1px solid #f1f5f9;
  padding-top: 10px;
  margin-top: 10px;
}
.sb-account {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin: 0 2px 8px;
  border-radius: 12px;
  background: #f9fafb;
}
.sb-account.compact {
  justify-content: center;
}
.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.avatar-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: #ede9fe;
  color: #4c1d95;
  font-weight: 800;
}
.meta .name {
  display: block;
  font-size: 14px;
  color: #111827;
}
.meta .role {
  color: #6b7280;
}

.sb-danger {
  width: 100%;
  justify-content: flex-start;
  border: 1px solid #fee2e2;
  background: #fff5f5;
  color: #b91c1c;
}
.sb-danger:hover {
  background: #ffe9e9;
}
.sidebar.collapsed .sb-danger {
  justify-content: center;
}
</style>
