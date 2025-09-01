<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConferenciasStore } from '@/stores/app/conferencias.js'
import { useAuthStore } from '@/stores/publicStores/auth.js'
import CharlaModal from '@/components/CharlaModal.vue'
import VoteWidget from '@/components/VoteWidget.vue'

const store = useConferenciasStore()
const auth  = useAuthStore()

const q = ref(localStorage.getItem('mi-q') || '')
const viewMode = ref(localStorage.getItem('mi-view') || 'grid')
const tab = ref(localStorage.getItem('mi-tab') || 'actual')
const openModal = ref(false)
const selected  = ref(null)

onMounted(() => {
  store._loadAll()
})

const uid = computed(() => auth.user?.id_usuario ?? auth.user?.id ?? null)

const baseList = computed(() => {
  const all = uid.value ? store.enrolledForUser(uid.value) : []
  return tab.value === 'historial'
    ? all.filter(c => store.statusOf(c) === 'finished')
    : all.filter(c => store.statusOf(c) !== 'finished')
})

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return baseList.value
  return baseList.value.filter(c =>
    [c.titulo, c.descripcion, c.sala]
      .filter(Boolean)
      .some(v => String(v).toLowerCase().includes(term))
  )
})

const groupedByDate = computed(() => {
  const map = new Map()
  for (const c of filtered.value) {
    const key = c.fecha || 'Sin fecha'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(c)
  }
  for (const arr of map.values()) {
    arr.sort((a,b) => (a.horaEmpieza||'').localeCompare(b.horaEmpieza||''))
  }
  return [...map.entries()]
    .sort((a,b) => (a[0]||'').localeCompare(b[0]||''))
    .map(([date, items]) => ({ date, items }))
})

const statusText = (c) => {
  const s = store.statusOf(c)
  return s === 'live' ? 'En curso' : s === 'upcoming' ? 'Próxima' : 'Finalizada'
}
const canJoinZoom = (c) => {
  const s = store.statusOf(c)
  return (s === 'live' || s === 'upcoming') && !!c.zoomUrl
}
const canEvaluate = (c) =>
  store.statusOf(c) === 'finished' && !!c.evaluacion

function isEnrolled(c){
  return uid.value ? store.isEnrolled(uid.value, c.idConferencia) : false
}
function toggleEnroll(c){
  if (!uid.value) return
  const res = store.toggleEnroll(uid.value, c.idConferencia)
  if (!res.ok && res.reason === 'time_locked') {
    alert('Solo puedes desinscribirte antes de que la charla empiece.')
  }
}

function show(charla){ selected.value = charla; openModal.value = true }
function closeModal(){ openModal.value = false }

function setViewMode(m){ viewMode.value = m; localStorage.setItem('mi-view', m) }
function onQueryInput(){ localStorage.setItem('mi-q', q.value) }
function setTab(t){ tab.value = t; localStorage.setItem('mi-tab', t) }

const fmtFechaHead = (d) =>
  d && !isNaN(Date.parse(d))
    ? new Date(d).toLocaleDateString(undefined,{weekday:'long', day:'2-digit', month:'long', year:'numeric'})
    : d || 'Sin fecha'
</script>

