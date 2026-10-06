import {config} from "dotenv";
config(); 
import mongoose from "mongoose";
import Product from "./model/product.js";

console.log(process.env.MONGODB_URI)

const day = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000); // n days ago

const products = [
  // fashion
  { name: 'Blue Ankara Gown', category: 'fashion', price: 18000, rating: 4.5, inStock: true, createdAt: day(1) },
  { name: 'Red Ankara Shirt', category: 'fashion', price: 12000, rating: 4.2, inStock: true, createdAt: day(3) },
  { name: 'Leather Shoe', category: 'fashion', price: 25000, rating: 4.7, inStock: true, createdAt: day(5) },
  { name: 'Canvas SHOE', category: 'fashion', price: 15000, rating: 3.9, inStock: false, createdAt: day(8) },
  { name: 'Agbada Set', category: 'fashion', price: 45000, rating: 4.8, inStock: true, createdAt: day(10) },
  { name: 'Adire Fabric 6 Yards', category: 'fashion', price: 12000, rating: 4.0, inStock: true, createdAt: day(12) },
  { name: 'Aso Oke Cap', category: 'fashion', price: 5000, rating: 4.1, inStock: true, createdAt: day(15) },

  // raw produce
  { name: 'Fresh Tomatoes (Basket)', category: 'produce', price: 8000, rating: 4.3, inStock: true, createdAt: day(2) },
  { name: 'Ugu Leaves Bunch', category: 'produce', price: 1500, rating: 4.0, inStock: true, createdAt: day(4) },
  { name: 'Yam Tubers (5 pieces)', category: 'produce', price: 9000, rating: 4.4, inStock: true, createdAt: day(6) },
  { name: 'Ripe Plantain Bunch', category: 'produce', price: 3000, rating: 3.8, inStock: false, createdAt: day(9) },
  { name: 'Fresh Pepper (Rodo)', category: 'produce', price: 3000, rating: 4.6, inStock: true, createdAt: day(11) },

  // cooked food
  { name: 'Jollof Rice and Chicken', category: 'food', price: 3500, rating: 4.9, inStock: true, createdAt: day(1) },
  { name: 'Pounded Yam and Egusi', category: 'food', price: 4500, rating: 4.7, inStock: true, createdAt: day(2) },
  { name: 'Suya (Large)', category: 'food', price: 3000, rating: 4.8, inStock: true, createdAt: day(7) },
  { name: 'Fried Rice Combo', category: 'food', price: 3500, rating: 4.1, inStock: false, createdAt: day(13) },
  { name: 'Moi Moi (Pack of 3)', category: 'food', price: 1500, rating: 4.2, inStock: true, createdAt: day(14) },
];

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products`);
  await mongoose.disconnect();
})();