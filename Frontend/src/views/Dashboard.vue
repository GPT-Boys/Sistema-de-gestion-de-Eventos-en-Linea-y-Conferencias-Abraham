<script setup>
import { computed, ref } from 'vue'

/* ===== Mock data (reemplaza luego con tu API) ===== */
const kpis = [
  {
    id: 'eventos',
    label: 'Eventos activos',
    value: 12,
    delta: '+8%',
    series: [8, 9, 10, 9, 11, 12],
  },
  { id: 'charlas', label: 'Charlas hoy', value: 24, delta: '+2', series: [20, 18, 19, 22, 21, 24] },
  {
    id: 'asistentes',
    label: 'Asistentes registrados',
    value: 438,
    delta: '+32',
    series: [300, 320, 360, 390, 410, 438],
  },
  {
    id: 'satisfaccion',
    label: 'Satisfacción (NPS)',
    value: 72,
    delta: '+4',
    series: [66, 68, 67, 69, 70, 72],
  },
]

const proximas = [
  {
    id: 1,
    titulo: 'Apertura: Tendencias IA 2025',
    sala: 'Auditorio A',
    fecha: 'Hoy 10:30',
    orador: 'Dra. Valdez',
  },
  {
    id: 2,
    titulo: 'Panel: Ciberseguridad',
    sala: 'Sala 2',
    fecha: 'Hoy 12:00',
    orador: 'Equipo SecOps',
  },
  {
    id: 3,
    titulo: 'Taller: Prompt Engineering',
    sala: 'Lab 1',
    fecha: 'Hoy 15:00',
    orador: 'Ing. R. Rivera',
  },
  {
    id: 4,
    titulo: 'Keynote: Cloud Native',
    sala: 'Auditorio B',
    fecha: 'Mañana 09:00',
    orador: 'Invitado Intel',
  },
]

const actividad = [
  { id: 1, texto: 'Se actualizó sala para “Ciberseguridad” → Sala 2', hora: 'hace 12m' },
  { id: 2, texto: 'Nuevo material subido para “IA 2025”.', hora: 'hace 40m' },
  { id: 3, texto: 'El orador “R. Rivera” confirmó asistencia.', hora: 'hace 1h' },
  { id: 4, texto: 'Se crearon 2 votaciones del Workshop de Cloud.', hora: 'ayer' },
]

const topOradores = [
  { id: 1, nombre: 'Fabrisio Condarco', score: 4.8, charlas: 3, avatar: '/team/fabrisio.jpg' },
  { id: 2, nombre: 'Jose Manzaneda', score: 4.7, charlas: 2, avatar: '/team/jose.jpg' },
  { id: 3, nombre: 'Miguel Quisbert', score: 4.6, charlas: 4, avatar: '/team/miguel.jpg' },
  { id: 4, nombre: 'Oscar Menacho', score: 4.5, charlas: 2, avatar: '/team/oscar.jpg' },
]

/* Donut participación por ciudad (simulada) */
const participacion = ref([
  { label: 'La Paz', value: 38 },
  { label: 'Cochabamba', value: 22 },
  { label: 'Santa Cruz', value: 28 },
  { label: 'Otros', value: 12 },
])
const donutStyle = computed(() => {
  // genera stops para conic-gradient
  const total = participacion.value.reduce((a, b) => a + b.value, 0)
  let acc = 0
  const colors = ['#6d28d9', '#8b5cf6', '#a78bfa', '#c4b5fd'] // morados claros/medios
  const segments = participacion.value
    .map((s, idx) => {
      const start = (acc / total) * 360
      acc += s.value
      const end = (acc / total) * 360
      return `${colors[idx % colors.length]} ${start}deg ${end}deg`
    })
    .join(', ')
  return {
    background: `conic-gradient(${segments})`,
  }
})
</script>

