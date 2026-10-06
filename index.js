import {config} from "dotenv";
config(); 
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoute.js";
import postRoutes from "./routes/postRoute.js";
import productRoutes from "./routes/product.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 9999;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.static("files"));
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("Error while connecting to MongoDB:", error))

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "files", "index.html"));
});

app.listen(PORT, () => {
  console.log("Server is running on port: ", PORT);
});