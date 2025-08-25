<script>
import { RouterLink } from 'vue-router'
export default {
  name: 'RegisterView',
  components: {
    RouterLink,
  },
  data() {
    return {
      // Campos del formulario
      usuario: '',
      password: '',
      confirmPassword: '',
      tipoUsuario: '',
      nombres: '',
      apellidos: '',
      ciudad: '',
      telefono: '',
      email: '',
      
      // Estados de UI
      showPassword: false,
      showConfirmPassword: false,
      acceptTerms: false,
      loading: false,
      notification: {
        message: '',
        type: ''
      },
      showModal: false,
      modalTitle: '',
      modalContent: '',
      
      // Opciones para los selects
      tiposUsuario: [
        { value: '', text: 'Selecciona tu tipo de usuario', disabled: true },
        { value: 'orador', text: 'Orador' },
        { value: 'personal_apoyo', text: 'Personal de Apoyo' },
        { value: 'asistente', text: 'Asistente' }
      ],
      
      departamentosBolivia: [
        { value: '', text: 'Selecciona tu departamento', disabled: true },
        { value: 'lp', text: 'La Paz' },
        { value: 'cb', text: 'Cochabamba' },
        { value: 'sc', text: 'Santa Cruz' },
        { value: 'or', text: 'Oruro' },
        { value: 'pt', text: 'Potosí' },
        { value: 'tj', text: 'Tarija' },
        { value: 'ch', text: 'Chuquisaca' },
        { value: 'bn', text: 'Beni' },
        { value: 'pn', text: 'Pando' }
      ]
    }
  },
  methods: {
    simulateRegister() {
      // Validación básica
      if (!this.usuario || !this.password || !this.confirmPassword || 
          !this.tipoUsuario || !this.nombres || !this.apellidos || 
          !this.ciudad || !this.telefono || !this.email) {
        this.showNotification('Por favor, completa todos los campos', 'error')
        // Desplazar a la notificación
        this.scrollToNotification();
        return
      }

      if (this.password && this.password.length < 8) {
        this.showNotification('La contraseña debe tener al menos 8 caracteres', 'error')
        this.scrollToNotification();
        return
      }
      if (this.password !== this.confirmPassword) {
        this.showNotification('Las contraseñas no coinciden', 'error')
        this.scrollToNotification();
        return
      }

      if (!this.acceptTerms) {
        this.showNotification('Debes aceptar los términos y condiciones', 'error')
        this.scrollToNotification();
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.email)) {
        this.showNotification('Por favor, introduce un email válido', 'error')
        this.scrollToNotification();
        return
      }

      const phoneRegex = /^[0-9+]{7,15}$/
      if (!phoneRegex.test(this.telefono)) {
        this.showNotification('Por favor, introduce un número de teléfono válido', 'error')
        this.scrollToNotification();
        return
      }

      this.loading = true

      // Simular proceso de registro
      setTimeout(() => {
        this.showNotification('Registro simulado correctamente. Redirigiendo...', 'success')
        this.scrollToNotification();
        
        // Simular redirección después de 2 segundos
        setTimeout(() => {
          this.$router.push('/')
        }, 2000)
      }, 1500)
    },
    showNotification(message, type) {
      this.notification = { message, type }
      
      // Ocultar notificación después de 5 segundos
      setTimeout(() => {
        this.notification = { message: '', type: '' }
      }, 5000)
    },
    scrollToNotification() {
      // Desplazar suavemente a la notificación
      this.$nextTick(() => {
        const notificationElement = document.querySelector('.notification-fixed');
        if (notificationElement) {
          notificationElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    },
    openModal(type) {
      if (type === 'terms') {
        this.modalTitle = 'Términos y Condiciones';
        this.modalContent = 'Aquí irán los términos y condiciones de uso del servicio. Puedes agregar el PDF cuando lo tengas disponible.';
      } else if (type === 'privacy') {
        this.modalTitle = 'Política de Privacidad';
        this.modalContent = 'Aquí irá la política de privacidad. Puedes agregar el PDF cuando lo tengas disponible.';
      }
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  }
}
</script>

<template>
  <div class="register-container">
    <!-- Notificación fija en la parte superior -->
    <div v-if="notification.message" 
         :class="['notification-fixed', 'alert', 'alert-dismissible', 'fade', 'show', 
                 notification.type === 'error' ? 'alert-danger' : 'alert-success']" 
         role="alert">
      {{ notification.message }}
      <button type="button" class="btn-close" @click="notification.message = ''"></button>
    </div>
    
    <!-- Modal para Términos y Privacidad -->
    <div v-if="showModal" class="modal-backdrop show"></div>
    <div v-if="showModal" class="modal show d-block" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-info text-white">
            <h5 class="modal-title">{{ modalTitle }}</h5>
            <button type="button" class="btn-close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <p>{{ modalContent }}</p>
            <div class="placeholder-pdf">
              <i class="bi bi-file-earmark-pdf display-4 text-danger"></i>
              <p class="mt-2">Aquí se mostrará el PDF cuando esté disponible</p>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Cerrar</button>
            <button type="button" class="btn btn-primary">Aceptar</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="background-animation">
      <div class="shape shape-1"></div>
      <div class="shape shape-2"></div>
      <div class="shape shape-3"></div>
    </div>
    
    <div class="container h-100">
      <div class="row h-100 justify-content-center align-items-center">
        <div class="col-12 col-lg-10 col-xl-8">
          <div class="card register-card shadow-lg">
            <div class="card-header bg-info text-white text-center py-4">
              <img
                src="../assets/images/Logo_AbrahamEventSphere.png"
                alt="Logo AbrahamEventSphere"
                width="80"
                height="80"
                class="d-block mx-auto mb-3"
              />
              <h2 class="mb-0">AbrahamEventSphere</h2>
              <p class="mb-0 opacity-75">Crear una nueva cuenta</p>
            </div>
            
            <div class="card-body p-4 p-md-5">
              <form @submit.prevent="simulateRegister">
                <div class="row">
                  <div class="col-md-6">
                    <h5 class="mb-3 text-info">Información de acceso</h5>
                    
                    <div class="mb-3">
                      <label for="usuario" class="form-label">Nombre de usuario <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <span class="input-group-text">
                          <i class="bi bi-person-badge"></i>
                        </span>
                        <input 
                          type="text" 
                          class="form-control" 
                          id="usuario" 
                          v-model="usuario" 
                          placeholder="Tu nombre de usuario"
                          required
                        >
                      </div>
                    </div>
                    
                    <div class="mb-3">
                      <label for="password" class="form-label">Contraseña <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <span class="input-group-text">
                          <i class="bi bi-lock"></i>
                        </span>
                        <input 
                          :type="showPassword ? 'text' : 'password'" 
                          class="form-control" 
                          id="password" 
                          v-model="password" 
                          placeholder="Crea una contraseña segura"
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
                      <div class="form-text">Mínimo 8 caracteres, con letras y números</div>
                    </div>
                    
                    <div class="mb-3">
                      <label for="confirmPassword" class="form-label">Confirmar contraseña <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <span class="input-group-text">
                          <i class="bi bi-lock-fill"></i>
                        </span>
                        <input 
                          :type="showConfirmPassword ? 'text' : 'password'" 
                          class="form-control" 
                          id="confirmPassword" 
                          v-model="confirmPassword" 
                          placeholder="Repite tu contraseña"
                          required
                        >
                        <button 
                          type="button" 
                          class="input-group-text" 
                          @click="showConfirmPassword = !showConfirmPassword"
                        >
                          <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                        </button>
                      </div>
                    </div>
                    
                    <div class="mb-3">
                      <label for="tipoUsuario" class="form-label">Tipo de usuario <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <span class="input-group-text">
                          <i class="bi bi-people-fill"></i>
                        </span>
                        <select class="form-select" id="tipoUsuario" v-model="tipoUsuario" required>
                          <option v-for="option in tiposUsuario" :key="option.value" 
                                  :value="option.value" :disabled="option.disabled">
                            {{ option.text }}
                          </option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div class="col-md-6">
                    <h5 class="mb-3 text-info">Información personal</h5>
                    
                    <div class="mb-3">
                      <label for="nombres" class="form-label">Nombres <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <span class="input-group-text">
                          <i class="bi bi-person-circle"></i>
                        </span>
                        <input 
                          type="text" 
                          class="form-control" 
                          id="nombres" 
                          v-model="nombres" 
                          placeholder="Tus nombres"
                          required
                        >
                      </div>
                    </div>
                    
                    <div class="mb-3">
                      <label for="apellidos" class="form-label">Apellidos <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <span class="input-group-text">
                          <i class="bi bi-person-vcard"></i>
                        </span>
                        <input 
                          type="text" 
                          class="form-control" 
                          id="apellidos" 
                          v-model="apellidos" 
                          placeholder="Tus apellidos"
                          required
                        >
                      </div>
                    </div>
                    
                    <div class="mb-3">
                      <label for="ciudad" class="form-label">Ciudad/Departamento <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <span class="input-group-text">
                          <i class="bi bi-geo-alt-fill"></i>
                        </span>
                        <select class="form-select" id="ciudad" v-model="ciudad" required>
                          <option v-for="depto in departamentosBolivia" :key="depto.value" 
                                  :value="depto.value" :disabled="depto.disabled">
                            {{ depto.text }}
                          </option>
                        </select>
                      </div>
                    </div>
                    
                    <div class="mb-3">
                      <label for="telefono" class="form-label">Teléfono <span class="text-danger">*</span></label>
                      <div class="input-group">
                        <span class="input-group-text">
                          <i class="bi bi-telephone"></i>
                        </span>
                        <input 
                          type="tel" 
                          class="form-control" 
                          id="telefono" 
                          v-model="telefono" 
                          placeholder="Ej: 71234567"
                          required
                        >
                      </div>
                    </div>
                    
                    <div class="mb-3">
                      <label for="email" class="form-label">Correo electrónico <span class="text-danger">*</span></label>
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
                  </div>
                </div>
                
                <div class="mb-3 form-check mt-4">
                  <input type="checkbox" class="form-check-input" id="acceptTerms" v-model="acceptTerms">
                  <label class="form-check-label" for="acceptTerms">
                    Acepto los <a href="#" class="text-info" @click.prevent="openModal('terms')">términos y condiciones</a> y la 
                    <a href="#" class="text-info" @click.prevent="openModal('privacy')">política de privacidad</a>
                  </label>
                </div>
                
                <div class="d-grid gap-2 mt-4">
                  <button type="submit" class="btn btn-success btn-lg">
                    <span v-if="!loading">Crear cuenta</span>
                    <span v-else>
                      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Creando cuenta...
                    </span>
                  </button>
                </div>
              </form>
              
              <hr class="my-4">
              
              <div class="text-center">
                <p class="mb-3">¿Ya tienes una cuenta?</p>
                <RouterLink to="/login" class="btn btn-outline-info">Inicia sesión aquí</RouterLink>
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

<style scoped>
.register-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #c0d8e0 0%, #a2c4d0 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 20px 0;
}

.notification-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1060;
  border-radius: 0;
  text-align: center;
  padding: 15px;
  animation: slideDown 0.5s ease-out;
}

@keyframes slideDown {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}

.modal-backdrop {
  opacity: 0.5;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1040;
  width: 100vw;
  height: 100vh;
  background-color: #000;
}

.modal {
  z-index: 1050;
}

.placeholder-pdf {
  text-align: center;
  padding: 20px;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  margin-top: 15px;
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
  background: rgba(255, 255, 255, 0.2);
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

.register-card {
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
}

.input-group-text {
  background-color: #f8f9fa;
}

.form-control:focus,
.form-select:focus {
  border-color: #0dcaf0;
  box-shadow: 0 0 0 0.25rem rgba(13, 202, 240, 0.25);
}

.btn-success {
  background-color: #198754;
  border: none;
}

.btn-success:hover {
  background-color: #146c43;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.btn-outline-info {
  color: #0dcaf0;
  border-color: #0dcaf0;
}

.btn-outline-info:hover {
  background-color: #0dcaf0;
  color: white;
}

.text-danger {
  color: #dc3545 !important;
}

@media (max-width: 768px) {
  .register-card {
    margin: 20px;
  }
  
  .card-body {
    padding: 1.5rem !important;
  }
}
</style>