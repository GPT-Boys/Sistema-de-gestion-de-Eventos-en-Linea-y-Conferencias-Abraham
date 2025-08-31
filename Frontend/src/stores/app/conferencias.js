// Pinia store - Charlas (solo frontend, persiste en localStorage)
import { defineStore } from 'pinia'

// helpers de fecha/hora -> estado
function buildDate(dateStr, timeStr) {
  // dateStr: 'YYYY-MM-DD'  | timeStr: 'HH:mm' (24h)
  return new Date(`${dateStr}T${timeStr}:00`)
}
function statusFor(conf, now = new Date()) {
  const start = buildDate(conf.fecha, conf.horaEmpieza)
  const end   = buildDate(conf.fecha, conf.horaTermina)
  if (now < start) return 'upcoming'   // Próxima
  if (now > end)   return 'finished'   // Finalizada
  return 'live'                         // En curso
}

const LS_ALL = 'conf:all'
const LS_ENR = (uid) => `conf:enrolled:${uid}`     // Set de ids (stringificados)
const LS_VOT = (uid) => `conf:votes:${uid}`        // { [id]: 'up'|'down' }

export const useConferenciasStore = defineStore('conf', {
  state: () => ({
    loaded: false,
    list: [],             // array de charlas
  }),

  getters: {
    // Lista ordenada por fecha/hora
    ordered: (s) => [...s.list].sort((a,b) => {
      const A = buildDate(a.fecha, a.horaEmpieza).getTime()
      const B = buildDate(b.fecha, b.horaEmpieza).getTime()
      return A - B
    }),
    getById: (s) => (id) => s.list.find(c => String(c.idConferencia) === String(id)),
    statusOf: () => (conf) => statusFor(conf),
    byOrador: (s) => (oradorId) => s.ordered.filter(c => String(c.idOrador) === String(oradorId)),
    // Filtrados por estado
    upcomingList: (s) => s.ordered.filter(c => statusFor(c) === 'upcoming'),
    liveList:     (s) => s.ordered.filter(c => statusFor(c) === 'live'),
    finishedList: (s) => s.ordered.filter(c => statusFor(c) === 'finished'),
  },

  actions: {
    // --- Persistencia base
    _saveAll() {
      localStorage.setItem(LS_ALL, JSON.stringify(this.list))
    },
    _loadAll() {
      if (this.loaded) return
      const raw = localStorage.getItem(LS_ALL)
      this.list = raw ? JSON.parse(raw) : []
      this.loaded = true
    },

    // --- Enrolamientos por usuario
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
      const set = this._getEnrollSet(userId)
      const key = String(confId)
      if (set.has(key)) set.delete(key); else set.add(key)
      this._saveEnrollSet(userId, set)
      return set.has(key)
    },
    enrolledForUser(userId) {
      const set = this._getEnrollSet(userId)
      return this.ordered.filter(c => set.has(String(c.idConferencia)))
    },

    // --- Votos por usuario
    _getVotesMap(userId) {
      const raw = localStorage.getItem(LS_VOT(userId))
      return raw ? JSON.parse(raw) : {} // { [confId]: 'up'|'down' }
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
      if (st !== 'finished') return { ok:false, reason:'not_finished' }

      const map = this._getVotesMap(userId)
      const key = String(confId)
      if (map[key]) return { ok:false, reason:'already_voted' }

      if (like) conf.votosAFavor += 1; else conf.votosEnContra += 1
      map[key] = like ? 'up' : 'down'

      this._saveAll()
      this._saveVotesMap(userId, map)
      return { ok:true }
    },

    // --- Crear charla (orador)
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
        fecha: payload.fecha,                // 'YYYY-MM-DD'
        horaEmpieza: payload.horaEmpieza,    // 'HH:mm'
        horaTermina: payload.horaTermina,    // 'HH:mm'
        sala: payload.sala,
        evaluacion: payload.evaluacion || '', // URL Google Forms
        materialUrl: payload.materialUrl || '', // por ahora URL (BLOB más adelante)
        zoomUrl: payload.zoomUrl || '',        // enlace a Zoom
      }

      this.list.push(conf)
      this._saveAll()
      return conf
    },
  }
})
