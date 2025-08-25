<template>
  <div class="login-container">
    <div class="background-animation">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    
    <div class="container h-100">
      <div class="row h-100 justify-content-center align-items-center">
        <div class="col-12 col-md-8 col-lg-6 col-xl-5">
          <div class="card login-card shadow-lg">
            <div class="card-header bg-primary text-white text-center py-4">
              <img
                src="../assets/images/Logo_AbrahamEventSphere.png"
                alt="Logo AbrahamEventSphere"
                width="80"
                height="80"
                class="d-block mx-auto mb-3"
              />
              <h2 class="mb-0">AbrahamEventSphere</h2>
              <p class="mb-0 opacity-75">Sistema de Gestión de Eventos</p>
            </div>
            
            <div class="card-body p-4 p-md-5">
              <div v-if="notification.message" 
                   :class="['alert', 'alert-dismissible', 'fade', 'show', notificationClass]" 
                   role="alert">
                {{ notification.message }}
                <button type="button" class="btn-close" @click="hideNotification"></button>
              </div>
              
              <form @submit.prevent="simulateLogin">
                <div class="mb-3">
                  <label for="email" class="form-label">Correo electrónico</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-envelope"></i>
                    </span>
                    <input 
                      type="email" 
                      class="form-control" 
                      id="email" 
                      v-model="email" 
                      placeholder="tu@email.com"
                      required
                    >
                  </div>
                </div>
                
                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-lock"></i>
                    </span>
                    <input 
                      :type="showPassword ? 'text' : 'password'" 
                      class="form-control" 
                      id="password" 
                      v-model="password" 
                      placeholder="Tu contraseña"
                      required
                    >
                    <button 
                      type="button" 
                      class="input-group-text" 
                      @click="showPassword = !showPassword"
                    >
                      <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                    </button>
                  </div>
                </div>
                
                <div class="mb-3 form-check">
                  <input type="checkbox" class="form-check-input" id="remember" v-model="remember">
                  <label class="form-check-label" for="remember">Recordar mis datos</label>
                </div>
                
                <div class="d-grid gap-2">
                  <button type="submit" class="btn btn-info btn-lg text-white">
                    <span v-if="!loading">Iniciar sesión</span>
                    <span v-else>
                      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Iniciando sesión...
                    </span>
                  </button>
                </div>
              </form>
              
              <div class="text-center mt-3">
                <a href="#" class="text-decoration-none">¿Olvidaste tu contraseña?</a>
              </div>
              
              <hr class="my-4">
              
              <div class="text-center">
                <p class="mb-3">¿No tienes una cuenta?</p>
                <router-link to="/register" class="btn btn-outline-info">Regístrate ahora</router-link>
                
                <div class="mt-4">
                  <p class="mb-2">O inicia sesión con</p>
                  <div class="d-flex justify-content-center gap-3">
                    <button class="btn btn-outline-secondary btn-social">
                      <i class="bi bi-google"></i>
                    </button>
                    <button class="btn btn-outline-secondary btn-social">
                      <i class="bi bi-facebook"></i>
                    </button>
                    <button class="btn btn-outline-secondary btn-social">
                      <i class="bi bi-linkedin"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="card-footer text-center py-3">
              <small class="text-muted">
                &copy; 2025 AbrahamEventSphere. Todos los derechos reservados.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'LoginView',
  setup() {
    const email = ref('');
    const password = ref('');
    const remember = ref(false);
    const showPassword = ref(false);
    const loading = ref(false);
    const notification = ref({ message: '', type: '' });
    
    const router = useRouter();

    const notificationClass = computed(() => {
      return notification.value.type === 'error' ? 'alert-danger' : 'alert-success';
    });

    const simulateLogin = () => {
      // Validación básica
      if (!email.value || !password.value) {
        showNotification('Por favor, completa todos los campos', 'error');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.value)) {
        showNotification('Por favor, introduce un email válido', 'error');
        return;
      }

      loading.value = true;

      // Simular proceso de login
      setTimeout(() => {
        showNotification('Inicio de sesión simulado correctamente. Redirigiendo...', 'success');
        
        // Simular redirección después de 2 segundos
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }, 1500);
    };

    const showNotification = (message, type) => {
      notification.value = { message, type };
    };

    const hideNotification = () => {
      notification.value = { message: '', type: '' };
    };

    return {
      email,
      password,
      remember,
      showPassword,
      loading,
      notification,
      notificationClass,
      simulateLogin,
      hideNotification
    };
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: -50px;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 70%;
}

.login-card {
  border: none;
  border-radius: 15px;
  z-index: 1;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.card-header {
  border-top-left-radius: 15px !important;
  border-top-right-radius: 15px !important;
  border-bottom: none;
  background: linear-gradient(135deg, #0dcaf0 0%, #0dcaf0 100%) !important;
  /*background: linear-gradient(135deg, #3b5998 0%, #667eea 100%) !important;*/
}

.btn-social {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.input-group-text {
  background-color: #f8f9fa;
}

.form-control:focus {
    border-color: #0dcaf0;
    box-shadow: 0 0 0 0.25rem rgba(13, 202, 240, 0.25);    
  /*border-color: #667eea;
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);*/
}

/*.btn-primary {
  background: linear-gradient(135deg, #3b5998 0%, #667eea 100%);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2d4373 0%, #5a6fd8 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}*/
.btn-info {
  background: linear-gradient(135deg, #0dcaf0 0%, #0dcaf0 100%);
  border: none;
}
.btn-info:hover {
  background: linear-gradient(135deg, #0dcaf0 0%, #0dcaf0 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

@media (max-width: 768px) {
  .login-card {
    margin: 20px;
  }
  
  .card-body {
    padding: 1.5rem !important;
  }
}
</style>