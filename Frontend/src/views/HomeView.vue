<template>
  <div class="landing">
    <!-- HERO -->
    <section id="inicio" class="hero" role="region" aria-label="Portada">
      <div class="container hero-grid" id="contenido">
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

          <ul class="bullets">
            <li>Programación de charlas</li>
            <li>Votación y feedback</li>
            <li>Notificaciones y materiales</li>
          </ul>
        </div>

        <div class="hero-art" aria-hidden="true"></div>
      </div>

      <!-- Mockup fuera del grid -->
      <picture>
        <img
          :src="lapPng"
          alt="Vista previa del sistema en una laptop"
          class="laptop"
          width="1500"
          height="900"
          decoding="async"
          loading="lazy"
          sizes="(max-width: 900px) 88vw, 55vw"
        />
      </picture>
    </section>

    <!-- FEATURES -->
    <section id="features" class="section">
      <div class="container">
        <h2 class="h2 center">Características</h2>
        <div class="features" role="list">
          <article class="card" role="listitem">
            <div class="chip" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="currentColor"
              >
                <path
                  d="M19 4h-1V2h-2v2H8V2H6v2H5 c-1.1 0-2 .9-2 2v14c0 1.1.9 2
                         2 2h14c1.1 0 2-.9 2-2V6 c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"
                />
              </svg>
            </div>
            <h3>Organiza sin complicaciones</h3>
            <p>Crea eventos, agenda charlas y gestiona salas y horarios.</p>
          </article>

          <article class="card" role="listitem">
            <div class="chip" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="currentColor"
              >
                <path
                  d="M12 2l4 8H8l4-8zm0 20 c-4.41 0-8-3.59-8-8s3.59-8
                         8-8 8 3.59 8 8-3.59 8-8 8zm0-14 c-3.31 0-6 2.69-6 6s2.69 6
                         6 6 6-2.69 6-6-2.69-6-6-6z"
                />
              </svg>
            </div>
            <h3>Feedback en tiempo real</h3>
            <p>Votación y encuestas para mejorar la experiencia.</p>
          </article>

          <article class="card" role="listitem">
            <div class="chip" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="currentColor"
              >
                <path
                  d="M12 22c1.1 0 1.99-.9 1.99-2H10c0 1.1.9 2 2
                         2zm6-6V9c0-3.07-1.63-5.64-4.5-6.32V2.5a1.5
                         1.5 0 0 0-3 0v.18C7.63 3.36 6 5.92 6 9v7l-2
                         2v1h16v-1l-2-2z"
                />
              </svg>
            </div>
            <h3>Notificaciones inmediatas</h3>
            <p>Avisos de cambios de sala u horario, al instante.</p>
          </article>

          <article class="card" role="listitem">
            <div class="chip" aria-hidden="true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="22"
                height="22"
                fill="currentColor"
              >
                <path
                  d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2
                         2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"
                />
              </svg>
            </div>
            <h3>Materiales centralizados</h3>
            <p>Descarga diapositivas y recursos desde un solo lugar.</p>
          </article>
        </div>
      </div>
    </section>

    <!-- CÓMO FUNCIONA -->
    <section class="section howitworks">
      <div class="container">
        <h2 class="h2 center">¿Cómo funciona?</h2>
        <div class="steps">
          <article class="step">
            <div class="step-num">1</div>
            <h3>Crea tu evento</h3>
            <p>Define agenda, salas y oradores en minutos.</p>
          </article>
          <article class="step">
            <div class="step-num">2</div>
            <h3>Invita y comunica</h3>
            <p>Invitaciones y notificaciones en tiempo real.</p>
          </article>
          <article class="step">
            <div class="step-num">3</div>
            <h3>Mide y mejora</h3>
            <p>Votaciones, encuestas y materiales centralizados.</p>
          </article>
        </div>
      </div>
    </section>

    <!-- SHOWCASE -->
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
          <figure class="t-card">
            <blockquote>
              “Simplificó la logística del congreso y elevó la participación.”
            </blockquote>
            <figcaption>Camila R. · Coordinadora académica</figcaption>
          </figure>
          <figure class="t-card">
            <blockquote>
              “El feedback en vivo nos permitió ajustar el programa al instante.”
            </blockquote>
            <figcaption>Diego M. · Organizador</figcaption>
          </figure>
          <figure class="t-card">
            <blockquote>
              “Materiales y notificaciones en un solo lugar. Ahorro de tiempo real.”
            </blockquote>
            <figcaption>Ana P. · Asistente</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- EQUIPO -->
    <section class="section" role="region" aria-label="Equipo de desarrollo">
      <div class="container">
        <h2 class="h2 center">Equipo de Desarrollo</h2>

        <div class="team" role="list">
          <article class="member" v-for="m in members" :key="m.nombre" role="listitem">
            <figure class="avatar" :aria-label="`Foto de ${m.nombre}`">
              <img
                v-if="m.foto"
                :src="m.foto"
                :alt="`Foto de ${m.nombre}`"
                loading="lazy"
                decoding="async"
                width="96"
                height="96"
                sizes="96px"
                style="aspect-ratio: 1/1; object-fit: cover"
              />
              <div v-else class="avatar-fallback" aria-hidden="true">
                {{ getInitials(m.nombre) }}
              </div>
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
          <details>
            <summary>¿Puedo cambiar la agenda después de publicada?</summary>
            <p>Sí. Las notificaciones llegarán automáticamente a los asistentes.</p>
          </details>
          <details>
            <summary>¿Cómo funcionan las votaciones en vivo?</summary>
            <p>Activas una encuesta desde el panel y los asistentes responden desde su móvil.</p>
          </details>
          <details>
            <summary>¿Puedo subir materiales por charla?</summary>
            <p>Claro. PDF, diapositivas y enlaces quedan centralizados por sesión.</p>
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

    <!-- ABOUT -->
    <section id="about" class="section">
      <div class="container">
        <h2 class="h2 center">Acerca de</h2>

        <p class="center" style="max-width: 75ch; margin: 8px auto 0">
          <strong>AbrahamEventSphere</strong> es una plataforma innovadora diseñada para transformar
          la manera en que se organizan, administran y viven las conferencias y eventos académicos y
          profesionales. Nace con el propósito de brindar a universidades, instituciones y
          organizadores una herramienta moderna, ágil y accesible que centraliza todo el ciclo de
          gestión de un evento en un solo lugar.
        </p>

        <p class="center" style="max-width: 75ch; margin: 16px auto 0">
          Nuestra misión es <em>facilitar la experiencia de todos los actores involucrados</em>:
          desde organizadores, que pueden planificar charlas, salas y horarios; hasta los
          participantes, que acceden a información actualizada, votan en tiempo real y descargan
          materiales con un solo clic. Todo esto con un diseño pensado para la simplicidad y la
          eficiencia.
        </p>

        <p class="center" style="max-width: 75ch; margin: 16px auto 0">
          Entre las principales características destacan:
        </p>
        <ul
          class="center"
          style="max-width: 70ch; margin: 16px auto; text-align: left; line-height: 1.6"
        >
          <li>✔️ Gestión integral de conferencias, talleres y charlas.</li>
          <li>✔️ Sistema de votación y encuestas en vivo para obtener feedback inmediato.</li>
          <li>✔️ Notificaciones en tiempo real sobre cambios de agenda o ubicación.</li>
          <li>✔️ Repositorio centralizado de materiales y presentaciones.</li>
        </ul>

        <p class="center" style="max-width: 75ch; margin: 16px auto 0">
          Con <strong>AbrahamEventSphere</strong>, buscamos no solo optimizar la logística de los
          eventos, sino también potenciar la interacción y el aprendizaje colaborativo. Creemos que
          cada conferencia es una oportunidad de crecimiento y nuestra plataforma está construida
          para que esa experiencia sea memorable, eficiente y conectada con el futuro.
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer" role="contentinfo">
      <div class="container footer-grid">
        <div>
          <div class="ft-title">Contacto</div>
          <a class="link" href="mailto:contacto@eventos.com">AbrahamEventSphere@gmail.com</a><br />
          <a class="link" href="tel:+59170000000">+591 70000000</a><br />
          <a class="link" href="tel:+59170000000">+591 60000000</a>
        </div>
        <div>
          <div class="ft-title">Dirección</div>
          <div>La Paz, Bolivia</div>
        </div>
        <div class="footer-meta">
          <div>Universidad Católica Boliviana San Pablo</div>
          <div>© 2025 — Todos los derechos reservados</div>
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

