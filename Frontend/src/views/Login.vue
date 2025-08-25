<template>
  <div class="login-page">
    <!-- Navbar mini -->
    <HeaderAuth />

    <!-- decor -->
    <div class="bg-dots" aria-hidden="true">
      <span></span><span></span><span></span>
    </div>

    <div class="login-card">
      <header class="brand-head">
        
        <h1 class="brand-title">Iniciar Sesion</h1>
        
      </header>

      <div class="form">
        <transition name="fade">
          <div
            v-if="notification.message"
            class="notice"
            :class="notification.type === 'error' ? 'notice-error' : 'notice-ok'"
            role="status"
          >
            {{ notification.message }}
            <button class="notice-close" @click="hideNotification" aria-label="Cerrar">×</button>
          </div>
        </transition>

        <form @submit.prevent="doLogin" novalidate>
          <label class="label" for="email">Correo electrónico</label>
          <div class="control">
            <span class="icon left" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5Z"/></svg>
            </span>
            <input id="email" v-model.trim="email" type="email" placeholder="tu@email.com" autocomplete="email" required />
          </div>

          <label class="label" for="password">Contraseña</label>
          <div class="control">
            <span class="icon left" aria-hidden="true">
              <svg viewBox="0 0 24 24"><path d="M12 1a5 5 0 0 0-5 5v3H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2V6a5 5 0 0 0-5-5Zm-3 8V6a3 3 0 1 1 6 0v3H9Z"/></svg>
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
              class="icon right btn-icon"
              type="button"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" viewBox="0 0 24 24"><path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"/></svg>
              <svg v-else viewBox="0 0 24 24"><path d="M2 5.27 3.28 4 20 20.72 18.73 22l-2.27-2.27A11.9 11.9 0 0 1 12 19C7 19 2.73 15.89 1 12a13.1 13.1 0 0 1 5.11-5.92L2 5.27Zm6.11 2.84A4.97 4.97 0 0 0 7 12a5 5 0 0 0 5 5 4.97 4.97 0 0 0 3.89-1.89L8.11 8.11ZM12 5c5 0 9.27 3.11 11 7a12.9 12.9 0 0 1-3.16 4.38l-1.43-1.43A10.5 10.5 0 0 0 21 12C19.27 8.11 15 5 12 5Z"/></svg>
            </button>
          </div>

          <label class="check"><input type="checkbox" v-model="remember" /> <span>Recordar mis datos</span></label>

          <!-- Botón morado (con fallback de variables) -->
          <button class="aes-btn aes-btn--primary" type="submit" :disabled="loading">
            <span v-if="!loading">Iniciar sesión</span>
            <span v-else class="spinner">Iniciando…</span>
          </button>

          <button class="link" type="button">¿Olvidaste tu contraseña?</button>

          <hr class="divider" />
          <p class="muted center">¿No tienes una cuenta?</p>
          <router-link to="/register" class="aes-btn aes-btn--secondary">Regístrate ahora</router-link>
        </form>
      </div>

      <footer class="mini-foot">© 2025 AbrahamEventSphere. Todos los derechos reservados.</footer>
    </div>
  </div>
</template>

<script setup>
import HeaderAuth from '@/components/HeaderAuth.vue'
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const notification = ref({ message: '', type: '' })
const showNotification = (m, t='ok') => { notification.value = { message:m, type:t } }
const hideNotification = () => { notification.value = { message:'', type:'' } }

const router = useRouter()

const doLogin = async () => {
  if (!email.value || !password.value) return showNotification('Por favor, completa todos los campos.', 'error')
  const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
  if (!okEmail) return showNotification('Introduce un correo válido.', 'error')
  loading.value = true
  try {
    const res = await axios.post('http://localhost:3000/auth/login', {
      usuario: email.value,
      contrasena: password.value
    }, { withCredentials: true })
    loading.value = false
    showNotification('Inicio de sesión exitoso.', 'ok')
    setTimeout(() => router.push('/conferences'), 800)
  } catch (err) {
    loading.value = false
    showNotification(
      err.response?.data?.message || 'Usuario o contraseña incorrectos.',
      'error'
    )
  }
}
/* Bloquea scroll SOLO en Login */
onMounted(() => document.documentElement.classList.add('no-scroll'))
onUnmounted(() => document.documentElement.classList.remove('no-scroll'))

</script>
<style scoped>
:root{
  --purple-700:#6d28d9;
  --purple-600:#7c3aed; /* si no existe en styles.css, hay fallback abajo */
  --purple-500:#8b5cf6;
  --ink:#0b0b0d; --paper:#ffffff; --muted:#6b7280;
  --ring:0 0 0 3px rgba(124,58,237,.25);
}

