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

module.exports = router;
