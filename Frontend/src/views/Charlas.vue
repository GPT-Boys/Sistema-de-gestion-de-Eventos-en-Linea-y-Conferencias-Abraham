<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

const STORAGE_KEY = 'aes.sesiones.v1'
const sesiones = ref([])
onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) sesiones.value = JSON.parse(raw)
  } catch {}
})
watch(
  sesiones,
  (v) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
    } catch {}
  },
  { deep: true },
)

/** ===== Filtros/orden/paginación ===== */
const q = ref('')
const sala = ref('')
const track = ref('')
const estado = ref('')
const rango = reactive({ desde: '', hasta: '' })
const sortKey = ref('fecha') // fecha | titulo | sala
const sortDir = ref('asc')
const page = ref(1)
const pageSize = ref(8)

const salas = computed(() => [...new Set(sesiones.value.map((s) => s.sala).filter(Boolean))])
const tracks = computed(() => [...new Set(sesiones.value.map((s) => s.track).filter(Boolean))])
const estados = ['Programada', 'En curso', 'Finalizada']

const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  return sesiones.value.filter((s) => {
    const okText =
      !term ||
      [s.titulo, s.orador, s.sala, s.track].some((v) =>
        String(v || '')
          .toLowerCase()
          .includes(term),
      )
    const okSala = !sala.value || s.sala === sala.value
    const okTrack = !track.value || s.track === track.value
    const okEstado = !estado.value || s.estado === estado.value
    const okDesde = !rango.desde || s.fecha >= rango.desde
    const okHasta = !rango.hasta || s.fecha <= rango.hasta
    return okText && okSala && okTrack && okEstado && okDesde && okHasta
  })
})

const sorted = computed(() => {
  const list = [...filtered.value]
  const k = sortKey.value
  const d = sortDir.value === 'asc' ? 1 : -1
  list.sort((a, b) => {
    const A = k === 'fecha' ? `${a.fecha} ${a.inicio}` : String(a[k] || '').toLowerCase()
    const B = k === 'fecha' ? `${b.fecha} ${b.inicio}` : String(b[k] || '').toLowerCase()
    if (A < B) return -1 * d
    if (A > B) return 1 * d
    return 0
  })
  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(sorted.value.length / pageSize.value)))
const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sorted.value.slice(start, start + pageSize.value)
})
watch(
  [q, sala, track, estado, () => rango.desde, () => rango.hasta, sortKey, sortDir, pageSize],
  () => {
    page.value = 1
  },
)

/** ===== Crear/editar ===== */
const showModal = ref(false)
const form = reactive({
  id: null,
  titulo: '',
  orador: '',
  sala: '',
  track: '',
  descripcion: '',
  fecha: '',
  inicio: '10:00',
  fin: '11:00',
  cupo: 100,
  inscritos: 0,
  estado: 'Programada',
  destacado: false,
})
const showDelete = ref(false)
const toDelete = ref(null)

function openCreate() {
  Object.assign(form, {
    id: null,
    titulo: '',
    orador: '',
    sala: '',
    track: '',
    descripcion: '',
    fecha: new Date().toISOString().slice(0, 10),
    inicio: '10:00',
    fin: '11:00',
    cupo: 100,
    inscritos: 0,
    estado: 'Programada',
    destacado: false,
  })
  showModal.value = true
}
function openEdit(s) {
  Object.assign(form, s)
  showModal.value = true
}
function validate() {
  if (!form.titulo.trim()) return 'Título obligatorio'
  if (!form.orador.trim()) return 'Orador obligatorio'
  if (!form.sala.trim()) return 'Sala obligatoria'
  if (form.fin <= form.inicio) return 'Fin debe ser mayor que inicio'
  if (Number(form.cupo) < 1) return 'Cupo inválido'
  if (Number(form.inscritos) < 0) return 'Inscritos inválido'
  return null
}
function save() {
  const err = validate()
  if (err) {
    alert(err)
    return
  }
  if (form.id == null) {
    const maxId = sesiones.value.reduce((m, s) => Math.max(m, s.id), 0)
    sesiones.value.push({ ...form, id: maxId + 1 })
  } else {
    const i = sesiones.value.findIndex((s) => s.id === form.id)
    if (i !== -1) sesiones.value[i] = { ...form }
  }
  showModal.value = false
}
function askDelete(s) {
  toDelete.value = s
  showDelete.value = true
}
function confirmDelete() {
  sesiones.value = sesiones.value.filter((s) => s.id !== toDelete.value.id)
  showDelete.value = false
  toDelete.value = null
}
function toggleStar(s) {
  const i = sesiones.value.findIndex((x) => x.id === s.id)
  if (i !== -1)
    sesiones.value[i] = { ...sesiones.value[i], destacado: !sesiones.value[i].destacado }
}
function occupancy(s) {
  const c = Number(s.cupo) || 0,
    ins = Number(s.inscritos) || 0
  if (c <= 0) return '—'
  const pct = Math.min(100, Math.round((ins / c) * 100))
  return `${ins}/${c} (${pct}%)`
}
</script>

