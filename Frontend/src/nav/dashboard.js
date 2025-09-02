// src/dashboard/items.js

// Roles: 'admin' | 'staff' | 'orador' | 'asistente'
export const DASHBOARD_ITEMS = [
  // Admin + Staff
  { to: '/app/agenda', icon: 'bi-calendar-event', label: 'Agenda', roles: ['admin', 'staff'] },
  { to: '/app/charlas', icon: 'bi-mic', label: 'Charlas', roles: ['admin', 'staff'] },
  { to: '/app/oradores', icon: 'bi-people', label: 'Oradores', roles: ['admin', 'staff'] },
  {
    to: '/app/asistentes',
    icon: 'bi-person-check',
    label: 'Asistentes',
    roles: ['admin', 'staff'],
  },
  {
    to: '/app/materiales',
    icon: 'bi-box-arrow-up',
    label: 'Materiales',
    roles: ['admin', 'staff'],
  },

  // Orador
  { to: '/app/orador/mi-agenda', icon: 'bi-calendar-check', label: 'Mi agenda', roles: ['orador'] },
  { to: '/app/orador/nueva-charla', icon: 'bi-plus-lg', label: 'Crear charla', roles: ['orador'] },
  {
    to: '/app/orador/mis-materiales',
    icon: 'bi-upload',
    label: 'Mis materiales',
    roles: ['orador'],
  },

  // Asistente
  {
    to: '/app/asistente/explorar',
    icon: 'bi-search',
    label: 'Explorar charlas',
    roles: ['asistente'],
  },
  {
    to: '/app/asistente/mis-inscripciones',
    icon: 'bi-bookmark-check',
    label: 'Mis inscripciones',
    roles: ['asistente'],
  },
  {
    to: '/app/asistente/historial',
    icon: 'bi-clock-history',
    label: 'Historial',
    roles: ['asistente'],
  },

  // Ajustes (todos)
  {
    to: '/app/ajustes',
    icon: 'bi-gear',
    label: 'Ajustes',
    roles: ['admin', 'staff', 'orador', 'asistente'],
  },
]
