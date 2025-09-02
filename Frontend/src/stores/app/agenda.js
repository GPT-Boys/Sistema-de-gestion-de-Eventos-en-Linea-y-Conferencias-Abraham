// src/stores/app/agenda.js
import { defineStore } from 'pinia'

const LS_KEY = 'aes-registrations'

export const useAgendaStore = defineStore('agenda', {
  state: () => ({
    // 👇 Dataset de ejemplo. Cambia/añade según tu necesidad
    sessions: [
      {
        idConferencia: 101,
        titulo: 'Apertura: Tendencias IA 2025',
        descripcion: 'Qué viene en IA aplicada a industria y educación.',
        fecha: '2025-09-02',
        horaEmpieza: '10:30',
        horaTermina: '11:15',
        ciudad: 'La Paz',
        sala: 'Auditorio A',
        tipo: 'Keynote',
        orador: 'Dra. Valdez',
        zoomUrl: 'https://zoom.us/j/111111',
        tags: ['IA', 'Tendencias'],
        votosAFavor: 12,
        votosEnContra: 1,
      },
      {
        idConferencia: 102,
        titulo: 'Panel: Ciberseguridad moderna',
        descripcion: 'Riesgos actuales y buenas prácticas en 2025.',
        fecha: '2025-09-02',
        horaEmpieza: '12:00',
        horaTermina: '12:45',
        ciudad: 'La Paz',
        sala: 'Sala 2',
        tipo: 'Panel',
        orador: 'Equipo SecOps',
        zoomUrl: 'https://zoom.us/j/222222',
        tags: ['Seguridad', 'Infra'],
        votosAFavor: 18,
        votosEnContra: 2,
      },
      {
        idConferencia: 103,
        titulo: 'Taller: Prompt Engineering',
        descripcion: 'Práctico con prompts útiles para el trabajo diario.',
        fecha: '2025-09-02',
        horaEmpieza: '15:00',
        horaTermina: '16:00',
        ciudad: 'La Paz',
        sala: 'Lab 1',
        tipo: 'Taller',
        orador: 'Ing. R. Rivera',
        zoomUrl: 'https://zoom.us/j/333333',
        tags: ['IA', 'Productividad'],
        votosAFavor: 25,
        votosEnContra: 3,
      },
    ],

    // Conjunto de inscripciones, persistido en localStorage
    myRegistrations: new Set(JSON.parse(localStorage.getItem(LS_KEY) || '[]')),
  }),

  getters: {
    isEnrolled: (s) => (id) => s.myRegistrations.has(id),
  },

  actions: {
    enroll(id) {
      this.myRegistrations.add(id)
      this.persist()
    },
    unenroll(id) {
      this.myRegistrations.delete(id)
      this.persist()
    },
    toggleEnroll(id) {
      this.isEnrolled(id) ? this.unenroll(id) : this.enroll(id)
    },
    persist() {
      localStorage.setItem(LS_KEY, JSON.stringify([...this.myRegistrations]))
    },
  },
})
