<template>
  <div>
    <a class="skip-link" href="#main">Saltar al contenido</a>
    <HeaderPublic />
    <main id="main" tabindex="-1">
      <router-view />
    </main>
    <!-- tu footer público aquí -->
  </div>
</template>

<script setup>
import HeaderPublic from '@/components/HeaderPublic.vue'
</script>

<style scoped>
/* Si alguna vista pública NECESITA compensar el header, hágalo en su propia vista.
   Aquí no agregamos padding-top global para no duplicar espacios. */
</style>
