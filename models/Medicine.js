import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  genericName: { type: String },
  brandName: { type: String },
  dosage: { type: String },
  sideEffects: { type: String },
  allergies: { type: String },
  price: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Medicine= mongoose.model('Medicine', medicineSchema);
export default Medicine
