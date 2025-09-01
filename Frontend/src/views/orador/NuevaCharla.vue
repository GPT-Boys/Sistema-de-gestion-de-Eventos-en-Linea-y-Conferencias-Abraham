<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/publicStores/auth.js'
import { useConferenciasStore } from '@/stores/app/conferencias.js'

const router = useRouter()
const auth = useAuthStore()
const store = useConferenciasStore()

const titulo = ref('')
const descripcion = ref('')
const fecha = ref('')
const horaEmpieza = ref('')
const horaTermina = ref('')
const sala = ref('')
const zoomUrl = ref('')
const idMarcaConferencia = ref('')
const idTipoConferencia = ref('')
const evaluacion = ref('')
const materialFile = ref(null)

const marcas = [
  { value: '1', label: 'Serie Académica' },
  { value: '2', label: 'Serie Empresarial' },
  { value: '3', label: 'Serie Tecnológica' }
]

const tipos = [
  { value: '1', label: 'Presencial' },
  { value: '2', label: 'Virtual' },
  { value: '3', label: 'Híbrida' }
]

const errors = ref({})

// Duración
const duracion = computed(() => {
  if (!horaEmpieza.value || !horaTermina.value) return ''
  const [h1, m1] = horaEmpieza.value.split(':').map(Number)
  const [h2, m2] = horaTermina.value.split(':').map(Number)
  const start = h1 * 60 + m1
  const end = h2 * 60 + m2
  if (end <= start) return ''
  const diff = end - start
  const horas = Math.floor(diff / 60)
  const minutos = diff % 60
  return `${horas ? horas + 'h ' : ''}${minutos ? minutos + 'min' : ''}`
})

const isValid = computed(() => {
  errors.value = {}
  if (!titulo.value.trim()) errors.value.titulo = 'El título es obligatorio'
  if (!descripcion.value.trim()) errors.value.descripcion = 'La descripción es obligatoria'
  if (!fecha.value) errors.value.fecha = 'Selecciona una fecha'
  if (!horaEmpieza.value) errors.value.horaEmpieza = 'La hora de inicio es obligatoria'
  if (!horaTermina.value) errors.value.horaTermina = 'La hora de fin es obligatoria'
  if (horaEmpieza.value && horaTermina.value && horaTermina.value <= horaEmpieza.value) {
    errors.value.horas = 'La hora de fin debe ser mayor que la de inicio'
  }
  if (!sala.value.trim()) errors.value.sala = 'La sala es obligatoria'
  if (!idMarcaConferencia.value) errors.value.idMarcaConferencia = 'Selecciona una serie'
  if (!idTipoConferencia.value) errors.value.idTipoConferencia = 'Selecciona una modalidad'
  if (!zoomUrl.value.trim()) errors.value.zoomUrl = 'El enlace Zoom es obligatorio'
  return Object.keys(errors.value).length === 0
})

