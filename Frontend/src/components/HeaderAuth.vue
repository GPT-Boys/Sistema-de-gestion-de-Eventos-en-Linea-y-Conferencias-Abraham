@ -1,97 +1,117 @@
<template>
  <!-- Header de autenticación, alineado como el landing -->
  <!-- Header de autenticación -->
  <header class="header header-auth" role="banner">
    <div class="container header-inner">
      <!-- Logo que vuelve al Home -->
      <!-- Logo -->
      <RouterLink to="/" class="brand" aria-label="Ir al inicio">
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

      <!-- Botones de Auth (sin conflicto con Bootstrap) -->
      <!-- Botones -->
      <nav class="nav">
        <RouterLink to="/login" class="btn-auth btn-auth-ghost">Iniciar Sesión</RouterLink>
        <RouterLink to="/register" class="btn-auth btn-auth-primary">Crear Cuenta</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import logoPng from '@/assets/brand/Logo.png'
import { RouterLink } from 'vue-router'
</script>

<style scoped>
/* Alineación: reutiliza el mismo .container y .header-inner globales */

/* Mismo tamaño de logo que en el landing */
/* Logo */
.header-auth .logo {
  height: clamp(140px, 12vw, 180px);
  width: auto;
  max-width: none;
}

/* Quitar el subrayado de los <a> dentro del navbar de este header */
/* Elimina la línea inferior de los links heredada del header principal */
.header-auth .nav a::after {
  display: none !important;
}

/* Espaciado de los botones del navbar */
.header-auth .nav {
  gap: 10px;
  display: flex;
  gap: 12px;
  align-items: center;
}

/* ========== Botones sin colisión con Bootstrap ========== */
/* Botones */
.btn-auth {
  display: inline-block;
  padding: 10px 16px;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    filter 0.18s ease,
    box-shadow 0.18s ease;
  border: none;
  transition: transform 0.18s ease, filter 0.18s ease, box-shadow 0.18s ease;
  cursor: pointer;
  font-size: 14px;
}

/* Fantasma (blanco con borde) */
/* Ghost */
.btn-auth-ghost {
  background: #fff;
  color: var(--purple-700, #6d28d9);
  background: var(--blanco);
  color: var(--morado-base);
  border: 1px solid rgba(109, 40, 217, 0.25);
}
.btn-auth-ghost:hover {
  transform: translateY(-2px);
  background: rgba(124, 58, 237, 0.06);
  background: var(--morado-suave);
  color: var(--blanco);
}

/* Principal morado (NO usa .btn-secondary para evitar Bootstrap) */
/* Primary */
.btn-auth-primary {
  background: var(--purple-700, #6d28d9);
  color: #fff;
  background: var(--morado-base);
  color: var(--blanco);
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.btn-auth-primary:hover {
  transform: translateY(-2px);
  filter: brightness(1.04);
  background: var(--morado-intermedio);
}

/* Dark mode */
[data-theme="dark"] .btn-auth-ghost {
  background: transparent;
  color: var(--blanco);
  border: 1px solid var(--morado-base);
}
[data-theme="dark"] .btn-auth-ghost:hover {
  background: var(--morado-base);
  color: var(--blanco);
}

/* Sombra del header (igual que landing) */
[data-theme="dark"] .btn-auth-primary {
  background: var(--morado-intermedio);
}
[data-theme="dark"] .btn-auth-primary:hover {
  background: var(--morado-base);
}

/* Header sombra */
.header-auth {
  background: var(--gris-fondo);
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.06);
}
[data-theme="dark"] .header-auth {
  background: var(--gris-fondo);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
</style>