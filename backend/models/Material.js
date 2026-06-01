import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    unit: { type: String, required: true }, // e.g. kg, ton, piece, m3
    stockQuantity: { type: Number, required: true, min: 0 },
    usedQuantity: { type: Number, default: 0, min: 0 },
    unitPrice: { type: Number, required: true, min: 0 },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      default: null,
    },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock',
    },
    description: { type: String, default: '' },
    reorderLevel: { type: Number, default: 10 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: available quantity
MaterialSchema.virtual('availableQuantity').get(function () {
  return Math.max(0, this.stockQuantity - this.usedQuantity);
});

// Auto-update status based on stock
MaterialSchema.pre('save', function (next) {
  const available = this.stockQuantity - this.usedQuantity;
  if (available <= 0) this.status = 'Out of Stock';
  else if (available <= this.reorderLevel) this.status = 'Low Stock';
  else this.status = 'In Stock';
  next();
});

export default mongoose.models.Material || mongoose.model('Material', MaterialSchema);
