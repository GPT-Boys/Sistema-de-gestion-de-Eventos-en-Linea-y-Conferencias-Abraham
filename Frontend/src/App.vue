<script setup>
import NavBar from './components/NavBar.vue'
import { RouterView } from 'vue-router'
import Footer from './components/FooterComponent.vue'
</script>

<template>
  <NavBar />
  <RouterView />
  <Footer />
</template>

<style scoped></style>
