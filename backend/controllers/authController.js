import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/emailService.js";
import generateOTP from '../utils/generateOTP.js';

let tempOTPStore = {}
//Register User
// Send OTP and temporarily store user info
export const registerUser = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, address, password, confirmPassword } = req.body;

    if (!fullName || !email || !phoneNumber || !address || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Generate OTP and hash password
    const otp = generateOTP();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store user data temporarily with OTP
    tempOTPStore[email] = {
      fullName,
      email,
      phoneNumber,
      address,
      password: hashedPassword,
      otp,
      createdAt: Date.now(),
    };

    // Send OTP email
    await sendEmail(
      email,
      "Your OTP for Seeras Makeover",
      `Your OTP is ${otp}`,
      `<h2>Welcome to Seeras Makeover</h2><p>Your OTP is: <strong>${otp}</strong></p>`
    );

    res.status(200).json({ message: "OTP sent to your email. Please verify." });
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
export const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { fullName, address, phoneNumber } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, address, phoneNumber },
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




export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const tempUser = tempOTPStore[email];
  if (!tempUser) {
    return res.status(400).json({ message: "No registration found for this email." });
  }

  // Expire OTP after 5 mins
  const OTP_EXPIRY_MINUTES = 5;
  const isExpired = Date.now() - tempUser.createdAt > OTP_EXPIRY_MINUTES * 60 * 1000;
  if (isExpired) {
    delete tempOTPStore[email];
    return res.status(400).json({ message: "OTP has expired. Please register again." });
  }

  if (tempUser.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP." });
  }

  try {
    const user = new User({
      fullName: tempUser.fullName,
      email: tempUser.email,
      phoneNumber: tempUser.phoneNumber,
      address: tempUser.address,
      password: tempUser.password,
    });

    await user.save();

    // Cleanup temp store
    delete tempOTPStore[email];

    // Send welcome + admin email
    await sendEmail(
      email,
      "Welcome to Seeras Makeover!",
      `Hello ${tempUser.fullName}, welcome to Seeras Makeover!`,
      `<h1>Hello ${tempUser.fullName}</h1><p>Welcome to Seeras Makeover!</p>`
    );

    await sendEmail(
      process.env.EMAIL_USER,
      "New User Registration",
      "A new user has registered",
      `
        <h2>New User Registration</h2>
        <ul>
          <li>Name: ${tempUser.fullName}</li>
          <li>Email: ${tempUser.email}</li>
        </ul>
      `
    );

    res.status(201).json({ message: "Registration complete. You can now login." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

export const getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'Not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



