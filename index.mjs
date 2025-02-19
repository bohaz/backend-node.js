import "dotenv/config";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";

import petsRoutes from "./routes/pets.mjs";
import authRoutes from "./routes/auth.mjs";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error("Error al conectar MongoDB:", err));

// Usar rutas
app.use("/api/pets", petsRoutes);
app.use("/api/auth", authRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// Escuchar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
