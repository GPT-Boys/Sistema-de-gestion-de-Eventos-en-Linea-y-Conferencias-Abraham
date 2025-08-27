const express = require("express");
const { passport, isAuthenticated } = require("../services/authService");
const ResponseDTO = require("../DTO/ResponseDTO");
const LogInDTO = require("../DTO/LogInDTO");
const router = express.Router();

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, response) => {
    if (err || !user) {
      const status = err ? 500 : 401;
      return res.status(status).json(response);
    }

    req.logIn(user, (loginError) => {
      if (loginError) {
        return res.status(500).json(response);
      }

      const logInDTO = response.data;
      res
        .status(200)
        .json(new ResponseDTO("AUTH-000", 200, logInDTO, "Successful Login."));
    });
  })(req, res, next);
});

router.get("/logout", isAuthenticated, (req, res) => {
  req.logOut(function (err) {
    if (err) {
      return res
        .status(500)
        .json(new ResponseDTO("AUTH-104", 500, null, "Error Logging Out."));
    }
    res
      .status(200)
      .json(new ResponseDTO("AUTH-003", 200, null, "Successful Logout."));
  });
});

router.get("/status", isAuthenticated, (req, res) => {
  if (req.isAuthenticated()) {
    const userDTO = new LogInDTO(req.user.id_usuario, req.user.usuario);
    res
      .status(200)
      .json(new ResponseDTO("AUTH-000", 200, userDTO, "User Authenticated."));
  } else {
    res
      .status(401)
      .json(new ResponseDTO("AUTH-001", 401, null, "User Not Authenticated."));
  }
});
router.post('/register', async (req, res) => {
  try {
    const {
      USUARIO,
      CONTRASENIA,
      ID_TIPO_USUARIO,
      NOMBRES,
      APELLIDOS,
      FECHA_NACIMIENTO,
      ID_CIUDAD,
      TELEFONO,
      CORREO_ELECTRONICO
    } = req.body

    // Validaciones mínimas
    if (!USUARIO || !CONTRASENIA || !ID_TIPO_USUARIO || !NOMBRES || !APELLIDOS ||
        !FECHA_NACIMIENTO || !ID_CIUDAD || !TELEFONO || !CORREO_ELECTRONICO) {
      return res.status(400).json(new ResponseDTO('AUTH-400', 400, null, 'Datos incompletos.'))
    }

    // (Opcional) duplicados
    if (UsuarioService.existsByUserOrEmail) {
      const exists = await UsuarioService.existsByUserOrEmail(USUARIO, CORREO_ELECTRONICO)
      if (exists) return res.status(409).json(new ResponseDTO('AUTH-409', 409, null, 'Usuario o correo ya registrados.'))
    }

    // Hash de contraseña
    const hash = await bcrypt.hash(CONTRASENIA, 10)

    // Crear usuario (ajusta nombres de campos según tu modelo)
    const nuevo = await (UsuarioService.createUser
      ? UsuarioService.createUser({
          usuario: USUARIO,
          contrasenia: hash,
          id_tipo_usuario: ID_TIPO_USUARIO,
          nombres: NOMBRES,
          apellidos: APELLIDOS,
          fecha_nacimiento: FECHA_NACIMIENTO,
          id_ciudad: ID_CIUDAD,
          telefono: TELEFONO,
          correo_electronico: CORREO_ELECTRONICO
        })
      : UsuarioService.create({
          usuario: USUARIO,
          contrasenia: hash,
          id_tipo_usuario: ID_TIPO_USUARIO,
          nombres: NOMBRES,
          apellidos: APELLIDOS,
          fecha_nacimiento: FECHA_NACIMIENTO,
          id_ciudad: ID_CIUDAD,
          telefono: TELEFONO,
          correo_electronico: CORREO_ELECTRONICO
        }))

    return res
      .status(201)
      .json(new ResponseDTO('AUTH-200', 201,
        { id_usuario: nuevo.id_usuario, usuario: nuevo.usuario },
        'Usuario registrado.'
      ))
  } catch (e) {
    console.error(e)
    return res.status(500).json(new ResponseDTO('AUTH-500', 500, null, 'Error creando usuario.'))
  }
})

module.exports = router;
