require("dotenv").config();
const { app, server, io } = require("./app");
const { swaggerDocs: V1SwaggerDocs } = require("./swagger");

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  V1SwaggerDocs(app, PORT);
});

module.exports = { io };
