import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import Payroll from '../images/Payroll.png';
import api from "../utils/api";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api.post("/auth/register", formData);

    // Backend response kaise hai: { message, token, user }
    if (res.data.token) {  // check token instead of success
      alert(res.data.message || "Account created successfully!");
      navigate("/login");  // login page ya dashboard
    } else {
      alert(res.data.message || "Registration failed!");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong while registering");
  }
};


 return (
  <div className="min-h-screen bg-green-600 flex items-center justify-center px-2">
    <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2">
      
      {/* Left Side: About Nabu */}
   <div className="hidden md:flex flex-col items-center justify-center p-8 bg-green-100 rounded-l-lg">
  <h2 className="text-3xl font-bold text-green-700 mb-4">Smart Payroll System</h2>
  <p className="text-gray-700 text-lg leading-relaxed text-center">
    Manage your employees’ salaries, attendance, and tax deductions 
    seamlessly with our Payroll System.  
    Secure, fast, and easy-to-use platform designed to simplify 
    HR operations and ensure timely payments.
  </p>
  {/* Left Image */}
    <div className="hidden md:flex md:w-2/3 bg-green-50 items-center justify-center p-6">
      <img src={Payroll} alt="Payroll" className="max-h-96 object-contain" />
    </div>
</div>


      {/* Right Side: Register Form */}
      <div className="p-8 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-8 text-green-700 text-center">
          Register Account
        </h2>
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
              name="terms"
              required
              className="accent-green-600"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              I agree to the{" "}
              <span className="text-green-700 font-semibold">
                Terms and Conditions
              </span>
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
          <Link
            to="/login"
            className="text-green-700 font-semibold hover:underline"
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
