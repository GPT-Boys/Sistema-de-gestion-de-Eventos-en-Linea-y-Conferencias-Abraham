<!-- src/views/asistente/Explorar.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConferenciasStore } from '@/stores/app/conferencias.js'
import { useAuthStore } from '@/stores/publicStores/auth.js'
import CharlaModal from '@/components/CharlaModal.vue'

const store = useConferenciasStore()
const auth  = useAuthStore()

// UI state
const q = ref(localStorage.getItem('exp-q') || '')
const viewMode = ref(localStorage.getItem('exp-view') || 'grid') // 'grid' | 'agenda'
const openModal = ref(false)
const selected  = ref(null)

onMounted(() => {
  store._loadAll()
})

const uid = computed(() =>
  auth.user?.id_usuario ?? auth.user?.id ?? null
)

const filtered = computed(() => {
  const base = Array.isArray(store.ordered) ? store.ordered : []
  const term = q.value.trim().toLowerCase()
  if (!term) return base
  return base.filter(c =>
    [c.titulo, c.descripcion, c.sala]
      .filter(Boolean)
      .some(v => String(v).toLowerCase().includes(term))
  )
})

// Agrupar por fecha (para timeline)
const groupedByDate = computed(() => {
  const map = new Map()
  for (const c of filtered.value) {
    const key = c.fecha || 'Sin fecha'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(c)
  }
  // ordenar cada grupo por hora de inicio
  for (const [k, arr] of map.entries()) {
    arr.sort((a,b) => (a.horaEmpieza||'').localeCompare(b.horaEmpieza||''))
    map.set(k, arr)
  }
  // devolver array ordenado por fecha asc
  return [...map.entries()]
    .sort((a,b) => (a[0]||'').localeCompare(b[0]||''))
    .map(([date, items]) => ({ date, items }))
})

// helpers
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

const isEnrolled = (c) =>
  uid.value ? store.isEnrolled(uid.value, c.idConferencia) : false

function toggleEnroll(c) {
  if (!uid.value) {
    alert('Inicia sesión como asistente para inscribirte.')
    return
  }
  store.toggleEnroll(uid.value, c.idConferencia)
}

function show(charla) {
  selected.value = charla
  openModal.value = true
}
function closeModal() {
  openModal.value = false
}

// persistencia simple UI
function onQueryInput() {
  localStorage.setItem('exp-q', q.value)
}
function setViewMode(m) {
  viewMode.value = m
  localStorage.setItem('exp-view', m)
}

// formatos
const fmtFechaHead = (d) =>
  d && !isNaN(Date.parse(d))
    ? new Date(d).toLocaleDateString(undefined, { weekday:'long', day:'2-digit', month:'long', year:'numeric' })
    : d || 'Sin fecha'
</script>

