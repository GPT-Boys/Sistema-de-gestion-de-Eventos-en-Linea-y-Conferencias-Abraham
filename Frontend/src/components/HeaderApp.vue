<template>
  <header class="appbar">
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
  position: sticky; top:0; z-index:10;
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  background:#fff; border-bottom:1px solid #eef0f4; padding:10px 14px;
}
.icon-btn{
  width:38px; height:38px; border-radius:12px; border: 1px solid #e5e7eb; background:#fff; cursor:pointer;
}
.search{
  flex:1; display:flex; align-items:center; gap:8px; padding:8px 12px; max-width:680px;
  border:1px solid #e5e7eb; border-radius:12px; background:#fafafa;
}
.search input{ flex:1; border:none; background:transparent; outline:none; }

.right{ display:flex; align-items:center; gap:10px; }
.user{ position:relative; }
.avatar{
  width:36px; height:36px; border-radius:50%; border: 2px solid #e9d5ff; cursor:pointer;
}
.user:hover .menu{ opacity:1; pointer-events:auto; transform: translateY(0); }
.menu{
  position:absolute; right:0; top:110%; width:200px; background:#fff; border:1px solid #eef0f4; border-radius:12px;
  box-shadow: 0 20px 60px rgba(17,24,39,.12);
  padding:8px; display:grid; gap:6px;
  opacity:0; pointer-events:none; transform: translateY(6px); transition: all .16s ease;
}
.u-name{ padding:8px; font-weight:800; }
.link{
  text-align:left; background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:8px; cursor:pointer;
}
.link:hover{ background:#f8fafc; }
</style>
