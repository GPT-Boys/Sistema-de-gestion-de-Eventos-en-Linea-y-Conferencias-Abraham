<template>
  <header class="header" role="banner">
    <div class="container header-inner">
      <!-- Logo -->
      <RouterLink to="/" class="brand" aria-label="AbrahamEventSphere — Inicio" @click="closeMenu">
        <picture class="logo-wrap">
          <img
            :src="logoPng"
            alt="AbrahamEventSphere"
            class="logo"
            width="320"
            height="120"
            fetchpriority="high"
            decoding="async"
            loading="eager"
            sizes="(max-width: 640px) 110px, (max-width: 900px) 140px, 180px"
          />
        </picture>
      </RouterLink>

      <!-- Botón hamburguesa (solo móvil) -->
      <button
        class="nav-toggle"
        @click="toggleMenu"
        :aria-expanded="menuOpen.toString()"
        aria-controls="mainnav"
        aria-label="Abrir menú"
      >
        ☰
      </button>

      <!-- Navegación -->
      <nav
        id="mainnav"
        class="nav"
        :class="{ 'is-open': menuOpen }"
        aria-label="Navegación principal"
      >
        <!-- Anclas solo en Home -->
        <template v-if="onHome">
          <a href="#inicio" @click="closeMenu">Inicio</a>
          <a href="#features" @click="closeMenu">Características</a>
          <a href="#about" @click="closeMenu">Acerca de</a>
        </template>

        <!-- En cualquier ruta -->
        <RouterLink to="/login" @click="closeMenu">Iniciar Sesión</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import logoPng from '@/assets/brand/Logo.png'

// (tu script actual sigue igual…)

import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const onHome = computed(() => route.path === '/')

const menuOpen = ref(false)
const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}
const closeMenu = () => {
  menuOpen.value = false
}

let io // IntersectionObserver para scroll-spy

const handleResize = () => {
  if (window.innerWidth > 900 && menuOpen.value) menuOpen.value = false
}

onMounted(() => {
  window.addEventListener('resize', handleResize)

  // Scroll-spy solo en Home (hay secciones con #id)
  if (onHome.value) {
    const sections = document.querySelectorAll('section[id]')
    const navLinks = document.querySelectorAll('.nav a[href^="#"]')

    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const id = entry.target.getAttribute('id')
          navLinks.forEach((a) => {
            a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
          })
        })
      },
      { threshold: 0.5 },
    )

    sections.forEach((s) => io.observe(s))
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (io) io.disconnect()
})
</script>

<style scoped>
/* Header igual que en landing */
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: #fff;
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.06);
}
.header-inner {
  /* usa el mismo contenedor que landing */
  height: var(--header-h, 140px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 12px;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.logo {
  height: clamp(140px, 12vw, 180px);
  max-width: none;
  width: auto;
}

/* Nav */
.nav {
  display: flex;
  gap: 26px;
}
.nav a,
.nav :deep(a) {
  font-weight: 600;
  color: #1f2937;
  position: relative;
  padding: 4px 0;
}
.nav a::after,
.nav :deep(a)::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -6px;
  width: 0;
  height: 2px;
  background: var(--purple-700, #6d28d9);
  transition: width 0.2s;
}
.nav a:hover::after,
.nav :deep(a:hover)::after {
  width: 100%;
}

/* Estado activo de scroll-spy */
.nav a.active {
  color: var(--purple-700, #6d28d9);
}
.nav a.active::after {
  width: 100%;
}

/* Toggle (solo móvil) */
.nav-toggle {
  display: none;
  font-size: 26px;
  background: none;
  border: none;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 900px) {
  .nav {
    display: none;
    flex-direction: column;
    background: #fff;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    padding: 12px;
    border-radius: 8px;
    position: absolute;
    top: var(--header-h, 140px);
    right: 10px;
  }
  .nav.is-open {
    display: flex;
  }
  .nav-toggle {
    display: block;
  }
}
</style>
