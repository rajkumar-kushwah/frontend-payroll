import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';
import Payroll from '../images/Payroll.png';
import api from "../utils/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/register", formData);

    // Backend se success message
    setMessage(res.data.message || "Registered successfully. Please check your email for verification.");

    // Email verify page pe redirect (optional, UX better karne ke liye)
    const email = formData.email;
    setTimeout(() => {
      navigate(`/verify-email?email=${encodeURIComponent(email)}`);
    }, 2000); // 2 sec delay, message dekhne ke liye
  } catch (err) {
    console.error("Full Axios error:", err);
    setMessage(err.response?.data?.message || "Registration failed!");
  }
};


  return (
    <div className="min-h-screen bg-green-600 flex items-center justify-center px-2">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2">

        {/* Left Side */}
        <div className="hidden md:flex flex-col items-center justify-center p-8 bg-green-100 rounded-l-lg">
          <h2 className="text-3xl font-bold text-green-700 mb-4"> Payroll Management</h2>
          <p className="text-gray-700 text-lg text-center">
            Manage your employees’ salaries, attendance, and tax deductions seamlessly.
          </p>
          <div className="hidden md:flex md:w-2/3 bg-green-50 items-center justify-center p-6">
            <img src={Payroll} alt="Payroll" className="max-h-96 object-contain" />
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-green-700 text-center">
            Register Account
          </h2>

          {message && (
            <p className="text-center mb-4 text-green-700 font-semibold">{message}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Name */}
            <div className="flex items-center border border-green-400 rounded-md px-3">
              <FaUser className="text-green-600 mr-2" />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-2 py-3 focus:outline-none"
              />
            </div>

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

            {/* Phone */}
            <div className="flex items-center border border-green-400 rounded-md px-3">
              <FaPhone className="text-green-600 mr-2" />
              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                value={formData.phone}
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

            {/* Terms */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="accent-green-600"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the <span className="text-green-700 font-semibold">Terms and Conditions</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Create Account
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-700 font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
