const passport = require("passport");
const bcrypt = require("bcrypt");
const ResponseDTO = require("../DTO/ResponseDTO");
const LogInDTO = require("../DTO/LogInDTO");
const TipoUsuarioDTO = require("../DTO/TipoUsuarioDTO");
const TipoUsuarioENT = require("../ENT/TipoUsuarioENT");
const UsuarioENT = require("../ENT/UsuarioENT");
const { Strategy: LocalStrategy } = require("passport-local");

passport.use(
  new LocalStrategy(
    {
      usernameField: "usuario",
      passwordField: "password", // <-- explícito
      passReqToCallback: true,
    },
    async (req, usuario, password, done) => {
      try {
        console.log(`Searching User by User ID: ${usuario}.`);
        const user = await UsuarioENT.findOne({
          where: { usuario: usuario },
          include: [{ model: TipoUsuarioENT, as: "tipo_usuario" }],
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

        req.session.user = {
          id_usuario: user.id_usuario,
          id_tipo_usuario: user.id_tipo_usuario,
        };

        const tipoUsuarioDTO = new TipoUsuarioDTO(
          user.tipo_usuario.id_tipo_usuario,
          user.tipo_usuario.tipo_usuario
        );
        const logInDTO = new LogInDTO(
          user.id_usuario,
          user.usuario,
          tipoUsuarioDTO
        );
        return done(
          null,
          user,
          new ResponseDTO("AUTH-000", 200, logInDTO, "Successful Login.")
        );
      } catch (error) {
        console.error(`LocalStrategy Error: ${error}.`);
        return done(
          error,
          false,
          new ResponseDTO("AUTH-103", 500, null, "Authentication Error.")
        );
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id_usuario));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UsuarioENT.findByPk(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  res
    .status(401)
    .json(new ResponseDTO("AUTH-001", 401, null, "User Not Authenticated."));
}

function checkRole(requiredRole) {
  return function (req, res, next) {
    const userRole = req.user.id_tipo_usuario;
    if (String(userRole) === String(requiredRole)) return next();
    res
      .status(403)
      .json(new ResponseDTO("AUTH-002", 403, null, "Access Denied."));
  };
}

module.exports = { passport, isAuthenticated, checkRole };
