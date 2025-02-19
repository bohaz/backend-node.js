import mongoose from "mongoose";

const PetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, required: true },
});

const Pet = mongoose.model("Pet", PetSchema);
export default Pet;
