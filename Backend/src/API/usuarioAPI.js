const express = require("express");
const router = express.Router();
const usuarioService = require("../services/usuarioService");

router.post("/", async (req, res) => {
  console.log(`POST Request received for createUser with Data: ${req.body}`);
  const response = await usuarioService.createUser(req.body);
  res.json({
    method: "createUser",
    code: response.code,
    status: response.status,
    data: response.data,
    message: response.message,
  });
});

module.exports = router;
