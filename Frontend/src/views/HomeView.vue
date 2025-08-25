<template>
  <div class="landing">
    <!-- Header fijo -->
    <header class="header" role="banner">
      <div class="container header-inner">
        <!-- Logo -->
        <a href="/" class="brand" aria-label="AbrahamEventSphere — Inicio">
          <img src="/Logo.png" alt="AbrahamEventSphere" class="logo" />
        </a>

        <!-- Botón hamburguesa (solo móvil) -->
        <button
          class="nav-toggle"
          @click="toggleMenu"
          :aria-expanded="menuOpen.toString()"
          aria-controls="mainnav"
          aria-label="Abrir menú"
        >
          ☰
        </button>

        <!-- Navegación -->
        <nav
          id="mainnav"
          class="nav"
          :class="{ 'is-open': menuOpen }"
          aria-label="Navegación principal"
        >
          <a href="#inicio">Inicio</a>
          <a href="#features">Características</a>
          <a href="#about">Acerca de</a>
          <a href="/login">Iniciar Sesión</a>
        </nav>
      </div>
    </header>

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
      <img src="/laptop.png" alt="Vista previa del sistema en una laptop" class="laptop" />
    </section>

    <!-- FEATURES -->
<section id="features" class="section">
  <div class="container">
    <h2 class="h2 center">Características</h2>
    <div class="features" role="list">

      <!-- Organiza -->
      <article class="card" role="listitem">
        <div class="chip" aria-hidden="true">
          <!-- Calendario -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5
                     c-1.1 0-2 .9-2 2v14c0 1.1.9 2
                     2 2h14c1.1 0 2-.9 2-2V6
                     c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>
          </svg>
        </div>
        <h3>Organiza sin complicaciones</h3>
        <p>Crea eventos, agenda charlas y gestiona salas y horarios.</p>
      </article>

      <!-- Feedback -->
      <article class="card" role="listitem">
        <div class="chip" aria-hidden="true">
          <!-- Votación -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M12 2l4 8H8l4-8zm0 20
                     c-4.41 0-8-3.59-8-8s3.59-8
                     8-8 8 3.59 8 8-3.59 8-8 8zm0-14
                     c-3.31 0-6 2.69-6 6s2.69 6
                     6 6 6-2.69 6-6-2.69-6-6-6z"/>
          </svg>
        </div>
        <h3>Feedback en tiempo real</h3>
        <p>Votación y encuestas para mejorar la experiencia.</p>
      </article>

      <!-- Notificaciones -->
      <article class="card" role="listitem">
        <div class="chip" aria-hidden="true">
          <!-- Campana -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M12 22c1.1 0 1.99-.9
                     1.99-2H10c0 1.1.9 2 2
                     2zm6-6V9c0-3.07-1.63-5.64-4.5-6.32V2.5a1.5
                     1.5 0 0 0-3 0v.18C7.63 3.36
                     6 5.92 6 9v7l-2
                     2v1h16v-1l-2-2z"/>
          </svg>
        </div>
        <h3>Notificaciones inmediatas</h3>
        <p>Avisos de cambios de sala u horario, al instante.</p>
      </article>

      <!-- Materiales -->
      <article class="card" role="listitem">
        <div class="chip" aria-hidden="true">
          <!-- Carpeta -->
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M10 4H4c-1.1 0-2
                     .9-2 2v12c0 1.1.9 2
                     2 2h16c1.1 0 2-.9
                     2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/>
          </svg>
        </div>
        <h3>Materiales centralizados</h3>
        <p>Descarga diapositivas y recursos desde un solo lugar.</p>
      </article>

    </div>
  </div>
