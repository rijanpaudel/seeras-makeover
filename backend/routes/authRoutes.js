import express from "express";
import User from "../models/User.js";
import bycrpt from "bcryptjs";

const router = express.Router();

//Register User
router.post("/register", async (req, res) => {
  try {
    const { fullName, email, phoneNumber, address, password, confirmPassword } = req.body;

    //Check if any field is empty
    if(!fullName || !email || !phoneNumber || !address || !password || !confirmPassword){
      return res.status(400).json({ message: "All fields are required." });
    }

    //Check is user already exists
    const userExists = await User.findOne({ email })
    if(userExists){
      return res.status(400).json({ message: "The User already exists." });
    }

    //Check if passwords match
    if(confirmPassword != password){
      return res.status(400).json({ message: "Passwords do no match." })
    }

    //Hash the password
    const salt = await bycrpt.genSalt(10);
    const hashedPassword = await bycrpt.hash(password, salt);

    //Create and save the user
    const user = new User({
      fullName,
      email,
      phoneNumber,
      address,
      password: hashedPassword,//Save hashed password
    });

    //Return success response
    res.status(201).json({ message: "User registered successfully." });

  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

export default router;