<template>
  <div class="dash">
    <!-- Topbar del dashboard -->
    <header class="dash-head">
      <div>
        <h1>Dashboard</h1>
        <p class="muted">Resumen del evento y actividad reciente</p>
      </div>

      <div class="actions">
        <div class="filter">
          <i class="bi bi-calendar-event"></i>
          <select aria-label="Rango de fechas">
            <option>Hoy</option>
            <option>Últimos 7 días</option>
            <option>Últimos 30 días</option>
          </select>
        </div>
        <button class="btn btn-primary"><i class="bi bi-plus-lg"></i> Nueva conferencia</button>
      </div>
    </header>

    <!-- KPIs -->
    <section class="kpi-grid" aria-label="Indicadores clave">
      <article v-for="k in kpis" :key="k.id" class="kpi">
        <header>
          <h3>{{ k.label }}</h3>
          <span
            class="delta"
            :class="{ up: String(k.delta).includes('+'), down: String(k.delta).includes('-') }"
          >
            {{ k.delta }}
          </span>
        </header>
        <div class="kpi-main">
          <div class="kpi-value">{{ k.value }}</div>
          <svg class="spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
            <!-- línea -->
            <polyline
              :points="
                k.series
                  .map(
                    (v, i) =>
                      `${(i / (k.series.length - 1)) * 100},${30 - (v / Math.max(...k.series)) * 26 - 2}`,
                  )
                  .join(' ')
              "
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            />
            <!-- relleno suave -->
            <polygon
              :points="
                (() => {
                  const pts = k.series.map(
                    (v, i) =>
                      `${(i / (k.series.length - 1)) * 100},${30 - (v / Math.max(...k.series)) * 26 - 2}`,
                  )
                  return `0,30 ${pts.join(' ')} 100,30`
                })()
              "
              class="spark-fill"
            />
          </svg>
        </div>
      </article>
    </section>

    <!-- Grid 2 columnas -->
    <section class="grid-2">
      <!-- Col izquierda -->
      <div class="stack">
        <!-- Próximas conferencias -->
        <article class="card">
          <header class="card-head">
            <h3>Próximas conferencias</h3>
            <a href="#" class="link">Ver agenda</a>
          </header>
          <ul class="list list-sessions">
            <li v-for="c in proximas" :key="c.id" class="row">
              <div class="meta">
                <div class="title">{{ c.titulo }}</div>
                <div class="sub">{{ c.fecha }} · {{ c.sala }}</div>
              </div>
              <div class="aux">
                <i class="bi bi-person-circle"></i>
                <span>{{ c.orador }}</span>
              </div>
            </li>
          </ul>
        </article>

        <!-- Actividad reciente -->
        <article class="card">
          <header class="card-head">
            <h3>Actividad reciente</h3>
            <a href="#" class="link">Ver todo</a>
          </header>
          <ul class="timeline">
            <li v-for="a in actividad" :key="a.id">
              <span class="dot"></span>
              <div class="t-body">
                <div class="t-text">{{ a.texto }}</div>
                <div class="t-time">{{ a.hora }}</div>
              </div>
            </li>
          </ul>
        </article>

        <!-- Accesos rápidos -->
        <article class="card">
          <header class="card-head">
            <h3>Accesos rápidos</h3>
          </header>
          <div class="quick">
            <button class="qbtn"><i class="bi bi-megaphone"></i> Crear anuncio</button>
            <button class="qbtn"><i class="bi bi-people"></i> Invitar asistentes</button>
            <button class="qbtn"><i class="bi bi-upload"></i> Subir materiales</button>
            <button class="qbtn"><i class="bi bi-clipboard2-check"></i> Nueva votación</button>
          </div>
        </article>
      </div>

      <!-- Col derecha -->
      <div class="stack">
        <!-- Participación (donut) -->
        <article class="card">
          <header class="card-head">
            <h3>Participación por ciudad</h3>
          </header>
          <div class="donut-wrap">
            <div class="donut" :style="donutStyle" aria-label="Distribución por ciudad"></div>
            <ul class="legend">
              <li v-for="(s, idx) in participacion" :key="s.label">
                <span
                  class="swatch"
                  :style="{
                    backgroundColor: ['#6d28d9', '#8b5cf6', '#a78bfa', '#c4b5fd'][idx % 4],
                  }"
                ></span>
                <span class="lg-label">{{ s.label }}</span>
                <span class="lg-val">{{ s.value }}%</span>
              </li>
            </ul>
          </div>
        </article>

        <!-- Top oradores -->
        <article class="card">
          <header class="card-head">
            <h3>Top oradores</h3>
          </header>
          <ul class="list list-speakers">
            <li v-for="o in topOradores" :key="o.id" class="row">
              <div class="avatar">
                <img v-if="o.avatar" :src="o.avatar" :alt="`Foto de ${o.nombre}`" loading="lazy" />
                <div v-else class="fallback">{{ o.nombre.slice(0, 1) }}</div>
              </div>
              <div class="meta">
                <div class="title">{{ o.nombre }}</div>
                <div class="sub">Charlas: {{ o.charlas }}</div>
              </div>
              <div class="aux">
                <i class="bi bi-star-fill"></i>
                <span>{{ o.score }}</span>
              </div>
            </li>
          </ul>
        </article>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* ===== Tokens ===== */