<template>
  <div class="page">
    <!-- Header -->
    <header class="page-header">
      <h1><i class="bi bi-bookmark-check"></i> Mis inscripciones</h1>

      <div class="toolbar">
        <div class="tabs">
          <button :class="['tab',{active:tab==='actual'}]" @click="setTab('actual')">
            Próximas / En curso
          </button>
          <button :class="['tab',{active:tab==='historial'}]" @click="setTab('historial')">
            Historial
          </button>
        </div>

        <div class="right-tools">
          <div class="search">
            <i class="bi bi-search"></i>
            <input v-model="q" type="search" placeholder="Buscar…" @input="onQueryInput"/>
          </div>
          <div class="view-toggle">
            <button :class="['toggle-btn',{active:viewMode==='grid'}]" @click="setViewMode('grid')">
              <i class="bi bi-grid-3x3-gap"></i>
            </button>
            <button :class="['toggle-btn',{active:viewMode==='agenda'}]" @click="setViewMode('agenda')">
              <i class="bi bi-calendar2-week"></i>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Empty -->
    <div v-if="filtered.length===0" class="empty">
      <i class="bi bi-collection"></i>
      <p>No tienes charlas en esta categoría.</p>
    </div>

    <!-- Grid -->
    <section v-else-if="viewMode==='grid'" class="grid">
      <article v-for="c in filtered" :key="c.idConferencia" class="q-card" :data-status="store.statusOf(c)">
        <header class="q-head">
          <span class="badge" :class="store.statusOf(c)">{{ statusText(c) }}</span>
          <h3>{{ c.titulo }}</h3>
        </header>

        <p class="desc">{{ c.descripcion }}</p>

        <ul class="meta">
          <li><i class="bi bi-calendar-event"></i> {{ c.fecha }}</li>
          <li><i class="bi bi-clock"></i> {{ c.horaEmpieza }} – {{ c.horaTermina }}</li>
          <li><i class="bi bi-geo"></i> Sala: {{ c.sala }}</li>
        </ul>

        <div class="actions">
          <button class="btn" @click="show(c)"><i class="bi bi-eye"></i> Detalles</button>

          <a v-if="canJoinZoom(c)" class="btn primary" :href="c.zoomUrl" target="_blank">
            <i class="bi bi-camera-video"></i> Unirme
          </a>
          <a v-else-if="canEvaluate(c)" class="btn" :href="c.evaluacion" target="_blank">
            <i class="bi bi-ui-checks-grid"></i> Evaluación
          </a>

          <button v-if="store.statusOf(c)==='upcoming'" class="btn enroll" :class="{ on:isEnrolled(c) }" @click="toggleEnroll(c)">
            <i class="bi" :class="isEnrolled(c) ? 'bi-bookmark-x' : 'bi-bookmark-plus'"></i>
            {{ isEnrolled(c) ? 'Cancelar' : 'Inscribirme' }}
          </button>
        </div>

        <VoteWidget
          v-if="isEnrolled(c) && ['live','finished'].includes(store.statusOf(c))"
          :charla-id="c.idConferencia"
          :status="store.statusOf(c)"
        />
      </article>
    </section>

    <!-- Agenda -->
    <section v-else class="timeline">
      <div v-for="group in groupedByDate" :key="group.date" class="day-group">
        <h4 class="day-title">{{ fmtFechaHead(group.date) }}</h4>
        <ul class="line">
          <li v-for="c in group.items" :key="c.idConferencia" class="slot">
            <span class="dot"></span>
            <div class="slot-content">
              <div class="slot-head">
                <div>
                  <div class="time">{{ c.horaEmpieza }} – {{ c.horaTermina }}</div>
                  <h3>{{ c.titulo }}</h3>
                </div>
                <div class="right">
                  <button class="btn sm" @click="show(c)"><i class="bi bi-eye"></i> Detalles</button>
                  <a v-if="canJoinZoom(c)" class="btn sm primary" :href="c.zoomUrl" target="_blank">
                    <i class="bi bi-camera-video"></i> Unirme
                  </a>
                  <a v-else-if="canEvaluate(c)" class="btn sm" :href="c.evaluacion" target="_blank">
                    <i class="bi bi-ui-checks-grid"></i> Evaluación
                  </a>
                </div>
              </div>
              <p class="desc">{{ c.descripcion }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <CharlaModal v-if="openModal && selected" v-model:open="openModal" :charla="selected" @close="closeModal" />
  </div>
</template>

<style scoped>
.page { display:grid; gap:20px; padding:20px; background:white; min-height:100vh; }
.page-header h1 { font-size:24px; font-weight:800; color:var(--morado-oscuro); display:flex; align-items:center; gap:8px; }

/* toolbar */
.toolbar{ display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.tabs{ display:flex; gap:8px; }
.tab{ border:1px solid var(--morado-suave); background:#fff; padding:10px 16px; border-radius:12px; cursor:pointer; font-weight:700; }
.tab.active{ background:var(--morado-base); color:#fff; border:none; }

.right-tools{ display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
.search{ display:flex; align-items:center; gap:6px; background:#fff; border:1px solid var(--morado-suave); border-radius:14px; padding:8px 12px; }
.search input{ border:none; outline:none; background:transparent; }

.view-toggle{ display:flex; gap:6px; }
.toggle-btn{ width:40px; height:40px; border:1px solid var(--morado-suave); border-radius:12px; display:grid; place-items:center; background:#fff; cursor:pointer; }
.toggle-btn.active{ background:var(--morado-base); color:#fff; border:none; }

/* Empty */
.empty{ text-align:center; color:#6b7280; padding:40px; border:1px dashed var(--morado-suave); border-radius:16px; background:#fff; }

/* Grid cards */
.q-card{ background:#fff; border:1px solid #e5e7eb; border-radius:20px; padding:16px; display:grid; gap:12px; box-shadow:0 6px 16px rgba(0,0,0,.05); }
.q-card:hover{ transform:translateY(-3px); transition:.2s; box-shadow:0 10px 20px rgba(0,0,0,.1); }
.q-head{ display:flex; justify-content:space-between; align-items:center; }
.badge{ font-size:12px; font-weight:700; padding:4px 10px; border-radius:999px; }
.badge.upcoming{ background:#eef2ff; color:#3730a3; }
.badge.live{ background:#ecfeff; color:#0e7490; }
.badge.finished{ background:#f3f4f6; color:#334155; }

/* Actions */
.actions{ display:flex; gap:8px; flex-wrap:wrap; }
.btn{ border:1px solid var(--morado-suave); background:#fff; padding:8px 12px; border-radius:12px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px; }
.btn.primary{ background:linear-gradient(135deg,var(--morado-base),var(--morado-intermedio)); color:#fff; border:none; }
.btn.enroll.on{ background:#faf5ff; color:var(--morado-base); border:1px solid #e9d5ff; }
.btn.sm{ padding:6px 10px; font-size:13px; }

/* Timeline */
.timeline{ display:grid; gap:20px; }
.day-group{ background:#fff; border:1px solid #e5e7eb; border-radius:20px; padding:16px; box-shadow:0 6px 16px rgba(0,0,0,.04); }
.day-title{ margin:0 0 10px; font-size:16px; font-weight:700; color:var(--morado-intermedio); }
.line{ list-style:none; margin:0; padding:0; }
.slot{ display:flex; gap:12px; padding:12px 0; border-left:3px solid #e5e7eb; margin-left:14px; position:relative; }
.dot{ width:12px; height:12px; border-radius:50%; background:var(--morado-base); position:absolute; left:-7px; top:18px; }
.slot-content{ flex:1; display:grid; gap:6px; }
</style>

<style>
:root {
  --morado-base: #6D28D9;
  --morado-oscuro: #310176;
  --morado-intermedio: #624399;
  --morado-suave: #9B85BC;
  --gris-fondo: #EBECEB;
}
</style>
