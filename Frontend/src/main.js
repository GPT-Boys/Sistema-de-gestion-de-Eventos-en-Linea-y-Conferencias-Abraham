// estilos/libretías
import 'bootswatch/dist/united/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'animate.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import './styles.css' // tus estilos

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'          // <- usa el router externo
import VueCookies from 'vue-cookies'
import VueSweetalert2 from 'vue-sweetalert2'

axios.defaults.withCredentials = true

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueCookies, { expires: '7d', path: '/' })
app.use(VueSweetalert2)

app.mount('#app')                      // <- montar UNA sola vez
