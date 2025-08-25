<script setup>

import SideNav from './components/layout/SideNav.vue';
</script>

<template>
  <div class="app-contenedor">
    <SideNav />
    
    <main class="contenido-principal">
      <router-view />
    </main>
  </div>
</template>

<style>

body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f0f2f5;
}

.app-contenedor {
  display: flex;
}

.contenido-principal {
  flex-grow: 1; 
  padding: 2rem;
}
</style>