/* Fondo y espacio por header fijo */
.login-page{
  min-height:100svh;
  background:
    radial-gradient(900px 400px at 15% 10%, rgba(255,255,255,0.06), transparent 60%),
    radial-gradient(700px 320px at 85% 85%, rgba(255,255,255,0.05), transparent 60%),
    linear-gradient(135deg, #3a3b3e 0%, #111214 100%);
  position:relative;
  padding-top: var(--header-h, 80px);
}

/* decor */
.bg-dots span{ position:absolute; border-radius:50%; pointer-events:none;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.08), transparent 60%); filter: blur(2px); }
.bg-dots span:nth-child(1){ width:280px; height:280px; top:0; left:-80px; }
.bg-dots span:nth-child(2){ width:220px; height:220px; bottom:20px; right:-60px; }
.bg-dots span:nth-child(3){ width:160px; height:160px; top:55%; left:72%; }

/* Card */
.login-card{
  width:min(430px, 92vw);
  max-height: calc(92vh - var(--header-h, 80px));
  margin: 18px auto 24px;
  background:rgba(255,255,255,.98);
  backdrop-filter: blur(10px);
  border-radius:20px; box-shadow:0 20px 60px rgba(0,0,0,.35);
  display:flex; flex-direction:column; overflow:hidden;
}
.brand-head{ display:grid; place-items:center; padding:22px 20px 10px; }
.brand-logo{ height:100px; width:auto; }
.brand-title{ margin:8px 0 2px; font-size:20px; font-weight:800; color:#1f2937; text-align:center; }
.brand-sub{ margin:0; font-size:13px; color:#6b7280; text-align:center; }

.form{ flex:1; overflow:auto; padding:18px 20px 8px; }

.notice{ border-radius:12px; padding:11px 14px; font-size:14px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; }
.notice-ok{ background:#ecfdf5; color:#065f46; }
.notice-error{ background:#fef2f2; color:#7f1d1d; }
.notice-close{ background:transparent; border:none; font-size:18px; cursor:pointer; line-height:1; color:inherit; }
.fade-enter-active,.fade-leave-active{ transition: opacity .18s ease; }
.fade-enter-from,.fade-leave-to{ opacity:0; }

.label{ display:block; font-size:13px; color:#374151; margin:8px 0 6px; }
.control{ position:relative; margin-bottom:12px; }
.control input{
  width:100%; padding:12px 42px; border-radius:12px; border:1px solid #e5e7eb; background:#fff; font-size:14px;
  outline:none; transition: box-shadow .15s ease, border-color .15s ease;
}
.control input:focus{ border-color: var(--purple-600, var(--purple-700)); box-shadow: var(--ring); }
.icon{ position:absolute; top:50%; transform:translateY(-50%); width:22px; height:22px; display:grid; place-items:center; opacity:.75; }
.icon svg{ width:18px; height:18px; fill:#6b7280; }
.icon.left{ left:12px; } .icon.right{ right:12px; }
.btn-icon{ background:transparent; border:none; cursor:pointer; padding:0; }

.check{ display:flex; align-items:center; gap:8px; font-size:14px; color:#374151; margin:2px 0 12px; }
.check input{ width:16px; height:16px; }

.aes-btn{
  width:100%; border:none; border-radius:14px; font-weight:700;
  padding:12px 18px; cursor:pointer; transition: transform .15s ease, filter .15s ease, box-shadow .15s ease;
  text-decoration:none; display:inline-block; text-align:center;
}
.aes-btn:disabled{ opacity:.7; cursor:default; }
.aes-btn:focus-visible{ outline:none; box-shadow: var(--ring); }

/* Botón morado con fallback */
.aes-btn--primary{
  background: linear-gradient(135deg,
              var(--purple-600, var(--purple-700, #7c3aed)),
              var(--purple-500, #8b5cf6)) !important;
  color:#ffffff !important;
  margin-top:6px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
}
.aes-btn--primary:hover{ transform: translateY(-2px); filter: brightness(1.05); }

.aes-btn--secondary{ background:#e5e7eb; color:#111827; margin-top:8px; }
.aes-btn--secondary:hover{ transform: translateY(-1px); filter: brightness(0.98); }

.link{ width:100%; margin-top:10px; background:transparent; border:none; color:var(--purple-600, var(--purple-700)); font-weight:600; cursor:pointer; text-decoration:none; }

.divider{ height:1px; border:none; background:#e5e7eb; margin:16px 0; }
.muted{ color:#6b7280; font-size:14px; }
.center{ text-align:center; }
.mini-foot{ padding:10px 14px; font-size:12px; color:#6b7280; text-align:center; border-top:1px solid #f3f4f6; }

@media (max-width:420px){
  .brand-logo{ height:68px; }
  .brand-title{ font-size:18px; }
}
</style>
