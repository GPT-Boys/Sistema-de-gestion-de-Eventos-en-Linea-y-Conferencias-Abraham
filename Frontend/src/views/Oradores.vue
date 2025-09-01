<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'

/** ===== Estado ===== */
const STORAGE_KEY = 'aes.oradores.v1'
const showModal = ref(false)
const showDelete = ref(false)
const search = ref('')
const sortKey = ref('nombre')       // nombre | score | charlas
const sortDir = ref('asc')          // asc | desc
const page = ref(1)
const pageSize = ref(8)

const blank = () => ({
  id: null,
  nombre: '',
  titulo: '',
  bio: '',
  charlas: 0,
  score: 4.5,
  tags: '' // separado por comas
})

const form = reactive(blank())
const toDelete = ref(null)

const oradores = ref([
  { id: 1, nombre: 'Fabrisio Condarco', titulo: 'Sr. Ingeniero de Software', bio: 'Apasionado por IA y arquitectura.', charlas: 3, score: 4.8, tags: 'IA,Cloud' },
  { id: 2, nombre: 'Jose Manzaneda',    titulo: 'Security Lead',            bio: 'Ciberseguridad ofensiva/defensiva.', charlas: 2, score: 4.7, tags: 'SecOps' },
  { id: 3, nombre: 'Miguel Quisbert',   titulo: 'DevRel',                    bio: 'Comunidad, DX y demos.', charlas: 4, score: 4.6, tags: 'DX,DevRel' },
  { id: 4, nombre: 'Oscar Menacho',     titulo: 'Cloud Architect',           bio: 'K8s, IaC, FinOps.', charlas: 2, score: 4.5, tags: 'Cloud,K8s' },
])

/** ===== Persistencia local (opcional) ===== */
onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) oradores.value = parsed
    }
  } catch {}
})
watch(oradores, v => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)) } catch {}
}, { deep: true })

/** ===== Computados ===== */
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return oradores.value
  return oradores.value.filter(o =>
    o.nombre.toLowerCase().includes(q) ||
    o.titulo.toLowerCase().includes(q) ||
    o.bio.toLowerCase().includes(q) ||
    (o.tags || '').toLowerCase().includes(q)
  )
})

const sorted = computed(() => {
  const list = [...filtered.value]
  const k = sortKey.value
  const d = sortDir.value === 'asc' ? 1 : -1
  list.sort((a,b) => {
    const av = (a[k] ?? '').toString().toLowerCase()
    const bv = (b[k] ?? '').toString().toLowerCase()
    if (k === 'score' || k === 'charlas') return (Number(a[k]) - Number(b[k])) * d
    if (av < bv) return -1 * d
    if (av > bv) return  1 * d
    return 0
  })
  return list
})

const total = computed(() => sorted.value.length)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return sorted.value.slice(start, start + pageSize.value)
})

watch([search, sortKey, sortDir, pageSize], () => { page.value = 1 })

/** ===== Acciones ===== */
function openCreate () {
  Object.assign(form, blank())
  showModal.value = true
}
function openEdit (row) {
  Object.assign(form, row)
  showModal.value = true
}
function validate () {
  if (!form.nombre.trim()) return 'El nombre es obligatorio'
  if (String(form.charlas).trim() === '' || Number.isNaN(Number(form.charlas)) || Number(form.charlas) < 0) return 'Charlas debe ser número ≥ 0'
  if (String(form.score).trim() === '' || Number(form.score) < 0 || Number(form.score) > 5) return 'Score debe estar entre 0 y 5'
  return null
}
function save () {
  const err = validate()
  if (err) { alert(err); return }
  if (form.id == null) {
    const maxId = oradores.value.reduce((m, o) => Math.max(m, o.id), 0)
    oradores.value.push({ ...form, id: maxId + 1 })
  } else {
    const idx = oradores.value.findIndex(o => o.id === form.id)
    if (idx !== -1) oradores.value[idx] = { ...form }
  }
  showModal.value = false
}
function askDelete (row) {
  toDelete.value = row
  showDelete.value = true
}
function confirmDelete () {
  if (!toDelete.value) return
  oradores.value = oradores.value.filter(o => o.id !== toDelete.value.id)
  showDelete.value = false
  toDelete.value = null
}
function initials (name) {
  const parts = String(name || '').trim().split(/\s+/)
  return (parts[0]?.[0] || '').toUpperCase() + (parts[1]?.[0] || '').toUpperCase()
}
</script>

