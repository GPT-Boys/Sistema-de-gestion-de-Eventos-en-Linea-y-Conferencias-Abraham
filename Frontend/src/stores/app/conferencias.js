// Pinia store - Charlas
import { defineStore } from 'pinia'

// helpers de fecha/hora -> estado
function buildDate(dateStr, timeStr) {
  // Desarmar manualmente la fecha para evitar desfase UTC
  const [y, m, d] = dateStr.split('-').map(Number)
  const [hh, mm] = timeStr?.split(':').map(Number) || [0, 0]
  return new Date(y, m - 1, d, hh, mm, 0) // fecha/hora en local
}

function statusFor(conf, now = new Date()) {
  if (!conf?.fecha || !conf?.horaEmpieza || !conf?.horaTermina) {
    return 'upcoming'
  }
  const start = buildDate(conf.fecha, conf.horaEmpieza)
  const end = buildDate(conf.fecha, conf.horaTermina)
  if (now < start) return 'upcoming'
  if (now > end) return 'finished'
  return 'live'
}

const LS_ALL = 'conf:all'
const LS_ENR = (uid) => `conf:enrolled:${uid}`
const LS_VOT = (uid) => `conf:votes:${uid}`

export const useConferenciasStore = defineStore('conf', {
  state: () => ({
    loaded: false,
    list: [],
  loadingRemote: false,
  errorRemote: null,
  }),

  getters: {
    ordered: (s) =>
      [...s.list].sort((a, b) => {
        const A = buildDate(a.fecha, a.horaEmpieza).getTime()
        const B = buildDate(b.fecha, b.horaEmpieza).getTime()
        return A - B
      }),
    getById: (s) => (id) => s.list.find((c) => String(c.idConferencia) === String(id)),
    statusOf: () => (conf) => statusFor(conf),
    byOrador: (s) => (oradorId) => s.ordered.filter((c) => String(c.idOrador) === String(oradorId)),

    upcomingList: (s) => s.ordered.filter((c) => statusFor(c) === 'upcoming'),
    liveList: (s) => s.ordered.filter((c) => statusFor(c) === 'live'),
    finishedList: (s) => s.ordered.filter((c) => statusFor(c) === 'finished'),

    activeList: (s) =>
      s.ordered.filter((c) => {
        const st = statusFor(c)
        return st === 'upcoming' || st === 'live'
      }),
  },

  actions: {
    // --- Normalizador de conferencias recibidas del backend ---
    _normalizeApiConf(raw) {
      if (!raw) return null
      const toId = (v, key) => {
        if (v == null) return null
        if (typeof v === 'object') {
          // intenta extraer id_* dentro
            const k = Object.keys(v).find((n) => /id_?/.test(n) || n.startsWith('id_'))
            if (k && typeof v[k] !== 'object') return v[k]
            // casos específicos
            if (v.id_marca_conferencia) return v.id_marca_conferencia
            if (v.id_orador) return v.id_orador
            if (v.id_tipo_conferencia) return v.id_tipo_conferencia
        }
        return v
      }
      return {
        idConferencia: raw.id_conferencia,
        titulo: raw.titulo,
        descripcion: raw.descripcion,
        idMarcaConferencia: toId(raw.id_marca_conferencia, 'marca'),
        idOrador: toId(raw.id_orador, 'orador'),
        idTipoConferencia: toId(raw.id_tipo_conferencia, 'tipo'),
        votosAFavor: raw.votos_a_favor ?? 0,
        votosEnContra: raw.votos_en_contra ?? 0,
        fecha: raw.fecha,
        horaEmpieza: raw.hora_empieza,
        horaTermina: raw.hora_termina,
        sala: raw.sala,
        evaluacion: raw.evaluacion || '',
        materiales: raw.material
          ? [
              {
                id: Date.now() + Math.random(),
                nombre: 'material',
                url: raw.material,
              },
            ]
          : [],
        zoomUrl: raw.zoom_url || raw.zoomUrl || '',
      }
    },

    // Carga desde backend y sincroniza el store/localStorage
    async fetchAllRemote({ force = false } = {}) {
      this.loadingRemote = true
      this.errorRemote = null
      // Evitar recargas innecesarias si ya tenemos datos
      if (!force && this.list.length > 0) {
        // aún así podríamos querer refrescar; se controla con force
      }
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:3000'
        const res = await fetch(`${base}/api/conferencia`)
        const text = await res.text()
        let payload
        try {
          payload = JSON.parse(text)
        } catch (e) {
          console.error('Respuesta no JSON de conferencias:', text)
          this.errorRemote = 'Respuesta inválida del servidor'
          this.loadingRemote = false
          return { ok: false, error: 'Respuesta inválida del servidor' }
        }
        if (!res.ok || payload.code !== 'C-000') {
          this.errorRemote = payload.message || 'Error al obtener conferencias'
          this.loadingRemote = false
          return { ok: false, error: this.errorRemote }
        }
        const incoming = Array.isArray(payload.data) ? payload.data.map(this._normalizeApiConf) : []
        // Merge: crear mapa actual
        const map = new Map(this.list.map((c) => [String(c.idConferencia), c]))
        for (const conf of incoming) {
          map.set(String(conf.idConferencia), { ...map.get(String(conf.idConferencia)), ...conf })
        }
        this.list = [...map.values()]
        this._saveAll()
        this.loadingRemote = false
        return { ok: true, total: this.list.length }
      } catch (e) {
        console.error('Error fetchAllRemote conferencias:', e)
        this.errorRemote = e.message
        this.loadingRemote = false
        return { ok: false, error: this.errorRemote }
      }
    },

    _saveAll() {
      localStorage.setItem(LS_ALL, JSON.stringify(this.list))
    },
    _loadAll() {
      if (this.loaded) return
      const raw = localStorage.getItem(LS_ALL)
      this.list = raw ? JSON.parse(raw) : []
      this.loaded = true
    },

    // Enrolamientos
    _getEnrollSet(userId) {
      const raw = localStorage.getItem(LS_ENR(userId))
      return new Set(raw ? JSON.parse(raw) : [])
    },
    _saveEnrollSet(userId, set) {
      localStorage.setItem(LS_ENR(userId), JSON.stringify([...set]))
    },
    isEnrolled(userId, confId) {
      const set = this._getEnrollSet(userId)
      return set.has(String(confId))
    },
    toggleEnroll(userId, confId) {
      this._loadAll()
      const conf = this.getById(confId)
      if (!conf) return { ok: false, reason: 'not_found' }

      const st = statusFor(conf)
      if (st !== 'upcoming') {
        return { ok: false, reason: 'time_locked', status: st }
      }

      const set = this._getEnrollSet(userId)
      const key = String(confId)
      let enrolled
      if (set.has(key)) {
        set.delete(key)
        enrolled = false
      } else {
        set.add(key)
        enrolled = true
      }
      this._saveEnrollSet(userId, set)
      return { ok: true, enrolled }
    },
    enrolledForUser(userId) {
      const set = this._getEnrollSet(userId)
      return this.ordered.filter((c) => set.has(String(c.idConferencia)))
    },

    // Votos
    _getVotesMap(userId) {
      const raw = localStorage.getItem(LS_VOT(userId))
      return raw ? JSON.parse(raw) : {}
    },
    _saveVotesMap(userId, map) {
      localStorage.setItem(LS_VOT(userId), JSON.stringify(map))
    },
    myVote(userId, confId) {
      const map = this._getVotesMap(userId)
      return map[String(confId)] || null
    },
    vote(userId, confId, like = true) {
      this._loadAll()
      const conf = this.getById(confId)
      if (!conf) return { ok: false, reason: 'not_found' }

      const st = statusFor(conf)
      if (!['live', 'finished'].includes(st)) {
        return { ok: false, reason: 'not_live_or_finished' }
      }

      if (!this.isEnrolled(userId, confId)) {
        return { ok: false, reason: 'not_enrolled' }
      }

      const map = this._getVotesMap(userId)
      const key = String(confId)
      if (map[key]) return { ok: false, reason: 'already_voted' }

      if (like) conf.votosAFavor += 1
      else conf.votosEnContra += 1
      map[key] = like ? 'up' : 'down'

      this._saveAll()
      this._saveVotesMap(userId, map)
      return { ok: true }
    },


    // Crear charla en backend y actualizar store si es exitosa
    async createFromOradorRemoto(payload, oradorId) {
      // Construir el objeto esperado por el backend
      const conferencia = {
        titulo: payload.titulo,
        descripcion: payload.descripcion,
        marca_conferencia: { id_marca_conferencia: Number(payload.idMarcaConferencia) },
        orador: { id_orador: Number(oradorId) },
        tipo_conferencia: { id_tipo_conferencia: Number(payload.idTipoConferencia) },
        fecha: payload.fecha,
        hora_empieza: payload.horaEmpieza,
        hora_termina: payload.horaTermina,
        sala: payload.sala,
        evaluacion: payload.evaluacion || '',
        material: payload.materialUrl || '',
        zoom_url: payload.zoomUrl || '',
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/conferencia`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(conferencia),
        })
        const text = await res.text()
        let data
        try {
          data = JSON.parse(text)
        } catch (err) {
          throw new Error('Respuesta inesperada del backend: ' + text)
        }
        if (!res.ok || data.code !== 'C-000') throw new Error(data.message || 'Error al crear conferencia')
        this.list.push({
          idConferencia: data.data.id_conferencia,
          titulo: data.data.titulo,
          descripcion: data.data.descripcion,
          idMarcaConferencia: data.data.id_marca_conferencia,
          idOrador: data.data.id_orador,
          idTipoConferencia: data.data.id_tipo_conferencia,
          votosAFavor: data.data.votos_a_favor,
          votosEnContra: data.data.votos_en_contra,
          fecha: data.data.fecha,
          horaEmpieza: data.data.hora_empieza,
          horaTermina: data.data.hora_termina,
          sala: data.data.sala,
          evaluacion: data.data.evaluacion,
          materiales: data.data.material ? [{ id: Date.now(), nombre: payload.nombreArchivo || 'material', url: data.data.material }] : [],
          zoomUrl: data.data.zoom_url || '',
        })
        this._saveAll()
        return { ok: true, data: data.data }
      } catch (e) {
        return { ok: false, error: e.message }
      }
    },

    addMaterial(confId, archivo) {
      this._loadAll()
      const conf = this.getById(confId)
      if (!conf) return { ok: false, reason: 'not_found' }
      if (!conf.materiales) conf.materiales = []

      conf.materiales.push({
        id: Date.now(),
        nombre: archivo.nombre,
        url: archivo.url,
      })

      this._saveAll()
      return { ok: true }
    },
  },
})
