import mongoose from 'mongoose';

const AssignmentSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Worker',
      required: true,
    },
    assignedDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null },
    role: { type: String, required: true }, // Role on this specific project
    status: {
      type: String,
      enum: ['Active', 'Completed', 'Cancelled'],
      default: 'Active',
    },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Assignment || mongoose.model('Assignment', AssignmentSchema);
