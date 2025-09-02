// src/stores/publicStores/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

// Mapea distintas etiquetas a nuestros 4 roles
const mapRole = (v) => {
  if (!v) return null
  const s = String(v).toLowerCase().trim()
  if (['admin', 'administrador', 'administrator'].includes(s)) return 'admin'
  if (['staff', 'organizador', 'moderador'].includes(s)) return 'staff'
  if (['orador', 'speaker', 'ponente'].includes(s)) return 'orador'
  if (['asistente', 'attendee', 'participante'].includes(s)) return 'asistente'
  return null
}

// Normaliza la forma del usuario venga como venga del backend
const normalizeUser = (raw) => {
  if (!raw) return null
  const id = raw.id_usuario ?? raw.id ?? raw.ID_USUARIO
  const usuario = raw.usuario ?? raw.username ?? raw.USUARIO
  const tu = raw.TIPO_USUARIO ?? raw.userType ?? {}
  const id_tipo_usuario = tu.id_tipo_usuario ?? tu.idTipoUsuario
  const tipo_usuario = tu.tipo_usuario ?? tu.tipoUsuario

  const role = mapRole(tipo_usuario)

  return {
    id: id,
    id_usuario: id,
    usuario,
    TIPO_USUARIO: { id_tipo_usuario, tipo_usuario },
    role, // ⬅️ lo usará el SideNav
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    role: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (s) => !!s.user,
    uid: (s) => s.user?.id_usuario ?? null,
  },

  actions: {
    async fetchStatus() {
      try {
        const { data } = await api.get('/auth/status')
        if (data?.code === 'AUTH-000') {
          const u = normalizeUser(data.data)
          this.user = u
          this.role = u?.role
          this.error = null
        } else {
          this.user = null
          this.role = null
        }
      } catch {
        this.user = null
        this.role = null
      }
    },

    async login({ usuario, password, remember }) {
      this.loading = true
      try {
        const { data } = await api.post('/auth/login', { usuario, password, remember })
        if (data?.code === 'AUTH-000') {
          const u = normalizeUser(data.data)
          this.user = u
          this.role = u?.role
          this.error = null
          return true
        }
        this.user = null
        this.role = null
        this.error = data?.message || 'No autorizado'
        return false
      } catch (err) {
        this.user = null
        this.role = null
        this.error = err?.response?.data?.message || 'Error al iniciar sesión'
        return false
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await api.get('/auth/logout')
      } finally {
        this.user = null
        this.role = null
      }
    },
  },
})
