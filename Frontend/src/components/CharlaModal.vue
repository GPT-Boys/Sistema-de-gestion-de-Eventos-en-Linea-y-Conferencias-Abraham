<!-- src/components/CharlaModal.vue -->
<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  open:   { type: Boolean, default: false },
  charla: { type: Object,  default: null },
})
const emit = defineEmits(['close', 'update:open'])

const dialogRef = ref(null)
const snack = ref('') // micro-notificación (copiado, etc.)

// --- helpers ---
const toDate = (d, t = '00:00') => new Date(`${d}T${t}:00`)
const fmtFecha = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { weekday:'short', day:'2-digit', month:'short', year:'numeric' }) : ''
const fmtHora = (t) => t || ''

const status = computed(() => {
  if (!props.charla) return 'upcoming'
  const now = new Date()
  const s = toDate(props.charla.fecha, props.charla.horaEmpieza)
  const e = toDate(props.charla.fecha, props.charla.horaTermina)
  if (now < s) return 'upcoming'
  if (now > e) return 'finished'
  return 'live'
})
const canJoinZoom = computed(() => status.value === 'live' || status.value === 'upcoming')
const canEvaluate = computed(() => status.value === 'finished' && !!props.charla?.evaluacion)
const hasMaterial = computed(() => !!props.charla?.materialUrl)

// --- open/close ---
function close () {
  emit('update:open', false)
  emit('close')
}

// backdrop click
function onBackdropClick(e) {
  if (e.target === e.currentTarget) close()
}

// Esc + focus trap
function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }
  if (e.key !== 'Tab') return

  // Focus trap muy simple
  const root = dialogRef.value
  if (!root) return
  const focusables = root.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  )
  if (!focusables.length) return
  const first = focusables[0]
  const last  = focusables[focusables.length - 1]
  const active = document.activeElement

  if (e.shiftKey && active === first) {
    e.preventDefault(); last.focus(); return
  }
  if (!e.shiftKey && active === last) {
    e.preventDefault(); first.focus(); return
  }
}

// Lock scroll y enfocar primer elemento
watch(() => props.open, async (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
  if (v) {
    await nextTick()
    // enfoca el título o primer botón
    const h = dialogRef.value?.querySelector('.modal-title')
    if (h) h.focus({ preventScroll: true })
  }
})

// snack (autocierre)
function toast(msg) {
  snack.value = msg
  setTimeout(() => { snack.value = '' }, 1800)
}

// copiar link zoom
async function copyZoom() {
  try {
    await navigator.clipboard.writeText(props.charla?.zoomUrl || '')
    toast('Enlace de Zoom copiado')
  } catch {
    toast('No se pudo copiar')
  }
}

onMounted(() => {
  // si el modal ya viene abierto
  if (props.open) document.body.style.overflow = 'hidden'
})
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open && charla"
        class="aes-modal"
        role="dialog"
        aria-modal="true"
        @click="onBackdropClick"
        @keydown="onKeydown"
      >
        <Transition name="pop">
          <div class="aes-modal__dialog" role="document" ref="dialogRef">
            <!-- Header -->
            <header class="aes-modal__head">
              <div class="title-wrap">
                <h3
                  class="modal-title"
                  tabindex="0"
                >
                  {{ charla.titulo }}
                </h3>
                <span class="badge" :class="status">
                  {{ status === 'live' ? 'En curso' : status === 'upcoming' ? 'Próxima' : 'Finalizada' }}
                </span>
              </div>

              <button class="icon-btn" @click="close" aria-label="Cerrar">
                <i class="bi bi-x-lg"></i>
              </button>
            </header>

            <!-- Body -->
            <section class="aes-modal__body">
              <p class="desc">{{ charla.descripcion }}</p>

              <ul class="meta">
                <li>
                  <i class="bi bi-calendar-event"></i>
                  <span>{{ fmtFecha(charla.fecha) }}</span>
                </li>
                <li>
                  <i class="bi bi-clock"></i>
                  <span>{{ fmtHora(charla.horaEmpieza) }} – {{ fmtHora(charla.horaTermina) }}</span>
                </li>
                <li>
                  <i class="bi bi-geo"></i>
                  <span>Sala: {{ charla.sala }}</span>
                </li>
                <li>
                  <i class="bi bi-person"></i>
                  <span>Orador #{{ charla.idOrador }}</span>
                </li>
                <li v-if="typeof charla.votosAFavor === 'number' && typeof charla.votosEnContra === 'number'">
                  <i class="bi bi-hand-thumbs-up"></i>
                  <span>Valoración: {{ charla.votosAFavor }} 👍 · {{ charla.votosEnContra }} 👎</span>
                </li>
              </ul>

              <div class="cta">
                <div class="cta-left">
                  <a
                    v-if="charla.zoomUrl && canJoinZoom"
                    class="btn primary"
                    :href="charla.zoomUrl"
                    target="_blank" rel="noopener"
                    aria-label="Abrir reunión en Zoom"
                  >
                    <i class="bi bi-camera-video"></i> Unirse por Zoom
                  </a>
                  <button
                    v-if="charla.zoomUrl && canJoinZoom"
                    class="btn ghost"
                    type="button"
                    @click="copyZoom"
                  >
                    <i class="bi bi-clipboard"></i> Copiar enlace
                  </button>

                  <a
                    v-if="canEvaluate"
                    class="btn"
                    :href="charla.evaluacion"
                    target="_blank" rel="noopener"
                  >
                    <i class="bi bi-ui-checks-grid"></i> Evaluación
                  </a>

                  <a
                    v-if="hasMaterial"
                    class="btn"
                    :href="charla.materialUrl"
                    target="_blank" rel="noopener"
                  >
                    <i class="bi bi-file-earmark-arrow-down"></i> Material
                  </a>
                </div>
              </div>
            </section>

            <!-- Footer -->
            <footer class="aes-modal__foot">
              <button class="btn" type="button" @click="close">
                Cerrar
              </button>
            </footer>

            <!-- Snack micro aviso -->
            <div v-if="snack" class="snack">{{ snack }}</div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* ===== Animaciones ===== */
