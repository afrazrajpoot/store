// app/models/productModal.js
import { getRenderPropValue } from 'antd/es/_util/getRenderPropValue';
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0
  },
  image: {
    type: String,
    required: [true, 'Main image is required']
  },
  hoverImages: [{
    type: String
  }],
  label: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  colors: [{
    type: String,
    trim: true
  }],
  sizes: [{
    type: String,
    trim: true
  }],
  material: {
    type: String,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  care: {
    type: String,
    trim: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: {
    type: Number,
    default: 0
  },
  stock: [{
    size: {
      type: String,
      required: true,
      trim: true
    },
 
    quantity: {
      type: Number,
      required: true,
      min: 0
    },   
    color:{
      type:[{
        type:String
      }],
      required: true,
      trim: true
    }
  }],
  specifications: {
    fit: String,
    gender: String,
 
  },
  discountPrice: {
    type: Number,
    min: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for frequently queried fields
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;