import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";
import Payroll from "../images/Payroll.png";
import logo from "../images/logo.png";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    companyName: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", formData);
      toast.success(res.data.message || "Registered successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-lime-200 flex items-center justify-center px-4 overflow-hidden">
      <ToastContainer />

      {/* Background SVG wave */}
      <svg
        className="absolute bottom-0 left-0 w-full z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#00000" // lime-500 color
          fillOpacity="1"
          d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L0,320Z"
        ></path>
      </svg>

      {/* Main Card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden w-[90%] max-w-3xl border border-gray-200">
        {/* Left Section */}
        <div className="hidden md:flex md:w-1/2 bg-lime-100 flex-col items-center justify-center p-6 text-center">
          <h2 className="text-2xl font-bold text-lime-500 mb-3">
            Payroll Management
          </h2>
          <p className="text-gray-600 text-sm mb-6 px-4">
            Manage employee records, attendance, salaries, and deductions — all
            in one place.
          </p>
          <img
            src={Payroll}
            alt="Payroll"
            className="max-h-60 object-contain"
          />
        </div>

        {/* Right Section (Form) */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center items-center bg-white">
          <img
            src={logo}
            alt="Company Logo"
            className="h-14 mb-4 object-contain drop-shadow-[0_2px_0_rgba(1,1,1,1)] "
          />

          <form
            onSubmit={handleSubmit}
            className="w-full max-w-xs md:max-w-sm space-y-4"
          >
            {/* Name */}
            <div className="flex items-center border border-lime-400 rounded-md px-3 py-2">
              <FaUser className="text-lime-500 mr-2" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full focus:outline-none text-sm"
              />
            </div>

            {/* Email */}
            <div className="flex items-center border border-lime-400 rounded-md px-3 py-2">
              <FaEnvelope className="text-lime-500 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full focus:outline-none text-sm"
              />
            </div>

            {/* Phone */}
            <div className="flex items-center border border-lime-400 rounded-md px-3 py-2">
              <FaPhone className="text-lime-500 mr-2" />
              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full focus:outline-none text-sm"
              />
            </div>

            {/* Company Name */}
            <div className="flex items-center border border-lime-400 rounded-md px-3 py-2">
              <FaUser className="text-lime-500 mr-2" />
              <input
                type="text"
                name="companyName"
                placeholder="Company Name"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full focus:outline-none text-sm"
              />
            </div>



            {/* Password */}
            <div className="flex items-center border border-lime-400 rounded-md px-3 py-2">
              <FaLock className="text-lime-500 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full focus:outline-none text-sm"
              />
            </div>

            {/* Terms */}
            <div className="flex items-center space-x-2 text-xs">
              <input
                type="checkbox"
                id="terms"
                required
                className="accent-lime-500"
              />
              <label htmlFor="terms" className="text-gray-700">
                I agree to the{" "}
                <span className="text-lime-500 font-semibold">
                  Terms and Conditions
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-lime-400 text-white py-2 rounded-md font-semibold hover:bg-lime-500 transition-all duration-200 disabled:opacity-50 text-sm"
            >
              {loading ? "Registering..." : "Create Account"}
            </button>
          </form>

          <p className="mt-4 text-xs text-gray-600 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-lime-500 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
