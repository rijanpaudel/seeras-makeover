import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js"

//Load environment variables
dotenv.config();

//Initalize express
const app = express();

//Enable cors to allow frontend requests
app.use(cors());

//Middleware to parse JSON data from requests
app.use(express.json());

//Connect to MongoDB locally
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected (locally)"))
  .catch((error) => console.log("MongoDB Connection Failed: ", error));


//Use the auth routes
app.use("/api/auth", authRoutes)

=======
//Simple test route
app.get("/", (req, res) => {
  res.send("API is running..");
});

//Set the server to listen on PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));