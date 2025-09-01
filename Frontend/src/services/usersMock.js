import { listUsers, createUser, updateUser, deleteUser } from '@/services/mockDB'

// API idéntica a como lo haría el backend (lista paginada y filtros)
export async function fetchUsers(params) {
  return listUsers(params) // { items, total }
}
export async function createUserAPI(payload) {
  return createUser(payload)
}
export async function updateUserAPI(id, patch) {
  return updateUser(id, patch)
}
export async function deleteUserAPI(id) {
  return deleteUser(id)
}
