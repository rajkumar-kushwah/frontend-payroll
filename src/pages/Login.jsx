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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!captchaToken) {
      toast.error("Please complete the reCAPTCHA!");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", { ...formData, captchaToken });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      toast.success(res.data.message || "Login successful!");
      if (!res.data.user.profileComplete) navigate("/profile");
      else navigate("/dashboard");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Login failed! Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-lime-200 overflow-hidden">
      <ToastContainer />

      {/* Background SVG wave */}
      <svg
        className="absolute bottom-0 left-0 w-full z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#000000" // lime-500 color
          fillOpacity="1"
          d="M0,0L40,42.7C80,85,160,171,240,197.3C320,224,400,192,480,154.7C560,117,640,75,720,74.7C800,75,880,117,960,154.7C1040,192,1120,224,1200,213.3C1280,203,1360,149,1400,122.7L1440,96L1440,320L0,320Z"
        ></path>
      </svg>

      {/* Main box */}
      <div className="relative z-10 bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden w-[90%] max-w-3xl">
        {/* Left section */}
        <div className="hidden md:flex md:w-1/2 bg-lime-100 items-center justify-center flex-col p-6 text-center">
          <img
            src={Payroll}
            alt="Payroll"
            className="max-h-64 object-contain mb-4"
          />
          <h2 className="text-2xl font-bold text-lime-500 mb-2">
            Smart Payroll
          </h2>
          <p className="text-gray-600 text-sm px-4">
            Manage employees, track salaries, and automate payroll seamlessly.
          </p>
        </div>

        {/* Right section */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-lime-300 text-center drop-shadow-[0_2px_0_rgba(1,1,1,1)]">
            Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center border border-lime-400 rounded-md px-3 py-2">
              <FaEnvelope className="text-lime-400 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full focus:outline-none"
              />
            </div>

            <div className="flex items-center border border-lime-400 rounded-md px-3 py-2">
              <FaLock className="text-lime-400 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full focus:outline-none"
              />
            </div>

            <div className="text-right text-sm">
              <Link
                to="/forgot-password"
                className="text-gray-500 hover:text-gray-400 underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LdM3wgsAAAAAFO8PiOnKKfZHMbdvUcO16ijYTl3"
                onChange={(token) => setCaptchaToken(token)}
                onExpired={() => setCaptchaToken(null)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-lime-300 text-black font-semibold py-3 rounded-md transition-all duration-200 ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-lime-400"
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-lime-500 font-semibold hover:underline"
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
