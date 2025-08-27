// src/API/usuarios.js

//lista_usuarios_ejemplo
const listaDeUsuarios = [
  { id: 1, nombre: 'Carlos Santana', correo: 'carlos.s@email.com', estado: 'Activo' },
  { id: 2, nombre: 'Ana Jimenez', correo: 'ana.j@email.com', estado: 'Activo' },
  { id: 3, nombre: 'Pedro Pascal', correo: 'pedro.p@email.com', estado: 'Bloqueado' },
  { id: 4, nombre: 'Lucia Mendez', correo: 'lucia.m@email.com', estado: 'Activo' },
];

export const obtenerUsuarios = async () => {
  console.log('Obteniendo usuarios simulados...');
  await new Promise(res => setTimeout(res, 500)); // demora de red
  return listaDeUsuarios;
};