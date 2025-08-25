import 'bootswatch/dist/united/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '../node_modules/animate.css/animate.min.css'
import 'sweetalert2/dist/sweetalert2.min.css'

import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies'
import VueSweetalert2 from 'vue-sweetalert2'
import Axios from 'axios'

Axios.defaults.withCredentials = true

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueCookies, {
  expires: '7d',
  path: '/',
})
app.use(VueSweetalert2)

app.mount('#app')
