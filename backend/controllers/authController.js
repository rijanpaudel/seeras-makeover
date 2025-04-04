import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/emailService.js";


//Register User
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, address, password, confirmPassword } = req.body;

    //Check if any field is empty
    if (!fullName || !email || !phoneNumber || !address || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    //Check is user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ message: "The User already exists." });
    }

    //Check if passwords match
    if (confirmPassword !== password) {
      return res.status(400).json({ message: "Passwords do no match." })
    }

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

    // Send Welcome Email
    sendEmail(
      email,
      "Welcome to Seeras Makeover!",
      `Hello ${fullName}, welcome to our Seeras Makeover!`,
      `<h1>Hello ${fullName}</h1><p>welcome to our Seeras Makeover!</p>`
    );

    // Send admin notification
    const adminEmailHTML = `
      <h2>New User Registration</h2>
      <p>A new user has registered:</p>
      <ul>
        <li><strong>Name:</strong> ${fullName}</li>
        <li><strong>Email:</strong> ${email}</li>
      </ul>
    `;
    
    await sendEmail(
      process.env.EMAIL_USER,
      "New User Registration",
      "A new user has registered",
      adminEmailHTML
    );

    //Return success response
    res.status(201).json({ message: "User registered successfully." });

  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

//Login User
export const loginUser = async (req, res)=> {
  try {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found.");
      return res.status(400).json({ message: "User not found. Please register." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Invalid password.");
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("Login successful. Token generated:", token);
    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        address: user.address,
        phoneNumber: user.phoneNumber,
        role: user.role
      },
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Server Error. Please try again." });
  }
};

//Get all users
export const getAllUsers = async (req, res)=> {
  try {
    const users = await User.find({ role: { $ne: "admin" } });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Update user profile
export const updateUserProfile = async (req, res)=> {
  const { userId } = req.params;
  const { fullName, email, address, phoneNumber } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, email, address, phoneNumber },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
};


