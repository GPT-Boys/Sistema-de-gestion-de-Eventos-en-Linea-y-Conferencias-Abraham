<!-- src/layouts/AppLayout.vue -->
<script setup>
import { useAuthStore } from '@/stores/publicStores/auth.js'
import { useRouter, useRoute } from 'vue-router'
import { watch, onMounted, onBeforeUnmount } from 'vue'
import SideNav from '@/components/SideNav.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const onLogout = async () => {
  await auth.logout()
  router.push('/login')
}

// 🔒 Fix: limpiar el overflow del body siempre que se cambie de ruta
const clearBodyOverflow = () => {
  document.body.style.overflow = ''
}

onMounted(clearBodyOverflow)
onBeforeUnmount(clearBodyOverflow)
watch(() => route.fullPath, () => clearBodyOverflow())
</script>

<template>
  <div class="app-shell">
    <!-- Menú lateral -->
    <SideNav @logout="onLogout" />

    <!-- Contenido principal -->
    <section class="app-main">
      <header class="topbar">
        <h2 class="title">Panel</h2>
        <div class="spacer" />
        <div class="user">
          <i class="bi bi-person-circle"></i>
          <span>{{ auth.user?.usuario }}</span>
        </div>
      </header>

      <main id="main" tabindex="-1" class="content">
        <router-view />
      </main>
    </section>
  </div>
</template>

<style scoped>
.app-shell {
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 100svh;
}

.app-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.topbar {
  height: 64px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border-bottom: 1px solid #eef0f4;
  background: #fff;
}

.title {
  margin: 0;
  font-size: 16px;
  font-weight: 800;
}

.spacer {
  flex: 1;
}

.user {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  font-weight: 700;
}

.content {
  padding: 16px;
  background: #f7f8fc;
  min-height: calc(100svh - 64px);
}
</style>
