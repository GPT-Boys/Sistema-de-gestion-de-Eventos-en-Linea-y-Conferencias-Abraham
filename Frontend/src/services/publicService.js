import axios from '@/API/axios'
import { rutaAPI } from '@/assets/APIConfig'

export const login = async () => {
  try {
    const response = await axios.post(
      `${rutaAPI}/auth/login`,
      {
        user: '',
        password: '',
      },
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    )
    console.log(response.data)
  } catch (error) {
    console.error(`Hubo un Error al Iniciar Sesión: ${error}.`)
    throw error
  }
}

export const createUser = async (userData, token) => {
  try {
    const response = await axios.post(`${rutaAPI}/usuario`, userData, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    const data = response.data
    if (data.code === 'U-000') {
      alert('User Created Successfully.')
      return data
    } else {
      alert('Could Not Create User.')
      return null
    }
  } catch (error) {
    console.error(`There was an Error Creating the User: ${error}.`)
    throw error
  }
}

export const logout = async () => {
  try {
    const response = await axios.get(`${rutaAPI}/auth/logout`)
    const data = response.data
    if (data.code === 'AUTH-003') {
      alert('Cerraste Sesión Correctamente.')
      return true
    } else {
      alert('No se pudo Cerrar Sesión.')
      return false
    }
  } catch (error) {
    console.error(`Hubo un Error al Cerrar Sesión: ${error}.`)
    throw error
  }
}
