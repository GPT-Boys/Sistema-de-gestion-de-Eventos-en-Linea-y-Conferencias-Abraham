<script setup>
import { ref, reactive, computed, onUnmounted } from 'vue'

const q = ref('')
const type = ref('') // '', 'pdf','image','ppt','doc','other'
const page = ref(1)
const pageSize = ref(10)
const showEdit = ref(false)
const current = reactive({ id: null, nombre: '', relacionado: '', visible: true })

let nextId = 4
const materials = ref([
  {
    id: 1,
    nombre: 'Agenda general.pdf',
    tipo: 'pdf',
    size: 245_000,
    relacionado: 'Evento',
    visible: true,
    url: null,
    uploadedAt: new Date(),
  },
  {
    id: 2,
    nombre: 'Keynote-Cloud.pptx',
    tipo: 'ppt',
    size: 3_240_000,
    relacionado: 'Keynote',
    visible: true,
    url: null,
    uploadedAt: new Date(),
  },
  {
    id: 3,
    nombre: 'logo.png',
    tipo: 'image',
    size: 56_000,
    relacionado: 'Branding',
    visible: false,
    url: null,
    uploadedAt: new Date(),
  },
])

function detectType(file) {
  const t = file.type
  if (t.includes('pdf')) return 'pdf'
  if (t.startsWith('image/')) return 'image'
  if (
    t.includes('presentation') ||
    file.name.toLowerCase().endsWith('.ppt') ||
    file.name.toLowerCase().endsWith('.pptx')
  )
    return 'ppt'
  if (t.includes('word') || /\.(doc|docx)$/i.test(file.name)) return 'doc'
  return 'other'
}
function fmtSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}
function iconFor(t) {
  switch (t) {
    case 'pdf':
      return 'bi-file-earmark-pdf-fill text-danger'
    case 'ppt':
      return 'bi-file-earmark-slides-fill text-warning'
    case 'doc':
      return 'bi-file-earmark-text-fill text-primary'
    case 'image':
      return 'bi-file-earmark-image-fill text-success'
    default:
      return 'bi-file-earmark-fill text-secondary'
  }
}

function onPickFiles(e) {
  const files = Array.from(e.target.files || [])
  files.forEach((f) => {
    const url = URL.createObjectURL(f)
    materials.value.unshift({
      id: nextId++,
      nombre: f.name,
      tipo: detectType(f),
      size: f.size,
      relacionado: '',
      visible: true,
      url,
      uploadedAt: new Date(),
    })
  })
  e.target.value = ''
}

function openEdit(m) {
  Object.assign(current, {
    id: m.id,
    nombre: m.nombre,
    relacionado: m.relacionado,
    visible: m.visible,
  })
  showEdit.value = true
}
function saveEdit() {
  const idx = materials.value.findIndex((m) => m.id === current.id)
  if (idx !== -1) {
    materials.value[idx] = {
      ...materials.value[idx],
      nombre: current.nombre.trim() || materials.value[idx].nombre,
      relacionado: current.relacionado,
      visible: current.visible,
    }
  }
  showEdit.value = false
}
function remove(m) {
  if (!confirm(`¿Eliminar "${m.nombre}"?`)) return
  if (m.url) URL.revokeObjectURL(m.url)
  materials.value = materials.value.filter((x) => x.id !== m.id)
}

onUnmounted(() => {
  materials.value.forEach((m) => {
    if (m.url) URL.revokeObjectURL(m.url)
  })
})

/** Filtros + paginación */
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase()
  return materials.value.filter((m) => {
    const okType = !type.value || m.tipo === type.value
    const okText =
      !term ||
      m.nombre.toLowerCase().includes(term) ||
      (m.relacionado || '').toLowerCase().includes(term)
    return okType && okText
  })
})
const paged = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filtered.value.slice(start, start + pageSize.value)
})
const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize.value)))
</script>

