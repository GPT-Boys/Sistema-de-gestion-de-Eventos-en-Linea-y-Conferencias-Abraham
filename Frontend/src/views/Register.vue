<template>
  <div class="register-page">
    <!-- Header fijo -->
    <HeaderAuth />

    <!-- Fondo + sin scroll global -->
    <div class="bg-dots" aria-hidden="true"><span></span><span></span><span></span></div>

    <!-- Viewport: ocupa todo bajo el header y centra el card -->
    <div class="viewport">
      <div class="register-card">
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
              <button class="notice-close" @click="notification.message = ''" aria-label="Cerrar">
                ×
              </button>
            </div>
          </transition>

          <!-- Envío real -->
          <form @submit.prevent="onSubmitRegister" novalidate>
            <div class="grid-2">
              <!-- Col 1: Acceso -->
              <section>
                <h2 class="section-title">Información de acceso</h2>

                <label class="label" for="usuario"
                  >Nombre de usuario <span class="req">*</span></label
                >
                <div class="control">
                  <span class="icon left" aria-hidden="true">
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

                <label class="label" for="password">Contraseña <span class="req">*</span></label>
                <div class="control">
                  <span class="icon left" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5Zm-3 8V6a3 3 0 1 1 6 0v3H9Z"
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
                    :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                    @click="showPassword = !showPassword"
                  >
                    <svg v-if="!showPassword" viewBox="0 0 24 24">
                      <path
                        d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
                      />
                    </svg>
                    <svg v-else viewBox="0 0 24 24">
                      <path
                        d="M2 5.27 3.28 4 20 20.72 18.73 22l-2.27-2.27A11.9 11.9 0 0 1 12 19C7 19 2.73 15.89 1 12a13.1 13.1 0 0 1 5.11-5.92L2 5.27Z"
                      />
                    </svg>
                  </button>
                </div>
                <p class="hint">Mínimo 8 caracteres, con letras y números.</p>

                <label class="label" for="confirmPassword"
                  >Confirmar contraseña <span class="req">*</span></label
                >
                <div class="control">
                  <span class="icon left" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5Z"
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
                    :aria-label="
                      showConfirmPassword ? 'Ocultar confirmación' : 'Mostrar confirmación'
                    "
                    @click="showConfirmPassword = !showConfirmPassword"
                  >
                    <svg v-if="!showConfirmPassword" viewBox="0 0 24 24">
                      <path
                        d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
                      />
                    </svg>
                    <svg v-else viewBox="0 0 24 24">
                      <path
                        d="M2 5.27 3.28 4 20 20.72 18.73 22l-2.27-2.27A11.9 11.9 0 0 1 12 19C7 19 2.73 15.89 1 12a13.1 13.1 0 0 1 5.11-5.92L2 5.27Z"
                      />
                    </svg>
                  </button>
                </div>

                <label class="label" for="tipoUsuario"
                  >Tipo de usuario <span class="req">*</span></label
                >
                <div class="control">
                  <span class="icon left" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M16 11a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-8 0a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-3.33 0-10 1.67-10 5v3h8v-3c0-1.33.53-2.55 1.39-3.54A9.67 9.67 0 0 0 8 13Zm8 0c-1.61 0-4.67.8-6.14 2.46A5.06 5.06 0 0 0 9 18v3h14v-3c0-3.33-6.67-5-9-5Z"
                      />
                    </svg>
                  </span>
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

              <!-- Col 2: Personal -->
              <section>
                <h2 class="section-title">Información personal</h2>

                <label class="label" for="nombres">Nombres <span class="req">*</span></label>
                <div class="control">
                  <span class="icon left" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" /></svg>
                  </span>
                  <input
                    id="nombres"
                    v-model.trim="nombres"
                    type="text"
                    placeholder="Tus nombres"
                    required
                  />
                </div>

                <label class="label" for="apellidos">Apellidos <span class="req">*</span></label>
                <div class="control">
                  <span class="icon left" aria-hidden="true">
                    <svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" /></svg>
                  </span>
                  <input
                    id="apellidos"
                    v-model.trim="apellidos"
                    type="text"
                    placeholder="Tus apellidos"
                    required
                  />
                </div>

                <label class="label" for="fechaNacimiento"
                  >Fecha de nacimiento <span class="req">*</span></label
                >
                <div class="control">
                  <span class="icon left" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                      />
                    </svg>
                  </span>
                  <input
                    id="fechaNacimiento"
                    v-model="fechaNacimiento"
                    type="date"
                    :max="today"
                    required
                  />
                </div>

                <label class="label" for="ciudad"
                  >Ciudad/Departamento <span class="req">*</span></label
                >
                <div class="control">
                  <span class="icon left" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7Zm0 9.5a2.5 2.5 0 1 1 2.5-2.5A2.5 2.5 0 0 1 12 11.5Z"
                      />
                    </svg>
                  </span>
                  <select id="ciudad" v-model="ciudad" required>
                    <option
                      v-for="d in departamentosBolivia"
                      :key="d.value"
                      :value="d.value"
                      :disabled="d.disabled"
                    >
                      {{ d.text }}
                    </option>
                  </select>
                </div>

                <label class="label" for="telefono">Teléfono <span class="req">*</span></label>
                <div class="control">
                  <span class="icon left" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M6.62 10.79a15 15 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.24 11.36 11.36 0 0 0 3.56.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A16 16 0 0 1 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.56 1 1 0 0 1-.26 1Z"
                      />
                    </svg>
                  </span>
                  <input
                    id="telefono"
                    v-model.trim="telefono"
                    type="tel"
                    placeholder="Ej: +59170000000"
                    required
                  />
                </div>

                <label class="label" for="email"
                  >Correo electrónico <span class="req">*</span></label
                >
                <div class="control">
                  <span class="icon left" aria-hidden="true">
                    <svg viewBox="0 0 24 24">
                      <path
                        d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5Z"
                      />
                    </svg>
                  </span>
                  <input
                    id="email"
                    v-model.trim="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                  />
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

            <p class="muted center" style="margin: 10px 0 0">¿Ya tienes una cuenta?</p>
            <router-link to="/login" class="aes-btn aes-btn--secondary"
              >Inicia sesión aquí</router-link
            >
          </form>
        </div>

        <footer class="mini-foot">
          © 2025 AbrahamEventSphere. Todos los derechos reservados.
        </footer>
      </div>
    </div>

    <!-- Modal -->
    <teleport to="body">
      <div v-if="showModal" class="aes-backdrop" @click.self="closeModal">
        <div class="aes-modal" role="dialog" aria-modal="true" :aria-label="modalTitle">
          <header class="modal-head">
            <h3>{{ modalTitle }}</h3>
            <button type="button" class="btn-icon" @click="closeModal" aria-label="Cerrar">
              ×
            </button>
          </header>
          <div class="modal-body">
            <p>{{ modalContent }}</p>
            <div class="placeholder-pdf">
              <svg viewBox="0 0 24 24">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Zm0 2.5L18.5 9H14Z"
                />
              </svg>
              <p>Aquí se mostrará el PDF cuando esté disponible.</p>
            </div>
          </div>
          <footer class="modal-foot">
            <button type="button" class="aes-btn aes-btn--secondary" @click="closeModal">
              Cerrar
            </button>
            <button type="button" class="aes-btn aes-btn--primary" @click="closeModal">
              Aceptar
            </button>
          </footer>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import HeaderAuth from '@/components/HeaderAuth.vue'
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
    USUARIO: usuario.value,
    CONTRASENIA: password.value, // el backend deberá hashearla
    ID_TIPO_USUARIO: idTipo,
    NOMBRES: nombres.value,
    APELLIDOS: apellidos.value,
    FECHA_NACIMIENTO: fechaNacimiento.value, // YYYY-MM-DD
    ID_CIUDAD: idCiudad,
    TELEFONO: phoneDigits,
    CORREO_ELECTRONICO: email.value,
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
:root {
  --header-h: 80px;
  --purple-900: #4c1d95;
  --purple-700: #6d28d9;
  --purple-600: #7c3aed;
  --purple-500: #8b5cf6;
  --ink: #0b0b0d;
  --paper: #ffffff;
  --muted: #6b7280;
  --ring: 0 0 0 3px rgba(124, 58, 237, 0.25);
}

