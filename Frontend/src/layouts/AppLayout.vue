<template>
  <div class="app-shell">
    <SideNav />
    <aside><!-- ... --></aside>
    <main id="main" tabindex="-1" class="app-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import SideNav from '@/components/SideNav.vue'
</script>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
}
.app-main {
  flex: 1;
  padding: 20px;
  background: #f5f7fb;
}
</style>
