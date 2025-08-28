const base = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function apiLogin(email, password) {
  const res = await fetch(`${base}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error en login')
  return data
}
