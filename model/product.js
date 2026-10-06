// models/Product.js
import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: String,
    category: String,
    price: Number,
    rating: Number,
    inStock: Boolean,
  },
  { timestamps: true } // gives you createdAt and updatedAt
);

productSchema.index({name: 'text', category: 'text'})

const Product = mongoose.model('Product', productSchema)
export default Product;