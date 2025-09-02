<!-- src/views/Agenda.vue -->
<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/publicStores/auth.js'
import VoteWidget from '@/components/VoteWidget.vue'

const auth = useAuthStore()

// mock charlas
const sessions = ref([
  {
    id: 1,
    titulo: 'Apertura: IA 2025',
    sala: 'Auditorio A',
    inicio: '2025-08-30T10:30:00',
    fin: '2025-08-30T11:30:00',
    orador: 'Dra. Valdez',
    up: 12,
    down: 1,
  },
  {
    id: 2,
    titulo: 'Panel: Ciberseguridad',
    sala: 'Sala 2',
    inicio: '2025-08-30T12:00:00',
    fin: '2025-08-30T13:00:00',
    orador: 'Equipo SecOps',
    up: 9,
    down: 2,
  },
  {
    id: 3,
    titulo: 'Taller: Prompt Engineering',
    sala: 'Lab 1',
    inicio: '2025-08-31T15:00:00',
    fin: '2025-08-31T16:30:00',
    orador: 'Ing. R. Rivera',
    up: 0,
    down: 0,
  },
])

const q = ref('')
const day = ref('hoy') // hoy | mañana | todos

const now = new Date()
function isToday(d) {
  const x = new Date(d)
  return x.toDateString() === now.toDateString()
}
function isTomorrow(d) {
  const x = new Date(d)
  const t = new Date(now)
  t.setDate(t.getDate() + 1)
  return x.toDateString() === t.toDateString()
}

const filtered = computed(() => {
  return sessions.value.filter((s) => {
    const okText =
      !q.value ||
      s.titulo.toLowerCase().includes(q.value.toLowerCase()) ||
      s.orador.toLowerCase().includes(q.value.toLowerCase())
    const okDay =
      day.value === 'todos' ||
      (day.value === 'hoy' && isToday(s.inicio)) ||
      (day.value === 'mañana' && isTomorrow(s.inicio))
    return okText && okDay
  })
})

function closed(s) {
  return new Date(s.fin) < now
} // finalizada
const canVote = computed(() => auth.role === 'asistente') // solo asistentes
</script>

<template>
  <div class="page">
    <header class="head">
      <h1>Agenda</h1>
      <div class="filters">
        <input class="inp" v-model="q" placeholder="Buscar charla u orador…" />
        <select v-model="day" class="sel">
          <option value="hoy">Hoy</option>
          <option value="mañana">Mañana</option>
          <option value="todos">Todos</option>
        </select>
      </div>
    </header>

    <ul class="list">
      <li v-for="s in filtered" :key="s.id" class="row">
        <div class="meta">
          <div class="title">{{ s.titulo }}</div>
          <div class="sub">
            {{ new Date(s.inicio).toLocaleString() }} · {{ s.sala }} · {{ s.orador }}
          </div>
        </div>
        <VoteWidget
          :canVote="canVote"
          :closed="closed(s)"
          :initial="null"
          :up-count="s.up"
          :down-count="s.down"
        />
      </li>
    </ul>
  </div>
</template>

<style scoped>
.page {
  padding: 12px;
  display: grid;
  gap: 12px;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}
.filters {
  display: flex;
  gap: 8px;
}
.inp,
.sel {
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 10px;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #fff;
  border: 1px solid #eef0f4;
  border-radius: 14px;
  padding: 12px;
}
.title {
  font-weight: 800;
}
.sub {
  color: #64748b;
  font-size: 13px;
}
</style>
