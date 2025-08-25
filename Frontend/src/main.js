import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import LandingPage from './views/HomeView.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'
import './styles.css' // tus estilos
// main.js
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
// Opcional (para tooltips, etc.):
// import 'bootstrap'


const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: LandingPage },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
  ],
})

createApp(App).use(router).mount('#app')
