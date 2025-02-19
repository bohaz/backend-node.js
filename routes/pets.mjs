import express from "express";
import Pet from "../models/Pet.mjs";

const router = express.Router();

// Obtener todas las mascotas
router.get("/", async (req, res) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear una nueva mascota
router.post("/", async (req, res) => {
  const { name, species } = req.body;
  try {
    const newPet = new Pet({ name, species });
    await newPet.save();
    res.status(201).json(newPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar una mascota
router.put("/:id", async (req, res) => {
  const { name, species } = req.body;

  try {
    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      { name, species },
      { new: true, runValidators: true } // Devuelve el documento actualizado y valida los cambios
    );

    if (!updatedPet) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    res.json(updatedPet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar una mascota
router.delete("/:id", async (req, res) => {
  try {
    await Pet.findByIdAndDelete(req.params.id);
    res.json({ message: "Mascota eliminada" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
