import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Payroll from "../images/Payroll.png";
import api from "../utils/api";
import { useUser } from "../context/UserContext";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { setUser } = useUser();
  const navigate = useNavigate();
  const [captchaToken, setCaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);

  // Input change handler
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        ...formData,
        captchaToken,
      });

      // Save token & user to localStorage and context
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      // Success toast
      toast.success(res.data.message || "Login successful!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Redirect based on profile completion
      if (!res.data.user.profileComplete) navigate("/profile");
      else navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      const message =
        err.response?.data?.message || // backend error
        err.message ||                 // network error
        "Login failed!";               // fallback

      toast.error(message || "Login failed!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer />
      <div className="flex bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full">
        {/* Left side */}
        <div className="hidden md:flex md:w-1/2 bg-green-50 items-center justify-center flex-col p-6 text-center">
          <img src={Payroll} alt="Payroll" className="max-h-80 object-contain mb-6" />
          <h2 className="text-2xl font-bold text-green-700 mb-2">Smart Payroll</h2>
          <p className="text-gray-600 text-sm">
            Manage employees, track salaries, and automate payroll seamlessly.
          </p>
        </div>

        {/* Right side */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold mb-8 text-green-700 text-center">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="flex justify-end mt-2">
              <Link
                to="/forgot-password"
                className="text-green-700 font-medium hover:underline text-sm"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Google reCAPTCHA */}
            <div className="flex justify-center mb-4">
              <ReCAPTCHA
                sitekey="6LdM3wgsAAAAAFO8PiOnKKfZHMbdvUcO16ijYTl3"
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-green-600 text-white py-3 rounded-md transition-colors duration-200 ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-green-700"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-green-700 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
