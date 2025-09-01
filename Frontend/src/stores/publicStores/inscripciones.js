import { defineStore } from 'pinia'

const LS_KEY = 'aes_inscripciones_v1'
const load = () => { try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}') } catch { return {} } }
const save = (s) => localStorage.setItem(LS_KEY, JSON.stringify(s))

export const useInscripcionesStore = defineStore('inscripciones', {
  state: () => ({
    byUser: load(), // { [userId]: number[] }
  }),
  getters: {
    listByUser: (s) => (userId) => Array.from(new Set(s.byUser[userId] || [])),
    isInscrito: (s) => (userId, confId) => (s.byUser[userId] || []).includes(confId),
  },
  actions: {
    subscribe(userId, confId){
      if(!userId || !confId) return
      if(!this.byUser[userId]) this.byUser[userId] = []
      if(!this.byUser[userId].includes(confId)) this.byUser[userId].push(confId)
      save(this.byUser)
    },
    unsubscribe(userId, confId){
      if(!userId || !confId) return
      if(!this.byUser[userId]) return
      this.byUser[userId] = this.byUser[userId].filter(id => id !== confId)
      save(this.byUser)
    },
    clearUser(userId){
      delete this.byUser[userId]
      save(this.byUser)
    }
  }
})
