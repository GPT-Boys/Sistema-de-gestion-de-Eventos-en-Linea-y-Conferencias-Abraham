// src/app.js
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const session = require("express-session");
const passport = require("passport");

const http = require("http");
const { Server } = require("socket.io");

const usuarioAPI = require("./API/usuarioAPI");
const authAPI = require("./API/authAPI");
const asistenteAPI = require("./API/asistenteAPI");
const asistenteConferenciaAPI = require("./API/asistenteConferenciaAPI");
const asistenteConferenciaVotacionAPI = require("./API/asistenteConferenciaVotacionAPI");
const ciudadAPI = require("./API/ciudadAPI");
const conferenciaAPI = require("./API/conferenciaAPI");
const conferenciaNotificacionAPI = require("./API/conferenciaNotificacionAPI");
const marcaConferenciaAPI = require("./API/marcaConferenciaAPI");
const notificacionAsistenteAPI = require("./API/notificacionAsistenteAPI");
const oradorAPI = require("./API/oradorAPI");
const tipoConferenciaAPI = require("./API/tipoConferenciaAPI");
const tipoUsuarioAPI = require("./API/tipoUsuarioAPI");
const votacionAPI = require("./API/votacionAPI");

const asistenteRoutes = require("./routes/asistenteRoutes");
const oradorRoutes = require("./routes/oradorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const routes = require("./routes");

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  },
});

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
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

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
app.use("/api/asistente", asistenteAPI);
app.use("/api/asistenteConferencia", asistenteConferenciaAPI);
app.use("/api/asistenteConferenciaVotacion", asistenteConferenciaVotacionAPI);
app.use("/api/ciudad", ciudadAPI);
app.use("/api/conferencia", conferenciaAPI);
app.use("/api/conferenciaNotificacion", conferenciaNotificacionAPI);
app.use("/api/marcaConferencia", marcaConferenciaAPI);
app.use("/api/notificacionAsistente", notificacionAsistenteAPI);
app.use("/api/orador", oradorAPI);
app.use("/api/tipoConferencia", tipoConferenciaAPI);
app.use("/api/tipoUsuario", tipoUsuarioAPI);
app.use("/api/votacion", votacionAPI);

// Rutas por Tipo de Usuario
app.use("/api/asistente", asistenteRoutes);
app.use("/api/orador", oradorRoutes);
app.use("/api/admin", adminRoutes);

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Ejemplo de ruta para probar
app.get("/api/test", (req, res) => res.json({ message: "Server running" }));

// Manejo de conexiones Socket.IO
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Unir a rooms basados en conferencias (para notificaciones dirigidas)
  socket.on("joinConferencia", (conferenciaId) => {
    socket.join(`conferencia_${conferenciaId}`);
    console.log(`User ${socket.id} joined room: conferencia_${conferenciaId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// ⬇️ rutas “comunes” y fallback 404
app.use(routes);

module.exports = { app, server, io };
