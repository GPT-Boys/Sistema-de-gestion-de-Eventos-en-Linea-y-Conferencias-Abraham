<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useConferenciasStore } from '@/stores/app/conferencias.js'
import { useAuthStore } from '@/stores/publicStores/auth.js'
import CharlaModal from '@/components/CharlaModal.vue'

const router = useRouter()
const store = useConferenciasStore()
const auth = useAuthStore()

const q = ref(localStorage.getItem('mc-q') || '')
const viewMode = ref(localStorage.getItem('mc-view') || 'grid')
const openModal = ref(false)
const selected = ref(null)

// filtros
const filterStatus = ref('')
const filterMarca = ref('')
const filterTipo = ref('')

onMounted(() => {
  store._loadAll()
})

const uid = computed(() => auth.user?.id_usuario ?? auth.user?.id ?? null)
const mine = computed(() => (uid.value ? store.byOrador(uid.value) : []))

// nombres para chips
const statusLabels = { upcoming: 'Próximas', live: 'En curso', finished: 'Finalizadas' }
const marcaLabels = { 1: 'Académica', 2: 'Empresarial', 3: 'Tecnológica' }
const tipoLabels = { 1: 'Presencial', 2: 'Virtual', 3: 'Híbrida' }

// Filtrado
const filtered = computed(() => {
  let base = Array.isArray(mine.value) ? mine.value : []

  const term = q.value.trim().toLowerCase()
  if (term) {
    base = base.filter((c) =>
      [c.titulo, c.descripcion, c.sala]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term)),
    )
  }

  if (filterStatus.value) {
    base = base.filter((c) => store.statusOf(c) === filterStatus.value)
  }
  if (filterMarca.value) {
    base = base.filter((c) => String(c.idMarcaConferencia) === filterMarca.value)
  }
  if (filterTipo.value) {
    base = base.filter((c) => String(c.idTipoConferencia) === filterTipo.value)
  }

  return base
})

const groupedByDate = computed(() => {
  const map = new Map()
  for (const c of filtered.value) {
    const key = c.fecha || 'Sin fecha'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(c)
  }
  for (const arr of map.values()) {
    arr.sort((a, b) => (a.horaEmpieza || '').localeCompare(b.horaEmpieza || ''))
  }
  return [...map.entries()]
    .sort((a, b) => (a[0] || '').localeCompare(b[0] || ''))
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
const canEvaluate = (c) => store.statusOf(c) === 'finished' && !!c.evaluacion

function show(charla) {
  selected.value = charla
  openModal.value = true
}
function closeModal() {
  openModal.value = false
}
function goCreate() {
  router.push({ name: 'NuevaCharla' })
}
function onQueryInput() {
  localStorage.setItem('mc-q', q.value)
}
function setViewMode(m) {
  viewMode.value = m
  localStorage.setItem('mc-view', m)
}

function clearFilter(key) {
  if (key === 'status') filterStatus.value = ''
  if (key === 'marca') filterMarca.value = ''
  if (key === 'tipo') filterTipo.value = ''
}

const fmtFechaHead = (d) =>
  d && !isNaN(Date.parse(d))
    ? new Date(d).toLocaleDateString(undefined, {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : d || 'Sin fecha'
</script>

<template>
  <div class="page">
    <header class="head">
      <div>
        <h1>Mis charlas</h1>
        <p class="muted">Creadas por ti. Puedes ver detalles, abrir Zoom y compartir evaluación.</p>
      </div>

      <div class="toolbar">
        <!-- búsqueda -->
        <div class="search">
          <i class="bi bi-search"></i>
          <input
            v-model="q"
            type="search"
            placeholder="Buscar por título, descripción o sala…"
            @input="onQueryInput"
            aria-label="Buscar charlas"
          />
        </div>

        <!-- filtros -->
        <div class="filters">
          <select v-model="filterStatus">
            <option value="">Todos los estados</option>
            <option value="upcoming">Próximas</option>
            <option value="live">En curso</option>
            <option value="finished">Finalizadas</option>
          </select>

          <select v-model="filterMarca">
            <option value="">Todas las series</option>
            <option value="1">Académica</option>
            <option value="2">Empresarial</option>
            <option value="3">Tecnológica</option>
          </select>

          <select v-model="filterTipo">
            <option value="">Todas las modalidades</option>
            <option value="1">Presencial</option>
            <option value="2">Virtual</option>
            <option value="3">Híbrida</option>
          </select>
        </div>

        <!-- acciones -->
        <div class="actions">
          <button class="btn primary" @click="goCreate">
            <i class="bi bi-plus-lg"></i> Nueva charla
          </button>
          <div class="view-toggle">
            <button
              :class="['toggle-btn', { active: viewMode === 'grid' }]"
              @click="setViewMode('grid')"
              title="Vista tarjetas"
            >
              <i class="bi bi-grid-3x3-gap"></i>
            </button>
            <button
              :class="['toggle-btn', { active: viewMode === 'agenda' }]"
              @click="setViewMode('agenda')"
              title="Vista agenda"
            >
              <i class="bi bi-calendar2-week"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 🔹 Chips de filtros activos -->
      <div class="chips" v-if="filterStatus || filterMarca || filterTipo">
        <span v-if="filterStatus" class="chip">
          {{ statusLabels[filterStatus] }} <i class="bi bi-x" @click="clearFilter('status')"></i>
        </span>
        <span v-if="filterMarca" class="chip">
          {{ marcaLabels[filterMarca] }} <i class="bi bi-x" @click="clearFilter('marca')"></i>
        </span>
        <span v-if="filterTipo" class="chip">
          {{ tipoLabels[filterTipo] }} <i class="bi bi-x" @click="clearFilter('tipo')"></i>
        </span>
      </div>
    </header>

    <div v-if="filtered.length === 0" class="empty">
      <i class="bi bi-calendar2-x"></i>
      <p>No tienes charlas en esta categoría.</p>
      <button class="btn primary" @click="goCreate">
        <i class="bi bi-plus-lg"></i> Crear charla
      </button>
    </div>

    <!-- GRID -->
    <section v-else-if="viewMode === 'grid'" class="grid">
      <article
        v-for="c in filtered"
        :key="c.idConferencia"
        class="card"
        :data-status="store.statusOf(c)"
      >
        <header class="card-head">
          <span class="status">{{ statusText(c) }}</span>
          <h3 class="title" :title="c.titulo">{{ c.titulo }}</h3>
        </header>
        <p class="desc">{{ c.descripcion }}</p>
        <ul class="meta">
          <li><i class="bi bi-calendar-event"></i> {{ fmtFechaHead(c.fecha) }}</li>
          <li><i class="bi bi-clock"></i> {{ c.horaEmpieza }} – {{ c.horaTermina }}</li>
          <li><i class="bi bi-geo"></i> Sala: {{ c.sala }}</li>
        </ul>
        <div class="actions">
          <button class="btn secondary" @click="show(c)"><i class="bi bi-eye"></i> Detalles</button>
          <a
            v-if="canJoinZoom(c)"
            class="btn primary"
            :href="c.zoomUrl"
            target="_blank"
            rel="noopener"
          >
            <i class="bi bi-camera-video"></i> Abrir Zoom
          </a>
          <a
            v-else-if="canEvaluate(c)"
            class="btn secondary"
            :href="c.evaluacion"
            target="_blank"
            rel="noopener"
          >
            <i class="bi bi-ui-checks-grid"></i> Evaluación
          </a>
        </div>
      </article>
    </section>

    <!-- AGENDA -->
    <section v-else class="timeline">
      <div v-for="group in groupedByDate" :key="group.date" class="day-group">
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
                  <button class="btn sm secondary" @click="show(c)">
                    <i class="bi bi-eye"></i> Detalles
                  </button>
                  <a
                    v-if="canJoinZoom(c)"
                    class="btn sm primary"
                    :href="c.zoomUrl"
                    target="_blank"
                    rel="noopener"
                  >
                    <i class="bi bi-camera-video"></i> Zoom
                  </a>
                  <a
                    v-else-if="canEvaluate(c)"
                    class="btn sm secondary"
                    :href="c.evaluacion"
                    target="_blank"
                    rel="noopener"
                  >
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

    <CharlaModal
      v-if="openModal && selected"
      v-model:open="openModal"
      :charla="selected"
      @close="closeModal"
    />
  </div>
</template>

<style scoped>
.page {
  background: #f8f9fc;
  display: grid;
  gap: 16px;
  padding: 10px;
  color: #111827;
}
.head h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 800;
  color: #4c1d95;
}
.muted {
  color: #6b7280;
  margin-top: 2px;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}
.search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 8px 10px;
  width: min(400px, 100%);
}
.search input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
}

.filters {
  display: flex;
  gap: 8px;
}
.filters select {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 6px 8px;
  font-size: 14px;
  background: #fff;
}

.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 8px;
}
.chip {
  background: #ede9fe;
  color: #4c1d95;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: default;
}
.chip i {
  cursor: pointer;
}

