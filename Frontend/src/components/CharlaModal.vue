<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  charla: { type: Object, default: null },
})
const emit = defineEmits(['close', 'update:open'])

const dialogRef = ref(null)
const snack = ref('')

// helpers
const toDate = (d, t = '00:00') => new Date(`${d}T${t}:00`)
const fmtFecha = (d) =>
  d
    ? new Date(d).toLocaleDateString(undefined, {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : ''
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

function lockBody() {
  document.body.style.overflow = 'hidden'
}
function unlockBody() {
  document.body.style.overflow = ''
}

function close() {
  emit('update:open', false)
  emit('close')
}

function onBackdropClick(e) {
  if (e.target === e.currentTarget) close()
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    e.preventDefault()
    close()
    return
  }
  if (e.key !== 'Tab') return
  const root = dialogRef.value
  if (!root) return
  const focusables = root.querySelectorAll(
    'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])',
  )
  if (!focusables.length) return
  const first = focusables[0],
    last = focusables[focusables.length - 1],
    active = document.activeElement
  if (e.shiftKey && active === first) {
    e.preventDefault()
    last.focus()
    return
  }
  if (!e.shiftKey && active === last) {
    e.preventDefault()
    first.focus()
    return
  }
}

// ✅ Bloqueo/Desbloqueo robusto
watch(
  () => props.open,
  async (v) => {
    if (v) {
      lockBody()
      await nextTick()
      dialogRef.value?.querySelector('.modal-title')?.focus({ preventScroll: true })
    } else {
      unlockBody()
    }
  },
)

onMounted(() => {
  // si el modal ya viene abierto por estado inicial
  if (props.open) lockBody()
})

onUnmounted(() => {
  // ✅ pase lo que pase, restaurar scroll al desmontar
  unlockBody()
})

// snack
function toast(msg) {
  snack.value = msg
  setTimeout(() => {
    snack.value = ''
  }, 1800)
}
async function copyZoom() {
  try {
    await navigator.clipboard.writeText(props.charla?.zoomUrl || '')
    toast('Enlace de Zoom copiado')
  } catch {
    toast('No se pudo copiar')
  }
}
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
                <h3 class="modal-title" tabindex="0">{{ charla.titulo }}</h3>
                <span class="badge" :class="status">
                  {{
                    status === 'live'
                      ? 'En curso'
                      : status === 'upcoming'
                        ? 'Próxima'
                        : 'Finalizada'
                  }}
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
                <li><i class="bi bi-calendar-event"></i>{{ fmtFecha(charla.fecha) }}</li>
                <li>
                  <i class="bi bi-clock"></i>{{ fmtHora(charla.horaEmpieza) }} –
                  {{ fmtHora(charla.horaTermina) }}
                </li>
                <li><i class="bi bi-geo"></i>Sala: {{ charla.sala }}</li>
                <li><i class="bi bi-person"></i>Orador #{{ charla.idOrador }}</li>
                <li v-if="typeof charla.votosAFavor === 'number'">
                  <i class="bi bi-hand-thumbs-up"></i>{{ charla.votosAFavor }} 👍 ·
                  {{ charla.votosEnContra }} 👎
                </li>
              </ul>

              <div class="cta">
                <div class="cta-left">
                  <a
                    v-if="charla.zoomUrl && canJoinZoom"
                    class="btn primary"
                    :href="charla.zoomUrl"
                    target="_blank"
                    rel="noopener"
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
                    target="_blank"
                    rel="noopener"
                  >
                    <i class="bi bi-ui-checks-grid"></i> Evaluación
                  </a>
                  <a
                    v-if="hasMaterial"
                    class="btn"
                    :href="charla.materialUrl"
                    target="_blank"
                    rel="noopener"
                  >
                    <i class="bi bi-file-earmark-arrow-down"></i> Material
                  </a>
                </div>
              </div>
            </section>

            <!-- Footer -->
            <footer class="aes-modal__foot">
              <button class="btn" type="button" @click="close">Cerrar</button>
            </footer>

            <div v-if="snack" class="snack">{{ snack }}</div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* animaciones */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.pop-enter-active,
.pop-leave-active {
  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}
.pop-enter-from,
.pop-leave-to {
  transform: scale(0.97);
  opacity: 0;
}

/* contenedor */
.aes-modal {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(6px);
  display: grid;
  place-items: center;
  z-index: 9999;
  padding: 20px;
}
.aes-modal__dialog {
  width: min(720px, 95vw);
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
  border: 1px solid #e5e7eb;
  display: grid;
  gap: 16px;
  padding: 20px;
  position: relative;
}

/* header */
.aes-modal__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: #4c1d95;
  outline: none;
}
.icon-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 10px;
  color: #374151;
}
.icon-btn:hover {
  background: #f3f4f6;
}

/* body */
.aes-modal__body {
  display: grid;
  gap: 12px;
}
.desc {
  margin: 0;
  color: #374151;
  line-height: 1.6;
}
.meta {
  display: grid;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 0;
  color: #4b5563;
  font-size: 14px;
}
.meta li {
  display: flex;
  gap: 8px;
  align-items: center;
}

.badge {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: #eef2ff;
  color: #3730a3;
}
.badge.live {
  background: #ecfeff;
  color: #0e7490;
}
.badge.finished {
  background: #f1f5f9;
  color: #334155;
}

/* cta */
.cta {
  display: flex;
  justify-content: flex-start;
}
.cta-left {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.btn {
  border: 1px solid #d1d5db;
  background: #fff;
  padding: 9px 14px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  color: #111827;
}
.btn:hover {
  background: #f9fafb;
}
.btn.primary {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: #fff;
  border: none;
  box-shadow: 0 3px 10px rgba(124, 58, 237, 0.3);
}
.btn.primary:hover {
  filter: brightness(1.07);
}
.btn.ghost {
  background: #fff;
  color: #7c3aed;
  border: 1px solid #e9d5ff;
}

/* foot */
.aes-modal__foot {
  display: flex;
  justify-content: flex-end;
}

/* snack */
.snack {
  position: absolute;
  left: 50%;
  bottom: 12px;
  transform: translateX(-50%);
  background: #111827;
  color: #fff;
  font-size: 12px;
  padding: 6px 10px;
  border-radius: 8px;
}
</style>
