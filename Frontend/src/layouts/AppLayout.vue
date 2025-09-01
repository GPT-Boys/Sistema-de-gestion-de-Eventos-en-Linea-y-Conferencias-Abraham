

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/publicStores/auth.js'
import { useRouter, useRoute } from 'vue-router'

import SideNav from '@/components/SideNav.vue'
import AppBar from '@/components/HeaderApp.vue'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const collapsed = ref(localStorage.getItem('nav-collapsed') === '1')
const toggleNav = () => {
  collapsed.value = !collapsed.value
  localStorage.setItem('nav-collapsed', collapsed.value ? '1' : '0')
}

const onLogout = async () => {
  await auth.logout()
  router.push('/login')
}

const clearBodyOverflow = () => { document.body.style.overflow = '' }
onMounted(clearBodyOverflow)
onBeforeUnmount(clearBodyOverflow)
watch(() => route.fullPath, () => clearBodyOverflow())
</script>

<template>
  <div class="app-shell">
    <!-- SideNav con animación -->
    <SideNav :collapsed="collapsed" @logout="onLogout" />

    <section class="app-main">
      <AppBar @toggle-nav="toggleNav" />
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

.content {
  padding: 16px;
  background: #f7f8fc;
  flex: 1;
}
</style>