<template>
  <main id="main" tabindex="-1" class="page d-grid gap-3">
    <header class="d-flex align-items-center justify-content-between gap-2">
      <div>
        <h1 class="h4 m-0">Materiales</h1>
        <p class="text-muted m-0">
          Biblioteca de archivos (solo frontend). Los subidos aquí no persisten tras refrescar.
        </p>
      </div>
      <label class="btn btn-primary m-0" role="button">
        <i class="bi bi-upload"></i> Subir archivos
        <input type="file" class="d-none" multiple @change="onPickFiles" />
      </label>
    </header>

    <!-- Filtros -->
    <div class="card p-3">
      <div class="row g-2">
        <div class="col-md-6">
          <label class="form-label">Buscar</label>
          <input
            v-model="q"
            type="search"
            class="form-control"
            placeholder="Nombre o relacionado…"
            @input="page = 1"
          />
        </div>
        <div class="col-md-3">
          <label class="form-label">Tipo</label>
          <select v-model="type" class="form-select" @change="page = 1">
            <option value="">Todos</option>
            <option value="pdf">PDF</option>
            <option value="ppt">Presentación</option>
            <option value="doc">Documento</option>
            <option value="image">Imagen</option>
            <option value="other">Otros</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label">Tamaño página</label>
          <select v-model.number="pageSize" class="form-select">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
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
              <th>Nombre</th>
              <th class="d-none d-md-table-cell">Relacionado</th>
              <th class="text-end d-none d-md-table-cell">Tamaño</th>
              <th class="text-end" style="width: 200px">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in paged" :key="m.id">
              <td><i :class="`bi ${iconFor(m.tipo)}`"></i></td>
              <td>
                <div class="fw-semibold">
                  {{ m.nombre }}
                  <span v-if="!m.visible" class="badge bg-light text-muted ms-1">oculto</span>
                </div>
                <div class="small text-muted d-md-none">
                  {{ m.relacionado || '—' }} · {{ fmtSize(m.size) }}
                </div>
              </td>
              <td class="d-none d-md-table-cell">{{ m.relacionado || '—' }}</td>
              <td class="text-end d-none d-md-table-cell">{{ fmtSize(m.size) }}</td>
              <td class="text-end">
                <div class="btn-group">
                  <a
                    v-if="m.url"
                    class="btn btn-sm btn-outline-secondary"
                    :href="m.url"
                    :download="m.nombre"
                    title="Descargar"
                  >
                    <i class="bi bi-download"></i>
                  </a>
                  <button
                    class="btn btn-sm btn-outline-secondary"
                    @click="openEdit(m)"
                    title="Editar"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="remove(m)" title="Eliminar">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!paged.length">
              <td colspan="5" class="text-center text-muted py-4">Sin resultados</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div class="d-flex align-items-center justify-content-between p-3 border-top">
        <div class="text-muted small">
          Mostrando {{ paged.length }} de {{ filtered.length }} archivos
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

    <!-- Modal Editar -->
    <div v-if="showEdit" class="modal d-block" tabindex="-1" role="dialog" aria-modal="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Editar material</h5>
            <button
              type="button"
              class="btn-close"
              @click="showEdit = false"
              aria-label="Cerrar"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input v-model="current.nombre" type="text" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Relacionado con</label>
              <input
                v-model="current.relacionado"
                type="text"
                class="form-control"
                placeholder="Ej: Keynote, Taller A, etc."
              />
            </div>
            <div class="form-check">
              <input
                v-model="current.visible"
                id="visible"
                class="form-check-input"
                type="checkbox"
              />
              <label class="form-check-label" for="visible">Visible para asistentes</label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline-secondary" @click="showEdit = false">Cancelar</button>
            <button class="btn btn-primary" @click="saveEdit">
              <i class="bi bi-check-lg"></i> Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showEdit" class="modal-backdrop show"></div>
  </main>
</template>

<style scoped>
.page :deep(.bi) {
  font-size: 1.2rem;
}
</style>
