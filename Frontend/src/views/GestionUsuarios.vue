<script setup>
import { ref, onMounted } from 'vue';
import { obtenerUsuarios } from '../API/usuarios.js';

const usuarios = ref([]);
const cargando = ref(true);

onMounted(async () => {
  cargando.value = true;
  usuarios.value = await obtenerUsuarios();
  cargando.value = false;
});
</script>

<template>
  <div class="gestion-usuarios-vista">
    <h1 class="titulo-vista">Gestion de Usuarios</h1>

    <div class="barra-herramientas">
      <button class="boton-accion anadir">Añadir Nuevo Usuario 👤</button>
      <input type="search" placeholder="Buscar..." class="campo-busqueda" />
      <button class="boton-accion filtros">Filtros lọc</button>
    </div>

    <div class="area-contenido">
      <div class="panel-lista-usuarios">
        <div v-if="cargando" class="mensaje-carga">Cargando usuarios...</div>
        <div v-else class="grid-usuarios">
          <div v-for="usuario in usuarios" :key="usuario.id" class="tarjeta-usuario">
            <div class="info-usuario">
              <h4>{{ usuario.nombre }}</h4>
              <p>{{ usuario.correo }}</p>
              <span :class="['estado', usuario.estado.toLowerCase()]">{{ usuario.estado }}</span>
            </div>
            <div class="acciones-tarjeta">
              <button class="boton-icono" title="Modificar">
                <i class="bi bi-pencil-fill"></i>
              </button>
              <button class="boton-icono" title="Eliminar">
                <i class="bi bi-trash-fill"></i>
              </button>
              <button class="boton-icono" title="Bloquear">
                <i class="bi bi-ban"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
  </div>
</template>

<style scoped>
.titulo-vista {
  font-size: 2.5rem;
  color: var(--ink);
  margin-bottom: 1.5rem;
}
.barra-herramientas { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; gap: 1rem; }
.boton-accion { padding: 0.5rem 1rem; border: 1px solid #ccc; background-color: var(--paper); border-radius: 5px; cursor: pointer; color: var(--ink); }
.campo-busqueda { flex-grow: 1; padding: 0.5rem; border: 1px solid #ccc; border-radius: 5px; }
.area-contenido { display: flex; gap: 2rem; }
.panel-lista-usuarios { flex-grow: 1; min-height: 500px; }
.mensaje-carga { text-align: center; padding: 2rem; color: var(--muted); }
.grid-usuarios { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem; }
.tarjeta-usuario {
  background-color: var(--paper);
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.tarjeta-usuario:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}
.info-usuario p {
  color: var(--muted);
  font-size: 0.9rem;
}
.tarjeta-usuario .estado { padding: 0.2rem 0.5rem; border-radius: 10px; font-size: 0.8rem; color: var(--paper); }
.tarjeta-usuario .estado.activo { background-color: #28a745; }
.tarjeta-usuario .estado.bloqueado { background-color: #dc3545; }
.acciones-tarjeta {
  margin-top: auto;
  align-self: flex-end;
  display: flex;
  gap: 0.5rem;
  padding-top: 1rem;
}
.boton-icono {
  border: none;
  background: none;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1rem;
  color: var(--muted);
  transition: color 0.2s ease;
}
.boton-icono:hover {
  color: var(--purple-700);
}
</style>