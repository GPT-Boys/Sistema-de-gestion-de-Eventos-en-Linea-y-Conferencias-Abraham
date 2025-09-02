<script setup>
import { computed } from 'vue'
import { useConferenciasStore } from '@/stores/app/conferencias.js'
import { useAuthStore } from '@/stores/publicStores/auth.js'

const props = defineProps({
  charlaId: { type: [String, Number], required: true },
  status: { type: String, required: true }, // 'upcoming'|'live'|'finished'
})

const store = useConferenciasStore()
const auth = useAuthStore()

const uid = computed(() => auth.user?.id_usuario ?? auth.user?.id ?? null)
const alreadyVoted = computed(() => (uid.value ? !!store.myVote(uid.value, props.charlaId) : false))
const enrolled = computed(() => (uid.value ? store.isEnrolled(uid.value, props.charlaId) : false))

const showWidget = computed(() => {
  // Solo si está inscrito, charla live/finished y NO votó aún
  return enrolled.value && ['live', 'finished'].includes(props.status) && !alreadyVoted.value
})

function onVote(like) {
  if (!uid.value) return
  const res = store.vote(uid.value, props.charlaId, like)
  // Tras votar, alreadyVoted pasará a true y el widget desaparecerá solo
}
</script>

<template>
  <div v-if="showWidget" class="vote">
    <span class="tag">Valora esta charla</span>
    <div class="btns">
      <button class="btn up" @click="onVote(true)">
        <i class="bi bi-hand-thumbs-up-fill"></i> Me gustó
      </button>
      <button class="btn down" @click="onVote(false)">
        <i class="bi bi-hand-thumbs-down-fill"></i> No me gustó
      </button>
    </div>
  </div>
</template>

<style scoped>
.vote {
  margin-top: 10px;
  border: 1px dashed #e5e7eb;
  border-radius: 12px;
  padding: 10px;
  background: #fff;
}
.tag {
  font-size: 12px;
  color: #6b7280;
  font-weight: 700;
}
.btns {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.btn {
  border: 1px solid #e5e7eb;
  background: #fff;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
}
.btn.up {
  color: #065f46;
  background: #ecfdf5;
  border-color: #a7f3d0;
}
.btn.down {
  color: #7f1d1d;
  background: #fef2f2;
  border-color: #fecaca;
}
.btn:hover {
  filter: brightness(0.98);
}
</style>