const members = [
  { nombre: 'Fabrisio Condarco', foto: fabrisioJpg },
  { nombre: 'Jose Manzaneda', foto: joseJpg },
  { nombre: 'Miguel Quisbert', foto: miguelJpg },
  { nombre: 'Oscar Menacho', foto: oscarJpg },
  { nombre: 'Rodrigo Rivera', foto: rodrigoJpg },
]

const getInitials = (n) =>
  n
    .split(/\s+/)
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
</script>

<style scoped>
/* ===== Tokens ===== */
:root {
  --purple-900: #4c1d95;
  --purple-700: #6d28d9;
  --purple-500: #8b5cf6;

  --gray-900: #0f1012;
  --gray-800: #17181b;
  --gray-700: #1f2126;
  --gray-100: #e5e7eb;
}
/* ===== Base ===== */
* {
  box-sizing: border-box;
}
.landing {
  background: #fff;
  color: var(--ink);
}
img {
  display: block;
  height: auto;
  max-width: 100%;
}
a {
  color: inherit;
  text-decoration: none;
}
.container {
  width: min(1280px, 92%);
  margin-inline: auto;
}
.section {
  padding: 20px 0;
}
.center {
  text-align: center;
}

/* ===== Hero ===== */
.hero {
  min-height: calc(100dvh - var(--header-h, 140px));
  position: relative;
  overflow: hidden;
  color: #fff;
  padding: 28px 0 140px; /* reserva para la laptop absoluta */
  background:
    radial-gradient(1000px 420px at 75% 15%, rgba(255, 255, 255, 0.06), transparent 60%),
    linear-gradient(120deg, var(--purple-900), var(--purple-700) 55%, var(--purple-500));
}
.hero-grid {
  display: grid;
  gap: 32px;
  align-items: center;
  min-height: 460px;
  grid-template-columns: 1.05fr 0.95fr;
}
.eyebrow {
  opacity: 0.9;
  margin: 0 0 6px;
  font-weight: 600;
}
.hero-text h1 {
  font-size: clamp(36px, 5.2vw, 56px);
  line-height: 1.08;
  margin: 0 0 12px;
  font-weight: 800;
}
.brand-mark {
  display: block;
  font-weight: 800;
}
.lead {
  font-size: 18px;
  opacity: 0.95;
  margin: 0 0 22px;
  max-width: 60ch;
}

