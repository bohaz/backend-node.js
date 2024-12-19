const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Registro de usuario
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login de usuario
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, "secretkey", { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Ruta protegida
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Ruta protegida accedida correctamente" });
});

// Middleware para verificar el token
function verifyToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "Acceso denegado" });

  try {
    const verified = jwt.verify(token, "secretkey");
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Token inválido" });
  }
}

module.exports = router;
