import mongoose from 'mongoose';

const SupplyHistorySchema = new mongoose.Schema({
  material: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, default: '' },
  cost: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String, default: '' },
});

const SupplierSchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    materials: [{ type: String }], // List of materials they supply
    supplyHistory: [SupplyHistorySchema],
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    website: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema);
