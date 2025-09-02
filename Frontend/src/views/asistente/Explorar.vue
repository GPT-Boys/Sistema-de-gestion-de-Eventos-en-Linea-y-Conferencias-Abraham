<!-- src/views/asistente/Explorar.vue -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConferenciasStore } from '@/stores/app/conferencias.js'
import { useAuthStore } from '@/stores/publicStores/auth.js'
import CharlaModal from '@/components/CharlaModal.vue'

const store = useConferenciasStore()
const auth = useAuthStore()

// Estado UI
const q = ref(localStorage.getItem('exp-q') || '')
const tab = ref(localStorage.getItem('exp-tab') || 'activas')
const openModal = ref(false)
const selected = ref(null)

onMounted(() => store._loadAll())

const uid = computed(() => auth.user?.id_usuario ?? auth.user?.id ?? null)

// Fuente de datos
const baseList = computed(() =>
  tab.value === 'finalizadas' ? store.finishedList : store.activeList,
)

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  if (!term) return baseList.value
  return baseList.value.filter((c) =>
    [c.titulo, c.descripcion, c.sala]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(term)),
  )
})

// Helpers
const statusText = (c) => {
  const s = store.statusOf(c)
  return s === 'live' ? 'En curso' : s === 'upcoming' ? 'Próxima' : 'Finalizada'
}
const canJoinZoom = (c) => ['live', 'upcoming'].includes(store.statusOf(c)) && !!c.zoomUrl
const isEnrolled = (c) => (uid.value ? store.isEnrolled(uid.value, c.idConferencia) : false)

function toggleEnroll(c) {
  if (!uid.value) {
    alert('Inicia sesión como asistente para inscribirte.')
    return
  }
  const res = store.toggleEnroll(uid.value, c.idConferencia)
  if (!res.ok && res.reason === 'time_locked') {
    alert('Solo puedes inscribirte/cancelar antes de que la charla empiece.')
  }
}

function show(charla) {
  selected.value = charla
  openModal.value = true
}
function closeModal() {
  openModal.value = false
}
function setTab(t) {
  tab.value = t
  localStorage.setItem('exp-tab', t)
}
</script>

