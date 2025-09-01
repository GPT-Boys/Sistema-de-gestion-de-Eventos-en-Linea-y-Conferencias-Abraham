// Roles: 'admin' | 'staff' | 'orador' | 'asistente'
export const NAV_ITEMS = [
  // General (todos)
  { header: 'General', roles: ['admin','staff','orador','asistente'] },
  { to: '/app/dashboard', icon: 'bi-speedometer2', label: 'Dashboard', roles: ['admin','staff','orador','asistente'] },

  // Gestión (admin / staff)
  { header: 'Gestión', roles: ['admin','staff'] },
  { to: '/app/agenda',     icon: 'bi-calendar-event',  label: 'Agenda',      roles: ['admin','staff'] },
  { to: '/app/charlas',    icon: 'bi-mic',             label: 'Charlas',     roles: ['admin','staff'] },
  { to: '/app/oradores',   icon: 'bi-people',          label: 'Oradores',    roles: ['admin','staff'] },
  { to: '/app/materiales', icon: 'bi-box-arrow-up',    label: 'Materiales',  roles: ['admin','staff'] },
  { to: '/app/votaciones', icon: 'bi-clipboard-check', label: 'Votaciones',  roles: ['admin','staff'] },
  { to: '/app/asistentes', icon: 'bi-person-check',    label: 'Asistentes',  roles: ['admin','staff'] },

  // Orador
  { header: 'Mis actividades', roles: ['orador'] },
  { to: '/app/orador/mi-agenda',     icon: 'bi-calendar-check', label: 'Mi agenda',     roles: ['orador'] },
  { to: '/app/orador/nueva-charla',  icon: 'bi-plus-lg',        label: 'Crear charla',  roles: ['orador'] },
  { to: '/app/orador/mis-materiales',icon: 'bi-upload',         label: 'Mis materiales',roles: ['orador'] },

  // Asistente
  { header: 'Participación', roles: ['asistente'] },
  { to: '/app/asistente/explorar',          icon: 'bi-calendar2-week', label: 'Explorar ',     roles: ['asistente'] },
  { to: '/app/asistente/mis-inscripciones', icon: 'bi-bookmark-check', label: 'Mis inscripciones',   roles: ['asistente'] },
  { to: '/app/asistente/votaciones',        icon: 'bi-hand-thumbs-up', label: 'Votaciones',          roles: ['asistente'] },
  { to: '/app/asistente/historial',         icon: 'bi-clock-history',  label: 'Historial',           roles: ['asistente'] },

  // Sistema (todos)
  { header: 'Sistema', roles: ['admin','staff','orador','asistente'] },
  { to: '/app/ajustes', icon: 'bi-gear', label: 'Ajustes', roles: ['admin','staff','orador','asistente'] },
]
