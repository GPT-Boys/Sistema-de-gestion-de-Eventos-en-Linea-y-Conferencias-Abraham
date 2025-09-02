// Pinia store - Charlas
import { defineStore } from 'pinia'

// helpers de fecha/hora -> estado
function buildDate(dateStr, timeStr) {
  // Desarmar manualmente la fecha para evitar desfase UTC
  const [y, m, d] = dateStr.split('-').map(Number)
  const [hh, mm]  = timeStr?.split(':').map(Number) || [0, 0]
  return new Date(y, m - 1, d, hh, mm, 0) // fecha/hora en local
}

function statusFor(conf, now = new Date()) {
  if (!conf?.fecha || !conf?.horaEmpieza || !conf?.horaTermina) {
    return 'upcoming'
  }
  const start = buildDate(conf.fecha, conf.horaEmpieza)
  const end   = buildDate(conf.fecha, conf.horaTermina)
  if (now < start) return 'upcoming'
  if (now > end)   return 'finished'
  return 'live'
}

const LS_ALL = 'conf:all'
const LS_ENR = (uid) => `conf:enrolled:${uid}`
const LS_VOT = (uid) => `conf:votes:${uid}`

export const useConferenciasStore = defineStore('conf', {
  state: () => ({
    loaded: false,
    list: [],
  }),

  getters: {
    ordered: (s) => [...s.list].sort((a,b) => {
      const A = buildDate(a.fecha, a.horaEmpieza).getTime()
      const B = buildDate(b.fecha, b.horaEmpieza).getTime()
      return A - B
    }),
    getById: (s) => (id) => s.list.find(c => String(c.idConferencia) === String(id)),
    statusOf: () => (conf) => statusFor(conf),
    byOrador: (s) => (oradorId) => s.ordered.filter(c => String(c.idOrador) === String(oradorId)),

    upcomingList: (s) => s.ordered.filter(c => statusFor(c) === 'upcoming'),
    liveList:     (s) => s.ordered.filter(c => statusFor(c) === 'live'),
    finishedList: (s) => s.ordered.filter(c => statusFor(c) === 'finished'),

    activeList: (s) => s.ordered.filter(c => {
      const st = statusFor(c)
      return st === 'upcoming' || st === 'live'
    }),
  },

  actions: {
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
      if (!conf) return { ok:false, reason:'not_found' }

      const st = statusFor(conf)
      if (st !== 'upcoming') {
        return { ok:false, reason:'time_locked', status:st }
      }

      const set = this._getEnrollSet(userId)
      const key = String(confId)
      let enrolled
      if (set.has(key)) { set.delete(key); enrolled = false } 
      else { set.add(key); enrolled = true }
      this._saveEnrollSet(userId, set)
      return { ok:true, enrolled }
    },
    enrolledForUser(userId) {
      const set = this._getEnrollSet(userId)
      return this.ordered.filter(c => set.has(String(c.idConferencia)))
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
      if (!conf) return { ok:false, reason:'not_found' }

      const st = statusFor(conf)
      if (!['live','finished'].includes(st)) {
        return { ok:false, reason:'not_live_or_finished' }
      }

      if (!this.isEnrolled(userId, confId)) {
        return { ok:false, reason:'not_enrolled' }
      }

      const map = this._getVotesMap(userId)
      const key = String(confId)
      if (map[key]) return { ok:false, reason:'already_voted' }

      if (like) conf.votosAFavor += 1
      else conf.votosEnContra += 1
      map[key] = like ? 'up' : 'down'

      this._saveAll()
      this._saveVotesMap(userId, map)
      return { ok:true }
    },

    // Crear charla
    createFromOrador(payload, oradorId) {
      this._loadAll()
      const nextId =
        this.list.length ? Math.max(...this.list.map(i => i.idConferencia)) + 1 : 1

      const conf = {
        idConferencia: nextId,
        titulo: payload.titulo,
        descripcion: payload.descripcion,
        idMarcaConferencia: Number(payload.idMarcaConferencia),
        idOrador: Number(oradorId),
        idTipoConferencia: Number(payload.idTipoConferencia),
        votosAFavor: 0,
        votosEnContra: 0,
        fecha: payload.fecha, // mantener como string "YYYY-MM-DD"
        horaEmpieza: payload.horaEmpieza,
        horaTermina: payload.horaTermina,
        sala: payload.sala,
        evaluacion: payload.evaluacion || '',
        zoomUrl: payload.zoomUrl || '',
        materiales: payload.materialUrl 
          ? [{ id: Date.now(), nombre: payload.nombreArchivo || 'material', url: payload.materialUrl }]
          : [],
      }

      this.list.push(conf)
      this._saveAll()
      return conf
    },

    addMaterial(confId, archivo) {
      this._loadAll()
      const conf = this.getById(confId)
      if (!conf) return { ok:false, reason:'not_found' }
      if (!conf.materiales) conf.materiales = []

      conf.materiales.push({
        id: Date.now(),
        nombre: archivo.nombre,
        url: archivo.url,
      })

      this._saveAll()
      return { ok:true }
    }
  }
})
