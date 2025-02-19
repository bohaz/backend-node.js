import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.mjs";

const router = express.Router();

// Registro de usuario
router.post("/register", async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    username = username.trim(); // Eliminar espacios en blanco

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "Usuario registrado exitosamente" });
  } catch (err) {
    console.error("Error en /register:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Login de usuario
router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    username = username.trim();

    // Verificar si el usuario existe
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Verificar si JWT_SECRET está definido
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET no está definido en las variables de entorno.");
      return res.status(500).json({ error: "Error interno en la autenticación" });
    }

    // Generar token JWT con "Bearer"
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token: `Bearer ${token}` });
  } catch (err) {
    console.error("Error en /login:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

// Ruta protegida
router.get("/protected", verifyToken, (req, res) => {
  res.json({ message: "Ruta protegida accedida correctamente" });
});

// Middleware para verificar el token
function verifyToken(req, res, next) {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado, token no proporcionado" });
  }

  // Remover "Bearer " si está presente en el token
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error("Error en la verificación del token:", err);
    res.status(403).json({ message: "Token inválido o expirado" });
  }
}

export default router;
