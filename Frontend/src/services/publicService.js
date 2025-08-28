import api from '@/API/axios'

export const login = async (usuario, password) => {
  // Passport LocalStrategy usa { usuario, password }
  const { data } = await api.post('/auth/login', { usuario, password }, { withCredentials: true })
  return data
}

export const createUser = async (userData) => {
  const { data } = await api.post('/usuario', userData)
  return data
}

export const logout = async () => {
  const { data } = await api.get('/auth/logout')
  return data
}
