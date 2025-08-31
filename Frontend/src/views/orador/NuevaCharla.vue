<!-- src/views/orador/NuevaCharla.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/publicStores/auth.js'
import { useConferenciasStore } from '@/stores/app/conferencias.js'

const router = useRouter()
const auth = useAuthStore()
const store = useConferenciasStore()

// Form
const titulo = ref('')
const descripcion = ref('')
const fecha = ref('')
const horaEmpieza = ref('')
const horaTermina = ref('')
const sala = ref('')
const zoomUrl = ref('')
const idMarcaConferencia = ref(1)
const idTipoConferencia = ref(1)
const evaluacion = ref('')        // enlace a Google Form
const materialFile = ref(null)    // archivo opcional

// Validaciones simples
const errors = ref({})
const isValid = computed(() => {
  errors.value = {}
  if (!titulo.value.trim()) errors.value.titulo = 'Requerido'
  if (!descripcion.value.trim()) errors.value.descripcion = 'Requerido'
  if (!fecha.value) errors.value.fecha = 'Requerido'
  if (!horaEmpieza.value) errors.value.horaEmpieza = 'Requerido'
  if (!horaTermina.value) errors.value.horaTermina = 'Requerido'
  if (!sala.value.trim()) errors.value.sala = 'Requerido'
  if (!zoomUrl.value.trim()) errors.value.zoomUrl = 'Requerido'
  if (horaEmpieza.value && horaTermina.value && horaTermina.value <= horaEmpieza.value) {
    errors.value.horas = 'La hora de fin debe ser mayor'
  }
  return Object.keys(errors.value).length === 0
})

async function onSubmit () {
  if (!isValid.value) return
  if (!auth.uid) {
    alert('No se encontró el usuario orador. Inicia sesión nuevamente.')
    return
  }

  // materialUrl como base64 (opcional)
  let materialUrl = ''
  if (materialFile.value?.files?.[0]) {
    const file = materialFile.value.files[0]
    materialUrl = await fileToBase64(file) // string base64
  }

  // ⬇️ usa el action que SÍ existe en el store
  store.createFromOrador({
    titulo: titulo.value,
    descripcion: descripcion.value,
    idMarcaConferencia: idMarcaConferencia.value,
    idTipoConferencia: idTipoConferencia.value,
    fecha: fecha.value,
    horaEmpieza: horaEmpieza.value,
    horaTermina: horaTermina.value,
    sala: sala.value,
    evaluacion: evaluacion.value,
    materialUrl,                // <- string (opcional)
    zoomUrl: zoomUrl.value,     // <- requerido
  }, auth.uid)

  router.push('/app/orador/mi-agenda')
}

function fileToBase64 (file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(file)
  })
}
</script>

<template>
  <div class="page">
    <header class="head">
      <h1>Crear charla</h1>
      <p class="muted">Completa la información y guarda para publicarla en Explorar (asistentes).</p>
    </header>

    <form class="grid" @submit.prevent="onSubmit" novalidate>
      <div class="field">
        <label>Título</label>
        <input v-model.trim="titulo" type="text" placeholder="Ej. IA aplicada a educación" />
        <small v-if="errors.titulo" class="err">{{ errors.titulo }}</small>
      </div>

      <div class="field">
        <label>Descripción</label>
        <textarea v-model.trim="descripcion" rows="3" placeholder="Resumen de la charla..."></textarea>
        <small v-if="errors.descripcion" class="err">{{ errors.descripcion }}</small>
      </div>

      <div class="field row">
        <div>
          <label>Fecha</label>
          <input v-model="fecha" type="date" />
          <small v-if="errors.fecha" class="err">{{ errors.fecha }}</small>
        </div>
        <div>
          <label>Hora inicio</label>
          <input v-model="horaEmpieza" type="time" />
          <small v-if="errors.horaEmpieza" class="err">{{ errors.horaEmpieza }}</small>
        </div>
        <div>
          <label>Hora fin</label>
          <input v-model="horaTermina" type="time" />
          <small v-if="errors.horaTermina" class="err">{{ errors.horaTermina }}</small>
        </div>
        <small v-if="errors.horas" class="err">{{ errors.horas }}</small>
      </div>

      <div class="field row">
        <div>
          <label>Sala</label>
          <input v-model.trim="sala" type="text" placeholder="Auditorio A" />
          <small v-if="errors.sala" class="err">{{ errors.sala }}</small>
        </div>
        <div>
          <label>Marca conferencia</label>
          <input v-model.number="idMarcaConferencia" type="number" min="1" />
        </div>
        <div>
          <label>Tipo conferencia</label>
          <input v-model.number="idTipoConferencia" type="number" min="1" />
        </div>
      </div>

      <div class="field">
        <label>Enlace Zoom</label>
        <input v-model.trim="zoomUrl" type="url" placeholder="https://zoom.us/j/..." />
        <small v-if="errors.zoomUrl" class="err">{{ errors.zoomUrl }}</small>
      </div>

      <div class="field">
        <label>Formulario de evaluación (Google Forms)</label>
        <input v-model.trim="evaluacion" type="url" placeholder="https://forms.gle/..." />
      </div>

      <div class="field">
        <label>Material (opcional)</label>
        <input ref="materialFile" type="file" />
      </div>

      <div class="actions">
        <button class="btn primary" type="submit">Guardar</button>
        <button class="btn" type="button" @click="$router.back()">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.page{ display:grid; gap:12px; }
.head h1{ margin:0; }
.muted{ color:#6b7280; }
.grid{ display:grid; gap:12px; }
.field{ display:grid; gap:6px; }
.field.row{ grid-template-columns: repeat(3, minmax(0,1fr)); gap:10px; align-items:start; }
.err{ color:#b91c1c; font-size:12px; }
.actions{ display:flex; gap:8px; }
.btn{ border:1px solid #e5e7eb; background:#fff; padding:10px 12px; border-radius:10px; cursor:pointer; }
.btn.primary{ background:linear-gradient(135deg,#7c3aed,#8b5cf6); color:#fff; border:none; }
@media (max-width: 760px){ .field.row{ grid-template-columns: 1fr; } }
</style>
