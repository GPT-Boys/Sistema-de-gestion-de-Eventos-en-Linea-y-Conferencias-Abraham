import { defineStore } from 'pinia'
import { fetchUsers, createUserAPI, updateUserAPI, deleteUserAPI } from '@/services/usersMock'

export const useUsersStore = defineStore('users', {
  state: () => ({
    q: '',
    page: 1,
    pageSize: 8,
    sortBy: 'usuario',
    sortDir: 'asc',

    total: 0,
    items: [],
    loading: false,
    error: null,
  }),
  actions: {
    async load() {
      this.loading = true
      this.error = null
      try {
        const { items, total } = await fetchUsers({
          q: this.q,
          page: this.page,
          pageSize: this.pageSize,
          sortBy: this.sortBy,
          sortDir: this.sortDir,
        })
        this.items = items
        this.total = total
      } catch (e) {
        this.error = e?.message || 'Error cargando usuarios'
      } finally {
        this.loading = false
      }
    },
    async create(user) {
      await createUserAPI(user)
      await this.load()
    },
    async update(id, patch) {
      await updateUserAPI(id, patch)
      await this.load()
    },
    async remove(id) {
      await deleteUserAPI(id)
      await this.load()
    },
  },
  getters: {
    pages(state) {
      return Math.max(1, Math.ceil(state.total / state.pageSize))
    },
  },
})