/* CTA */
.cta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.btn {
  display: inline-block;
  padding: 14px 26px;
  border-radius: 14px;
  font-weight: 700;
  transition:
    transform 0.18s ease,
    filter 0.18s ease,
    box-shadow 0.18s ease;
}
.btn-primary {
  background: #fff;
  color: var(--purple-900);
}
.btn-primary:hover {
  transform: translateY(-3px);
  filter: brightness(0.96);
}
.btn-secondary {
  background: var(--purple-700);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}
.btn-secondary:hover {
  transform: translateY(-3px);
  filter: brightness(1.03);
}

/* Laptop destacada (fuera del grid) */
.laptop {
  position: absolute;
  right: 2.5vw;
  bottom: 140px;
  width: min(55vw, 1500px);
  transform: rotate(-6deg);
  filter: drop-shadow(0 28px 48px rgba(0, 0, 0, 0.4));
  pointer-events: none;
  z-index: 1;
}

/* ===== Features ===== */
.about-card {
  background: #111827;
  color: #e5e7eb;
  padding: 24px;
  border-radius: 20px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.03),
    0 10px 30px rgba(17, 24, 39, 0.25);
}
.h2 {
  font-size: clamp(24px, 3vw, 32px);
  margin: 0 0 8px;
}
.features {
  display: grid;
  gap: 16px;
  margin-top: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
@media (min-width: 900px) {
  .features {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.card {
  background: #1f2937;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.25);
}
.card h3 {
  margin: 8px 0 6px;
  font-size: 18px;
  color: #fff;
}
.card p {
  margin: 0;
  color: #cbd5e1;
  font-size: 14px;
}
.chip {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--purple-700), var(--purple-500));
  color: #fff;
  font-size: 20px;
}

/* ===== Cómo funciona ===== */
.howitworks .steps {
  display: grid;
  gap: 16px;
  margin-top: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
@media (max-width: 900px) {
  .howitworks .steps {
    grid-template-columns: 1fr;
  }
}
.step {
  background: #ffffff;
  border: 1px solid #eee;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 6px 20px rgba(17, 24, 39, 0.08);
  text-align: center;
}
.step-num {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  margin: 0 auto 6px;
  display: grid;
  place-items: center;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(135deg, var(--purple-700), var(--purple-500));
}
.step h3 {
  margin: 6px 0;
  font-size: 18px;
}
.step p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

/* ===== Showcase ===== */
.show-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}
@media (min-width: 900px) {
  .show-grid {
    grid-template-columns: 1fr 1fr;
  }
}
.shot {
  background: #0f172a;
  color: #e2e8f0;
  padding: 18px;
  border-radius: 16px;
}

/* ===== Testimonios ===== */
.testimonials .t-grid {
  display: grid;
  gap: 16px;
  margin-top: 12px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
@media (max-width: 900px) {
  .testimonials .t-grid {
    grid-template-columns: 1fr;
  }
}
.t-card {
  background: #111827;
  color: #e5e7eb;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.25);
}
.t-card blockquote {
  margin: 0 0 10px;
  font-size: 15px;
  line-height: 1.5;
}
.t-card figcaption {
  font-size: 13px;
  color: #cbd5e1;
}

/* ===== Team ===== */
.team {
  display: grid;
  gap: 18px;
  margin-top: 16px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}
@media (max-width: 900px) {
  .team {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .team {
    grid-template-columns: 1fr;
  }
}

.member {
  text-align: center;
  padding: 14px 10px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.25);
}
.avatar {
  width: 96px;
  height: 96px;
  margin: 0 auto 10px;
  border-radius: 50%;
  position: relative;
  overflow: hidden;
}
.avatar::before {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--purple-700), var(--purple-500));
  z-index: 0;
  filter: blur(0.5px);
}
.avatar img,
.avatar .avatar-fallback {
  position: relative;
  z-index: 1;
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.25s ease;
}
.member:hover .avatar img {
  transform: scale(1.05);
}

