import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../Context/ToastContext';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({ email: '' });
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [otp, setOtp] = useState('');
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [otpMode, setOtpMode] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [otpVerified, setOtpVerified] = useState(false);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/reset-password/verify-email", formData);
            setRegisteredEmail(formData.email);

            showToast("OTP sent to your email");
            setOtpMode(true);

        } catch (error) {
            showToast(error.response?.data?.message || "Error while resetting password. Please try again.", "error");
        }
    };

    const handleOtpVerify = async (event) => {
        event.preventDefault();
        if (!otp.trim()) return showToast("Please enter OTP");

        try {
            await axios.post("http://localhost:5000/api/reset-password/verify-otp-reset", {
                email: registeredEmail,
                otp: otp
            });

            showToast("OTP verified successfully! You can now reset your password.");
            setOtpVerified(true);
        } catch (error) {
            showToast(error.response?.data?.message || "OTP verification failed");
        }
    };

    const handlePasswordReset = async (event) => {
        event.preventDefault();
        if (!newPassword.trim()) return showToast("Please enter a new password");

        try {
            await axios.post("http://localhost:5000/api/reset-password/reset-password", {
                email: registeredEmail,
                newPassword
            });

            showToast("Password reset successfully! Please login.");
            navigate("/login");
        }
        catch (error) {
            showToast(error.response?.data?.message || "Password reset failed");
        }

    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
                {!otpMode ? (
                    <>
                        <h1 className="text-4xl font-bold mb-6">Enter Your Email</h1>
                        <form className='text-xl space-y-5' onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-4 border border-gray-300 rounded"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-pink-500 text-white py-4 rounded-full hover:bg-pink-600"
                            >
                                Continue
                            </button>
                        </form>
                    </>
                ) : !otpVerified ? (
                    <>
                        <h1 className="text-3xl font-bold mb-4">Enter OTP</h1>
                        <form onSubmit={handleOtpVerify} className="space-y-5">
                            <input
                                type="text"
                                placeholder="Enter OTP sent to your email"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full p-4 border rounded"
                            />
                            <button type="submit" className="w-full bg-green-500 text-white py-4 rounded-full hover:bg-green-600">Verify OTP</button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold mb-4">Reset Password</h1>
                        <form onSubmit={handlePasswordReset} className="space-y-5">
                            <input
                                type="password"
                                placeholder="Enter New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-4 border rounded"
                            />
                            <button type="submit" className="w-full bg-blue-500 text-white py-4 rounded-full hover:bg-blue-600">Reset Password</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