<template>
  <main id="main" tabindex="-1" class="page d-grid gap-3">
    <header class="d-flex align-items-center justify-content-between gap-2">
      <div>
        <h1 class="h4 m-0">Oradores</h1>
        <p class="text-muted m-0">Gestión de oradores (solo frontend por ahora)</p>
      </div>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary" @click="() => { search=''; sortKey='nombre'; sortDir='asc' }">
          <i class="bi bi-arrow-counterclockwise"></i> Limpiar filtros
        </button>
        <button class="btn btn-primary" @click="openCreate">
          <i class="bi bi-plus-lg"></i> Nuevo orador
        </button>
      </div>
    </header>

    <!-- Filtros -->
    <div class="card p-3">
      <div class="row g-2">
        <div class="col-md-6">
          <label class="form-label">Buscar</label>
          <input v-model="search" type="search" class="form-control" placeholder="Nombre, título, tags…" />
        </div>
        <div class="col-md-3">
          <label class="form-label">Ordenar por</label>
          <select v-model="sortKey" class="form-select">
            <option value="nombre">Nombre</option>
            <option value="score">Score</option>
            <option value="charlas">Charlas</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Dirección</label>
          <select v-model="sortDir" class="form-select">
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla -->
    <div class="card">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th style="width:56px;"></th>
              <th>Nombre</th>
              <th class="d-none d-md-table-cell">Título</th>
              <th class="d-none d-lg-table-cell">Tags</th>
              <th class="text-end">Charlas</th>
              <th class="text-end">Score</th>
              <th class="text-end" style="width:140px;">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="o in paged" :key="o.id">
              <td>
                <div class="rounded-circle border d-inline-grid place-items-center" style="width:40px;height:40px;background:#ede9fe;border-color:#e9d5ff;">
                  <span class="fw-bold" style="color:#4c1d95;">{{ initials(o.nombre) }}</span>
                </div>
              </td>
              <td>
                <div class="fw-semibold">{{ o.nombre }}</div>
                <div class="text-muted small d-md-none">{{ o.titulo }}</div>
              </td>
              <td class="d-none d-md-table-cell">{{ o.titulo }}</td>
              <td class="d-none d-lg-table-cell">
                <span v-for="t in (o.tags||'').split(',').filter(Boolean)" :key="t" class="badge bg-light text-dark me-1">{{ t.trim() }}</span>
              </td>
              <td class="text-end">{{ o.charlas }}</td>
              <td class="text-end">
                <i class="bi bi-star-fill text-warning"></i>
                <span class="fw-semibold">{{ Number(o.score).toFixed(1) }}</span>
              </td>
              <td class="text-end">
                <div class="btn-group">
                  <button class="btn btn-sm btn-outline-secondary" @click="openEdit(o)">
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="askDelete(o)">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!paged.length">
              <td colspan="7" class="text-center text-muted py-4">Sin resultados</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="d-flex align-items-center justify-content-between p-3 border-top">
        <div class="text-muted small">Mostrando {{ paged.length }} de {{ total }} oradores</div>
        <div class="d-flex align-items-center gap-2">
          <select v-model.number="pageSize" class="form-select form-select-sm" style="width:90px">
            <option :value="8">8</option>
            <option :value="12">12</option>
            <option :value="20">20</option>
          </select>
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-secondary" :disabled="page<=1" @click="page--">Anterior</button>
            <button class="btn btn-sm btn-outline-secondary" :disabled="page>=totalPages" @click="page++">Siguiente</button>
          </div>
          <span class="small text-muted">Página {{ page }} / {{ totalPages }}</span>
        </div>
      </div>
    </div>

    <!-- Modal Crear/Editar -->
    <div v-if="showModal" class="modal d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ form.id == null ? 'Nuevo orador' : 'Editar orador' }}</h5>
            <button type="button" class="btn-close" @click="showModal=false" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Nombre *</label>
                <input v-model="form.nombre" type="text" class="form-control" required>
              </div>
              <div class="col-md-6">
                <label class="form-label">Título / Rol</label>
                <input v-model="form.titulo" type="text" class="form-control">
              </div>
              <div class="col-12">
                <label class="form-label">Bio</label>
                <textarea v-model="form.bio" rows="3" class="form-control" placeholder="Breve descripción"></textarea>
              </div>
              <div class="col-md-4">
                <label class="form-label">Charlas *</label>
                <input v-model.number="form.charlas" type="number" min="0" class="form-control">
              </div>
              <div class="col-md-4">
                <label class="form-label">Score (0–5) *</label>
                <input v-model.number="form.score" type="number" min="0" max="5" step="0.1" class="form-control">
              </div>
              <div class="col-md-4">
                <label class="form-label">Tags (coma)</label>
                <input v-model="form.tags" type="text" class="form-control" placeholder="IA, Cloud, SecOps">
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" @click="showModal=false">Cancelar</button>
            <button class="btn btn-primary" @click="save"><i class="bi bi-check-lg"></i> Guardar</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-backdrop show"></div>

    <!-- Modal Eliminar -->
    <div v-if="showDelete" class="modal d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger"><i class="bi bi-exclamation-triangle"></i> Eliminar orador</h5>
            <button type="button" class="btn-close" @click="showDelete=false" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <p>¿Seguro que deseas eliminar a <strong>{{ toDelete?.nombre }}</strong>?</p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" @click="showDelete=false">Cancelar</button>
            <button class="btn btn-danger" @click="confirmDelete"><i class="bi bi-trash"></i> Eliminar</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showDelete" class="modal-backdrop show"></div>
  </main>
</template>

<style scoped>
.place-items-center{place-items:center}
</style>
