import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
  medicineName: { type: String, required: true },
  delayMinutes: { type: Number, required: true },
  createdAt: { type: Date, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Reminder = mongoose.model('Reminder', reminderSchema);
export default Reminder
