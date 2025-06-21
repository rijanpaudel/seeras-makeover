import express from 'express';
import { verifyEmail, verifyOTPReset, resetPassword } from '../controllers/resetPasswordController.js';


const router = express.Router();

// Reset Password Route
router.post('/verify-email', verifyEmail);

router.post('/verify-otp-reset', verifyOTPReset);

router.post('/reset-password', resetPassword);

export default router;

