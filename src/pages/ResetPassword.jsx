// client/pages/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const resetToken = localStorage.getItem("resetToken");
    const email = localStorage.getItem("resetEmail");
    if (!resetToken || !email) {
      navigate("/verify-otp"); // agar token/email missing hai
    }
  }, [navigate]);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    return setMessage("Passwords do not match");
  }

  const email = localStorage.getItem("resetEmail");
  const resetToken = localStorage.getItem("resetToken");

  try {
    const res = await api.post("/auth/reset-password", {
      email,
      newPassword,
      resetToken,
    });

    setMessage(res.data.message || "Password reset successful!");

    // clear local storage
    localStorage.removeItem("resetEmail");
    localStorage.removeItem("resetToken");

    setTimeout(() => {
      navigate("/login");
    }, 2000);
  } catch (err) {
    setMessage(err.response?.data?.message || "Reset failed");
  }
};


  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-2xl shadow-lg bg-white">
      <div className="flex flex-col items-center">
        <FaLock className="text-4xl text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-center mb-2">Reset Password</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter your new password below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* New Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-md focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-3 text-gray-500"
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-all duration-200 font-semibold"
        >
          Reset Password
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center font-medium ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ResetPassword;
