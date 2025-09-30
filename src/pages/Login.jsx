import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Payroll from "../images/Payroll.png";
import api from "../utils/api";
import { useUser } from "../context/UserContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [verifyChecked, setVerifyChecked] = useState(false);

  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Step 1 → Normal login request
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", {
        ...formData,
        checkboxClicked: verifyChecked, // backend ko bhejna hoga
      });

      if (res.data.requireOtp) {
        // agar checkbox click tha → OTP bheja gya
        setUserId(res.data.userId);
        setShowOtpInput(true);
      } else {
        // agar checkbox click nahi tha → normal login
        alert("Login successful!");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed!");
    }
  };

  // Step 2 → Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const res = await api.post("/auth/verify-login-otp", { userId, otp });
      alert("Login Success ✅");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        {/* Left */}
        <div className="hidden md:flex md:w-1/2 bg-green-50 items-center justify-center flex-col p-6 text-center">
          <img src={Payroll} alt="Payroll" className="max-h-80 object-contain mb-6" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">Smart Payroll</h2>
          <p className="text-gray-600 text-sm">
            Manage employees, track salaries, and automate payroll seamlessly.
          </p>
        </div>

        {/* Right */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-8 text-green-700 text-center">
            Login
          </h2>

          {!showOtpInput ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="flex items-center border border-green-400 rounded-md px-3">
                <FaEnvelope className="text-green-600 mr-2" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-3 focus:outline-none"
                />
              </div>

              {/* Password */}
              <div className="flex items-center border border-green-400 rounded-md px-3">
                <FaLock className="text-green-600 mr-2" />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-2 py-3 focus:outline-none"
                />
              </div>

              {/* Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="verifyMobile"
                  checked={verifyChecked}
                  onChange={() => setVerifyChecked(!verifyChecked)}
                  className="mr-2"
                />
                <label htmlFor="verifyMobile" className="text-sm text-gray-700">
                  Verify via Mobile (OTP will be sent)
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Login
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-center text-green-700">
                Enter OTP
              </h2>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full border border-green-400 rounded-md px-3 py-3 focus:outline-none"
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Verify OTP
              </button>
            </div>
          )}

          <p className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-green-700 font-semibold hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
