import express from "express";
import User from "../models/User.js";
import bycrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    console.log("Saving user:", user);

    await user.save();

    //Return success response
    res.status(201).json({ message: "User registered successfully." });

  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

//Login User
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;

    //Check if email and password are provided
    if(!email || !password){
      return res.status(400).json({ message: "Email and Password are required" });
    };

    //Find user in database
    const user = await User.findOne({ email });

    if (!user){
      return res.status(400).json({ message: "User not found. Please register." });
    }

    //Check if the password is incorrect
    const isMatch = await bycrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(400).json({ message: "Invalid credentials."});
    }

    //Generate JWT token for authentication
    console.log("Password matched. Generating JWT...");
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET,  {expiresIn: "1h" });

    console.log("Token generated:", token);

    res.status(200).json({
      message: "Login Successfull",
      token,
      user: { fullName: user.fullName, email: user.email },
    });
  } catch (error) {
      console.log("Login Error");
      res.status(500).json({ message: "Server Error. Please try again." });
  }
});

export default router;