import express from "express";
import dotenv from "dotenv";
import cors from "cors";

//Load environment variables
dotenv.config();

//Initalize express
const app = express();

//Enable cors to allow frontend requests
app.use(cors());

//Middleware to parse JSON data from requests
app.use(express.json());

//Simple test route
app.get("/", (req, res) => {
  res.send("API is running..");
});

//Set the server to listen on PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));