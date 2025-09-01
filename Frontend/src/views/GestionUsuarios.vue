<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '@/stores/publicStores/users'
import { useAuthStore } from '@/stores/publicStores/auth' // por si quieres usar datos del user logueado

const us = useUsersStore()
const auth = useAuthStore()

const showModal = ref(false)
const editing = ref(null) // null = crear; objeto = editar
const confirmDel = ref(null)

const form = ref({
  usuario: '', contrasenia: '',
  rol: 'asistente',
  nombres: '', apellidos: '',
  fecha_nacimiento: '', ciudad: 'lp',
  telefono: '', correo_electronico: ''
})

function openCreate() {
  editing.value = null
  form.value = {
    usuario: '', contrasenia: '',
    rol: 'asistente',
    nombres: '', apellidos: '',
    fecha_nacimiento: '',
    ciudad: 'lp',
    telefono: '',
    correo_electronico: ''
  }
  showModal.value = true
}
function openEdit(u) {
  editing.value = { id: u.id }
  form.value = {
    usuario: u.usuario, contrasenia: u.contrasenia,
    rol: u.rol,
    nombres: u.nombres, apellidos: u.apellidos,
    fecha_nacimiento: u.fecha_nacimiento,
    ciudad: u.ciudad,
    telefono: u.telefono, correo_electronico: u.correo_electronico
  }
  showModal.value = true
}
async function submitForm() {
  const payload = { ...form.value }
  if (editing.value) {
    await us.update(editing.value.id, payload)
  } else {
    await us.create(payload)
  }
  showModal.value = false
}
async function removeUser() {
  if (!confirmDel.value) return
  await us.remove(confirmDel.value.id)
  confirmDel.value = null
}

function sort(col) {
  if (us.sortBy === col) { us.sortDir = us.sortDir === 'asc' ? 'desc' : 'asc' }
  else { us.sortBy = col; us.sortDir = 'asc' }
  us.page = 1
  us.load()
}

const startIdx = computed(() => (us.page - 1) * us.pageSize + 1)
const endIdx = computed(() => Math.min(us.page*us.pageSize, us.total))

onMounted(() => us.load())
</script>