</section>


    <!-- SHOWCASE -->
    <section class="section showcase">
      <div class="container">
        <div class="show-grid">
          <figure class="shot">
            <figcaption>Programa y administra tus sesiones</figcaption>
          </figure>
          <figure class="shot">
            <figcaption>Obtén feedback en minutos</figcaption>
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
              <img v-if="m.foto" :src="m.foto" :alt="`Foto de ${m.nombre}`" loading="lazy" />
              <div v-else class="avatar-fallback" aria-hidden="true">{{ getInitials(m.nombre) }}</div>
            </figure>
            <div class="name">{{ m.nombre }}</div>
          </article>
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

    <p class="center" style="max-width:75ch;margin:8px auto 0;">
      <strong>AbrahamEventSphere</strong> es una plataforma innovadora diseñada para transformar la manera en que 
      se organizan, administran y viven las conferencias y eventos académicos y profesionales. 
      Nace con el propósito de brindar a universidades, instituciones y organizadores una herramienta 
      moderna, ágil y accesible que centraliza todo el ciclo de gestión de un evento en un solo lugar.
    </p>

    <p class="center" style="max-width:75ch;margin:16px auto 0;">
      Nuestra misión es <em>facilitar la experiencia de todos los actores involucrados</em>: 
      desde organizadores, que pueden planificar charlas, salas y horarios; hasta los participantes, 
      que acceden a información actualizada, votan en tiempo real y descargan materiales con un solo clic. 
      Todo esto con un diseño pensado para la simplicidad y la eficiencia.
    </p>

    <!-- 🔧 Aquí estaba el <ul> dentro del <p>. Separarlo así: -->
    <p class="center" style="max-width:75ch;margin:16px auto 0;">
      Entre las principales características destacan:
    </p>
    <ul class="center" style="max-width:70ch;margin:16px auto;text-align:left;line-height:1.6;">
      <li>✔️ Gestión integral de conferencias, talleres y charlas.</li>
      <li>✔️ Sistema de votación y encuestas en vivo para obtener feedback inmediato.</li>
      <li>✔️ Notificaciones en tiempo real sobre cambios de agenda o ubicación.</li>
      <li>✔️ Repositorio centralizado de materiales y presentaciones.</li>
    </ul>

    <p class="center" style="max-width:75ch;margin:16px auto 0;">
      Con <strong>AbrahamEventSphere</strong>, buscamos no solo optimizar la logística de los eventos, 
      sino también potenciar la interacción y el aprendizaje colaborativo. 
      Creemos que cada conferencia es una oportunidad de crecimiento y nuestra plataforma 
      está construida para que esa experiencia sea memorable, eficiente y conectada con el futuro.
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
import { ref, onMounted, onBeforeUnmount } from 'vue'

const menuOpen = ref(false)
const toggleMenu = () => { menuOpen.value = !menuOpen.value }
const closeMenu = () => { menuOpen.value = false }

// Cerrar el menú si se cambia a desktop
const handleResize = () => {
  if (window.innerWidth > 900 && menuOpen.value) menuOpen.value = false
}

onMounted(() => {
  window.addEventListener('resize', handleResize)

  // Cerrar menú al pulsar enlaces internos
  document.querySelectorAll('.nav a[href^="#"]').forEach(a => {
    a.addEventListener('click', closeMenu, { passive: true })
  })

  // --- Scroll Spy ---
  const sections = document.querySelectorAll('section[id]')
  const navLinks = document.querySelectorAll('.nav a[href^="#"]')

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const id = entry.target.getAttribute('id')
        navLinks.forEach((a) => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
        })
      })
    },
    { threshold: 0.5 }
  )

  sections.forEach((s) => io.observe(s))

  // Cleanup de observadores y listeners
  onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
    document.querySelectorAll('.nav a[href^="#"]').forEach(a => {
      a.removeEventListener('click', closeMenu)
    })
    io.disconnect()
  })
})

const members = [
  { nombre: 'Fabrisio Condarco',   foto: '/team/fabrisio.jpg' },
  { nombre: 'Jose Manzaneda',      foto: '/team/jose.jpg' },
  { nombre: 'Miguel Quisbert',     foto: '/team/miguel.jpg' },
  { nombre: 'Oscar Menacho',       foto: '/team/oscar.jpg' },
  { nombre: 'Rodrigo Rivera',      foto: '/team/rodrigo.jpg' },
]

// Fallback de iniciales si no hay foto
const getInitials = (n) =>
  n.split(/\s+/).map(p => p[0]).filter(Boolean).slice(0,2).join('').toUpperCase()

</script>

