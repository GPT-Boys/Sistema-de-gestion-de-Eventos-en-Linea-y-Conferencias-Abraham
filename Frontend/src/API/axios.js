// src/API/axios.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // 🔑 asegura envío de cookie
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
})

// opcional: interceptor de errores 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
