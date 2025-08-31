<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConferenciasStore } from '@/stores/app/conferencias.js'
import { useAuthStore } from '@/stores/publicStores/auth.js'
import CharlaModal from '@/components/CharlaModal.vue'
import VoteWidget from '@/components/VoteWidget.vue'   // 👈 import

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
  const base = Array.isArray(baseList.value) ? baseList.value : []
  if (!term) return base
  return base.filter(c =>
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
  for (const [k, arr] of map.entries()) {
    arr.sort((a,b) => (a.horaEmpieza||'').localeCompare(b.horaEmpieza||''))
    map.set(k, arr)
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
  store.toggleEnroll(uid.value, c.idConferencia)
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
    <header class="head">
      <div>
        <h1>Mis inscripciones</h1>
        <p class="muted">Charlas a las que te suscribiste. Cambia entre próximas/en curso y tu historial.</p>
      </div>

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

    <div v-if="filtered.length===0" class="empty">
      <i class="bi bi-collection"></i>
      <p>No tienes charlas en esta categoría.</p>
    </div>

    <!-- GRID -->
    <section v-else-if="viewMode==='grid'" class="grid">
      <article v-for="c in filtered" :key="c.idConferencia" class="card" :data-status="store.statusOf(c)">
        <header class="card-head">
          <span class="status">{{ statusText(c) }}</span>
          <h3 class="title">{{ c.titulo }}</h3>
        </header>

        <p class="desc">{{ c.descripcion }}</p>

        <ul class="meta">
          <li><i class="bi bi-calendar-event"></i> {{ c.fecha }}</li>
          <li><i class="bi bi-clock"></i> {{ c.horaEmpieza }} – {{ c.horaTermina }}</li>
          <li><i class="bi bi-geo"></i> Sala: {{ c.sala }}</li>
          <li><i class="bi bi-person"></i> Orador #{{ c.idOrador }}</li>
        </ul>

        <div class="actions">
          <button class="btn" @click="show(c)"><i class="bi bi-eye"></i> Detalles</button>
          <a v-if="canJoinZoom(c)" class="btn primary" :href="c.zoomUrl" target="_blank"><i class="bi bi-camera-video"></i> Unirme</a>
          <a v-else-if="canEvaluate(c)" class="btn" :href="c.evaluacion" target="_blank"><i class="bi bi-ui-checks-grid"></i> Evaluación</a>
          <button class="btn enroll" :class="{ on:isEnrolled(c) }" @click="toggleEnroll(c)">
            <i class="bi" :class="isEnrolled(c) ? 'bi-bookmark-x' : 'bi-bookmark-plus'"></i>
            {{ isEnrolled(c) ? 'Cancelar' : 'Inscribirme' }}
          </button>
        </div>

        <!-- ✅ VoteWidget directo en la card -->
        <VoteWidget v-if="store.statusOf(c)==='finished'" :charla-id="c.idConferencia" :status="store.statusOf(c)" />
      </article>
    </section>

    <!-- AGENDA -->
    <section v-else class="timeline">
      <div v-for="group in groupedByDate" :key="group.date" class="day-group">
        <h4 class="day-title">{{ fmtFechaHead(group.date) }}</h4>
        <ul class="line">
          <li v-for="c in group.items" :key="c.idConferencia" class="slot" :data-status="store.statusOf(c)">
            <span class="dot"></span>
            <div class="slot-content">
              <div class="slot-head">
                <div class="left">
                  <div class="time">{{ c.horaEmpieza }} – {{ c.horaTermina }}</div>
                  <h3 class="title">{{ c.titulo }}</h3>
                </div>
                <div class="right">
                  <button class="btn sm" @click="show(c)"><i class="bi bi-eye"></i> Detalles</button>
                  <a v-if="canJoinZoom(c)" class="btn sm primary" :href="c.zoomUrl" target="_blank"><i class="bi bi-camera-video"></i> Zoom</a>
                  <a v-else-if="canEvaluate(c)" class="btn sm" :href="c.evaluacion" target="_blank"><i class="bi bi-ui-checks-grid"></i> Eval</a>
                </div>
              </div>
              <p class="desc">{{ c.descripcion }}</p>
              <div class="meta-row">
                <span><i class="bi bi-geo"></i> {{ c.sala }}</span>
                <span><i class="bi bi-person"></i> Orador #{{ c.idOrador }}</span>
              </div>

              <!-- ✅ VoteWidget directo en timeline -->
              <VoteWidget v-if="store.statusOf(c)==='finished'" :charla-id="c.idConferencia" :status="store.statusOf(c)" />
            </div>
          </li>
        </ul>
      </div>
    </section>

    <CharlaModal v-if="openModal && selected" v-model:open="openModal" :charla="selected" @close="closeModal" />
  </div>
</template>



<style scoped>
:root{
  --grad: linear-gradient(135deg,#7c3aed,#8b5cf6);
  --b:#e5e7eb;
  --live:#0ea5b7;
  --up:#6366f1;
  --fin:#9ca3af;
}

.page{ display:grid; gap:16px; }
.head h1{ margin:0; font-size:24px; font-weight:800; color:#4c1d95; }
.muted{ color:#6b7280; }

/* toolbar */
.toolbar{ display:flex; justify-content:space-between; flex-wrap:wrap; gap:10px; }
.tabs{ display:flex; gap:8px; }
.tab{ border:1px solid var(--b); background:#fff; padding:10px 16px; border-radius:12px; cursor:pointer; font-weight:700; }
.tab.active{ background:var(--grad); color:#fff; border:none; }

.right-tools{ display:flex; gap:10px; flex-wrap:wrap; align-items:center; }
.search{ display:flex; align-items:center; gap:6px; background:#fff; border:1px solid var(--b); border-radius:14px; padding:10px 14px; box-shadow:0 3px 6px rgba(0,0,0,.05); }
.search input{ border:none; outline:none; background:transparent; width:100%; }

.view-toggle{ display:flex; gap:6px; }
.toggle-btn{ width:42px; height:42px; border:1px solid var(--b); border-radius:12px; display:grid; place-items:center; background:#fff; cursor:pointer; }
.toggle-btn.active{ background:var(--grad); color:#fff; border:none; }

/* vacío */
.empty{ text-align:center; color:#6b7280; padding:40px; border:1px dashed var(--b); border-radius:16px; background:#fff; }

/* grid */
.grid{ display:grid; gap:18px; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); }
.card{ background:#fff; border:1px solid var(--b); border-radius:20px; box-shadow:0 10px 24px rgba(0,0,0,.05); padding:16px; display:grid; gap:12px; }
.card:hover{ transform:translateY(-2px); transition:.15s; box-shadow:0 14px 28px rgba(0,0,0,.08); }

.card-head{ display:flex; justify-content:space-between; align-items:center; }
.status{ font-size:13px; font-weight:700; padding:4px 10px; border-radius:999px; }
.status.live{ background:#ecfeff; color:#0e7490; }
.status.upcoming{ background:#eef2ff; color:#3730a3; }
.status.finished{ background:#f3f4f6; color:#334155; }

.title{ margin:0; font-size:18px; font-weight:800; }
.desc{ margin:0; color:#374151; font-size:14px; }

.meta{ list-style:none; margin:0; padding:0; display:grid; gap:4px; color:#4b5563; font-size:13px; }

/* acciones */
.actions{ display:flex; gap:10px; flex-wrap:wrap; margin-top:6px; }
.btn{ border:1px solid var(--b); background:#fff; padding:10px 14px; border-radius:12px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:6px; font-size:14px; }
.btn:hover{ background:#f9fafb; }
.btn.primary{ background:var(--grad); color:#fff; border:none; }
.btn.enroll.on{ background:#faf5ff; color:#7c3aed; border:1px solid #e9d5ff; }

/* timeline */
.timeline{ display:grid; gap:20px; }
.day-group{ background:#fff; border:1px solid var(--b); border-radius:20px; padding:16px; box-shadow:0 6px 18px rgba(0,0,0,.04); }
.day-title{ margin:0 0 10px; font-size:16px; font-weight:700; color:#1f2937; }

.line{ list-style:none; margin:0; padding:0; }
.slot{ display:flex; gap:12px; padding:12px 0; border-left:3px solid #e5e7eb; margin-left:14px; position:relative; }
.dot{ width:12px; height:12px; border-radius:50%; background:var(--up); position:absolute; left:-7px; top:18px; }
.slot[data-status="live"] .dot{ background:var(--live); }
.slot[data-status="finished"] .dot{ background:var(--fin); }
.slot-content{ flex:1; display:grid; gap:6px; }
.slot-head{ display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; }
.time{ font-weight:700; font-size:13px; color:#111827; }
</style>
