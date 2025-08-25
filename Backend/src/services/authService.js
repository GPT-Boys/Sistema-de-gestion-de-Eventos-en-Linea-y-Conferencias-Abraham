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
      passReqToCallback: true,
    },
    async (req, user, password, done) => {
      try {
        console.log(`Searching User by User ID: ${user}.`);
        const user_ = UsuarioENT.findOne({
          where: { usuario: user },
          include: [{ model: TipoUsuarioENT, as: "TIPO_USUARIO" }],
        });

        if (!user_) {
          console.log("User Not Found.");
          return done(
            null,
            false,
            new ResponseDTO("AUTH-100", 404, null, "User Not Found.")
          );
        }

        console.log(`Comparing passwords for the User: ${user}.`);
        const isPasswordValid = await bcrypt.compare(
          password,
          user_.contrasenia
        );

        if (!isPasswordValid) {
          console.log("Incorrect Password.");
          return done(
            null,
            false,
            new ResponseDTO("AUTH-101", 401, null, "Incorrect Password.")
          );
        }

        req.session.user = {
          id_usuario: user_.id_usuario,
          id_tipo_usuario: user_.id_tipo_usuario,
        };

        console.log(
          `User Information Saved, User Type: ${user_.id_tipo_usuario}.`
        );

        console.log(`User Authenticated Successfully: ${user}.`);

        const tipoUsuarioDTO = new TipoUsuarioDTO(
          user_.TIPO_USUARIO.id_tipo_usuario,
          user_.TIPO_USUARIO.tipo_usuario
        );
        const logInDTO = new LogInDTO(
          user_.id_usuario,
          user_.usuario,
          tipoUsuarioDTO
        );
        return done(
          null,
          user_,
          new ResponseDTO("AUTH-000", 200, logInDTO, "Successful Login.")
        );
      } catch (error) {
        console.error(`Error in the authentication process: ${error}.`);
        return done(
          error,
          false,
          new ResponseDTO(
            "AUTH-103",
            500,
            null,
            `Authentication error: ${error}.`
          )
        );
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log(`Serializing User: ${user.id_usuario}.`);
  done(null, user.id_usuario);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log(`Deserializing User by ID: ${id}.`);
    const user = await UsuarioENT.findByPk(id);
    done(null, user);
  } catch (error) {
    console.error(`Error while deserializing User: ${error}.`);
    done(error);
  }
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("User is Authenticated.");
    return next();
  }
  console.log("User Not Authenticated.");
  res
    .status(401)
    .json(new ResponseDTO("AUTH-001", 401, null, "User Not Authenticated."));
}

function checkRole(requiredRole) {
  return function (req, res, next) {
    console.log(`Verifying required Role: ${requiredRole}.`);
    const userRole = req.user.id_tipo_usuario;
    console.log(`User Role: ${userRole}.`);
    console.log(`Required Role: ${requiredRole}`);

    if (userRole.toString() == requiredRole.toString()) {
      console.log("The User has the Required Role.");
      return next();
    } else {
      console.log("The User does not have the Required Role.");
      return res
        .status(403)
        .json(
          new ResponseDTO(
            "AUTH-002",
            403,
            null,
            "Access denied: You do not have permission to perform this action."
          )
        );
    }
  };
}

module.exports = { passport, isAuthenticated, checkRole };
