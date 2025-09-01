<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/publicStores/auth.js'
import { useConferenciasStore } from '@/stores/app/conferencias.js'

const auth = useAuthStore()
const conf = useConferenciasStore()
conf._loadAll()

const uid = auth.user?.id ?? auth.user?.id_usuario
const enrolled = computed(() => conf.enrolledForUser(uid))
const finished = computed(() => enrolled.value.filter(c => conf.statusOf(c) === 'finished'))

function onVote(c, like) {
  const r = conf.vote(uid, c.idConferencia, like)
  // puedes mostrar toasts si quieres usando tu sistema de notificaciones
}

function myVote(c) {
  return conf.myVote(uid, c.idConferencia) // 'up' | 'down' | null
}
</script>

<template>
  <div class="wrap">
    <header class="head">
      <h1>Historial</h1>
      <p class="muted">Charlas a las que asististe y ya finalizaron. Deja tu valoración.</p>
    </header>

    <div v-if="!finished.length" class="empty">
      No tienes charlas finalizadas todavía.
    </div>

    <ul v-else class="list">
      <li v-for="c in finished" :key="c.idConferencia" class="row">
        <div class="meta">
          <div class="title">{{ c.titulo }}</div>
          <div class="sub">{{ c.fecha }} · {{ c.horaEmpieza }}–{{ c.horaTermina }} · Sala {{ c.sala }}</div>
          <div class="sub2">
            <strong>Votos:</strong> 👍 {{ c.votosAFavor }} · 👎 {{ c.votosEnContra }}
          </div>
        </div>

        <div class="actions">
          <template v-if="!myVote(c)">
            <button class="btn up"   @click="onVote(c,true)">👍 Me gustó</button>
            <button class="btn down" @click="onVote(c,false)">👎 No me gustó</button>
          </template>
          <span v-else class="voted">Tu voto: {{ myVote(c) === 'up' ? '👍' : '👎' }}</span>

          <a v-if="c.evaluacion" class="btn ghost" :href="c.evaluacion" target="_blank" rel="noopener">
            Evaluación (Forms)
          </a>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.wrap{ display:grid; gap:12px; }
.head h1{ margin:0; }
.muted{ color:#6b7280 }
.empty{ color:#6b7280 }

.list{ list-style:none; padding:0; margin:0; display:grid; gap:8px; }
.row{
  display:flex; align-items:center; justify-content:space-between; gap:10px;
  background:#fff; border:1px solid #eef0f4; border-radius:12px; padding:12px;
}
.meta .title{ font-weight:800 }
.meta .sub{ color:#64748b; font-size:13px }
.meta .sub2{ color:#374151; font-size:13px; margin-top:4px; }
.actions{ display:flex; gap:8px; align-items:center; }
.btn{ border:none; border-radius:10px; padding:8px 12px; font-weight:700; cursor:pointer; }
.btn.up{ background:#ecfdf5; color:#065f46 }
.btn.down{ background:#fef2f2; color:#7f1d1d }
.btn.ghost{ background:#f3f4f6 }
.voted{ font-weight:800; }
</style>
