// client/pages/VerifyOtp.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { FaKey } from "react-icons/fa";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  // Handle OTP digit input
  const handleChange = (value, index) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle Backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Submit OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("resetEmail"); // email already saved in forgot-password
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setMessage("Please enter complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/verify-otp", { email, otp: enteredOtp });

      setMessage(res.data.message);

      if (res.data.resetToken) {
        // Save only token and email
        localStorage.setItem("resetToken", res.data.resetToken);
        localStorage.setItem("resetEmail", email);
      }

      setTimeout(() => {
        navigate("/reset-password");
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-2xl shadow-lg bg-white">
      <div className="flex flex-col items-center">
        <FaKey className="text-4xl text-blue-600 mb-4" />
        <h2 className="text-2xl font-semibold text-center mb-2">Verify OTP</h2>
        <p className="text-gray-600 text-center mb-6">
          Enter the 6-digit code sent to your email
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-6">
        {/* OTP Inputs */}
        <div className="flex justify-between gap-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="w-12 h-12 text-center text-xl border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-md text-white font-semibold transition-colors duration-200 ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center ${
            message.toLowerCase().includes("failed") ||
            message.toLowerCase().includes("invalid")
              ? "text-red-600"
              : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default VerifyOtp;