<template>
  <div class="users">
    <header class="head">
      <div>
        <h1>Gestión de usuarios</h1>
        <p class="muted">Administra cuentas de asistentes, oradores y equipo.</p>
      </div>
      <div class="actions">
        <input
          class="search" type="search" placeholder="Buscar por usuario, nombre o email…"
          v-model="us.q" @input="us.page=1; us.load()" />
        <button class="btn btn-primary" @click="openCreate">
          <i class="bi bi-person-plus"></i> Nuevo usuario
        </button>
      </div>
    </header>

    <div class="card">
      <div class="toolbar">
        <div class="left">
          <span class="muted">Mostrando {{ startIdx }}–{{ endIdx }} de {{ us.total }}</span>
        </div>
        <div class="right">
          <label>
            <span class="muted">Filas</span>
            <select v-model.number="us.pageSize" @change="us.page=1; us.load()">
              <option :value="5">5</option>
              <option :value="8">8</option>
              <option :value="12">12</option>
            </select>
          </label>
        </div>
      </div>

      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th @click="sort('usuario')">Usuario <i class="bi" :class="us.sortBy==='usuario'?(us.sortDir==='asc'?'bi-caret-up-fill':'bi-caret-down-fill'):''"></i></th>
              <th @click="sort('nombres')">Nombres <i class="bi" :class="us.sortBy==='nombres'?(us.sortDir==='asc'?'bi-caret-up-fill':'bi-caret-down-fill'):''"></i></th>
              <th @click="sort('apellidos')">Apellidos <i class="bi" :class="us.sortBy==='apellidos'?(us.sortDir==='asc'?'bi-caret-up-fill':'bi-caret-down-fill'):''"></i></th>
              <th>Rol</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th style="width:120px;">Acciones</th>
            </tr>
          </thead>
          <tbody v-if="!us.loading && us.items.length">
            <tr v-for="u in us.items" :key="u.id">
              <td><strong>{{ u.usuario }}</strong></td>
              <td>{{ u.nombres }}</td>
              <td>{{ u.apellidos }}</td>
              <td><span class="chip">{{ u.rol }}</span></td>
              <td>{{ u.correo_electronico }}</td>
              <td>{{ u.telefono }}</td>
              <td class="actions-cell">
                <button class="icon" @click="openEdit(u)" title="Editar"><i class="bi bi-pencil-square"></i></button>
                <button class="icon danger" @click="confirmDel=u" title="Eliminar"><i class="bi bi-trash3"></i></button>
              </td>
            </tr>
          </tbody>
          <tbody v-else-if="us.loading">
            <tr><td colspan="7"><div class="skeleton h40"></div></td></tr>
            <tr><td colspan="7"><div class="skeleton h40"></div></td></tr>
            <tr><td colspan="7"><div class="skeleton h40"></div></td></tr>
          </tbody>
          <tbody v-else>
            <tr><td colspan="7" class="empty">Sin resultados</td></tr>
          </tbody>
        </table>
      </div>

      <div class="pager" v-if="us.pages > 1">
        <button :disabled="us.page===1" @click="us.page--; us.load()">Anterior</button>
        <span>Página {{ us.page }} de {{ us.pages }}</span>
        <button :disabled="us.page===us.pages" @click="us.page++; us.load()">Siguiente</button>
      </div>
    </div>

    <!-- Modal Crear/Editar -->
    <div v-if="showModal" class="backdrop" @click.self="showModal=false">
      <div class="modal">
        <header class="modal-head">
          <h3>{{ editing ? 'Editar usuario' : 'Nuevo usuario' }}</h3>
          <button class="icon" @click="showModal=false">×</button>
        </header>

        <div class="grid">
          <label>Usuario <input v-model.trim="form.usuario" placeholder="usuario" /></label>
          <label>Contraseña <input v-model="form.contrasenia" type="password" placeholder="••••••••" /></label>
          <label>Nombres <input v-model.trim="form.nombres" /></label>
          <label>Apellidos <input v-model.trim="form.apellidos" /></label>
          <label>Rol
            <select v-model="form.rol">
              <option value="admin">Admin</option>
              <option value="personal">Personal de apoyo</option>
              <option value="orador">Orador</option>
              <option value="asistente">Asistente</option>
            </select>
          </label>
          <label>Ciudad
            <select v-model="form.ciudad">
              <option value="lp">La Paz</option><option value="cb">Cochabamba</option>
              <option value="sc">Santa Cruz</option><option value="or">Oruro</option>
              <option value="pt">Potosí</option><option value="tj">Tarija</option>
              <option value="ch">Chuquisaca</option><option value="bn">Beni</option><option value="pn">Pando</option>
            </select>
          </label>
          <label>Fecha de nacimiento <input v-model="form.fecha_nacimiento" type="date" /></label>
          <label>Teléfono <input v-model.trim="form.telefono" /></label>
          <label>Email <input v-model.trim="form.correo_electronico" type="email" /></label>
        </div>

        <footer class="modal-foot">
          <button class="btn" @click="showModal=false">Cancelar</button>
          <button class="btn btn-primary" @click="submitForm">{{ editing ? 'Guardar' : 'Crear' }}</button>
        </footer>
      </div>
    </div>

    <!-- Confirm delete -->
    <div v-if="confirmDel" class="backdrop" @click.self="confirmDel=null">
      <div class="modal">
        <header class="modal-head">
          <h3>Eliminar usuario</h3>
          <button class="icon" @click="confirmDel=null">×</button>
        </header>
        <p>¿Eliminar <strong>{{ confirmDel.usuario }}</strong>? Esta acción no se puede deshacer.</p>
        <footer class="modal-foot">
          <button class="btn" @click="confirmDel=null">Cancelar</button>
          <button class="btn danger" @click="removeUser">Eliminar</button>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root{
  --purple-700:#6d28d9; --purple-500:#8b5cf6;
  --muted:#64748b; --ring:0 0 0 3px rgba(109,40,217,.22);
}
.users{ display:grid; gap:12px; }
.head{ display:flex; align-items:center; justify-content:space-between; gap:12px; }
.head h1{ margin:0; font-size:22px; }
.muted{ color:#64748b; margin:2px 0 0; }
.actions{ display:flex; gap:10px; align-items:center; }
.search{
  width:320px; max-width:55vw; padding:10px 12px; border-radius:12px;
  border:1px solid #e5e7eb; outline:none;
}
.search:focus{ border-color:var(--purple-700); box-shadow:var(--ring); }

.btn{ border:none; border-radius:12px; padding:10px 14px; font-weight:700; cursor:pointer; }
.btn-primary{ background:linear-gradient(135deg, var(--purple-700), var(--purple-500)); color:#fff; }

.card{ background:#fff; border:1px solid #eef0f4; border-radius:16px; padding:12px; box-shadow:0 10px 30px rgba(17,24,39,.06); }
.toolbar{ display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.toolbar select{ border:1px solid #e5e7eb; border-radius:10px; padding:6px 8px; margin-left:6px; }

.table-wrap{ overflow:auto; }
.table{ width:100%; border-collapse:separate; border-spacing:0 8px; }
.table th, .table td{ text-align:left; padding:10px 12px; }
.table thead th{ font-size:12px; color:#475569; user-select:none; cursor:pointer; }
.table tbody tr{ background:#fafbff; border:1px solid #f1f5f9; border-radius:12px; }
.table tbody tr td:first-child{ border-left:8px solid transparent; }
.empty{ text-align:center; padding:24px; color:#64748b; }

.chip{ background:#eef2ff; color:#4338ca; border-radius:999px; padding:4px 8px; font-size:12px; font-weight:700; }
.actions-cell{ display:flex; gap:8px; }
.icon{ border:none; background:#fff; border-radius:10px; width:36px; height:36px; display:grid; place-items:center; cursor:pointer; }
.icon:hover{ background:#f3f4f6; }
.icon.danger{ color:#b91c1c; }

.pager{ display:flex; gap:12px; justify-content:center; align-items:center; padding:10px; }
.pager button{ border:1px solid #e5e7eb; background:#fff; border-radius:10px; padding:6px 10px; }
.skeleton{ background:linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 37%,#f3f4f6 63%); background-size:400% 100%; animation:shimmer 1.2s infinite; border-radius:10px; }
.h40{ height:40px; }
@keyframes shimmer { 0%{background-position:100% 0} 100%{background-position:0 0} }

.backdrop{ position:fixed; inset:0; background:rgba(0,0,0,.45); display:grid; place-items:center; padding:16px; z-index:50; }
.modal{ width:min(720px,95vw); background:#fff; border-radius:16px; overflow:hidden; box-shadow:0 30px 80px rgba(0,0,0,.45); }
.modal-head{ display:flex; justify-content:space-between; align-items:center; padding:12px 14px; border-bottom:1px solid #f1f5f9; }
.modal-head h3{ margin:0; font-size:18px; }
.modal-foot{ display:flex; justify-content:flex-end; gap:10px; padding:12px 14px; border-top:1px solid #f1f5f9; }
.modal .btn{ background:#e5e7eb; }
.modal .btn.danger{ background:#fee2e2; color:#991b1b; }
.modal .btn.btn-primary{ background:linear-gradient(135deg, var(--purple-700), var(--purple-500)); color:#fff; }
.modal .icon{ background:transparent; font-size:20px; width:auto; height:auto; }
.grid{ display:grid; gap:10px; padding:14px; grid-template-columns:repeat(2, minmax(0,1fr)); }
.grid label{ display:grid; gap:6px; font-size:13px; color:#374151; }
.grid input, .grid select{
  border:1px solid #e5e7eb; border-radius:10px; padding:10px 12px; outline:none;
}
.grid input:focus, .grid select:focus{ border-color:var(--purple-700); box-shadow:var(--ring); }

@media (max-width:720px){ .grid{ grid-template-columns:1fr; } .search{ width:100%; } }
</style>
