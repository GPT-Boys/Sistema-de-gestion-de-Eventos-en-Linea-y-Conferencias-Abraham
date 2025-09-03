<template>
  <div class="landing">
    <!-- HERO -->
    <section id="inicio" class="hero" role="region" aria-label="Portada">
      <div class="container hero-grid">
        <div class="hero-text">
          <p class="eyebrow">Plataforma para conferencias y eventos</p>
          <h1>
            Gestiona tus Conferencias y Eventos
            <span class="brand-mark">AbrahamEventSphere</span>
          </h1>
          <p class="lead">Organiza, participa y recibe notificaciones en tiempo real.</p>

          <div class="cta">
            <a class="btn btn-primary" href="/register">Crear Cuenta</a>
            <router-link class="btn btn-secondary" to="/login">Iniciar Sesión</router-link>
          </div>
        </div>

        <figure class="hero-mockup" aria-hidden="true">
          <img :src="lapPng" alt="Vista previa del sistema" loading="lazy" decoding="async" />
        </figure>
      </div>
    </section>

    <!-- FEATURES -->
    <section id="features" class="section">
      <div class="container">
        <h2 class="h2 center">Características</h2>
        <div class="features" role="list">
          <article v-for="f in features" :key="f.titulo" class="card" role="listitem">
            <div class="chip">
              <component :is="f.icon" class="icon" />
            </div>
            <h3>{{ f.titulo }}</h3>
            <p>{{ f.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <!-- CÓMO FUNCIONA -->
    <section class="section howitworks">
      <div class="container">
        <h2 class="h2 center">¿Cómo funciona?</h2>
        <div class="steps">
          <article v-for="(s, i) in steps" :key="s.titulo" class="step">
            <div class="step-num">{{ i + 1 }}</div>
            <h3>{{ s.titulo }}</h3>
            <p>{{ s.desc }}</p>
          </article>
        </div>
        <div class="center mt-3">
          <a class="btn btn-primary" href="/register">Empieza ahora</a>
        </div>
      </div>
    </section>

    <!-- SHOWCASE -->
    <section class="section showcase">
      <div class="container">
        <h2 class="h2 center">Lo que puedes hacer</h2>
        <div class="show-grid">
          <figure class="shot">
            <img :src="charlasImg" alt="Administrar charlas" class="block-img" />
            <figcaption>Programa y administra tus sesiones</figcaption>
          </figure>
          <figure class="shot">
            <img :src="feedbackImg" alt="Feedback de charlas" class="block-img" />
            <figcaption>Obtén feedback en minutos</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- TESTIMONIOS -->
    <section class="section testimonials">
      <div class="container">
        <h2 class="h2 center">Lo que dicen nuestros usuarios</h2>
        <div class="t-grid">
          <figure v-for="t in testimonios" :key="t.nombre" class="t-card">
            <blockquote>“{{ t.texto }}”</blockquote>
            <figcaption>{{ t.nombre }}</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- EQUIPO -->
    <section class="section" role="region" aria-label="Equipo de desarrollo">
      <div class="container">
        <h2 class="h2 center">Equipo de Desarrollo</h2>
        <div class="team">
          <article v-for="m in members" :key="m.nombre" class="member">
            <figure class="avatar">
              <img v-if="m.foto" :src="m.foto" :alt="`Foto de ${m.nombre}`" loading="lazy" />
              <div v-else class="avatar-fallback">{{ getInitials(m.nombre) }}</div>
            </figure>
            <div class="name">{{ m.nombre }}</div>
          </article>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section faq">
      <div class="container">
        <h2 class="h2 center">Preguntas frecuentes</h2>
        <div class="faq-list">
          <details v-for="faq in faqs" :key="faq.q">
            <summary>{{ faq.q }}</summary>
            <p>{{ faq.a }}</p>
          </details>
        </div>
      </div>
    </section>

    <!-- CTA final -->
    <section class="section final-cta">
      <div class="container final-box">
        <h3>¿Listo para tu próximo evento?</h3>
        <p>Empieza gratis y escala cuando lo necesites.</p>
        <div class="cta">
          <a class="btn btn-primary" href="/register">Crear Cuenta</a>
          <router-link class="btn btn-secondary" to="/login">Iniciar Sesión</router-link>
        </div>
      </div>
    </section>
  <!-- ABOUT  -->
      <section id="about" class="section about-us">
        <div class="container">
          <h2 class="h2 center">Sobre nosotros</h2>
          <div class="about-content">
            <p>
              En <strong>AbrahamEventSphere</strong> creemos en el poder de la
              colaboración y la innovación. Nuestro equipo de estudiantes y
              desarrolladores apasionados ha creado esta plataforma para
              transformar la forma en que se gestionan conferencias y eventos.
            </p>
            <p>
              El proyecto nació en la <em>Universidad Católica Boliviana San Pablo</em>
              como una iniciativa académica que busca unir tecnología con
              comunidad, mejorando la experiencia de organizadores y asistentes
              en cada evento.
            </p>
          </div>
        </div>
      </section>
    <!-- FOOTER -->
    <footer class="footer">
      <div class="container footer-grid">
        <div>
          <h4 class="ft-title">Contacto</h4>
          <a href="mailto:AbrahamEventSphere@gmail.com" class="link">AbrahamEventSphere@gmail.com</a><br />
          <a href="tel:+59170000000" class="link">+591 70000000</a><br />
          <a href="tel:+59160000000" class="link">+591 60000000</a>
        </div>
        <div>
          <h4 class="ft-title">Dirección</h4>
          <p>La Paz, Bolivia</p>
        </div>
        <div>
          <h4 class="ft-title">Universidad</h4>
          <p>Universidad Católica Boliviana San Pablo</p>
          <p class="footer-meta">© 2025 — Todos los derechos reservados</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import lapPng from '@/assets/hero/laptop.png'
import fabrisioJpg from '@/assets/images/team/fabrisio.jpg'
import joseJpg from '@/assets/images/team/jose.jpg'
import miguelJpg from '@/assets/images/team/miguel.jpg'
import oscarJpg from '@/assets/images/team/oscar.jpg'
import rodrigoJpg from '@/assets/images/team/rodrigo.jpg'
import charlasImg from '@/assets/img/Charlas.png'
import feedbackImg from '@/assets/img/Feedback.png'

/* Heroicons */
import {
  CalendarDaysIcon,
  ArrowsRightLeftIcon,
  BellAlertIcon,
  DocumentArrowDownIcon
} from '@heroicons/vue/24/outline'

const members = [
  { nombre: 'Fabrisio Condarco', foto: fabrisioJpg },
  { nombre: 'Jose Manzaneda', foto: joseJpg },
  { nombre: 'Miguel Quisbert', foto: miguelJpg },
  { nombre: 'Oscar Menacho', foto: oscarJpg },
  { nombre: 'Rodrigo Rivera', foto: rodrigoJpg },
]

const features = [
  { titulo: 'Organiza sin complicaciones', desc: 'Crea eventos, agenda charlas y gestiona salas y horarios.', icon: CalendarDaysIcon },
  { titulo: 'Feedback en tiempo real', desc: 'Votación y encuestas para mejorar la experiencia.', icon: ArrowsRightLeftIcon },
  { titulo: 'Notificaciones inmediatas', desc: 'Avisos de cambios de sala u horario, al instante.', icon: BellAlertIcon },
  { titulo: 'Materiales centralizados', desc: 'Descarga diapositivas y recursos desde un solo lugar.', icon: DocumentArrowDownIcon },
]

const steps = [
  { titulo: 'Crea tu evento', desc: 'Define agenda, salas y oradores en minutos.' },
  { titulo: 'Invita y comunica', desc: 'Envía invitaciones y notificaciones en tiempo real.' },
  { titulo: 'Mide y mejora', desc: 'Recoge feedback y mejora cada edición.' },
]

const testimonios = [
  { texto: 'Simplificó la logística del congreso y elevó la participación.', nombre: 'Camila R. · Coordinadora académica' },
  { texto: 'El feedback en vivo nos permitió ajustar la calidad de los programas.', nombre: 'Diego M. · Organizador' },
  { texto: 'Materiales y notificaciones en un solo lugar. Ahorro de tiempo real.', nombre: 'Ana P. · Asistente' },
]

const faqs = [
  { q: '¿Puedo cambiar la agenda después de publicada?', a: 'Sí, y los asistentes reciben notificación automática.' },
  { q: '¿Cómo funcionan las votaciones en vivo?', a: 'Se activan desde el panel y los asistentes responden desde el sistema.' },
  { q: '¿Puedo subir materiales por charla?', a: 'Claro, PDF, diapositivas y enlaces centralizados.' },
]

const getInitials = (n) =>
  n.split(/\s+/).map((p) => p[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
</script>

<style scoped>
.landing {
  overflow-x: hidden;
  background: var(--gris-fondo);
  color: var(--text-primary);
}

/* HERO */
.hero {
  display: flex;
  align-items: center;
  padding: 80px 0;
  background: linear-gradient(135deg, var(--morado-oscuro), var(--morado-base));
  color: var(--blanco);
}
.hero-grid {
  display: grid;
  gap: 32px;
  align-items: center;
  grid-template-columns: 1fr 1fr;
}
.hero h1 {
  font-size: clamp(36px, 5vw, 56px);
  margin-bottom: 12px;
}
.hero .lead {
  font-size: 18px;
  margin-bottom: 22px;
}
.hero-mockup img {
  max-width: 100%;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.25);
}

/* BOTONES */
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 700;
  transition: all 0.2s ease;
  cursor: pointer;
}
.btn-primary {
  background: var(--morado-base);
  color: var(--blanco);
}
.btn-primary:hover {
  background: var(--morado-intermedio);
}
.btn-secondary {
  background: var(--blanco);
  color: var(--morado-base);
  border: 2px solid var(--morado-base);
}
.btn-secondary:hover {
  background: var(--morado-suave);
  color: var(--blanco);
}

/* FEATURES */
[data-theme="dark"] .card h3 {
  color: var(--blanco);
}

[data-theme="dark"] .card p {
  color: var(--text-secondary, #d1d5db);
}
.features {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.card {
  background: var(--card-bg, var(--blanco));
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
}
.chip {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--morado-base);
  display: grid;
  place-items: center;
  margin: 0 auto 14px;
}
.icon {
  width: 32px;
  height: 32px;
  color: var(--blanco);
}

/* STEPS */
.steps {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}
.step {
  background: var(--card-bg, var(--blanco));
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}
.step:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
}
.step-num {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--morado-base);
  color: var(--blanco);
  font-weight: 800;
  margin: 0 auto 8px;
}

/* SHOWCASE */
.show-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}
.shot {
  background: var(--card-bg, var(--blanco));
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}
.shot:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
}
.shot img {
  max-width: 100%;
  border-radius: 12px;
  display: block;
}