async function onSubmit () {
  if (!isValid.value) return
  if (!auth.uid) { alert('No se encontró el usuario orador.'); return }

  let materialUrl = ''
  let nombreArchivo = ''
  if (materialFile.value?.files?.[0]) {
    const file = materialFile.value.files[0]
    materialUrl = await fileToBase64(file)
    nombreArchivo = file.name
  }

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
    materialUrl,
    nombreArchivo,   // 👈 para guardarlo en array materiales
    zoomUrl: zoomUrl.value,
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
      <h1>Crear nueva conferencia</h1>
      <p class="muted">Completa la información y publícala para que los asistentes puedan inscribirse.</p>
    </header>

    <form class="form" @submit.prevent="onSubmit">
      <!-- Información general -->
      <section class="card">
        <h2 class="section-title">Información general</h2>
        <div class="field">
          <label for="titulo">Título *</label>
          <input id="titulo" v-model.trim="titulo" type="text" :class="{ invalid: errors.titulo }" placeholder="Ej. IA aplicada a educación" />
          <small v-if="errors.titulo" class="err">{{ errors.titulo }}</small>
        </div>

        <div class="field">
          <label for="descripcion">Descripción *</label>
          <textarea id="descripcion" v-model.trim="descripcion" rows="3" :class="{ invalid: errors.descripcion }" placeholder="Resumen de la conferencia..."></textarea>
          <small v-if="errors.descripcion" class="err">{{ errors.descripcion }}</small>
        </div>
      </section>

      <!-- Agenda -->
      <section class="card">
        <h2 class="section-title">Agenda</h2>
        <div class="field row">
          <div>
            <label for="fecha">Fecha *</label>
            <input id="fecha" v-model="fecha" type="date" :class="{ invalid: errors.fecha }" />
            <small v-if="errors.fecha" class="err">{{ errors.fecha }}</small>
          </div>
          <div>
            <label for="horaEmpieza">Hora inicio *</label>
            <input id="horaEmpieza" v-model="horaEmpieza" type="time" :class="{ invalid: errors.horaEmpieza }" />
            <small v-if="errors.horaEmpieza" class="err">{{ errors.horaEmpieza }}</small>
          </div>
          <div>
            <label for="horaTermina">Hora fin *</label>
            <input id="horaTermina" v-model="horaTermina" type="time" :class="{ invalid: errors.horaTermina }" />
            <small v-if="errors.horaTermina" class="err">{{ errors.horaTermina }}</small>
          </div>
        </div>
        <p v-if="duracion" class="duracion">Duración: {{ duracion }}</p>
        <small v-if="errors.horas" class="err">{{ errors.horas }}</small>

        <div class="field row">
          <div>
            <label for="sala">Sala *</label>
            <input id="sala" v-model.trim="sala" type="text" placeholder="Auditorio A" :class="{ invalid: errors.sala }" />
            <small v-if="errors.sala" class="err">{{ errors.sala }}</small>
          </div>
          <div>
            <label for="marca">Serie de conferencias *</label>
            <select id="marca" v-model="idMarcaConferencia" :class="{ invalid: errors.idMarcaConferencia }">
              <option disabled value="">Selecciona una serie</option>
              <option v-for="m in marcas" :key="m.value" :value="m.value">{{ m.label }}</option>
            </select>
            <small v-if="errors.idMarcaConferencia" class="err">{{ errors.idMarcaConferencia }}</small>
          </div>
          <div>
            <label>Modalidad *</label>
            <div class="toggle-group">
              <button v-for="t in tipos" :key="t.value" type="button"
                      :class="['toggle', { active: idTipoConferencia === t.value, invalid: errors.idTipoConferencia }]"
                      @click="idTipoConferencia = t.value">
                {{ t.label }}
              </button>
            </div>
            <small v-if="errors.idTipoConferencia" class="err">{{ errors.idTipoConferencia }}</small>
          </div>
        </div>
      </section>

      <!-- Recursos -->
      <section class="card">
        <h2 class="section-title">Enlaces y recursos</h2>
        <div class="field">
          <label for="zoom">Enlace Zoom *</label>
          <div class="zoom-field">
            <input id="zoom" v-model.trim="zoomUrl" type="url" placeholder="https://zoom.us/j/..." :class="{ invalid: errors.zoomUrl }" />
            <a v-if="zoomUrl" :href="zoomUrl" target="_blank" class="btn-link">Probar</a>
          </div>
          <small v-if="errors.zoomUrl" class="err">{{ errors.zoomUrl }}</small>
        </div>

        <div class="field">
          <label for="eval">Formulario de evaluación</label>
          <input id="eval" v-model.trim="evaluacion" type="url" placeholder="https://forms.gle/..." />
        </div>

        <div class="field">
          <label>Material (opcional)</label>
          <input ref="materialFile" type="file" />
        </div>
      </section>

      <!-- Botones -->
      <div class="actions">
        <button class="btn cancel" type="button" @click="$router.back()">Cancelar</button>
        <button class="btn primary" type="submit">Guardar conferencia</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.page { background:#f9fafb; display:grid; gap:20px; padding:20px; color:#111827; }
.head h1{ margin:0; font-size:26px; font-weight:800; color:#4c1d95; }
.head p{ color:#6b7280; }

.form{ display:grid; gap:20px; }

.card{ background:#fff; border-radius:12px; padding:18px 22px; box-shadow:0 2px 6px rgba(0,0,0,0.05); }
.section-title{ font-size:20px; font-weight:700; margin-bottom:14px; color:#374151; }

.field{ display:grid; gap:6px; margin-bottom:14px; }
.field.row{ grid-template-columns: repeat(3,minmax(0,1fr)); gap:12px; }

.field input, .field textarea, .field select {
  border:1px solid #d1d5db; border-radius:8px; padding:10px 12px;
  font-size:14px; color:#111827; background:#fff; height:40px;
}
.field textarea{ height:auto; resize: vertical; }
.field input:focus, .field textarea:focus, .field select:focus {
  border-color:#7c3aed; box-shadow:0 0 0 3px rgba(124,58,237,0.25); outline:none;
}
.field input.invalid, .field textarea.invalid, .field select.invalid {
  border-color:#b91c1c;
}

.err{ color:#b91c1c; font-size:12px; }
.duracion{ font-size:13px; color:#4c1d95; font-weight:500; margin-top:-4px; }

.zoom-field{ display:flex; gap:8px; align-items:center; }
.btn-link{ font-size:13px; color:#4c1d95; font-weight:600; text-decoration:none; }
.btn-link:hover{ text-decoration:underline; }

.toggle-group{ display:flex; gap:8px; margin-top:4px; }
.toggle{ flex:1; border:1px solid #d1d5db; padding:8px 12px; border-radius:8px; background:#fff; cursor:pointer; font-size:14px; font-weight:500; }
.toggle.active{ background:#7c3aed; color:#fff; border-color:#7c3aed; }
.toggle.invalid{ border-color:#b91c1c; }

.actions{ display:flex; justify-content:flex-end; gap:10px; margin-top:10px; }
.btn{ border:1px solid #d1d5db; background:#fff; padding:10px 16px; border-radius:8px;
  cursor:pointer; font-weight:600; color:#111827;
}
.btn.cancel:hover{ background:#f3f4f6; }
.btn.primary{ background:linear-gradient(135deg,#7c3aed,#6d28d9); color:#fff; border:none;
  box-shadow:0 4px 12px rgba(124,58,237,0.35);
}
.btn.primary:hover{ filter:brightness(1.1); transform:translateY(-2px); }

@media (max-width:760px){ .field.row{ grid-template-columns: 1fr; } }
</style>