:root {
  --paper: #fff;
  --ink: #0b0b0d;
  --muted: #6b7280;
  --purple-900: #4c1d95;
  --purple-700: #6d28d9;
  --purple-500: #8b5cf6;
  --ring: 0 0 0 3px rgba(109, 40, 217, 0.22);
}

/* ===== Layout base ===== */
.dash {
  display: grid;
  gap: 16px;
}
.dash-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.dash-head h1 {
  margin: 0;
  font-size: 24px;
}
.muted {
  color: var(--muted);
  margin: 2px 0 0;
}

.actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.filter {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 8px 10px;
}
.filter select {
  border: none;
  background: transparent;
  outline: none;
  font-weight: 600;
}
.btn {
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  gap: 8px;
  align-items: center;
}
.btn-primary {
  background: linear-gradient(135deg, var(--purple-700), var(--purple-500));
  color: #fff;
}
.btn-primary:focus-visible {
  outline: none;
  box-shadow: var(--ring);
}

/* ===== KPIs ===== */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}
.kpi {
  background: #ffffff;
  border: 1px solid #eef0f4;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 10px 30px rgba(17, 24, 39, 0.06);
}
.kpi header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.kpi h3 {
  margin: 0;
  font-size: 13px;
  color: #475569;
  font-weight: 700;
}
.delta {
  font-size: 12px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #0f172a;
}
.delta.up {
  background: #ecfdf5;
  color: #065f46;
}
.delta.down {
  background: #fef2f2;
  color: #7f1d1d;
}
.kpi-main {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  margin-top: 8px;
}
.kpi-value {
  font-size: 28px;
  font-weight: 800;
  line-height: 1;
}
.spark {
  width: 120px;
  height: 42px;
  color: var(--purple-700);
}
.spark-fill {
  fill: rgba(109, 40, 217, 0.12);
}

/* ===== Grid 2 cols ===== */
.grid-2 {
  display: grid;
  gap: 12px;
  grid-template-columns: 1.25fr 1fr;
}
.stack {
  display: grid;
  gap: 12px;
}

/* ===== Cards / listas ===== */
.card {
  background: #fff;
  border: 1px solid #eef0f4;
  border-radius: 16px;
  padding: 12px;
  box-shadow: 0 10px 30px rgba(17, 24, 39, 0.06);
}
.card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}
.card-head h3 {
  margin: 0;
  font-size: 16px;
}
.link {
  font-size: 13px;
  color: var(--purple-700);
  text-decoration: none;
  font-weight: 700;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}
.row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  background: #fafbff;
  border: 1px solid #f1f5f9;
}
.row:hover {
  background: #f7f8fe;
}
.meta {
  min-width: 0;
}
.title {
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.sub {
  font-size: 12px;
  color: #64748b;
}
.aux {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #0f172a;
  font-weight: 700;
}

/* Sesiones */
.list-sessions .row .aux i {
  color: var(--purple-700);
}

/* Timeline */
.timeline {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}
.timeline li {
  position: relative;
  display: flex;
  gap: 10px;
}
.timeline .dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--purple-700);
  margin-top: 8px;
  flex: 0 0 auto;
}
.t-body {
  background: #fafbff;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  padding: 10px;
  flex: 1;
}
.t-text {
  font-size: 14px;
}
.t-time {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

/* Donut */
.donut-wrap {
  display: flex;
  gap: 16px;
  align-items: center;
}
.donut {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 22px #fff; /* grosor del anillo */
  outline: 1px solid #eef0f4;
}
.legend {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 6px;
}
.legend li {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
}
.swatch {
  width: 10px;
  height: 10px;
  border-radius: 3px;
}
.lg-label {
  font-size: 13px;
  color: #0f172a;
}
.lg-val {
  font-weight: 800;
}

/* Speakers */
.list-speakers .avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex: 0 0 auto;
  border: 2px solid #e9d5ff;
}
.list-speakers .avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.list-speakers .fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: #ede9fe;
  color: #4c1d95;
  font-weight: 800;
}
.list-speakers .row {
  gap: 12px;
}

/* Quick actions */
.quick {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.qbtn {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 12px;
  padding: 12px;
  text-align: left;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
}
.qbtn:hover {
  background: #f8fafc;
}

/* ===== Responsive ===== */
@media (max-width: 1200px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .grid-2 {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 640px) {
  .actions {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
  .quick {
    grid-template-columns: 1fr;
  }
}
</style>
