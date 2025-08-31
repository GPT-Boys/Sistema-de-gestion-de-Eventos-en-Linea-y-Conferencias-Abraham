import { defineStore } from 'pinia'
import { createUser } from '@/services/publicService'

export const useUserRegisterStore = defineStore({
  id: 'userRegister',
  state: () => ({
    user: {
      id_usuario: 0,
      usuario: '',
      contrasenia: '',
      TIPO_USUARIO: {
        id_tipo_usuario: 0,
      },
      nombres: '',
      apellidos: '',
      fecha_nacimiento: '',
      CIUDAD: {
        id_ciudad: 0,
      },
      telefono: 0,
      correo_electronico: '',
      fecha_creacion: '',
    },
  }),
  actions: {
    clearUser() {
      this.user = {
        id_usuario: 0,
        usuario: '',
        contrasenia: '',
        TIPO_USUARIO: {
          id_tipo_usuario: 0,
        },
        nombres: '',
        apellidos: '',
        fecha_nacimiento: '',
        CIUDAD: {
          id_ciudad: 0,
        },
        telefono: 0,
        correo_electronico: '',
        fecha_creacion: '',
      }
    },

    async createUser() {
      try {
        const token = $cookies.get('token')
        const response = await createUser(this.user, token)
        if (response == null) {
          return false
        }
        $cookies.remove('token')
        this.clearUser()
        return true
      } catch (error) {
        console.error(`There was an Error Creating the User: ${error}.`)
        throw error
      }
    },
  },
})
