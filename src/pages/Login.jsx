// src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import Payroll from '../images/Payroll.png';
import api from "../utils/api";
import { useUser } from "../context/UserContext";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
const { setUser } = useUser();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/login", formData); // Axios wrapper se call
    console.log(res.data.user.lastLogin);
    if (res.data.token) {
      alert("Login successful!");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
       setUser(res.data.user); 
      navigate("/dashboard");
    } else {
      alert(res.data.message || "Login failed!");
    }
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Account not registered yet!");
  }
};
 return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        
        {/* Left Side - Image + Text */}
        <div className="hidden md:flex md:w-1/2 bg-green-50 items-center justify-center flex-col p-6 text-center">
          <img
            src={Payroll}
            alt="Payroll"
            className="max-h-80 object-contain mb-6"
          />
          <h2 className="text-2xl font-bold text-green-700 mb-2">Smart Payroll</h2>
          <p className="text-gray-600 text-sm">
            Manage employees, track salaries, and automate payroll seamlessly 
            with our secure platform.  
            <br /> Login to access your dashboard.
          </p>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-8 text-green-700 text-center">
            Login
          </h2>
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

            <p className="mt-2 text-center text-sm">
              Forgot password?{" "}
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Click here
              </Link>
            </p>

            <button
              type="submit"
              className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Login
            </button>
          </form>

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
