// src/app.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

const usuarioAPI = require("./API/usuarioAPI");
const authAPI = require("./API/authAPI");
const routes = require("./routes");

const app = express();

// CORS
const FRONT_ORIGIN = process.env.FRONT_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: FRONT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Session / Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "our-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// APIs bajo /api
app.use("/api/usuario", usuarioAPI);
app.use("/api/auth", authAPI);

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// ⬇️ rutas “comunes” y fallback 404
app.use(routes);

module.exports = app;
