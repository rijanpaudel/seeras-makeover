import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js"
import courseRoutes from "./routes/courseRoutes.js"
import User from "./models/User.js";
import bcrypt from "bcryptjs"
import path from "path";

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
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Middleware to parse JSON data from requests
app.use(express.json());

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

app.use("/api/products", productRoutes);

app.use("/api/courses", courseRoutes);

//Function to see the admin user
const seedAdminUser = async() => {
  try {
    const adminExists = await User.findOne({ email: "seerasmakeover90@gmail.com" });

    if(!adminExists) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Seerasmakeover18@", salt);

    const adminUser = new User({
      email: "seerasmakeover90@gmail.com",
      password: hashedPassword,
      role: "admin"
    });

    await adminUser.save();
    console.log("Admin User Created Sucessfully");
  }
  else{
    console.log("Admin User Already Exists");
  }

  } catch (error) {
    console.error("Error seeding admin", error);
  }
};

// Connect to MongoDB locally
mongoose.connect(process.env.MONGO_URI, {
})
  .then(async() => {
    console.log("MongoDB connected successfully!");
  await seedAdminUser();
})

  .catch((error) => {
    console.error("MongoDB Connection Failed:", error);
    process.exit(1); // Exit the process if DB connection fails
  });


// Use authentication routes
app.use("/api/auth", authRoutes);

// Set the server to listen on PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
