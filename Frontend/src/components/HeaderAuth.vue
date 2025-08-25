<template>
  <!-- Header de autenticación, alineado como el landing -->
  <header class="header header-auth" role="banner">
    <div class="container header-inner">
      <!-- Logo que vuelve al Home -->
      <RouterLink to="/" class="brand" aria-label="Ir al inicio">
        <img src="/Logo.png" alt="AbrahamEventSphere" class="logo" />
      </RouterLink>

      <!-- Botones de Auth (sin conflicto con Bootstrap) -->
      <nav class="nav">
        <RouterLink to="/login" class="btn-auth btn-auth-ghost">Iniciar Sesión</RouterLink>
        <RouterLink to="/register" class="btn-auth btn-auth-primary">Crear Cuenta</RouterLink>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
/* Alineación: reutiliza el mismo .container y .header-inner globales */

/* Mismo tamaño de logo que en el landing */
.header-auth .logo{
  height: clamp(140px, 12vw, 180px);
  width: auto;
  max-width: none;
}

/* Quitar el subrayado de los <a> dentro del navbar de este header */
.header-auth .nav a::after{ display:none !important; }

/* Espaciado de los botones del navbar */
.header-auth .nav{ gap: 10px; }

/* ========== Botones sin colisión con Bootstrap ========== */
.btn-auth{
  display:inline-block;
  padding:10px 16px;
  border-radius:12px;
  font-weight:700;
  text-decoration:none;
  transition: transform .18s ease, filter .18s ease, box-shadow .18s ease;
  border: none;
  cursor: pointer;
}

/* Fantasma (blanco con borde) */
.btn-auth-ghost{
  background:#fff;
  color: var(--purple-700, #6d28d9);
  border:1px solid rgba(109,40,217,.25);
}
.btn-auth-ghost:hover{
  transform: translateY(-2px);
  background: rgba(124,58,237,.06);
}

/* Principal morado (NO usa .btn-secondary para evitar Bootstrap) */
.btn-auth-primary{
  background: var(--purple-700, #6d28d9);
  color:#fff;
  border:1px solid rgba(255,255,255,.15);
}
.btn-auth-primary:hover{
  transform: translateY(-2px);
  filter: brightness(1.04);
}

/* Sombra del header (igual que landing) */
.header-auth{
  box-shadow: 0 2px 8px rgba(17,24,39,.06);
}
</style>
