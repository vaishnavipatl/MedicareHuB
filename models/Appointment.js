import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  patientName: String,
  email: String,
  contact: String,
  preferredDate: Date,
  reason: String,
  symptoms: String,
  status: {
    type: String,
    default: "pending", // or "accepted"/"rejected"
  },
  previousAppointment: Boolean,
  createdAt: { type: Date, default: Date.now },
});


const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment
