// src/API/authAPI.js
const express = require("express");
const { passport, isAuthenticated } = require("../services/authService");
const ResponseDTO = require("../DTO/ResponseDTO");

const router = express.Router();

/**
 * LOGIN
 */
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, response) => {
    if (err) return next(err);

    // si falla usuario/contraseña
    if (!user) {
      return res
        .status(response?.status || 401)   // 👈 corregido
        .json(response);
    }

    // persistencia de sesión
    req.logIn(user, (loginError) => {
      if (loginError) {
        return res
          .status(500)
          .json(new ResponseDTO("AUTH-102", 500, null, "Login error."));
      }

      // remember me (7 días o solo sesión)
      const remember = !!req.body?.remember;
      if (remember) {
        req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 7;
      } else {
        req.session.cookie.expires = false;
      }

      // `response` ya contiene el DTO armado desde la estrategia
      return res
        .status(response?.status || 200)   // 👈 corregido
        .json(response);
    });
  })(req, res, next);
});

/**
 * LOGOUT
 */
router.get("/logout", isAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // nombre default de la cookie de sesión
      return res.json(
        new ResponseDTO("AUTH-002", 200, null, "Logout exitoso.")
      );
    });
  });
});

/**
 * STATUS
 */
router.get("/status", isAuthenticated, (req, res) => {
  // 👇 gracias al deserializeUser en authService,
  // req.user ya es un LogInDTO con rol incluido
  return res
    .status(200)
    .json(new ResponseDTO("AUTH-000", 200, req.user, "User Authenticated."));
});

/**
 * REGISTER (ejemplo simple, puedes personalizar)
 */
router.post("/register", async (req, res) => {
  try {
    // implementar tu lógica de creación de usuario aquí
    return res
      .status(201)
      .json(new ResponseDTO("AUTH-200", 201, null, "Usuario registrado correctamente."));
  } catch (err) {
    return res
      .status(500)
      .json(new ResponseDTO("AUTH-201", 500, null, "Error al registrar usuario."));
  }
});

module.exports = router;
