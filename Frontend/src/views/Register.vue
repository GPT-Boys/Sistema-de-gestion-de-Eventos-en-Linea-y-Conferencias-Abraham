<template>
  <AuthLayout>
          <header class="brand-head">
            <h1 class="brand-title">Crear una nueva cuenta</h1>
          </header>

          <div class="form">
            <!-- Avisos -->
            <transition name="fade">
              <div
                v-if="notification.message"
                class="notice"
                :class="notification.type === 'error' ? 'notice-error' : 'notice-ok'"
                role="status"
              >
                {{ notification.message }}
                <button
                  class="notice-close"
                  @click="notification.message = ''"
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
            </transition>

            <!-- Formulario -->
            <form @submit.prevent="onSubmitRegister" novalidate>
              <div class="grid-2">
                <!-- Columna 1 -->
                <section>
                  <h2 class="section-title">Información de acceso</h2>

                  <!-- Usuario -->
                  <label class="label" for="usuario">
                    Nombre de usuario <span class="req">*</span>
                  </label>
                  <div class="control">
                    <span class="icon left">
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5Z"
                        />
                      </svg>
                    </span>
                    <input
                      id="usuario"
                      v-model.trim="usuario"
                      type="text"
                      placeholder="Tu usuario"
                      required
                    />
                  </div>

                  <!-- Contraseña -->
                  <label class="label" for="password">
                    Contraseña <span class="req">*</span>
                  </label>
                  <div class="control">
                    <span class="icon left">
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M12 1a5 5 0 0 0-5 5v3H5v13h14V9h-2V6a5 5 0 0 0-5-5Z"
                        />
                      </svg>
                    </span>
                    <input
                      id="password"
                      :type="showPassword ? 'text' : 'password'"
                      v-model="password"
                      placeholder="Crea una contraseña segura"
                      required
                    />
                    <button
                      type="button"
                      class="icon right btn-icon"
                      @click="showPassword = !showPassword"
                    >
                      <svg v-if="!showPassword" viewBox="0 0 24 24">
                        <path
                          d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Z"
                        />
                      </svg>
                      <svg v-else viewBox="0 0 24 24">
                        <path
                          d="M2 5.27 3.28 4 20 20.72 18.73 22 12 19c-5 0-9.27-3.11-11-7Z"
                        />
                      </svg>
                    </button>
                  </div>
                  <p class="hint">Mínimo 8 caracteres, con letras y números.</p>

                  <!-- Confirmar contraseña -->
                  <label class="label" for="confirmPassword">
                    Confirmar contraseña <span class="req">*</span>
                  </label>
                  <div class="control">
                    <span class="icon left">
                      <svg viewBox="0 0 24 24">
                        <path
                          d="M12 1a5 5 0 0 0-5 5v3H5v13h14V9h-2V6a5 5 0 0 0-5-5Z"
                        />
                      </svg>
                    </span>
                    <input
                      id="confirmPassword"
                      :type="showConfirmPassword ? 'text' : 'password'"
                      v-model="confirmPassword"
                      placeholder="Repite tu contraseña"
                      required
                    />
                    <button
                      type="button"
                      class="icon right btn-icon"
                      @click="showConfirmPassword = !showConfirmPassword"
                    >
                      <svg v-if="!showConfirmPassword" viewBox="0 0 24 24">
                        <path
                          d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7Z"
                        />
                      </svg>
                      <svg v-else viewBox="0 0 24 24">
                        <path
                          d="M2 5.27 3.28 4 20 20.72 18.73 22 12 19c-5 0-9.27-3.11-11-7Z"
                        />
                      </svg>
                    </button>
                  </div>

                  <!-- Tipo usuario -->
                  <label class="label" for="tipoUsuario">
                    Tipo de usuario <span class="req">*</span>
                  </label>
                  <div class="control">
                    <select id="tipoUsuario" v-model="tipoUsuario" required>
                      <option
                        v-for="o in tiposUsuario"
                        :key="o.value"
                        :value="o.value"
                        :disabled="o.disabled"
                      >
                        {{ o.text }}
                      </option>
                    </select>
                  </div>
                </section>

                <!-- Columna 2 -->
                  <section>
                    <h2 class="section-title">Información personal</h2>

                    <!-- Nombres -->
                    <label class="label" for="nombres">Nombres <span class="req">*</span></label>
                    <div class="control">
                      <span class="icon left">
                        <svg viewBox="0 0 24 24">
                          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
                        </svg>
                      </span>
                      <input id="nombres" v-model.trim="nombres" type="text" placeholder="Tus nombres" required />
                    </div>

                    <!-- Apellidos -->
                    <label class="label" for="apellidos">Apellidos <span class="req">*</span></label>
                    <div class="control">
                      <span class="icon left">
                        <svg viewBox="0 0 24 24">
                          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
                        </svg>
                      </span>
                      <input id="apellidos" v-model.trim="apellidos" type="text" placeholder="Tus apellidos" required />
                    </div>

                    <!-- Fecha de nacimiento -->
                    <label class="label" for="fechaNacimiento">Fecha de nacimiento <span class="req">*</span></label>
                    <div class="control">
                      <span class="icon left">
                        <svg viewBox="0 0 24 24">
                          <path d="M19 4h-1V2h-2v2H8V2H6v2H5v18h14V6Z" />
                        </svg>
                      </span>
                      <input id="fechaNacimiento" v-model="fechaNacimiento" type="date" :max="today" required />
                    </div>

                    <!-- Ciudad -->
                    <label class="label" for="ciudad">Ciudad/Departamento <span class="req">*</span></label>
                    <div class="control">
                      <span class="icon left">
                        <svg viewBox="0 0 24 24">
                          <path d="M12 2C8 2 5 5 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-4-3-7-7-7Z" />
                        </svg>
                      </span>
                      <select id="ciudad" v-model="ciudad" required>
                        <option v-for="d in departamentosBolivia" :key="d.value" :value="d.value" :disabled="d.disabled">
                          {{ d.text }}
                        </option>
                      </select>
                    </div>

                    <!-- Teléfono -->
                    <label class="label" for="telefono">Teléfono <span class="req">*</span></label>
                    <div class="control">
                      <span class="icon left">
                        <svg viewBox="0 0 24 24">
                          <path d="M6.6 10.8a15 15 0 0 0 6.6 6.6l2.2-2.2 3.6.6v3.2A16 16 0 0 1 4 4h3.2l.6 3.6Z" />
                        </svg>
                      </span>
                      <input id="telefono" v-model.trim="telefono" type="tel" placeholder="Ej: +59170000000" required />
                    </div>

                    <!-- Email -->
                    <label class="label" for="email">Correo electrónico <span class="req">*</span></label>
                    <div class="control">
                      <span class="icon left">
                        <svg viewBox="0 0 24 24">
                          <path d="M20 4H4a2 2 0 0 0-2 2v12h20V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5Z" />
                        </svg>
                      </span>
                      <input id="email" v-model.trim="email" type="email" placeholder="tu@email.com" required />
                    </div>
                  </section>
              </div>

              <!-- Términos -->
              <label class="check">
                <input type="checkbox" v-model="acceptTerms" />
                <span>
                  Acepto los
                  <button type="button" class="link-inline" @click="openModal('terms')">
                    términos y condiciones
                  </button>
                  y la
                  <button type="button" class="link-inline" @click="openModal('privacy')">
                    política de privacidad
                  </button>
                  <span class="req">*</span>
                </span>
              </label>

              <!-- Acciones -->
              <button class="aes-btn aes-btn--primary" type="submit" :disabled="loading">
                <span v-if="!loading">Crear cuenta</span>
                <span v-else class="spinner">Creando cuenta…</span>
              </button>

              <p class="muted center">¿Ya tienes una cuenta?</p>
              <router-link to="/login" class="aes-btn aes-btn--secondary">Inicia sesión aquí</router-link>
            </form>
          </div>
  </AuthLayout>
