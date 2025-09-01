import 'bootswatch/dist/united/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import './styles.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'

import { useAuthStore } from '@/stores/publicStores/auth.js'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Opcional A: hacer el check aquí (y QUITAR el fetch del router guard)
useAuthStore(pinia).fetchStatus().finally(() => {
  app.mount('#app')
})

// Opcional B: si prefieres hacerlo en el router guard, entonces:
// app.mount('#app')
// (y deja el fetchStatus del beforeEach como lo tienes)
