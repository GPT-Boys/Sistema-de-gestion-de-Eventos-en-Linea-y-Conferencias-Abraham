<!-- src/views/asistente/Historial.vue -->
<template>
  <div class="historial">
    <!-- Header -->
    <header class="historial-header">
      <h1><i class="bi bi-clock-history"></i> Historial de charlas</h1>
      <p class="subtitle">Consulta tus charlas finalizadas y deja tu feedback.</p>
    </header>

    <!-- Lista -->
    <section v-if="items.length > 0" class="history-list">
      <article
        v-for="c in items"
        :key="c.idConferencia"
        class="history-card"
      >
        <div class="h-main">
          <h2>{{ c.titulo }}</h2>
          <p class="desc">{{ c.descripcion }}</p>
          <ul class="meta">
            <li><i class="bi bi-calendar-event"></i> {{ c.fecha }}</li>
            <li><i class="bi bi-geo"></i> {{ c.sala }}</li>
            <li><i class="bi bi-mic"></i> Orador #{{ c.idOrador }}</li>
          </ul>
          <p class="votes">
            <strong>Votos:</strong>
            <i class="bi bi-hand-thumbs-up-fill text-success"></i> {{ c.votosAFavor }}
            ·
            <i class="bi bi-hand-thumbs-down-fill text-danger"></i> {{ c.votosEnContra }}
          </p>
        </div>

        <div class="h-actions">
          <!-- Estado de voto -->
          <span v-if="myVote(c)" class="badge voted">
            Tu voto:
            <i v-if="myVote(c)==='up'" class="bi bi-hand-thumbs-up-fill text-success"></i>
            <i v-else class="bi bi-hand-thumbs-down-fill text-danger"></i>
          </span>
          <span v-else class="badge pending">
            <i class="bi bi-hourglass-split"></i> Pendiente de votar
          </span>

          <!-- Acciones -->
          <div class="buttons">
            <button
              v-if="!myVote(c)"
              class="btn sm up"
              @click="onVote(c,true)"
            >
              <i class="bi bi-hand-thumbs-up"></i> Me gustó
            </button>
            <button
              v-if="!myVote(c)"
              class="btn sm down"
              @click="onVote(c,false)"
            >
              <i class="bi bi-hand-thumbs-down"></i> No me gustó
            </button>

            <a
              v-if="c.materialUrl"
              :href="c.materialUrl"
              target="_blank"
              class="btn sm"
            >
              <i class="bi bi-box-arrow-down"></i> Materiales
            </a>
            <a
              v-if="c.evaluacion"
              :href="c.evaluacion"
              target="_blank"
              class="btn sm"
            >
              <i class="bi bi-ui-checks-grid"></i> Evaluación
            </a>
          </div>
        </div>
      </article>
    </section>

    <!-- Empty -->
    <div v-else class="empty">
      <i class="bi bi-journal-x"></i>
      <p>No tienes charlas finalizadas aún.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/publicStores/auth.js'
import { useConferenciasStore } from '@/stores/app/conferencias.js'

const auth = useAuthStore()
const conf = useConferenciasStore()

const uid = auth.user?.id_usuario ?? auth.user?.id

// Charlas finalizadas inscritas
const items = computed(() =>
  conf.enrolledForUser(uid).filter(c => conf.statusOf(c) === 'finished')
)

// Voto del usuario
const myVote = (c) => conf.myVote(uid, c.idConferencia)
const onVote = (c, like) => conf.vote(uid, c.idConferencia, like)
</script>

<style scoped>
.historial {
  padding: 24px;
  background: #FFFFFF;
  min-height: 100vh;
  display: grid;
  gap: 24px;
}

/* Header */
.historial-header h1 {
  font-size: 26px;
  font-weight: 800;
  color: var(--morado-oscuro);
  display: flex;
  align-items: center;
  gap: 8px;
}
.subtitle {
  color: #555;
  margin-top: 4px;
}

/* Cards */
.history-list {
  display: grid;
  gap: 18px;
}
.history-card {
  background: var(--blanco);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  transition: transform 0.2s ease;
}
.history-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 14px rgba(0,0,0,0.12);
}

.h-main h2 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 700;
  color: var(--morado-intermedio);
}
.h-main .desc {
  margin: 0 0 8px;
  font-size: 14px;
  color: #555;
}
.meta {
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 13px;
  color: #666;
  display: flex;
  gap: 14px;
}
.meta i {
  margin-right: 4px;
}
.votes {
  margin-top: 8px;
  font-size: 14px;
  color: #444;
}

/* Actions */
.h-actions {
  display: grid;
  gap: 8px;
  text-align: right;
}
.badge {
  padding: 6px 10px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.badge.voted {
  background: rgba(34,197,94,0.15);
  color: #15803d;
}
.badge.pending {
  background: rgba(234,179,8,0.15);
  color: #92400e;
}

.buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.btn.sm {
  background: var(--blanco);
  border: 1px solid var(--morado-suave);
  border-radius: 10px;
  padding: 6px 10px;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.btn.sm:hover {
  background: var(--morado-base);
  color: var(--blanco);
}
.btn.sm.up { color: #065f46; border-color: #a7f3d0; }
.btn.sm.down { color: #7f1d1d; border-color: #fecaca; }

/* Empty */
.empty {
  text-align: center;
  color: #777;
  padding: 40px;
}
.empty i {
  font-size: 40px;
  margin-bottom: 8px;
}
</style>

<style>
:root {
  --morado-base: #6D28D9;
  --morado-oscuro: #310176;
  --morado-intermedio: #624399;
  --morado-suave: #9B85BC;
  --gris-fondo: #EBECEB;
  --blanco: #ffffff;
}
</style>