<template>
  <div class="page">
    <header class="head">
      <div>
        <h1>Explorar charlas</h1>
        <p class="muted">Busca y suscríbete a charlas creadas por los oradores.</p>
      </div>

      <div class="toolbar">
        <div class="search">
          <i class="bi bi-search"></i>
          <input
            v-model="q"
            type="search"
            placeholder="Buscar por título, descripción o sala…"
            aria-label="Buscar charlas"
            @input="onQueryInput"
          />
        </div>

        <div class="view-toggle" role="tablist" aria-label="Cambiar vista">
          <button
            :class="['toggle-btn', { active: viewMode==='grid' }]"
            @click="setViewMode('grid')"
            role="tab"
            aria-selected="viewMode==='grid'"
            title="Vista tarjetas"
          >
            <i class="bi bi-grid-3x3-gap"></i>
          </button>
          <button
            :class="['toggle-btn', { active: viewMode==='agenda' }]"
            @click="setViewMode('agenda')"
            role="tab"
            aria-selected="viewMode==='agenda'"
            title="Vista agenda"
          >
            <i class="bi bi-calendar2-week"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Vacío -->
    <div v-if="filtered.length === 0" class="empty">
      <i class="bi bi-calendar2-x"></i>
      <p>No hay charlas para mostrar.</p>
    </div>

    <!-- ==== Vista TARJETAS ==== -->
    <section v-else-if="viewMode === 'grid'" class="grid">
      <article
        v-for="c in filtered"
        :key="c.idConferencia"
        class="card"
        :data-status="store.statusOf(c)"
      >
        <header class="card-head">
          <span class="status">
            {{ statusText(c) }}
          </span>
          <h3 class="title" :title="c.titulo">{{ c.titulo }}</h3>
        </header>

        <p class="desc">{{ c.descripcion }}</p>

        <ul class="meta">
          <li><i class="bi bi-calendar-event"></i> {{ c.fecha }}</li>
          <li><i class="bi bi-clock"></i> {{ c.horaEmpieza }} – {{ c.horaTermina }}</li>
          <li><i class="bi bi-geo"></i> Sala: {{ c.sala }}</li>
          <li><i class="bi bi-person"></i> Orador #{{ c.idOrador }}</li>
        </ul>

        <div class="actions">
          <button class="btn" @click="show(c)">
            <i class="bi bi-eye"></i> Detalles
          </button>

          <a
            v-if="canJoinZoom(c)"
            class="btn primary"
            :href="c.zoomUrl"
            target="_blank" rel="noopener"
            aria-label="Abrir reunión Zoom"
          >
            <i class="bi bi-camera-video"></i> Unirme
          </a>

          <a
            v-else-if="canEvaluate(c)"
            class="btn"
            :href="c.evaluacion"
            target="_blank" rel="noopener"
          >
            <i class="bi bi-ui-checks-grid"></i> Evaluación
          </a>

          <button
            class="btn enroll"
            :class="{ on: isEnrolled(c) }"
            @click="toggleEnroll(c)"
            :title="isEnrolled(c) ? 'Cancelar inscripción' : 'Inscribirme'"
          >
            <i class="bi" :class="isEnrolled(c) ? 'bi-bookmark-x' : 'bi-bookmark-plus'"></i>
            {{ isEnrolled(c) ? 'Inscrito' : 'Inscribirme' }}
          </button>
        </div>
      </article>
    </section>

    <!-- ==== Vista AGENDA (timeline) ==== -->
    <section v-else class="timeline">
      <div
        v-for="group in groupedByDate"
        :key="group.date"
        class="day-group"
      >
        <h4 class="day-title">{{ fmtFechaHead(group.date) }}</h4>

        <ul class="line">
          <li
            v-for="c in group.items"
            :key="c.idConferencia"
            class="slot"
            :data-status="store.statusOf(c)"
          >
            <span class="dot" :title="statusText(c)"></span>
            <div class="slot-content">
              <div class="slot-head">
                <div class="left">
                  <div class="time">{{ c.horaEmpieza }} – {{ c.horaTermina }}</div>
                  <h3 class="title">{{ c.titulo }}</h3>
                </div>
                <div class="right">
                  <button class="btn sm" @click="show(c)">
                    <i class="bi bi-eye"></i>
                    <span class="hide-sm">Detalles</span>
                  </button>
                  <a
                    v-if="canJoinZoom(c)"
                    class="btn sm primary"
                    :href="c.zoomUrl"
                    target="_blank" rel="noopener"
                  >
                    <i class="bi bi-camera-video"></i>
                    <span class="hide-sm">Unirme</span>
                  </a>
                  <a
                    v-else-if="canEvaluate(c)"
                    class="btn sm"
                    :href="c.evaluacion"
                    target="_blank" rel="noopener"
                  >
                    <i class="bi bi-ui-checks-grid"></i>
                    <span class="hide-sm">Evaluación</span>
                  </a>
                  <button
                    class="btn sm enroll"
                    :class="{ on: isEnrolled(c) }"
                    @click="toggleEnroll(c)"
                    :title="isEnrolled(c) ? 'Cancelar inscripción' : 'Inscribirme'"
                  >
                    <i class="bi" :class="isEnrolled(c) ? 'bi-bookmark-x' : 'bi-bookmark-plus'"></i>
                    <span class="hide-sm">{{ isEnrolled(c) ? 'Inscrito' : 'Inscribirme' }}</span>
                  </button>
                </div>
              </div>

              <p class="desc">{{ c.descripcion }}</p>
              <div class="meta-row">
                <span><i class="bi bi-geo"></i> Sala: {{ c.sala }}</span>
                <span><i class="bi bi-person"></i> Orador #{{ c.idOrador }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- Modal -->
    <CharlaModal v-if="openModal && selected" v-model:open="openModal" :charla="selected" />
  </div>
</template>

