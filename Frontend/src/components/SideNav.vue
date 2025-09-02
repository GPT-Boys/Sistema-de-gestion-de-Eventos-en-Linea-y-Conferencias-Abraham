<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/publicStores/auth.js'
import { NAV_ITEMS } from '@/nav/items.js'
import logoPng from '@/assets/brand/MiniLogo.png'

const props = defineProps({
  collapsed: { type: Boolean, default: false }
})
const emit = defineEmits(['logout'])

const route = useRoute()
const auth = useAuthStore()

// Filtra por rol actual
const items = computed(() =>
  NAV_ITEMS.filter(it => !it.roles || (auth.role && it.roles.includes(auth.role)))
)

// Agrupa en secciones y quita headers vacíos
const groupedItems = computed(() => {
  const groups = []
  let current = null
  for (const it of items.value) {
    if (it.header) {
      current = { header: it.header, children: [] }
      groups.push(current)
    } else if (current) {
      current.children.push(it)
    }
  }
  return groups.filter(g => g.children.length > 0)
})

const isActive = (path) => route.path.startsWith(path)
</script>

<template>
  <aside class="sidenav" :class="{ collapsed: props.collapsed }">
    <!-- Brand -->
    <div class="nav-head">
      <router-link to="/app/dashboard" class="brand">
        <img class="logo" :src="logoPng" alt="" width="36" height="36" />
        <span v-if="!props.collapsed" class="brand-text">AbrahamEventSphere</span>
      </router-link>
    </div>

    <!-- Items -->
    <nav class="nav-scroll">
      <div v-for="(group, idx) in groupedItems" :key="idx">
        <div class="nav-section">
          <span v-if="!props.collapsed">{{ group.header }}</span>
          <span v-else class="nav-divider" />
        </div>

        <router-link
          v-for="it in group.children"
          :key="it.to"
          class="nav-item"
          :to="it.to"
          :class="{ active: isActive(it.to) }"
          :aria-current="isActive(it.to) ? 'page' : null"
        >
          <i :class="`bi ${it.icon}`"></i>
          <span v-if="!props.collapsed">{{ it.label }}</span>
        </router-link>
      </div>
    </nav>

    <!-- Logout -->
    <div class="nav-foot">
      <button class="nav-item logout-btn" @click="emit('logout')">
        <i class="bi bi-box-arrow-right"></i>
        <span v-if="!props.collapsed">Cerrar sesión</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidenav{
  --w: 280px; --w-collapsed: 90px;
  --bg:#131313ed; --ink:#cdd2df; --ink-muted:#8a90a3; --accent:#7c3aed;

  position: sticky; top:0; height:100svh;
  width: var(--w); background: var(--bg); color: var(--ink);
  display:flex; flex-direction:column; border-right:1px solid rgba(255,255,255,.06);

  /* 🔥 animación */
  transition: width 0.25s cubic-bezier(.4,0,.2,1), background 0.25s;
  overflow: hidden;
}
.sidenav.collapsed{ width: var(--w-collapsed); }

.nav-head{
  display:flex; align-items:center; justify-content:flex-start; gap:10px;
  padding:14px;
  transition: padding 0.25s ease;
}
.sidenav.collapsed .nav-head{ justify-content:center; }

.brand{ display:flex; align-items:center; gap:10px; color:inherit; text-decoration:none; }
.logo{ width:36px; height:36px; object-fit:contain; }
.brand-text{ font-weight:800; white-space:nowrap; opacity:1; transition:opacity 0.2s ease; }
.sidenav.collapsed .brand-text{ opacity:0; }

.nav-scroll{ flex:1; overflow:auto; padding:6px; }
.nav-item{
  display:flex; align-items:center; gap:12px; color:var(--ink);
  text-decoration:none; padding:12px; border-radius:12px;
  margin:4px 2px; cursor:pointer; transition: background 0.2s;
}
.nav-item i{ font-size:18px; width:22px; text-align:center; }
.nav-item:hover{ background: rgba(255,255,255,.06); }
.nav-item.active{
  background: linear-gradient(135deg, rgba(124,58,237,.25), rgba(124,58,237,.15));
  color:#fff; outline:1px solid rgba(124,58,237,.35);
}

/* Footer */
.nav-foot{
  padding:12px; border-top:1px solid rgba(255,255,255,.06);
  position: sticky; bottom: 0; background: linear-gradient(to top, rgba(0,0,0,.25), transparent);
}
.logout-btn{
  width:100%; display:flex; align-items:center; justify-content:center;
  gap:10px; border-radius:10px; padding:12px;
  background: linear-gradient(134deg,#ffffff,#c9c9c9);
  color:#000; font-weight:800; border:1px solid rgba(255,255,255,0.3);
  transition: all 0.2s ease;
}
.logout-btn:hover{ background:rgb(147, 59, 59);filter: brightness(1.08); transform:translateY(-2px); }
</style>
