<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/publicStores/auth.js'
import { NAV_ITEMS } from '@/nav/items.js'
import logoPng from '@/assets/brand/MiniLogo.png'

const emit = defineEmits(['logout'])

const route = useRoute()
const auth  = useAuthStore()

// estado colapsado (persistido)
const collapsed = ref(localStorage.getItem('nav-collapsed') === '1')
const toggle = () => {
  collapsed.value = !collapsed.value
  localStorage.setItem('nav-collapsed', collapsed.value ? '1' : '0')
}

const items = computed(() =>
  NAV_ITEMS.filter(it => !it.roles || (auth.role && it.roles.includes(auth.role)))
)

const isActive = (path) => route.path.startsWith(path)
</script>

<template>
  <aside class="sidenav" :class="{ collapsed }">
    <!-- Brand + burger -->
    <div class="nav-head">
      <router-link to="/app/dashboard" class="brand" :aria-label="collapsed ? 'Ir a dashboard' : 'AbrahamEventSphere'">
        <img class="logo" :src="logoPng" alt="" width="36" height="36" />
        <span v-if="!collapsed" class="brand-text">AbrahamEventSphere</span>
      </router-link>

      <button class="burger" @click="toggle" :aria-label="collapsed ? 'Expandir menú' : 'Colapsar menú'">
        <i class="bi" :class="collapsed ? 'bi-arrow-right-square' : 'bi-arrow-left-square'"></i>
      </button>
    </div>

    <!-- Items -->
    <nav class="nav-scroll">
      <template v-for="(it, idx) in items" :key="idx">
        <div v-if="it.header" class="nav-section">
          <span v-if="!collapsed" class="nav-section-text">{{ it.header }}</span>
          <span v-else class="nav-divider" />
        </div>

        <router-link
          v-else
          class="nav-item"
          :to="it.to"
          :class="{ active: isActive(it.to) }"
          :title="collapsed ? it.label : ''"
        >
          <i :class="`bi ${it.icon}`" aria-hidden="true"></i>
          <span v-if="!collapsed" class="nav-label">{{ it.label }}</span>
        </router-link>
      </template>
    </nav>

    <!-- Logout -->
    <div class="nav-foot">
      <button
        class="nav-item logout-btn"
        @click="emit('logout')"
        :title="collapsed ? 'Cerrar sesión' : ''"
      >
        <i class="bi bi-box-arrow-right" aria-hidden="true"></i>
        <span v-if="!collapsed" class="nav-label">Cerrar sesión</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidenav{
  --w: 280px; --w-collapsed: 90px;
  --bg:#0e0f16; --ink:#cdd2df; --ink-muted:#8a90a3; --accent:#7c3aed;
  --danger:#e3e3e3; --danger-900:#1f1f1f;

  position: sticky; top:0; height:100svh;
  width: var(--w); background: var(--bg); color: var(--ink);
  display:flex; flex-direction:column; border-right:1px solid rgba(255,255,255,.06);
  transition: width .18s ease;
}
.sidenav.collapsed{ width: var(--w-collapsed); }

.nav-head{
  display:flex; align-items:center; justify-content:space-between; gap:8px;
  padding:12px;
}
.brand{ display:flex; align-items:center; gap:10px; color:inherit; text-decoration:none; }
.logo{ width:36px; height:36px; object-fit:contain; }
.brand-text{ font-weight:800; white-space:nowrap; overflow:visible; }

.burger{
  background:transparent; border:none; color:var(--ink); cursor:pointer; font-size:20px; padding:6px; border-radius:10px;
}
.burger:hover{ background:rgba(255,255,255,.06); }
.burger:focus-visible{ outline:none; box-shadow:0 0 0 3px rgba(124,58,237,.35); border-radius:10px; }

.nav-scroll{ flex:1; overflow:auto; padding: 6px; }
.nav-section{ padding:8px 10px; color:var(--ink-muted); text-transform:uppercase; font-size:11px; letter-spacing:.06em; }
.nav-divider{ display:block; height:1px; background:rgba(255,255,255,.06); margin:6px 8px; }

.nav-item{
  display:flex; align-items:center; gap:12px; color:var(--ink); text-decoration:none;
  padding:10px 12px; border-radius:12px; margin:2px 2px; cursor:pointer;
}
.nav-item i{ font-size:18px; width:22px; text-align:center; }
.nav-item:hover{ background: rgba(255,255,255,.06); }
.nav-item.active{
  background: linear-gradient(135deg, rgba(124,58,237,.25), rgba(124,58,237,.15));
  color:#fff; outline:1px solid rgba(124,58,237,.35);
}

/* Footer fijo y botón de logout bien visible */
.nav-foot{
  padding:12px; border-top:1px solid rgba(255,255,255,.06);
  position: sticky; bottom: 0; background: linear-gradient(to top, rgba(0,0,0,.25), transparent);
}
.logout-btn{
  width:100%;
  background: linear-gradient(134deg, var(--danger), #ffffff67);
  color:#000000; font-weight:800;
  border:1px solid rgba(255, 255, 255, 0.6);
}
.logout-btn:hover{ filter: brightness(1.05); }
.logout-btn:focus-visible{ outline:none; box-shadow:0 0 0 3px rgba(255, 255, 255, 0.35); }

/* En modo colapsado, que sea un botón icónico cuadrado */
.sidenav.collapsed .logout-btn{
  justify-content:center;
  padding:12px; margin-inline:auto;
}
.sidenav.collapsed .logout-btn .nav-label{ display:none; }
</style>