/* Página sin scroll global */
.register-page {
  min-height: 100svh;
  overflow: hidden; /* <- clave */
  background:
    radial-gradient(900px 400px at 15% 10%, rgba(255, 255, 255, 0.06), transparent 60%),
    radial-gradient(700px 320px at 85% 85%, rgba(255, 255, 255, 0.05), transparent 60%),
    linear-gradient(135deg, #3a3b3e 0%, #111214 100%);
  position: relative;
}

/* Viewport bajo el header, centra el card */
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
.bg-dots span:nth-child(1) {
  width: 280px;
  height: 280px;
  top: 0;
  left: -80px;
}
.bg-dots span:nth-child(2) {
  width: 220px;
  height: 220px;
  bottom: 20px;
  right: -60px;
}
.bg-dots span:nth-child(3) {
  width: 160px;
  height: 160px;
  top: 55%;
  left: 72%;
}

/* Card con scroll interno si hace falta */
.register-card {
  width: min(960px, 94vw);
  max-height: calc(100svh - var(--header-h) - 32px); /* 32 = padding del viewport */
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-direction: column;
  overflow: auto;
  overscroll-behavior: contain;
}
.brand-head {
  display: grid;
  place-items: center;
  padding: 22px 20px 10px;
}
.brand-title {
  margin: 8px 0 2px;
  font-size: 20px;
  font-weight: 800;
  color: #1f2937;
  text-align: center;
}

.form {
  flex: 1;
  padding: 18px 22px 12px;
}

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
  background: #ecfdf5;
  color: #065f46;
}
.notice-error {
  background: #fef2f2;
  color: #7f1d1d;
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
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Grid */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 20px;
  margin-bottom: 10px;
}
.grid-2 section {
  min-width: 0;
}
.section-title {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 700;
  color: #374151;
}