<style scoped>
/* ===== Tokens ===== */
:root{
  --purple-900:#4c1d95;
  --purple-700:#6d28d9;
  --purple-500:#8b5cf6;

  --gray-900:#0f1012;
  --gray-800:#17181b;
  --gray-700:#1f2126;
  --gray-100:#e5e7eb;
}
/* ===== Base ===== */
*{ box-sizing:border-box; }
.landing{ background:#fff; color:var(--ink); }
img{ display:block; height:auto; max-width:100%; }
a{ color:inherit; text-decoration:none; }
.container{ width:min(1280px,92%); margin-inline:auto; }
.section{ padding:20px 0; }
.center{ text-align:center; }

/* ===== Header sticky ===== */
.header{
  position:sticky; top:0; z-index:20; background:#fff;
  box-shadow:0 2px 8px rgba(17,24,39,.06);
}
.header-inner{
  padding: 0 12px;
  height:var(--header-h);
  display:flex; align-items:center; justify-content:space-between; gap:20px;
}
.logo{
  height: clamp(140px, 12vw, 180px);
  max-width: none;
  width: auto;
}

/* Nav */
.nav{ display:flex; gap:26px; }
.nav a{ font-weight:600; color:#1f2937; position:relative; padding:4px 0; }
.nav a::after{
  content:''; position:absolute; left:0; bottom:-6px; width:0; height:2px;
  background:var(--purple-700); transition:width .2s;
}
.nav a:hover::after{ width:100%; }

/* Estado activo por scroll-spy */
.nav a.active{ color:var(--purple-700); }
.nav a.active::after{ width:100%; }

/* Toggle (solo móvil) */
.nav-toggle{
  display:none; font-size:26px; background:none; border:none; cursor:pointer;
}

/* ===== Hero ===== */
.hero{
  min-height: calc(100dvh - var(--header-h));
  position:relative; overflow:hidden; color:#fff;
  padding:28px 0 140px; /* reserva para la laptop absoluta */
  background:
    radial-gradient(1000px 420px at 75% 15%, rgba(255,255,255,.06), transparent 60%),
    linear-gradient(120deg, var(--purple-900), var(--purple-700) 55%, var(--purple-500));
}
.hero-grid{
  display:grid; gap:32px; align-items:center; min-height:460px;
  grid-template-columns:1.05fr .95fr;
}
.eyebrow{ opacity:.9; margin:0 0 6px; font-weight:600; }
.hero-text h1{
  font-size:clamp(36px,5.2vw,56px); line-height:1.08; margin:0 0 12px; font-weight:800;
}
.brand-mark{ display:block; font-weight:800; }
.lead{ font-size:18px; opacity:.95; margin:0 0 22px; max-width:60ch; }

/* CTA */
.cta{ display:flex; gap:12px; flex-wrap:wrap; }
.btn{
  display:inline-block; padding:14px 26px; border-radius:14px; font-weight:700;
  transition:transform .18s ease, filter .18s ease, box-shadow .18s ease;
}
.btn-primary{ background:#fff; color:var(--purple-900); }
.btn-primary:hover{ transform:translateY(-3px); filter:brightness(.96); }
.btn-secondary{ background:var(--purple-700); color:#fff; border:1px solid rgba(255,255,255,.15); }
.btn-secondary:hover{ transform:translateY(-3px); filter:brightness(1.03); }

/* Laptop destacada (fuera del grid) */
.laptop{
  position:absolute; right:2.5vw; bottom:140px;
  width:min(55vw,1500px); transform:rotate(-6deg);
  filter:drop-shadow(0 28px 48px rgba(0,0,0,.40)); pointer-events:none; z-index:1;
}

/* ===== Features ===== */
.about-card{
  background:#111827; color:#e5e7eb; padding:24px; border-radius:20px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.03), 0 10px 30px rgba(17,24,39,.25);
}
.h2{ font-size:clamp(24px,3vw,32px); margin:0 0 8px; }
.features{
  display:grid; gap:16px; margin-top:16px;
  grid-template-columns:repeat(2,minmax(0,1fr));
}
@media (min-width:900px){ .features{ grid-template-columns:repeat(4,minmax(0,1fr)); } }
.card{
  background:#1f2937; border:1px solid rgba(255,255,255,.05); border-radius:16px; padding:18px;
  box-shadow:0 8px 24px rgba(17,24,39,.25);
}
.card h3{ margin:8px 0 6px; font-size:18px; color:#fff; }
.card p{ margin:0; color:#cbd5e1; font-size:14px; }
.chip{
  width:44px; height:44px; display:grid; place-items:center; border-radius:12px;
  background:linear-gradient(135deg,var(--purple-700),var(--purple-500)); color:#fff; font-size:20px;
}

/* ===== Showcase ===== */
.show-grid{ display:grid; gap:16px; grid-template-columns:1fr; }
@media (min-width:900px){ .show-grid{ grid-template-columns:1fr 1fr; } }
.shot{ background:#0f172a; color:#e2e8f0; padding:18px; border-radius:16px; }

/* ===== Team ===== */
/* ===== Team (con fotos) ===== */
.team{
  display:grid; gap:18px; margin-top:16px;
  grid-template-columns:repeat(5,minmax(0,1fr));
}
@media (max-width:900px){ .team{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (max-width:640px){ .team{ grid-template-columns:1fr; } }

.member{
  text-align:center; padding:14px 10px; border-radius:16px;
  background:#ffffff; border:1px solid rgba(255,255,255,.06);
  box-shadow:0 8px 24px rgba(17,24,39,.25);
}
.avatar{
  width:96px; height:96px; margin:0 auto 10px; border-radius:50%;
  position:relative; overflow:hidden;
}
.avatar::before{
  content:''; position:absolute; inset:-2px; border-radius:50%;
  background:linear-gradient(135deg,var(--purple-700),var(--purple-500));
  z-index:0; filter:blur(0.5px);
}
.avatar img, .avatar .avatar-fallback{ position:relative; z-index:1; }
.avatar img{
  width:100%; height:100%; object-fit:cover; display:block;
  transition: transform .25s ease;
}
.member:hover .avatar img{ transform:scale(1.05); }

.avatar-fallback{
  width:100%; height:100%; display:grid; place-items:center;
  background:#e5e7eb; color:#374151; font-weight:800; font-size:24px;
  letter-spacing:.5px;
}
.name{ font-weight:700; color:#000000; }


/* ===== CTA final ===== */
.final-box{
  background:#180a38; color:#fff; border-radius:20px; padding:28px;
  display:grid; gap:10px; place-items:center; text-align:center;
}

/* ===== Footer ===== */
.footer{ background:#0b0b0d; color:#d1d5db; padding:70px 0; margin-top:10px; }
.footer-grid{ display:flex; gap:22px; justify-content:space-between; align-items:start; flex-wrap:wrap; }
.ft-title{ font-weight:700; color:#f3f4f6; margin-bottom:6px; }
.link:hover{ text-decoration:underline; }

/* ===== Responsive ===== */
@media (max-width:900px){
  .nav{ display:none; flex-direction:column; background:#fff; box-shadow:0 10px 20px rgba(0,0,0,.1);
        padding:12px; border-radius:8px; position:absolute; top:var(--header-h); right:10px; }
  .nav.is-open{ display:flex; }
  .nav-toggle{ display:block; }

  .hero{ padding:24px 0 44px; }
  .hero-grid{ grid-template-columns:1fr; min-height:420px; }
  .laptop{ position:static; transform:none; width:min(88vw,820px); margin:20px auto 0; }
  .team{ grid-template-columns:repeat(2,minmax(0,1fr)); }
}

@media (max-width:640px){
  .team{ grid-template-columns:1fr; }
  .logo{ height:110px; }
}

/* Reduce motion friendly */
@media (prefers-reduced-motion:reduce){
  .btn, .nav a::after{ transition:none; }
}
.chip svg {
  width: 22px;
  height: 22px;
}

</style>

<!-- Estilos globales necesarios para anclas y layout -->
<style>
html { scroll-behavior: smooth; }
html, body { height: 100%; margin: 0; overflow-x: hidden; }
/* Compensa el header sticky en los saltos de ancla */
#inicio, #features, #about {
  scroll-margin-top: calc(var(--header-h, 140px) + 16px);
}
</style>
