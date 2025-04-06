import express from 'express';
import { registerUser, loginUser, getAllUsers, updateUserProfile, verifyOTP } from '../controllers/authController.js';

const router = express.Router();

// Register User
router.post('/register', registerUser);

router.post('/verify-otp', verifyOTP);

// Login User
router.post('/login', loginUser);

// Get all users (admin only)
router.get('/all-users', getAllUsers);

// Update user profile
router.put('/:userId', updateUserProfile);

export default router;