.avatar-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: #e5e7eb;
  color: #374151;
  font-weight: 800;
  font-size: 24px;
  letter-spacing: 0.5px;
}
.name {
  font-weight: 700;
  color: #000000;
}

/* ===== FAQ ===== */
.faq .faq-list {
  max-width: 800px;
  margin: 12px auto 0;
  display: grid;
  gap: 10px;
}
.faq details {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: 0 4px 14px rgba(17, 24, 39, 0.08);
}
.faq summary {
  cursor: pointer;
  font-weight: 700;
  outline: none;
}
.faq details[open] summary {
  color: var(--purple-700);
}
.faq p {
  margin: 8px 0 0;
  color: #374151;
}

/* ===== CTA final ===== */
.final-box {
  background: #180a38;
  color: #fff;
  border-radius: 20px;
  padding: 28px;
  display: grid;
  gap: 10px;
  place-items: center;
  text-align: center;
}

/* ===== Footer ===== */
.footer {
  background: #0b0b0d;
  color: #d1d5db;
  padding: 70px 0;
  margin-top: 10px;
}
.footer-grid {
  display: flex;
  gap: 22px;
  justify-content: space-between;
  align-items: start;
  flex-wrap: wrap;
}
.ft-title {
  font-weight: 700;
  color: #f3f4f6;
  margin-bottom: 6px;
}
.link:hover {
  text-decoration: underline;
}

/* ===== Responsive ===== */
@media (max-width: 900px) {
  .hero {
    padding: 24px 0 44px;
  }
  .hero-grid {
    grid-template-columns: 1fr;
    min-height: 420px;
  }
  .laptop {
    position: static;
    transform: none;
    width: min(88vw, 820px);
    margin: 20px auto 0;
  }
  .team {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 640px) {
  .team {
    grid-template-columns: 1fr;
  }
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce) {
  .btn {
    transition: none;
  }
}
</style>

<!-- Estilos globales necesarios para anclas y layout -->
<style>
html {
  scroll-behavior: smooth;
}
html,
body {
  height: 100%;
  margin: 0;
  overflow-x: hidden;
}
/* Compensa el header sticky en los saltos de ancla */
#inicio,
#features,
#about {
  scroll-margin-top: calc(var(--header-h, 140px) + 16px);
}
</style>