</template>

<script setup>
import AuthLayout from '@/layouts/AuthLayout.vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

/* Axios base */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

/* Campos */
const usuario = ref('')
const password = ref('')
const confirmPassword = ref('')
const tipoUsuario = ref('')
const nombres = ref('')
const apellidos = ref('')
const fechaNacimiento = ref('')
const ciudad = ref('')
const telefono = ref('')
const email = ref('')

/* Estado UI */
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const acceptTerms = ref(false)
const loading = ref(false)
const notification = ref({ message: '', type: '' })

/* Modal */
const showModal = ref(false)
const modalTitle = ref('')
const modalContent = ref('')

/* Hoy (para max en date) */
const today = new Date().toISOString().slice(0, 10)

/* Opciones */
const tiposUsuario = [
  { value: '', text: 'Selecciona tu tipo de usuario', disabled: true },
  { value: 'orador', text: 'Orador' },
  { value: 'personal_apoyo', text: 'Personal de Apoyo' },
  { value: 'asistente', text: 'Asistente' },
]
const departamentosBolivia = [
  { value: '', text: 'Selecciona tu departamento', disabled: true },
  { value: 'lp', text: 'La Paz' },
  { value: 'cb', text: 'Cochabamba' },
  { value: 'sc', text: 'Santa Cruz' },
  { value: 'or', text: 'Oruro' },
  { value: 'pt', text: 'Potosí' },
  { value: 'tj', text: 'Tarija' },
  { value: 'ch', text: 'Chuquisaca' },
  { value: 'bn', text: 'Beni' },
  { value: 'pn', text: 'Pando' },
]