.btn {
  border: 1px solid #d1d5db;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.btn.primary {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: #fff;
  border: none;
}
.btn.secondary {
  background: #f3f4f6;
  color: #374151;
}
.btn.sm {
  padding: 6px 10px;
  font-size: 13px;
}

.view-toggle {
  display: flex;
  gap: 6px;
}
.toggle-btn {
  border: 1px solid #d1d5db;
  background: #fff;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  display: grid;
  place-items: center;
}
.toggle-btn.active {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: #fff;
  border: none;
}

.empty {
  display: grid;
  place-items: center;
  gap: 10px;
  padding: 30px;
  border: 1px dashed #e5e7eb;
  border-radius: 14px;
  color: #6b7280;
}

.grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
@media (max-width: 1200px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 760px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  padding: 16px;
  display: grid;
  gap: 10px;
}
.card-head {
  display: grid;
  gap: 4px;
}
.status {
  font-size: 12px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 999px;
  background: #f3f4f6;
  color: #374151;
}
.card[data-status='live'] .status {
  background: #ecfeff;
  color: #0e7490;
}
.card[data-status='finished'] .status {
  background: #f1f5f9;
  color: #334155;
}

.title {
  font-size: 17px;
  font-weight: 700;
  margin: 0;
}
.desc {
  font-size: 14px;
  color: #475569;
}

.meta {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 4px;
  font-size: 13px;
  color: #374151;
}

.timeline {
  display: grid;
  gap: 16px;
}
.day-group {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
}
.day-title {
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 700;
  color: #4c1d95;
}
.line {
  list-style: none;
  padding: 0;
  margin: 0;
}
.slot {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  border-left: 3px solid #e2e8f0;
  margin-left: 12px;
  position: relative;
}
.slot + .slot {
  border-top: 1px dashed #f1f1f1;
}
.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #5b6bff;
  position: absolute;
  left: -7px;
  top: 16px;
}
.slot[data-status='live'] .dot {
  background: #0e7490;
}
.slot[data-status='finished'] .dot {
  background: #64748b;
}
.slot-content {
  flex: 1;
  display: grid;
  gap: 4px;
}
</style>
