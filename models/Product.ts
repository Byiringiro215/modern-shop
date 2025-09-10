import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  image?: string; // For compatibility with frontend
  stock: number;
  rating?: number; // For product ratings
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
    maxlength: [50, 'Category cannot be more than 50 characters']
  },
  images: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  }
}, {
  timestamps: true
});

// Index for better search performance
ProductSchema.index({ title: 'text', description: 'text', category: 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
