<!-- src/views/Dashboard.vue -->
<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <h1><i class="bi bi-speedometer2"></i> Menú Rápido</h1>
    </header>

    <!-- Accesos rápidos dinámicos -->
    <section class="quick-actions">
      <router-link
        v-for="(it, idx) in quickItems"
        :key="idx"
        :to="it.to"
        class="q-card"
      >
        <i :class="`bi ${it.icon}`"></i>
        <span>{{ it.label }}</span>
      </router-link>
    </section>

    <!-- Métricas dinámicas -->
    <section class="metrics" v-if="metrics.length">
      <div
        v-for="(m, idx) in metrics"
        :key="idx"
        class="metric-card"
      >
        <i :class="`bi ${m.icon}`"></i>
        <div>
          <h2>{{ m.value }}</h2>
          <p>{{ m.label }}</p>
        </div>
      </div>
    </section>

    <!-- Próximas conferencias (solo asistente y orador) -->
    <section class="upcoming" v-if="['asistente','orador'].includes(auth.role)">
      <h3><i class="bi bi-clock-history"></i> Próximas conferencias</h3>
      <ul>
        <li v-for="c in upcomingList" :key="c.idConferencia">
          <strong>{{ c.titulo }}</strong> · {{ c.horaEmpieza }} · {{ c.sala }}
        </li>
      </ul>
      <p v-if="upcomingList.length === 0" class="empty">No tienes charlas próximas.</p>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/publicStores/auth.js'
import { useConferenciasStore } from '@/stores/app/conferencias.js'
import { DASHBOARD_ITEMS } from '@/nav/dashboard.js'

const auth = useAuthStore()
const conf = useConferenciasStore()

// Accesos rápidos según rol
const quickItems = computed(() =>
  DASHBOARD_ITEMS.filter(it => !it.roles || (auth.role && it.roles.includes(auth.role)))
)

// Métricas según rol
const metrics = computed(() => {
  const uid = auth.user?.id_usuario ?? auth.user?.id
  switch (auth.role) {
    case 'admin':
    case 'staff':
      return [
        { icon: 'bi-calendar-event', value: conf.activeList.length, label: 'Eventos activos' },
        { icon: 'bi-chat-dots', value: conf.list.length, label: 'Total de charlas' },
        { icon: 'bi-people', value: totalAsistentes(), label: 'Inscripciones registradas' },
        { icon: 'bi-emoji-smile', value: avgNps() + '%', label: 'Satisfacción (NPS)' }
      ]
    case 'orador': {
      const mias = conf.byOrador(uid)
      return [
        { icon: 'bi-mic', value: mias.length, label: 'Charlas creadas' },
        { icon: 'bi-calendar-check', value: mias.filter(c => conf.statusOf(c) === 'upcoming').length, label: 'Charlas próximas' },
        { icon: 'bi-hand-thumbs-up', value: mias.reduce((acc, c) => acc + (c.votosAFavor || 0), 0), label: 'Votos positivos' }
      ]
    }
    case 'asistente': {
      const mias = conf.enrolledForUser(uid)
      return [
        { icon: 'bi-bookmark-check', value: mias.filter(c => conf.statusOf(c) !== 'finished').length, label: 'Inscripciones activas' },
        { icon: 'bi-clock-history', value: mias.filter(c => conf.statusOf(c) === 'finished').length, label: 'Charlas asistidas' },
        { icon: 'bi-hand-thumbs-up', value: votosEmitidos(uid), label: 'Votos emitidos' }
      ]
    }
    default:
      return []
  }
})

// Próximas charlas (para asistente u orador)
const upcomingList = computed(() => {
  const uid = auth.user?.id_usuario ?? auth.user?.id
  if (auth.role === 'asistente') {
    return conf.enrolledForUser(uid).filter(c => conf.statusOf(c) === 'upcoming')
  }
  if (auth.role === 'orador') {
    return conf.byOrador(uid).filter(c => conf.statusOf(c) === 'upcoming')
  }
  return []
})

// Helpers
function totalAsistentes() {
  let total = 0
  conf.list.forEach(c => {
    for (let k in localStorage) {
      if (k.startsWith('conf:enrolled:')) {
        const arr = JSON.parse(localStorage.getItem(k) || '[]')
        if (arr.includes(String(c.idConferencia))) total++
      }
    }
  })
  return total
}
function votosEmitidos(uid) {
  const raw = localStorage.getItem(`conf:votes:${uid}`)
  if (!raw) return 0
  return Object.keys(JSON.parse(raw)).length
}
function avgNps() {
  const total = conf.list.reduce((a, c) => a + (c.votosAFavor || 0) + (c.votosEnContra || 0), 0)
  const up = conf.list.reduce((a, c) => a + (c.votosAFavor || 0), 0)
  return total > 0 ? Math.round((up / total) * 100) : 0
}
</script>

<style scoped>
.dashboard {
  padding: 24px;
  background: rgb(255, 255, 255);
  min-height: 100vh;
  display: grid;
  gap: 24px;
}

/* Header */
.dashboard-header h1 {
  font-size: 26px;
  font-weight: 800;
  color: var(--morado-base);
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Quick actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(180px,1fr));
  gap: 16px;
}
.q-card {
  background: var(--blanco);
  border-radius: 14px;
  padding: 20px;
  text-align: center;
  font-weight: 600;
  color: var(--morado-intermedio);
  box-shadow: 0 3px 8px rgba(0,0,0,0.08);
  transition: transform 0.2s ease, background 0.3s ease, color 0.3s ease;
}
.q-card i {
  font-size: 26px;
  margin-bottom: 6px;
  display: block;
}
.q-card:hover {
  transform: translateY(-4px);
  background: linear-gradient(135deg, var(--morado-suave), var(--morado-base));
  color: var(--blanco);
}

/* Metrics */
.metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit,minmax(220px,1fr));
  gap: 16px;
}
.metric-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: var(--blanco);
  padding: 18px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  transition: transform 0.2s ease;
}
.metric-card i {
  font-size: 28px;
  color: var(--morado-base);
}
.metric-card h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  color: var(--morado-oscuro);
}
.metric-card p {
  margin: 0;
  color: #555;
  font-size: 14px;
}
.metric-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.12);
}

/* Upcoming */
.upcoming {
  background: var(--blanco);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
}
.upcoming h3 {
  margin: 0 0 10px;
  font-size: 18px;
  font-weight: 700;
  color: var(--morado-intermedio);
  display: flex;
  align-items: center;
  gap: 6px;
}
.upcoming ul {
  margin: 0;
  padding: 0 0 0 20px;
  list-style: disc;
  color: #333;
}
.upcoming li {
  margin-bottom: 6px;
}
.empty {
  font-size: 14px;
  color: #ffffff;
}
</style>

<style>
:root {
  --morado-base: #6D28D9;
  --morado-oscuro: #310176;
  --morado-intermedio: #624399;
  --morado-suave: #9B85BC;
  --gris-fondo: #ffffff;
  --blanco: #ffffff;
  --negro: #000000;
}
</style>
