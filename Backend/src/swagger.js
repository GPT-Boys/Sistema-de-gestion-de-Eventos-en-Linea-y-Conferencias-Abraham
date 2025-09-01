const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

// Metadata info about our API
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "AbrahamEventSphere API",
      version: "1.0.0",
      description: "API Documentation for AbrahamEventSphere Application.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "src/API/usuarioAPI.js",
    "src/API/authAPI.js",
    "src/API/asistenteAPI.js",
    "src/API/asistenteConferenciaAPI.js",
    "src/API/asistenteConferenciaVotacionAPI.js",
    "src/API/ciudadAPI.js",
    "src/API/conferenciaAPI.js",
    "src/API/conferenciaNotificacionAPI.js",
    "src/API/marcaConferenciaAPI.js",
    "src/API/notificacionAsistenteAPI.js",
    "src/API/oradorAPI.js",
    "src/API/tipoConferenciaAPI.js",
    "src/API/tipoUsuarioAPI.js",
    "src/API/votacionAPI.js",
    "src/routes/asistenteRoutes.js",
    "src/routes/oradorRoutes.js",
    "src/routes/adminRoutes.js",
    "src/services/conferenciaService.js",
    "src/DTO/ResponseDTO.js",
    "src/DTO/ConferenciaDTO.js",
    "src/DTO/AsistenteDTO.js",
    "src/DTO/AsistenteConferenciaDTO.js",
    "src/DTO/AsistenteConferenciaVotacionDTO.js",
    "src/DTO/CiudadDTO.js",
    "src/DTO/ConferenciaNotificacionDTO.js",
    "src/DTO/MarcaConferenciaDTO.js",
    "src/DTO/NotificacionAsistenteDTO.js",
    "src/DTO/OradorDTO.js",
    "src/DTO/TipoConferenciaDTO.js",
    "src/DTO/TipoUsuarioDTO.js",
    "src/DTO/UsuarioDTO.js",
    "src/DTO/VotacionDTO.js",
    // Add more API and service pairs as needed
  ],
};

// Docs in JSON format
const swaggerSpec = swaggerJSDoc(options);

// Function to setup our Docs
const swaggerDocs = (app, port) => {
  app.use(
    "/AbrahamEventSphere/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerSpec)
  );
  app.get("/AbrahamEventSphere/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  console.log(
    `📄 Version 1 Docs are Available at http://localhost:${port}/AbrahamEventSphere/api-docs`
  );
};

module.exports = { swaggerDocs };
