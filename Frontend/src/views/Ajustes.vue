<!-- src/views/Ajustes.vue -->
<template>
  <div class="settings">
    <!-- Header -->
    <header class="settings-header">
      <h1><i class="bi bi-gear"></i> Ajustes</h1>
      <p class="subtitle">Administra tu perfil, preferencias y seguridad.</p>
    </header>

    <div class="settings-grid">
      <!-- Perfil -->
      <section class="card">
        <h2><i class="bi bi-person-circle"></i> Perfil</h2>
        <div class="form-group">
          <label>Nombre de usuario</label>
          <input type="text" v-model="form.username" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="form.email" />
        </div>
        <button class="btn-primary" @click="saveProfile">
          <i class="bi bi-save"></i> Guardar cambios
        </button>
      </section>

      <!-- Preferencias -->
      <section class="card">
        <h2><i class="bi bi-sliders"></i> Preferencias</h2>
        <div class="form-group">
          <label>Tema</label>
          <select v-model="form.theme">
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select>
        </div>
        <div class="form-group">
          <label>Notificaciones</label>
          <input type="checkbox" v-model="form.notifications" />
          <span>Recibir alertas de cambios</span>
        </div>
        <button class="btn-primary" @click="savePreferences">
          <i class="bi bi-check-circle"></i> Guardar preferencias
        </button>
      </section>

      <!-- Seguridad -->
      <section class="card">
        <h2><i class="bi bi-shield-lock"></i> Seguridad</h2>
        <div class="form-group">
          <label>Nueva contraseña</label>
          <input type="password" v-model="form.password" />
        </div>
        <div class="form-group">
          <label>Confirmar contraseña</label>
          <input type="password" v-model="form.passwordConfirm" />
        </div>
        <button class="btn-danger" @click="updatePassword">
          <i class="bi bi-lock"></i> Actualizar contraseña
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  username: 'Usuario Ejemplo',
  email: 'usuario@correo.com',
  theme: 'light',
  notifications: true,
  password: '',
  passwordConfirm: ''
})

function saveProfile() {
  alert('Perfil actualizado ✅')
}
function savePreferences() {
  alert('Preferencias guardadas ✅')
}
function updatePassword() {
  if (form.password !== form.passwordConfirm) {
    alert('Las contraseñas no coinciden ❌')
    return
  }
  alert('Contraseña actualizada 🔒')
}
</script>

<style scoped>
.settings {
  padding: 24px;
  background: #FFFFFF;
  min-height: 100vh;
  display: grid;
  gap: 24px;
}

.settings-header h1 {
  font-size: 26px;
  font-weight: 800;
  color: var(--morado-oscuro);
  display: flex;
  align-items: center;
  gap: 8px;
}
.subtitle {
  color: #555;
  margin-top: 4px;
}

.settings-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.card {
  background: var(--blanco);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  display: grid;
  gap: 16px;
}
.card h2 {
  font-size: 18px;
  font-weight: 700;
  color: var(--morado-intermedio);
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.form-group {
  display: grid;
  gap: 6px;
}
label {
  font-weight: 600;
  color: #333;
}
input, select {
  padding: 10px;
  border: 1px solid var(--morado-suave);
  border-radius: 10px;
  font-size: 14px;
  outline: none;
}
input:focus, select:focus {
  border-color: var(--morado-base);
  box-shadow: 0 0 0 3px rgba(109,40,217,0.25);
}

.btn-primary {
  background: linear-gradient(135deg, var(--morado-base), var(--morado-intermedio));
  color: var(--blanco);
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}
.btn-primary:hover {
  background: linear-gradient(135deg, var(--morado-oscuro), var(--morado-base));
}

.btn-danger {
  background: linear-gradient(135deg, #e11d48, #b91c1c);
  color: var(--blanco);
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: center;
}
.btn-danger:hover {
  filter: brightness(1.1);
}
</style>