<template>
  <div class="container py-4">
    <!-- Header -->
    <div class="mb-4">
      <h1 class="h3 fw-bold text-primary"><i class="bi bi-search"></i> Explorar charlas</h1>
      <p class="text-muted">Busca e inscríbete en charlas activas o revisa finalizadas.</p>

      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <!-- Tabs -->
        <div class="btn-group">
          <button
            class="btn"
            :class="tab === 'activas' ? 'btn-primary' : 'btn-outline-primary'"
            @click="setTab('activas')"
          >
            Activas
          </button>
          <button
            class="btn"
            :class="tab === 'finalizadas' ? 'btn-primary' : 'btn-outline-primary'"
            @click="setTab('finalizadas')"
          >
            Finalizadas
          </button>
        </div>

        <!-- Search -->
        <div class="input-group" style="max-width: 280px">
          <span class="input-group-text"><i class="bi bi-search"></i></span>
          <input v-model="q" type="search" class="form-control" placeholder="Buscar…" />
        </div>
      </div>
    </div>

    <!-- Empty -->
    <div v-if="filtered.length === 0" class="text-center text-muted py-5">
      <i class="bi bi-calendar2-x display-6 d-block mb-2"></i>
      <p>No hay charlas en esta categoría.</p>
    </div>

    <!-- Cards -->
    <div v-else class="row g-3">
      <div v-for="c in filtered" :key="c.idConferencia" class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm border-0">
          <div class="card-body d-flex flex-column">
            <!-- Estado -->
            <span
              class="badge mb-2"
              :class="{
                'bg-success': store.statusOf(c) === 'live',
                'bg-primary': store.statusOf(c) === 'upcoming',
                'bg-secondary': store.statusOf(c) === 'finished',
              }"
            >
              {{ statusText(c) }}
            </span>

            <!-- Título -->
            <h5 class="card-title fw-bold">{{ c.titulo }}</h5>
            <p class="card-text small text-muted flex-grow-1">{{ c.descripcion }}</p>

            <!-- Meta -->
            <ul class="list-unstyled small text-secondary mb-3">
              <li><i class="bi bi-calendar-event"></i> {{ c.fecha }}</li>
              <li><i class="bi bi-clock"></i> {{ c.horaEmpieza }} – {{ c.horaTermina }}</li>
              <li><i class="bi bi-geo-alt"></i> Sala: {{ c.sala }}</li>
              <li><i class="bi bi-mic"></i> Orador #{{ c.idOrador }}</li>
            </ul>

            <!-- Acciones -->
            <div v-if="store.statusOf(c) !== 'finished'" class="d-flex flex-wrap gap-2 mt-auto">
              <button class="btn btn-outline-secondary btn-sm flex-fill" @click="show(c)">
                <i class="bi bi-eye"></i> Detalles
              </button>
              <a
                v-if="canJoinZoom(c)"
                :href="c.zoomUrl"
                target="_blank"
                class="btn btn-primary btn-sm flex-fill"
              >
                <i class="bi bi-camera-video"></i> Unirme
              </a>
              <button
                v-if="store.statusOf(c) === 'upcoming'"
                class="btn btn-outline-primary btn-sm flex-fill"
                :class="{ active: isEnrolled(c) }"
                @click="toggleEnroll(c)"
              >
                <i class="bi" :class="isEnrolled(c) ? 'bi-bookmark-x' : 'bi-bookmark-plus'"></i>
                {{ isEnrolled(c) ? 'Cancelar' : 'Inscribirme' }}
              </button>
            </div>

            <!-- Finalizadas -->
            <div v-else class="mt-auto text-muted small">
              <p class="mb-1">
                <i class="bi bi-hand-thumbs-up-fill text-success"></i> {{ c.votosAFavor }} ·
                <i class="bi bi-hand-thumbs-down-fill text-danger"></i> {{ c.votosEnContra }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal solo para activas -->
    <CharlaModal
      v-if="openModal && selected && store.statusOf(selected) !== 'finished'"
      v-model:open="openModal"
      :charla="selected"
      @close="closeModal"
    />
  </div>
</template>

<style>
:root {
  --morado-base: #6d28d9;
  --morado-oscuro: #310176;
  --morado-intermedio: #624399;
  --morado-suave: #9b85bc;
  --gris-fondo: #ebeceb;
}

/* Bootstrap overrides */
.btn-primary {
  background-color: var(--morado-base) !important;
  border-color: var(--morado-base) !important;
}
.btn-primary:hover,
.btn-primary:focus {
  background-color: var(--morado-oscuro) !important;
  border-color: var(--morado-oscuro) !important;
}
.btn-outline-primary {
  color: var(--morado-base) !important;
  border-color: var(--morado-base) !important;
}
.btn-outline-primary:hover {
  background-color: var(--morado-base) !important;
  color: #fff !important;
}
/* Botón outline activo en morado */
.btn-outline-primary.active,
.btn-outline-primary:active {
  background-color: var(--morado-base) !important;
  border-color: var(--morado-base) !important;
  color: #fff !important;
}

/* Botón primario en morado */
.btn-primary {
  background-color: white !important;
  border-color: var(--morado-base) !important;
}
.btn-primary:hover {
  background-color: var(--morado-intermedio) !important;
  border-color: var(--morado-intermedio) !important;
}

.tab {
  border: 1px solid var(--morado-suave);
  background: #fff;
  padding: 10px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  color: var(--morado-base); /* texto morado por defecto */
}

.tab.active {
  background: var(--morado-base) !important;
  color: #fff !important; /* 🔥 contraste correcto */
  border: none;
}

/* Badges */
.bg-primary {
  background-color: var(--morado-base) !important;
}
.bg-secondary {
  background-color: var(--morado-intermedio) !important;
}
.text-primary {
  color: var(--morado-base) !important;
}
</style>
