<!-- src/components/VoteWidget.vue -->
<script setup>
import { ref } from 'vue'

// props: estado inicial y si el usuario puede votar
const props = defineProps({
  canVote: { type: Boolean, default: false },     // p.ej. solo asistentes
  closed:  { type: Boolean, default: false },     // charla finalizada
  initial: { type: String, default: null },       // 'up' | 'down' | null
  upCount: { type: Number, default: 0 },
  downCount:{ type: Number, default: 0 },
})

const up   = ref(props.upCount)
const down = ref(props.downCount)
const my   = ref(props.initial) // 'up'|'down'|null

function vote(kind){
  if (!props.canVote || !props.closed) return
  if (my.value === kind) {
    // quitar voto
    if (kind==='up') up.value-- ; else down.value--
    my.value = null
  } else {
    // cambiar voto
    if (kind==='up') { up.value++ ; if (my.value==='down') down.value-- }
    else { down.value++ ; if (my.value==='up') up.value-- }
    my.value = kind
  }
  // TODO: aquí llamarías a tu API cuando la tengas
}
</script>

<template>
  <div class="vote">
    <button class="vbtn" :class="{ on: my==='up', disabled: !canVote || !closed }" @click="vote('up')" :disabled="!canVote || !closed">
      👍 <span>{{ up }}</span>
    </button>
    <button class="vbtn" :class="{ on: my==='down', disabled: !canVote || !closed }" @click="vote('down')" :disabled="!canVote || !closed">
      👎 <span>{{ down }}</span>
    </button>
    <small v-if="!closed" class="muted">Disponible al finalizar</small>
  </div>
</template>

<style scoped>
.vote{ display:flex; align-items:center; gap:8px; }
.vbtn{
  border:1px solid #e5e7eb; background:#fff; border-radius:12px; padding:6px 10px;
  display:flex; align-items:center; gap:6px; cursor:pointer; font-weight:700;
}
.vbtn.on{ background:#ecfdf5; border-color:#10b981; }
.vbtn.disabled{ opacity:.6; cursor:default; }
.muted{ color:#6b7280; }
</style>
