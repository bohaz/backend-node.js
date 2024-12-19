require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");

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

// Importar rutas
const petsRoutes = require("./routes/pets");
const authRoutes = require("./routes/auth");

// Usar rutas
app.use("/api/pets", petsRoutes);
app.use("/api/auth", authRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// Escuchar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
