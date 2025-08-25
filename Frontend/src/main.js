import 'bootswatch/dist/united/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'; 

import 'bootstrap-icons/font/bootstrap-icons.css';

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
