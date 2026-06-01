import mongoose from 'mongoose';

const WorkerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    role: { type: String, required: true }, // e.g. Mason, Electrician, Carpenter
    skills: [{ type: String }],
    dailyWage: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    assignedProject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      default: null,
    },
    address: { type: String, default: '' },
    joinDate: { type: Date, default: Date.now },
    emergencyContact: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Worker || mongoose.model('Worker', WorkerSchema);
