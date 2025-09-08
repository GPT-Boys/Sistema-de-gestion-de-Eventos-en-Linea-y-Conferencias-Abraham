<script setup>
import { ref, computed, onMounted } from 'vue'
import { useConferenciasStore } from '@/stores/app/conferencias.js'
import { useAuthStore } from '@/stores/publicStores/auth.js'

const store = useConferenciasStore()
const auth = useAuthStore()

const q = ref('')
const uid = computed(() => auth.user?.id_usuario ?? auth.user?.id ?? null)

// Charlas del orador
const mine = computed(() => (uid.value ? store.byOrador(uid.value) : []))

// Filtrado
const filtered = computed(() => {
  const base = Array.isArray(mine.value) ? mine.value : []
  const term = q.value.trim().toLowerCase()
  if (!term) return base
  return base.filter((c) =>
    [c.titulo, c.descripcion, c.sala]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(term)),
  )
})

// Formato fecha
const fmtFecha = (d) =>
  d && !isNaN(Date.parse(d))
    ? new Date(d).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
    : d || 'Sin fecha'

// Estado de descarga
const downloadingId = ref(null)
const downloadError = ref(null)

// 🔹 Asegurar carga de datos al entrar directo (local + remoto)
onMounted(() => {
  if (!store.loaded) store._loadAll()
  store.fetchAllRemote().catch(() => {})
})

// Utilidad: descarga Blob a disco
function triggerDownload(blob, filename) {
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = filename || 'archivo'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(link.href), 2000)
}

// Detecta si es DataURL
function isDataUrl(u) {
  return typeof u === 'string' && u.startsWith('data:') && u.includes(',')
}

// Obtiene Blob desde data URL
function blobFromDataUrl(dataUrl) {
  const [meta, dataPart] = dataUrl.split(',')
  const mime = meta.match(/data:(.*?);/)?.[1] || 'application/octet-stream'
  const byteString = atob(dataPart)
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)
  for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i)
  return new Blob([ab], { type: mime })
}

// 🔹 Función unificada para descargar material (dataURL o URL remota)
async function downloadFile(m) {
  downloadError.value = null
  downloadingId.value = m.id
  try {
    if (!m?.url) throw new Error('URL vacía')
    // Caso 1: Data URL (base64 inline)
    if (isDataUrl(m.url)) {
      const blob = blobFromDataUrl(m.url)
      triggerDownload(blob, m.nombre || 'material')
      return
    }
    // Caso 2: URL directa -> intentar fetch para forzar descarga (maneja CORS si permitido)
    const res = await fetch(m.url, { credentials: 'omit' })
    if (!res.ok) {
      // Fallback: abrir en nueva pestaña
      window.open(m.url, '_blank', 'noopener')
      throw new Error('No se pudo descargar directamente, se abrió en otra pestaña.')
    }
    const ct = res.headers.get('Content-Type') || 'application/octet-stream'
    const blob = await res.blob()
    const fileName = m.nombre || m.url.split('/').pop()?.split('?')[0] || 'material'
    // Asegurar extensión básica si falta
    const finalName = /\./.test(fileName) ? fileName : fileName + (ct.includes('pdf') ? '.pdf' : '')
    triggerDownload(blob, finalName)
  } catch (e) {
    console.error('Error al descargar archivo:', e)
    downloadError.value = e.message || 'Error desconocido'
    alert('No se pudo descargar el archivo: ' + downloadError.value)
  } finally {
    downloadingId.value = null
  }
}
</script>

<template>
  <div class="page">
    <header class="head">
      <div>
        <h1>Mis materiales</h1>
        <p class="muted">Archivos que subiste al crear tus charlas.</p>
      </div>

      <div class="toolbar">
        <div class="search">
          <i class="bi bi-search"></i>
          <input
            v-model="q"
            type="search"
            placeholder="Buscar por título, descripción o sala…"
            aria-label="Buscar materiales"
          />
        </div>
      </div>
    </header>

    <div v-if="filtered.length === 0" class="empty">
      <i class="bi bi-inbox"></i>
      <p>No tienes materiales aún.</p>
    </div>

    <section v-else class="grid">
      <article v-for="c in filtered" :key="c.idConferencia" class="card">
        <header class="card-head">
          <h3 class="title">{{ c.titulo }}</h3>
          <p class="date">{{ fmtFecha(c.fecha) }} · {{ c.horaEmpieza }} – {{ c.horaTermina }}</p>
          <p class="sala"><i class="bi bi-geo"></i> {{ c.sala }}</p>
        </header>

        <p class="desc">{{ c.descripcion }}</p>

        <div v-if="c.materiales && c.materiales.length" class="files">
          <h4>Materiales</h4>
          <ul>
            <li v-for="m in c.materiales" :key="m.id">
              <i class="bi bi-file-earmark-text"></i>
              <button class="btn-link" @click="downloadFile(m)" :disabled="downloadingId === m.id">
                <span v-if="downloadingId === m.id"><i class="bi bi-arrow-repeat spin"></i> Descargando...</span>
                <span v-else>Descargar {{ m.nombre }}</span>
              </button>
            </li>
          </ul>
        </div>
        <div v-else class="no-files">
          <i class="bi bi-exclamation-circle"></i> Sin materiales subidos
        </div>
      </article>
    </section>
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
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}
.search {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 8px 10px;
  width: min(420px, 100%);
}
.search input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  color: #111827;
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
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
@media (max-width: 760px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(17, 24, 39, 0.06);
  padding: 16px;
  display: grid;
  gap: 12px;
}
.card-head {
  display: grid;
  gap: 4px;
}
.title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}
.date {
  font-size: 13px;
  color: #6b7280;
}
.sala {
  font-size: 13px;
  color: #6b7280;
}
.desc {
  font-size: 14px;
  color: #475569;
}

.files h4 {
  margin: 0 0 6px;
  font-size: 14px;
  font-weight: 700;
  color: #4c1d95;
}
.files ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
}
.files li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}
.btn-link {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font-size: 14px;
  color: #4c1d95;
  font-weight: 500;
  text-decoration: none;
}
.btn-link:hover {
  text-decoration: underline;
}
.btn-link[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
  text-decoration: none;
}
.spin { animation: spin 1s linear infinite; display: inline-block; }
@keyframes spin { to { transform: rotate(360deg); } }

.no-files {
  font-size: 13px;
  color: #64748b;
  display: flex;
  gap: 6px;
  align-items: center;
}
</style>
