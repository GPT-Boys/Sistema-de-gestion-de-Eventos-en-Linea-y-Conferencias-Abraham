<!-- src/components/ConferenciaDashboard.vue -->
<template>
  <div>
    <h1>Dashboard de Conferencias</h1>
    <p>Notificaciones en tiempo real activadas para la conferencia ID: {{ conferenceID }}</p>
  </div>
</template>

<script>
import { io } from 'socket.io-client'

export default {
  props: {
    conferenceID: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      socket: null,
    }
  },
  mounted() {
    this.socket = io('http://localhost:3000')
    this.socket.on('connect', () => {
      console.log('Conectado a Socket.IO')
      this.socket.emit('joinConferencia', this.conferenceID)
    })

    this.socket.on('conferenceUpdated', (data) => {
      console.log('Notificación recibida:', data)
      alert(`Notificación: ${data.message} (ID: ${data.conferenceID})`) // O usa un toast/notification component (e.g., Vue Toastification)
      // Recarga datos de conferencia si es necesario
      this.fetchConferenciaData()
    })
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect()
    }
  },
  methods: {
    fetchConferenciaData() {
      // Llama a tu API para refrescar datos
    },
  },
}
</script>

<style>
div {
  padding: 20px;
}
</style>
