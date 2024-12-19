const mongoose = require("mongoose");

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
});

module.exports = mongoose.model("Pet", PetSchema);
