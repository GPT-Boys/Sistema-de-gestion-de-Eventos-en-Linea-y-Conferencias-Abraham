<template>
  <header class="appbar">
    <!-- Botón hamburguesa -->
    <button class="icon-btn" @click="$emit('toggle-nav')" aria-label="Abrir/cerrar navegación">
      <i class="bi bi-list"></i>
    </button>

    <div class="search">
      <i class="bi bi-search"></i>
      <input type="search" placeholder="Buscar en el evento…" />
    </div>

    <div class="right">
      <button class="icon-btn" title="Notificaciones">
        <i class="bi bi-bell"></i>
      </button>

      <div class="user">
        <img class="avatar" src="https://i.pravatar.cc/80?img=15" alt="Avatar" />
        <div class="menu">
          <div class="u-name">{{ userLabel }}</div>
          <button class="link" @click="goProfile"><i class="bi bi-person"></i> Perfil</button>
          <button class="link" @click="onLogout"><i class="bi bi-box-arrow-right"></i> Cerrar sesión</button>
        </div>
      </div>
    </div>
  </header>
</template>


<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/publicStores/auth.js'

const router = useRouter()
const auth = useAuthStore()

const userLabel = computed(() => auth.user?.usuario || 'Usuario')

const goProfile = () => router.push('/app/ajustes')
const onLogout = async () => {
  await auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.appbar{
  position: sticky; top:0; z-index:20;
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  background: linear-gradient(90deg,#310176,#624399 80%);
  padding:10px 16px;
  box-shadow:0 2px 8px rgba(0,0,0,.25);
  color:#fff;
}

/* Botones de iconos */
.icon-btn{
  width:40px; height:40px; border-radius:50%;
  display:grid; place-items:center;
  border:none; background:rgba(255,255,255,0.12); cursor:pointer;
  color:#fff; font-size:18px; transition:.2s;
}
.icon-btn:hover{ background:rgba(255,255,255,0.2); transform:scale(1.05); }

/* Buscador */
.search{
  flex:1; display:flex; align-items:center; gap:8px;
  padding:8px 14px; max-width:680px;
  background:rgba(255,255,255,.12);
  border:1px solid rgba(255,255,255,.25);
  border-radius:14px; backdrop-filter: blur(6px);
}
.search i{ opacity:.8; }
.search input{
  flex:1; border:none; background:transparent; outline:none;
  color:#fff; font-size:14px;
}
.search input::placeholder{ color:rgba(255,255,255,.6); }

/* Right zone */
.right{ display:flex; align-items:center; gap:12px; }

/* Avatar + menú */
.user{ position:relative; }
.avatar{
  width:38px; height:38px; border-radius:50%;
  border:2px solid #AA71C9;
  cursor:pointer; transition:.2s;
}
.avatar:hover{ transform:scale(1.05); box-shadow:0 0 0 3px rgba(170,113,201,.4); }

/* Menú desplegable */
.menu{
  position:absolute; right:0; top:115%; width:200px;
  background:#fff; color:#111; border-radius:12px;
  box-shadow:0 20px 50px rgba(0,0,0,.25);
  padding:10px; display:grid; gap:8px;
  opacity:0; pointer-events:none; transform:translateY(8px);
  transition: all .18s ease;
}
.user:hover .menu{ opacity:1; pointer-events:auto; transform:translateY(0); }
.u-name{ font-weight:700; padding:6px 8px; border-bottom:1px solid #eee; }
.link{
  text-align:left; background:#f9fafb; border:none;
  border-radius:8px; padding:8px; cursor:pointer;
  font-size:14px; display:flex; align-items:center; gap:8px;
  transition:.2s;
}
.link i{ color:#6d28d9; }
.link:hover{ background:#f3e8ff; color:#4c1d95; }
</style>