.label {
  display: block;
  font-size: 13px;
  color: #374151;
  margin: 8px 0 6px;
}
.req {
  color: #ef4444;
}
.hint {
  margin: 4px 0 10px;
  font-size: 12px;
  color: #6b7280;
}

.control {
  position: relative;
  margin-bottom: 10px;
}
.control input,
.control select {
  width: 100%;
  padding: 12px 42px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 14px;
  outline: none;
  transition:
    box-shadow 0.15s ease,
    border-color 0.15s ease;
  -webkit-appearance: none;
  appearance: none;
}
.control select {
  padding-right: 42px;
  background-image: none;
}
.control input:focus,
.control select:focus {
  border-color: var(--purple-600);
  box-shadow: var(--ring);
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
.icon svg {
  width: 18px;
  height: 18px;
  fill: #6b7280;
}
.icon.left {
  left: 12px;
}
.icon.right {
  right: 12px;
}
.btn-icon {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
}

/* Checkbox/links */
.check {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  color: #374151;
  margin: 8px 0 12px;
}
.check input {
  width: 16px;
  height: 16px;
  margin-top: 2px;
}
.link-inline {
  background: transparent;
  border: none;
  color: var(--purple-600);
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
  transition:
    transform 0.15s ease,
    filter 0.15s ease,
    box-shadow 0.15s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  margin-top: 6px;
}
.aes-btn:disabled {
  opacity: 0.7;
  cursor: default;
}
.aes-btn:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}
.aes-btn--primary {
  background: linear-gradient(135deg, var(--purple-600), var(--purple-500)) !important;
  color: #fff !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
}
.aes-btn--primary:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}
.aes-btn--secondary {
  background: #e5e7eb;
  color: #111827;
}
.aes-btn--secondary:hover {
  transform: translateY(-1px);
  filter: brightness(0.98);
}

.muted {
  color: #6b7280;
  font-size: 14px;
}
.center {
  text-align: center;
}
.mini-foot {
  padding: 10px 14px;
  font-size: 12px;
  color: #6b7280;
  text-align: center;
  border-top: 1px solid #f3f4f6;
}

/* Modal */
.aes-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  padding: 16px;
  z-index: 1100;
}
.aes-modal {
  width: min(640px, 96vw);
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
}
.modal-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #f3f4f6;
}
.modal-head h3 {
  margin: 0;
  font-size: 18px;
}
.modal-body {
  padding: 16px;
  color: #374151;
}
.modal-foot {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 12px 16px;
  border-top: 1px solid #f3f4f6;
}
.placeholder-pdf {
  display: grid;
  place-items: center;
  gap: 6px;
  padding: 16px;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  margin-top: 10px;
}
.placeholder-pdf svg {
  width: 40px;
  height: 40px;
  fill: #ef4444;
}

/* Responsive */
@media (max-width: 860px) {
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
@media (max-height: 760px) {
  .register-card {
    padding-top: 6px;
  }
  .brand-title {
    font-size: 18px;
  }
  .control input,
  .control select {
    padding: 10px 38px;
  }
  .aes-btn {
    padding: 10px 14px;
  }
}
</style>
