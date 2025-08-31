<script setup>
import { ref } from 'vue'
import { useConferenciasStore } from '@/stores/app/conferencias.js'
import { useAuthStore } from '@/stores/publicStores/auth.js'

const props = defineProps({
  charlaId: { type: [Number, String], required: true },
  status:   { type: String, required: true }, // 'upcoming' | 'live' | 'finished'
})

const store = useConferenciasStore()
const auth  = useAuthStore()
const voted = ref(store.myVote(auth.user?.id, props.charlaId))

function castVote(like = true) {
  if (!auth.user?.id) {
    alert('Debes iniciar sesión para votar.')
    return
  }
  if (voted.value) {
    alert('Ya registraste tu voto.')
    return
  }
  const res = store.vote(auth.user.id, props.charlaId, like)
  if (res.ok) {
    voted.value = like ? 'up' : 'down'
  } else {
    alert(res.reason === 'not_finished'
      ? 'Solo puedes votar una vez terminada la charla.'
      : 'No se pudo registrar el voto.')
  }
}
</script>

<template>
  <div class="vote-bar" v-if="status === 'finished'">
    <button
      class="btn like"
      :class="{ active: voted==='up' }"
      @click="castVote(true)"
    >
      👍 Me gustó
    </button>
    <button
      class="btn dislike"
      :class="{ active: voted==='down' }"
      @click="castVote(false)"
    >
      👎 No me gustó
    </button>
  </div>
</template>

<style scoped>
.vote-bar {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}
.btn {
  border: 1px solid #e5e7eb;
  background: #fff;
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn.like:hover { background: #ecfdf5; color: #065f46; }
.btn.dislike:hover { background: #fef2f2; color: #991b1b; }

.btn.active.like { background: #34d399; color: white; border:none; }
.btn.active.dislike { background: #f87171; color: white; border:none; }
</style>