/* Mapas a IDs de tu BD */
const mapTipoUsuarioToId = (v) => {
  // 1 Admin | 2 Personal | 3 Orador | 4 Asistente
  if (v === 'personal_apoyo') return 2
  if (v === 'orador') return 3
  if (v === 'asistente') return 4
  return null
}
const mapCiudadToId = (v) => {
  // pn:1, bn:2, lp:3, cb:4, sc:5, or:6, pt:7, ch:8, tj:9
  const mapa = { pn: 1, bn: 2, lp: 3, cb: 4, sc: 5, or: 6, pt: 7, ch: 8, tj: 9 }
  return mapa[v] ?? null
}

/* Helpers */
const showNotification = (message, type = 'ok') => {
  notification.value = { message, type }
  setTimeout(() => {
    if (notification.value.message === message) notification.value.message = ''
  }, 5000)
}
const openModal = (type) => {
  if (type === 'terms') {
    modalTitle.value = 'Términos y Condiciones'
    modalContent.value = 'Aquí irán los términos y condiciones de uso del servicio.'
  } else {
    modalTitle.value = 'Política de Privacidad'
    modalContent.value = 'Aquí irá la política de privacidad.'
  }
  showModal.value = true
}
const closeModal = () => {
  showModal.value = false
}

/* Validación + POST real */
const onSubmitRegister = async () => {
  if (
    !usuario.value ||
    !password.value ||
    !confirmPassword.value ||
    !tipoUsuario.value ||
    !nombres.value ||
    !apellidos.value ||
    !fechaNacimiento.value ||
    !ciudad.value ||
    !telefono.value ||
    !email.value
  ) {
    return showNotification('Por favor, completa todos los campos.', 'error')
  }
  if (password.value.length < 8)
    return showNotification('La contraseña debe tener al menos 8 caracteres.', 'error')
  if (password.value !== confirmPassword.value)
    return showNotification('Las contraseñas no coinciden.', 'error')
  if (!acceptTerms.value)
    return showNotification('Debes aceptar los términos y condiciones.', 'error')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) return showNotification('Introduce un email válido.', 'error')
  const phoneDigits = (telefono.value || '').replace(/\D/g, '')
  if (phoneDigits.length < 7) return showNotification('Introduce un teléfono válido.', 'error')

  const idTipo = mapTipoUsuarioToId(tipoUsuario.value)
  const idCiudad = mapCiudadToId(ciudad.value)
  if (!idTipo) return showNotification('Tipo de usuario inválido.', 'error')
  if (!idCiudad) return showNotification('Ciudad inválida.', 'error')

  const payload = {
      usuario: usuario.value,
      contrasenia: password.value,            // << en minúsculas
      tipo_usuario: { id_tipo_usuario: idTipo },
      nombres: nombres.value,
      apellidos: apellidos.value,
      fecha_nacimiento: fechaNacimiento.value,
      ciudad: { id_ciudad: idCiudad },
      telefono: Number(phoneDigits),
      correo_electronico: email.value,
  }

  try {
    loading.value = true
    const { status } = await api.post('/usuario', payload)

    if (status === 200 || status === 201) {
      showNotification('Registro exitoso. Redirigiendo…', 'ok')
      setTimeout(() => router.push('/login'), 1200)
    } else {
      showNotification('No se pudo registrar. Intenta nuevamente.', 'error')
    }
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      (err?.response?.status === 409 ? 'Usuario o correo ya registrados.' : null) ||
      (err?.response?.status === 400 ? 'Datos inválidos.' : null) ||
      'Error de conexión con el servidor.'
    showNotification(msg, 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Viewport bajo el header */
.viewport {
  height: calc(100svh - var(--header-h));
  display: grid;
  place-items: center;
  padding: 12px;
}

/* halos decorativos */
.bg-dots span {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.08), transparent 60%);
  filter: blur(2px);
}
.bg-dots span:nth-child(1) { width: 280px; height: 280px; top: 0; left: -80px; }
.bg-dots span:nth-child(2) { width: 220px; height: 220px; bottom: 20px; right: -60px; }
.bg-dots span:nth-child(3) { width: 160px; height: 160px; top: 55%; left: 72%; }

/* Página */
.register-page {
  min-height: 100svh;
  overflow: hidden;
  background: var(--gris-fondo);
}

/* Card */
.register-card {
  width: min(960px, 94vw);
  max-height: calc(100svh - var(--header-h) - 32px);
  background: var(--card-bg);
  color: var(--text-primary);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  overflow: auto;
  overscroll-behavior: contain;
}

