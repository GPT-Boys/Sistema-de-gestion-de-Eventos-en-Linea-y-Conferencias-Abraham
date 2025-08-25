<template>
  <aside class="barra-lateral">
    <div class="seccion-superior">
      <h1 class="titulo-app">AbrahamEventSphere</h1>

      <nav class="navegacion-principal">
        <router-link to="/charlas" class="nav-boton">Charlas</router-link>
        <router-link to="/usuarios" class="nav-boton">Usuarios</router-link>
        <router-link to="/materiales" class="nav-boton">Materiales</router-link>
        <router-link to="/notificaciones" class="nav-boton">Notificaciones</router-link>
        <router-link to="/configuracion" class="nav-boton">Configuracion</router-link>
      </nav>

    </div>
    <div class="seccion-inferior">
      <span class="version">Version 1.0.0</span>
    </div>
  </aside>
</template>

<style scoped>
.barra-lateral {
  width: 250px;
  height: 100vh;
  background-color: var(--purple-900);
  color: var(--paper);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  box-sizing: border-box;
}
.titulo-app {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-align: center;
}
.navegacion-principal {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.nav-boton {
  padding: 0.75rem;
  border-radius: 5px;
  text-decoration: none;
  color: var(--paper);
  background-color: var(--purple-700);
  text-align: center;
  transition: background-color 0.2s ease;
}
.nav-boton:hover {
  background-color: var(--purple-500);
}
.router-link-exact-active {
  background-color: var(--purple-500);
  font-weight: bold;
}
.version {
  font-size: 0.8rem;
  color: var(--muted);
  text-align: center;
}
</style>