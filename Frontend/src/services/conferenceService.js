import api from '@/API/axios' // tu axios con withCredentials

// Crear conferencia (orador)
export const createConference = (payload) => api.post('/conferencias', payload)

// Mis conferencias (orador)
export const getMyConferences = () => api.get('/conferencias/mias')

// Todas las conferencias (asistente)
export const getAllConferences = (params = {}) => api.get('/conferencias', { params })

// Inscribirse (asistente)
export const enrollToConference = (idConferencia) =>
  api.post(`/conferencias/${idConferencia}/inscripciones`)
