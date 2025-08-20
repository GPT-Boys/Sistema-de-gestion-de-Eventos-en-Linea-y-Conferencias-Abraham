<script>
import { RouterLink } from 'vue-router'
export default {
  name: 'NavBar',
  components: {
    RouterLink,
  },
}
</script>

<template>
  <nav class="navbar sticky-top navbar-expand-lg bg-info" data-bs-theme="light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/"> AbrahamEventSphere </a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarColor03"
        aria-controls="navbarColor03"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarColor03">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink class="btNavBar nav-link active" to="/"
              >Home
              <span class="visually-hidden">(current)</span>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="btNavBar nav-link" to="/Conferences">Conferencias</RouterLink>
          </li>
        </ul>
        <button type="button" class="btn btn-success nav-item">
          <RouterLink class="nav-link" to="/Login">Login</RouterLink>
        </button>
        <button type="button" class="btn btn-danger nav-item">
          <RouterLink class="nav-link" to="/Register">Register</RouterLink>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.btNavBar {
  border-radius: 10%;
}

.btNavBar:hover {
  background-color: aqua;
}
</style>