/* TESTIMONIOS */
.t-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
.t-card {
  background: var(--card-bg, var(--blanco));
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  font-size: 16px;
  line-height: 1.6;
  transition: all 0.3s ease;
}
.t-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
}

/* TEAM */
.team {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}
.member {
  background: var(--card-bg, var(--blanco));
  border-radius: 16px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}
.member:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px rgba(0,0,0,0.15);
}
.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 12px;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* FAQ */
.faq-list {
  max-width: 800px;
  margin: 0 auto;
  display: grid;
  gap: 12px;
}
.faq details {
  background: var(--card-bg, var(--blanco));
  border-radius: 12px;
  padding: 14px 18px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}
.faq details[open] {
  background: var(--morado-suave);
  color: var(--card-bg, var(--blanco));
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0,0,0,0.25);
}
.faq summary {
  cursor: pointer;
  font-weight: 600;
  outline: none;
  transition: color 0.3s ease;
}
.faq details[open] summary {
  color: var(--card-bg, var(--blanco));
}
.faq p {
  margin-top: 10px;
  line-height: 1.6;
  font-size: 15px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

/* CTA Final */
.final-box {
  max-width: 900px;
  margin: 0 auto;
  padding: 48px 32px;
  border-radius: 20px;
  text-align: center;
  background: var(--morado-oscuro);
  color: var(--blanco);
}
.about-us {
  background: var(--card-bg, var(--blanco));
  border-radius: 16px;
  padding: 48px 32px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  font-size: 16px;
  line-height: 1.7;
  color: var(--text-secondary);
}

.about-content p {
  margin-bottom: 16px;
}

/* Dark Mode */
[data-theme="dark"] .about-us {
  background: var(--card-bg, #1f2937);
  color: var(--blanco);
  border: 1px solid rgba(255,255,255,0.08);
}
[data-theme="dark"] .about-content {
  color: var(--text-secondary, #d1d5db);
}

/* FOOTER */
.footer {
  background: var(--morado-oscuro);
  color: var(--blanco);
  padding: 60px 20px;
}
.footer-grid {
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  max-width: 1200px;
  margin: 0 auto;
}
.ft-title {
  font-weight: 700;
  margin-bottom: 10px;
}
.footer-meta {
  font-size: 14px;
  color: var(--morado-suave);
}
.footer a {
  color: var(--morado-suave);
}
.footer a:hover {
  color: var(--blanco);
}
</style>