<template>
  <main id="main" tabindex="-1" class="d-grid gap-3">
    <header class="d-flex align-items-center justify-content-between gap-2">
      <div>
        <h1 class="h4 m-0">Charlas</h1>
        <p class="text-muted m-0">Listado y filtros (solo frontend)</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">
        <i class="bi bi-plus-lg"></i> Nueva charla
      </button>
    </header>

    <!-- Filtros -->
    <div class="card p-3">
      <div class="row g-2">
        <div class="col-lg-4">
          <label class="form-label">Buscar</label>
          <input
            v-model="q"
            type="search"
            class="form-control"
            placeholder="Título, orador, sala, track…"
          />
        </div>
        <div class="col-sm-6 col-lg-2">
          <label class="form-label">Sala</label>
          <select v-model="sala" class="form-select">
            <option value="">Todas</option>
            <option v-for="s in salas" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
        <div class="col-sm-6 col-lg-2">
          <label class="form-label">Track</label>
          <select v-model="track" class="form-select">
            <option value="">Todos</option>
            <option v-for="t in tracks" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
        <div class="col-sm-6 col-lg-2">
          <label class="form-label">Estado</label>
          <select v-model="estado" class="form-select">
            <option value="">Todos</option>
            <option v-for="e in estados" :key="e" :value="e">{{ e }}</option>
          </select>
        </div>
        <div class="col-sm-6 col-lg-2">
          <label class="form-label">Orden</label>
          <div class="input-group">
            <select v-model="sortKey" class="form-select">
              <option value="fecha">Fecha/Hora</option>
              <option value="titulo">Título</option>
              <option value="sala">Sala</option>
            </select>
            <button
              class="btn btn-outline-secondary"
              @click="sortDir = sortDir === 'asc' ? 'desc' : 'asc'"
            >
              <i :class="`bi ${sortDir === 'asc' ? 'bi-sort-down' : 'bi-sort-up'}`"></i>
            </button>
          </div>
        </div>
        <div class="col-sm-6 col-lg-2">
          <label class="form-label">Desde</label>
          <input v-model="rango.desde" type="date" class="form-control" />
        </div>
        <div class="col-sm-6 col-lg-2">
          <label class="form-label">Hasta</label>
          <input v-model="rango.hasta" type="date" class="form-control" />
        </div>
        <div class="col-sm-6 col-lg-2">
          <label class="form-label">Tamaño pág.</label>
          <select v-model.number="pageSize" class="form-select">
            <option :value="8">8</option>
            <option :value="12">12</option>
            <option :value="20">20</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Lista -->
    <div class="card">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th style="width: 36px"></th>
              <th>Título</th>
              <th class="d-none d-md-table-cell">Orador</th>
              <th class="d-none d-lg-table-cell">Track</th>
              <th>Fecha</th>
              <th class="text-end d-none d-md-table-cell">Sala</th>
              <th class="text-end">Cupo</th>
              <th class="text-end" style="width: 150px">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in paged" :key="s.id">
              <td>
                <button
                  class="btn btn-sm btn-link p-0"
                  :title="s.destacado ? 'Quitar destacado' : 'Marcar destacado'"
                  @click="toggleStar(s)"
                >
                  <i :class="`bi ${s.destacado ? 'bi-star-fill text-warning' : 'bi-star'}`"></i>
                </button>
              </td>
              <td>
                <div class="fw-semibold">{{ s.titulo }}</div>
                <div class="small text-muted d-md-none">{{ s.orador }} · {{ s.sala }}</div>
                <span class="badge bg-light text-dark">{{ s.estado }}</span>
              </td>
              <td class="d-none d-md-table-cell">{{ s.orador }}</td>
              <td class="d-none d-lg-table-cell">{{ s.track || '—' }}</td>
              <td>
                {{ s.fecha }} <span class="text-muted small">{{ s.inicio }}–{{ s.fin }}</span>
              </td>
              <td class="text-end d-none d-md-table-cell">{{ s.sala }}</td>
              <td class="text-end">{{ occupancy(s) }}</td>
              <td class="text-end">
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-secondary" @click="openEdit(s)">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="askDelete(s)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!paged.length">
              <td colspan="8" class="text-center text-muted py-4">Sin resultados</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="d-flex align-items-center justify-content-between p-3 border-top">
        <div class="text-muted small">
          Mostrando {{ paged.length }} de {{ sorted.length }} charlas
        </div>
        <div class="d-flex align-items-center gap-2">
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-secondary" :disabled="page <= 1" @click="page--">
              Anterior
            </button>
            <button
              class="btn btn-sm btn-outline-secondary"
              :disabled="page >= totalPages"
              @click="page++"
            >
              Siguiente
            </button>
          </div>
          <span class="small text-muted">Página {{ page }} / {{ totalPages }}</span>
        </div>
      </div>
    </div>

    <!-- Modal crear/editar -->
    <div v-if="showModal" class="modal d-block" tabindex="-1" aria-modal="true" role="dialog">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ form.id == null ? 'Nueva charla' : 'Editar charla' }}</h5>
            <button class="btn-close" @click="showModal = false" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-8">
                <label class="form-label">Título *</label>
                <input v-model="form.titulo" type="text" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Orador *</label>
                <input v-model="form.orador" type="text" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Fecha *</label>
                <input v-model="form.fecha" type="date" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Inicio *</label>
                <input v-model="form.inicio" type="time" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Fin *</label>
                <input v-model="form.fin" type="time" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Sala *</label>
                <input v-model="form.sala" type="text" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Track</label>
                <input v-model="form.track" type="text" class="form-control" />
              </div>
              <div class="col-md-4">
                <label class="form-label">Estado</label>
                <select v-model="form.estado" class="form-select">
                  <option>Programada</option>
                  <option>En curso</option>
                  <option>Finalizada</option>
                </select>
              </div>
              <div class="col-md-3">
                <label class="form-label">Cupo</label>
                <input v-model.number="form.cupo" type="number" min="1" class="form-control" />
              </div>
              <div class="col-md-3">
                <label class="form-label">Inscritos</label>
                <input v-model.number="form.inscritos" type="number" min="0" class="form-control" />
              </div>
              <div class="col-12">
                <label class="form-label">Descripción</label>
                <textarea v-model="form.descripcion" rows="3" class="form-control"></textarea>
              </div>
              <div class="col-12 form-check">
                <input
                  id="dest"
                  v-model="form.destacado"
                  class="form-check-input"
                  type="checkbox"
                />
                <label for="dest" class="form-check-label">Destacado</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" @click="showModal = false">Cancelar</button>
            <button class="btn btn-primary" @click="save">
              <i class="bi bi-check-lg"></i> Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-backdrop show"></div>

    <!-- Modal borrar -->
    <div v-if="showDelete" class="modal d-block" tabindex="-1" aria-modal="true" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger">
              <i class="bi bi-exclamation-triangle"></i> Eliminar charla
            </h5>
            <button class="btn-close" @click="showDelete = false" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            ¿Eliminar <strong>{{ toDelete?.titulo }}</strong> del {{ toDelete?.fecha }}?
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" @click="showDelete = false">Cancelar</button>
            <button class="btn btn-danger" @click="confirmDelete">
              <i class="bi bi-trash"></i> Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDelete" class="modal-backdrop show"></div>
  </main>
</template>
