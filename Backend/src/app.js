const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const passport = require("passport");
const session = require("express-session");
const { isAuthenticated, checkRole } = require("./services/authService");

const routes = require("./routes");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  //credentials: true,
};

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.json());

app.use(
  session({
    secret: "our-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

const usuarioAPI = require("./API/usuarioAPI");

const authAPI = require("./API/authAPI");

app.use("/usuario", usuarioAPI);

app.use("/auth", authAPI);

app.use(routes);

module.exports = app;