<style scoped>
:root{
  --ink:#0f172a;
  --muted:#64748b;
  --card:#fff;
  --b:#eef0f4;
  --ring: 0 0 0 3px rgba(124,58,237,.18);
  --live:#0ea5b7;      /* cian */
  --up:#5b6bff;        /* índigo */
  --fin:#64748b;       /* slate */
  --grad: linear-gradient(135deg, #7c3aed, #8b5cf6);
}

.page{ display:grid; gap:14px; }
.head h1{ margin:0; }
.muted{ color:var(--muted); margin-top:2px; }

/* toolbar */
.toolbar{
  display:flex; gap:10px; align-items:center; flex-wrap:wrap; justify-content:space-between;
}
.search{
  display:flex; align-items:center; gap:8px; background:#fff; border:1px solid var(--b);
  border-radius:12px; padding:8px 10px; width:min(520px, 100%);
}
.search input{ border:none; outline:none; background:transparent; width:100%; }
.view-toggle{ display:flex; gap:8px; }
.toggle-btn{
  border:1px solid var(--b); background:#fff; width:42px; height:42px; border-radius:12px; cursor:pointer;
  display:grid; place-items:center;
}
.toggle-btn.active{ background: var(--grad); color:#fff; border:none; }

/* vacío */
.empty{
  display:grid; place-items:center; gap:6px; padding:30px;
  border:1px dashed var(--b); border-radius:14px; color:var(--muted);
}
.empty i{ font-size:28px; }

/* ==== GRID CARDS ==== */
.grid{
  display:grid; gap:14px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
@media (max-width: 1200px){
  .grid{ grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media (max-width: 760px){
  .grid{ grid-template-columns: 1fr; }
}
.card{
  position:relative;
  background: var(--card);
  border:1px solid var(--b);
  border-radius:16px;
  box-shadow: 0 12px 36px rgba(17,24,39,.06);
  padding:12px; display:grid; gap:10px;
  overflow:hidden;
}
.card::before{
  content:'';
  position:absolute; inset:0 0 auto 0; height:4px;
  background: var(--up);
  opacity:.75;
}
.card[data-status="live"]::before{ background: var(--live); }
.card[data-status="finished"]::before{ background: var(--fin); }

.card:hover{ transform: translateY(-1px); transition: transform .15s ease; }

.card-head{ display:grid; gap:6px; }
.status{
  font-size:12px; font-weight:800; width:max-content; padding:3px 8px; border-radius:999px;
  background:#eef2ff; color:#3730a3;
}
.card[data-status="live"] .status{ background:#ecfeff; color:#0e7490; }
.card[data-status="finished"] .status{ background:#f1f5f9; color:#334155; }

.title{ margin:0; font-size:17px; font-weight:800; line-height:1.25; }
.desc{ margin:0; color:#475569; min-height: 40px; }

.meta{ list-style:none; padding:0; margin:0; display:grid; gap:4px; color:#334155; font-size:14px; }
.meta i{ width:18px; display:inline-block; }

.actions{
  display:flex; gap:8px; justify-content:flex-end; flex-wrap:wrap; margin-top:4px;
}
.btn{
  border:1px solid var(--b); background:#fff; padding:10px 12px;
  border-radius:10px; cursor:pointer; display:inline-flex; gap:8px; align-items:center; font-weight:700;
}
.btn:hover{ background:#f8fafc; }
.btn.primary{ background: var(--grad); color:#fff; border:none; }
.btn.enroll.on{ background:#fff; color:#7c3aed; border:1px solid #e9d5ff; }

/* ==== TIMELINE ==== */
.timeline{ display:grid; gap:18px; }
.day-group{ background:#fff; border:1px solid var(--b); border-radius:16px; padding:12px; }
.day-title{ margin:0 0 8px; font-size:15px; text-transform:capitalize; color:var(--ink); }

.line{ list-style:none; padding:0; margin:0; position:relative; }
.slot{
  display:flex; align-items:flex-start; gap:12px; padding:12px 6px;
  border-left: 3px solid #e2e8f0; margin-left:10px; position:relative;
}
.slot + .slot{ border-top:1px dashed #eef0f4; }
.dot{
  position:absolute; left:-7px; top:18px; width:12px; height:12px; border-radius:50%;
  background: var(--up);
  box-shadow: 0 0 0 3px #eef2ff;
}
.slot[data-status="live"] .dot{ background: var(--live); box-shadow: 0 0 0 3px #dff9ff; }
.slot[data-status="finished"] .dot{ background: var(--fin); box-shadow: 0 0 0 3px #e2e8f0; }

.slot-content{ flex:1; display:grid; gap:6px; }
.slot-head{
  display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap;
}
.time{ font-weight:800; color:#374151; min-width:120px; }
.slot .title{ margin:0; font-size:16px; font-weight:800; }

.meta-row{
  display:flex; gap:14px; flex-wrap:wrap; color:#334155; font-size:14px;
}
.btn.sm{ padding:8px 10px; border-radius:10px; }
.btn.sm.primary{ background: var(--grad); color:#fff; border:none; }
.hide-sm{ display:inline; }
@media (max-width: 640px){ .hide-sm{ display:none; } }
</style>
