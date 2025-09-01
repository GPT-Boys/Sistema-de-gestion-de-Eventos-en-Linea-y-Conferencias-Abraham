// Pequeña "DB" en localStorage para mocks

const LS_KEYS = {
  USERS: 'aes_users',
  AUTH:  'aes_auth_session',
}

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback }
  catch { return fallback }
}
function write(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

export function seedIfNeeded() {
  const users = read(LS_KEYS.USERS, null)
  if (!users) {
    const seed = [
      {
        id: 1,
        usuario: 'admin',
        contrasenia: 'admin1234',     // plain para mock
        rol: 'admin',                 // 'admin' | 'personal' | 'orador' | 'asistente'
        nombres: 'Admin',
        apellidos: 'Principal',
        fecha_nacimiento: '1990-01-01',
        ciudad: 'lp',
        telefono: '70000000',
        correo_electronico: 'admin@aes.com',
        fecha_creacion: new Date().toISOString(),
      },
      {
        id: 2,
        usuario: 'fabrisio',
        contrasenia: '12345678',
        rol: 'orador',
        nombres: 'Fabrisio',
        apellidos: 'Condarco',
        fecha_nacimiento: '1999-05-11',
        ciudad: 'lp',
        telefono: '70123456',
        correo_electronico: 'fabrisio@aes.com',
        fecha_creacion: new Date().toISOString(),
      },
    ]
    write(LS_KEYS.USERS, seed)
  }
}

// ==== AUTH ====
export function getSavedSession() {
  return read(LS_KEYS.AUTH, null)
}
export function saveSession(session) {
  write(LS_KEYS.AUTH, session)
}
export function clearSession() {
  localStorage.removeItem(LS_KEYS.AUTH)
}

export function findUserByUsername(usuario) {
  const users = read(LS_KEYS.USERS, [])
  return users.find(u => u.usuario === usuario) || null
}
export function verifyPassword(user, plain) {
  // mock simple (no hash)
  return user?.contrasenia === plain
}

// ==== USERS CRUD ====
export function listUsers({ page=1, pageSize=10, q='', sortBy='usuario', sortDir='asc' } = {}) {
  const all = read(LS_KEYS.USERS, [])
  const term = q.trim().toLowerCase()

  let filtered = !term ? all : all.filter(u =>
    [u.usuario, u.nombres, u.apellidos, u.correo_electronico]
      .filter(Boolean).some(x => String(x).toLowerCase().includes(term))
  )

  filtered = filtered.sort((a,b) => {
    const av = (a[sortBy] ?? '').toString().toLowerCase()
    const bv = (b[sortBy] ?? '').toString().toLowerCase()
    if (av < bv) return sortDir === 'asc' ? -1 : 1
    if (av > bv) return sortDir === 'asc' ?  1 : -1
    return 0
  })

  const total = filtered.length
  const start = (page-1)*pageSize
  const end   = start + pageSize
  const items = filtered.slice(start, end)

  return { items, total }
}

export function createUser(user) {
  const users = read(LS_KEYS.USERS, [])
  const exists = users.some(u => u.usuario === user.usuario || u.correo_electronico === user.correo_electronico)
  if (exists) throw new Error('Usuario o correo ya existen')
  const id = users.length ? Math.max(...users.map(u=>u.id)) + 1 : 1
  const nuevo = {
    id,
    fecha_creacion: new Date().toISOString(),
    ...user,
  }
  users.push(nuevo)
  write(LS_KEYS.USERS, users)
  return nuevo
}

export function updateUser(id, patch) {
  const users = read(LS_KEYS.USERS, [])
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) throw new Error('Usuario no encontrado')
  users[idx] = { ...users[idx], ...patch }
  write(LS_KEYS.USERS, users)
  return users[idx]
}

export function deleteUser(id) {
  const users = read(LS_KEYS.USERS, [])
  const next = users.filter(u => u.id !== id)
  write(LS_KEYS.USERS, next)
}