/* Cabecera */
.brand-head {
  display: grid;
  place-items: center;
  padding: 22px 20px 10px;
}
.brand-title {
  margin: 8px 0 2px;
  font-size: 20px;
  font-weight: 800;
  color: var(--text-primary);
  text-align: center;
}


/* Avisos */
.notice {
  border-radius: 12px;
  padding: 11px 14px;
  font-size: 14px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.notice-ok {
  background: #d1fae5;
  color: #065f46;
}
.notice-error {
  background: #fee2e2;
  color: #7f1d1d;
}
[data-theme="dark"] .notice-ok {
  background: #064e3b;
  color: #a7f3d0;
}
[data-theme="dark"] .notice-error {
  background: #7f1d1d;
  color: #fecaca;
}
.notice-close {
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
  color: inherit;
}
.fade-enter-active,
.fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

/* Grid */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
  margin-bottom: 10px;
}
.grid-2 section { min-width: 0; }
.section-title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-primary);
}

/* Labels */
.label {
  display: block;
  font-size: 13px;
  color: var(--text-secondary);
  margin: 8px 0 6px;
}
.req { color: #ef4444; }
.hint {
  margin: 4px 0 10px;
  font-size: 12px;
  color: var(--text-secondary);
}

/* Inputs */
.control { position: relative; margin-bottom: 10px; }
.control input,
.control select {
  width: 100%;
  padding: 12px 42px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: var(--blanco);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  transition: box-shadow 0.15s ease, border-color 0.15s ease;
  -webkit-appearance: none;
  appearance: none;
}
.control select { padding-right: 42px; background-image: none; }
.control input:focus,
.control select:focus {
  border-color: var(--morado-base);
  box-shadow: var(--ring);
}
[data-theme="dark"] .control input,
[data-theme="dark"] .control select {
  background: #111827;
  border: 1px solid #374151;
  color: var(--blanco);
}
.icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  opacity: 0.75;
}
.icon svg { width: 18px; height: 18px; fill: var(--text-secondary); }
.icon.left { left: 12px; }
.icon.right { right: 12px; }
.btn-icon { background: transparent; border: none; cursor: pointer; padding: 0; }

/* Checkbox y links */
.check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: var(--text-secondary);
  margin: 8px 0 12px;
}
.check input { width: 16px; height: 16px; margin-top: 2px; }
.link-inline {
  background: transparent;
  border: none;
  color: var(--morado-base);
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

/* Botones */
.aes-btn {
  width: 100%;
  border: none;
  border-radius: 14px;
  font-weight: 700;
  padding: 12px 18px;
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.15s ease, box-shadow 0.15s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  margin-top: 6px;
}
.aes-btn:disabled { opacity: 0.7; cursor: default; }
.aes-btn:focus-visible { outline: none; box-shadow: var(--ring); }

.aes-btn--primary {
  background: linear-gradient(135deg, var(--morado-base), var(--morado-intermedio));
  color: var(--blanco);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}
[data-theme="dark"] .aes-btn--primary {
  background: linear-gradient(135deg, var(--morado-oscuro), var(--morado-base));
}
.aes-btn--primary:hover { transform: translateY(-2px); filter: brightness(1.05); }

.aes-btn--secondary {
  background: var(--blanco);
  color: var(--morado-base);
  border: 1px solid var(--morado-base);
}
.aes-btn--secondary:hover {
  background: var(--morado-base);
  color: var(--blanco);
}

/* Otros */
.muted { color: var(--text-secondary); font-size: 14px; }
.center { text-align: center; }
.mini-foot {
  padding: 10px 14px;
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
  border-top: 1px solid var(--gris-fondo);
}

/* Modal */
.aes-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 1100;
}
.aes-modal {
  width: min(640px, 96vw);
  background: var(--card-bg);
  color: var(--text-primary);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid var(--gris-fondo);
}
.modal-head h3 { margin: 0; font-size: 18px; }
.modal-body { padding: 16px; color: var(--text-primary); }
.modal-foot {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 12px 16px;
  border-top: 1px solid var(--gris-fondo);
}
.placeholder-pdf {
  display: grid;
  place-items: center;
  gap: 6px;
  padding: 16px;
  border: 2px dashed var(--gris-fondo);
  border-radius: 12px;
  margin-top: 10px;
}
.placeholder-pdf svg { width: 40px; height: 40px; fill: #ef4444; }

/* Responsive */
@media (max-width: 860px) { .grid-2 { grid-template-columns: 1fr; } }
@media (max-height: 760px) {
  .register-card { padding-top: 6px; }
  .brand-title { font-size: 18px; }
  .control input, .control select { padding: 10px 38px; }
  .aes-btn { padding: 10px 14px; }
}
</style>
