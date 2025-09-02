import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  withCredentials: true, // <— necesario para sesión (cookie)
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
})

export default http
