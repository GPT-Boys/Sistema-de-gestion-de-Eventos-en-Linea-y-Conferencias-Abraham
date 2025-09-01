// src/services/publicService.js
import api from '../API/axios'

// LOGIN: backend espera { usuario, password }
export const login = async (usuario, password) => {
  const { data } = await api.post('/auth/login', { usuario, password })
  return data // ResponseDTO
}

// REGISTER: asegúrate de mandar el payload anidado
export const createUser = async (userData) => {
  // Si userData YA viene anidado, puedes enviar directo:
  const { data } = await api.post('/usuario', userData)
  return data // ResponseDTO (U-000 si OK)
}

export const status = async () => {
  const { data } = await api.get('/auth/status')
  return data // ResponseDTO
}

export const logout = async () => {
  const { data } = await api.get('/auth/logout')
  return data // ResponseDTO
}
