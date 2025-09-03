@ -0,0 +1,75 @@
<template>
  <div class="auth-page">
    <!-- Header -->
    <HeaderAuth />

    <!-- Fondo decorativo -->
    <div class="bg-dots" aria-hidden="true"><span></span><span></span><span></span></div>

    <!-- Contenido -->
    <div class="viewport">
      <div class="auth-card">
        <slot />
        <footer class="mini-foot">© 2025 AbrahamEventSphere. Todos los derechos reservados.</footer>
      </div>
    </div>
  </div>
</template>

<script setup>
import HeaderAuth from '@/components/HeaderAuth.vue'
</script>

<style scoped>
.auth-page {
  min-height: 100svh;
  overflow: hidden;
  background:
    radial-gradient(900px 400px at 15% 10%, rgba(255, 255, 255, 0.06), transparent 60%),
    radial-gradient(700px 320px at 85% 85%, rgba(255, 255, 255, 0.05), transparent 60%),
    linear-gradient(135deg, #3a3b3e 0%, #111214 100%);
  position: relative;
}

.viewport {
  height: calc(100svh - var(--header-h));
  display: grid;
  place-items: center;
  padding: 12px;
}

/* Fondo decorativo */
.bg-dots span {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.08), transparent 60%);
  filter: blur(2px);
}
.bg-dots span:nth-child(1){width:280px;height:280px;top:0;left:-80px;}
.bg-dots span:nth-child(2){width:220px;height:220px;bottom:20px;right:-60px;}
.bg-dots span:nth-child(3){width:160px;height:160px;top:55%;left:72%;}

/* Card reutilizable */
.auth-card {
  width: min(960px, 94vw);
  max-height: calc(100svh - var(--header-h) - 32px);
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: auto;
  overscroll-behavior: contain;
  padding: 22px;
  color: var(--text-primary);
}

.mini-foot {
  margin-top: 16px;
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
}
</style>