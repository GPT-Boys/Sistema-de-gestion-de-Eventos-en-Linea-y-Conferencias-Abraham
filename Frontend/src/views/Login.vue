<template>
  <div class="login-page">
    <HeaderAuth />

    <div class="viewport">
      <div class="login-card">
        <header class="head">
          <h1>Iniciar sesión</h1>
          <p class="sub">Accede a tu panel para gestionar tus eventos.</p>
        </header>

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

        <form @submit.prevent="onSubmit" novalidate>
          <!-- Usuario -->
          <label class="label" for="user">Usuario</label>
          <div class="control">
            <span class="icon left" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path
                  d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5Z"
                />
              </svg>
            </span>
            <input
              id="user"
              v-model.trim="usuario"
              type="text"
              placeholder="Tu usuario"
              autocomplete="username"
              required
            />
          </div>

          <!-- Password -->
          <label class="label" for="password">Contraseña</label>
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
              placeholder="Tu contraseña"
              autocomplete="current-password"
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

          <!-- Recordar -->
          <label class="check">
            <input type="checkbox" v-model="remember" />
            <span> Mantener sesión iniciada </span>
          </label>

          <!-- Acciones -->
          <button class="aes-btn aes-btn--primary" type="submit" :disabled="loading">
            <span v-if="!loading">Entrar</span>
            <span v-else class="spinner">Entrando…</span>
          </button>
        </form>

        <footer class="foot-links">
          <router-link class="a" to="/register">¿No tienes cuenta? Crear una</router-link>
        </footer>
      </div>

      <footer class="mini-foot">© 2025 AbrahamEventSphere. Todos los derechos reservados.</footer>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HeaderAuth from '@/components/HeaderAuth.vue'
import { login as apiLogin } from '@/services/publicService.js'

const router = useRouter()

const usuario = ref('')
const password = ref('')
const remember = ref(true)
const showPassword = ref(false)
const loading = ref(false)
const notification = ref({ message: '', type: '' })

const showNotification = (message, type = 'ok') => {
  notification.value = { message, type }
  setTimeout(() => {
    if (notification.value.message === message) notification.value.message = ''
  }, 4000)
}

const onSubmit = async () => {
  if (!usuario.value || !password.value) {
    showNotification('Completa usuario y contraseña.', 'error')
    return
  }
  loading.value = true
  try {
    await apiLogin(usuario.value, password.value) // <- envía { usuario, password }
    router.push('/app/dashboard')
  } catch (e) {
    showNotification(e?.response?.data?.message || 'Usuario o contraseña inválidos.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
:root {
  --header-h: 80px; /* alto del header */
  --purple-700: #6d28d9;
  --purple-600: #7c3aed;
  --purple-500: #8b5cf6;
  --ring: 0 0 0 3px rgba(124, 58, 237, 0.25);
}

/* === Página sin scroll === */
.login-page {
  min-height: 100svh;
  background:
    radial-gradient(900px 400px at 15% 10%, rgba(255, 255, 255, 0.06), transparent 60%),
    radial-gradient(700px 320px at 85% 85%, rgba(255, 255, 255, 0.05), transparent 60%),
    linear-gradient(135deg, #3a3b3e 0%, #111214 100%);
  overflow: hidden; /* <- clave: evita scroll global */
}

/* zona visible bajo el header */
.viewport {
  height: calc(100svh - var(--header-h));
  display: grid;
  place-items: center;
  padding: 12px;
}

/* Card adaptable; si falta alto, scroll interno */
.login-card {
  width: min(640px, 92vw);
  max-height: calc(100svh - var(--header-h) - 32px); /* 32 = padding .viewport */
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
  overflow: auto; /* sólo si es necesario */
  overscroll-behavior: contain;
  padding: 22px;
}

.head h1 {
  margin: 0 0 4px;
  font-size: 26px;
  font-weight: 800;
  color: #111827;
  text-align: center;
}
.sub {
  margin: 0 0 12px;
  color: #6b7280;
  text-align: center;
}

.label {
  display: block;
  font-size: 13px;
  color: #374151;
  margin: 10px 0 6px;
}
.check {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 8px 0 12px;
  color: #374151;
  font-size: 14px;
}
.check input {
  width: 16px;
  height: 16px;
}

.control {
  position: relative;
  margin-bottom: 8px;
}
.control input {
  width: 100%;
  padding: 12px 42px;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 14px;
  outline: none;
  transition:
    box-shadow 0.15s ease,
    border-color 0.15s ease;
}
.control input:focus {
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
  opacity: 0.8;
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
  color: #fff;
  margin-top: 8px;
  background: linear-gradient(135deg, var(--purple-600), var(--purple-500));
}
.aes-btn:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}
.aes-btn:disabled {
  opacity: 0.7;
  cursor: default;
}
.aes-btn:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}

.foot-links {
  margin-top: 10px;
  text-align: center;
}
.foot-links .a {
  color: var(--purple-700);
  font-weight: 600;
  text-decoration: none;
}
.foot-links .a:hover {
  text-decoration: underline;
}

.notice {
  border-radius: 12px;
  padding: 11px 14px;
  font-size: 14px;
  margin: 6px 0 10px;
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

.mini-foot {
  margin-top: 10px;
  font-size: 12px;
  color: #6b7280;
  text-align: center;
}

/* Compacta si la pantalla es baja */
@media (max-height: 760px) {
  .login-card {
    padding: 16px 18px;
  }
  .head h1 {
    font-size: 22px;
  }
  .control input {
    padding: 10px 38px;
  }
  .aes-btn {
    padding: 10px 14px;
  }
}
</style>