.fade-enter-active,.fade-leave-active{ transition: opacity .18s ease; }
.fade-enter-from,.fade-leave-to{ opacity: 0; }
.pop-enter-active,.pop-leave-active{ transition: transform .2s ease, opacity .2s ease; }
.pop-enter-from,.pop-leave-to{ transform: scale(.98); opacity: 0; }

/* ===== Contenedor ===== */
.aes-modal{
  position: fixed; inset: 0;
  background: rgba(12, 13, 20, .55);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  display: grid; place-items: center;
  z-index: 99999;
  padding: 18px;
}

/* ===== Diálogo ===== */
.aes-modal__dialog{
  width: min(780px, 96vw);
  background: linear-gradient(180deg, #ffffff 0%, #fbfbff 100%);
  border-radius: 18px;
  box-shadow: 0 30px 80px rgba(7, 11, 30, .35);
  border: 1px solid #eef0f4;
  display: grid; gap: 12px;
  padding: 16px;
  position: relative;
}

/* Head */
.aes-modal__head{
  display:flex; align-items:center; justify-content:space-between; gap:12px;
}
.title-wrap{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.modal-title{
  margin:0; font-size:20px; font-weight:800; outline:none;
}
.icon-btn{
  border:none; background:transparent; cursor:pointer; color:#0f172a;
  width:38px; height:38px; display:grid; place-items:center; border-radius:12px;
}
.icon-btn:hover{ background:#f1f5f9; }

/* Body */
.aes-modal__body{ display:grid; gap:12px; }
.desc{ margin:0; color:#334155; line-height:1.6; }
.meta{
  display:grid; gap:8px; list-style:none; padding:0; margin:0;
  color:#334155; font-size:14px;
}
.meta li{ display:flex; gap:8px; align-items:center; }
.meta i{ width:18px; text-align:center; }

.badge{
  padding:3px 10px; border-radius:999px; font-size:12px; font-weight:800; text-transform:capitalize;
  background:#eef2ff; color:#3730a3; border:1px solid #e9e8ff;
}
.badge.live{ background:#ecfeff; color:#0e7490; border-color:#c0f4ff; }
.badge.finished{ background:#f1f5f9; color:#334155; border-color:#e2e8f0; }

/* CTAs */
.cta{ display:flex; justify-content:space-between; align-items:center; }
.cta-left{ display:flex; gap:10px; flex-wrap:wrap; }

.btn{
  border:1px solid #e5e7eb; background:#fff; padding:10px 14px;
  border-radius:12px; cursor:pointer; font-weight:700; display:inline-flex; gap:8px; align-items:center;
}
.btn:hover{ background:#f8fafc; }
.btn.primary{
  background: linear-gradient(135deg, #7c3aed, #8b5cf6);
  color:#fff; border:none;
}
.btn.primary:hover{ filter:brightness(1.05); }
.btn.ghost{
  background:#fff; color:#7c3aed; border:1px solid #e9d5ff;
}

/* Foot */
.aes-modal__foot{ display:flex; justify-content:flex-end; gap:8px; }

/* Snack */
.snack{
  position:absolute; left:50%; bottom:12px; transform:translateX(-50%);
  background:#111827; color:#fff; font-size:12px; padding:6px 10px; border-radius:8px;
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
}

/* Responsive */
@media (max-width: 640px){
  .aes-modal__dialog{ padding: 14px; }
  .modal-title{ font-size: 18px; }
}
</style>
