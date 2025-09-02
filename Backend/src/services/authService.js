// src/services/authService.js
const passport = require("passport");
const bcrypt = require("bcrypt");
const ResponseDTO = require("../DTO/ResponseDTO");
const LogInDTO = require("../DTO/LogInDTO");
const TipoUsuarioDTO = require("../DTO/TipoUsuarioDTO");
const TipoUsuarioENT = require("../ENT/TipoUsuarioENT");
const UsuarioENT = require("../ENT/UsuarioENT");
const { Strategy: LocalStrategy } = require("passport-local");

// Estrategia Local
passport.use(
  new LocalStrategy(
    {
      usernameField: "usuario",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, usuario, password, done) => {
      try {
        const user = await UsuarioENT.findOne({
          where: { usuario },
          include: [{ model: TipoUsuarioENT, as: "tipo_usuario" }], // 👈 alias correcto
        });

        if (!user) {
          return done(
            null,
            false,
            new ResponseDTO("AUTH-100", 404, null, "User Not Found.")
          );
        }

        const ok = await bcrypt.compare(password, user.contrasenia || "");
        if (!ok) {
          return done(
            null,
            false,
            new ResponseDTO("AUTH-101", 401, null, "Incorrect Password.")
          );
        }

        // Normalizamos la salida en un DTO
        const tipoUsuarioDTO = new TipoUsuarioDTO(
          user.tipo_usuario?.id_tipo_usuario,   // 👈 usar el alias real
          user.tipo_usuario?.tipo_usuario
        );

        const logInDTO = new LogInDTO(
          user.id_usuario,
          user.usuario,
          tipoUsuarioDTO
        );

        return done(
          null,
          user, // Passport guarda el objeto user (se reducirá en serializeUser)
          new ResponseDTO("AUTH-000", 200, logInDTO, "Successful Login.")
        );
      } catch (error) {
        console.error("LocalStrategy error:", error);
        return done(
          error,
          false,
          new ResponseDTO("AUTH-103", 500, null, "Authentication error.")
        );
      }
    }
  )
);

// Serialización: guardamos solo el id
passport.serializeUser((user, done) => {
  done(null, user.id_usuario);
});

// Deserialización: devolvemos DTO consistente
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UsuarioENT.findByPk(id, {
      include: [{ model: TipoUsuarioENT, as: "tipo_usuario" }], // 👈 alias correcto
    });

    if (!user) return done(null, false);

    const tipoUsuarioDTO = new TipoUsuarioDTO(
      user.tipo_usuario?.id_tipo_usuario,    // 👈 corregido
      user.tipo_usuario?.tipo_usuario
    );

    const logInDTO = new LogInDTO(user.id_usuario, user.usuario, tipoUsuarioDTO);

    done(null, logInDTO); // 👈 req.user siempre será este DTO
  } catch (error) {
    done(error);
  }
});

// Middleware: autenticación obligatoria
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res
    .status(401)
    .json(new ResponseDTO("AUTH-001", 401, null, "User Not Authenticated."));
}

// Middleware: verificación de rol
function checkRole(requiredRole) {
  return function (req, res, next) {
    const userRole = req.user?.tipoUsuario?.id_tipo_usuario; // 👈 accedemos al DTO
    if (String(userRole) === String(requiredRole)) return next();
    res
      .status(403)
      .json(new ResponseDTO("AUTH-002", 403, null, "Access denied"));
  };
}

module.exports = { passport, isAuthenticated, checkRole };
