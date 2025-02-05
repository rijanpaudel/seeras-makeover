import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

// Load environment variables
dotenv.config();

// Validate environment variables
if (!process.env.MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in .env file.");
  process.exit(1); // Exit process with failure
}

// Initialize express
const app = express();

// Enable CORS to allow frontend requests
app.use(cors());

// Middleware to parse JSON data from requests
app.use(express.json());

// Connect to MongoDB locally
mongoose.connect(process.env.MONGO_URI, {
})
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((error) => {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1); // Exit the process if DB connection fails
  });

// Use authentication routes
app.use("/api/auth", authRoutes);

// Set the server to listen on PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
