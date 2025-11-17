import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { FaEnvelope } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    
      const res = await api.post('/auth/send-otp', { email });

      setMessage(res.data.message);

     
      localStorage.setItem('resetEmail', email);

      setTimeout(() => {
        navigate('/verify-otp');
      }, 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow-lg bg-white">
      <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>

      {/* form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center border rounded px-3">
          <FaEnvelope className="text-green-600 mr-2" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-2 py-2 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Send OTP
        </button>
      </form>

      {message && <p className="mt-4 text-center text-blue-600">{message}</p>}
    </div>
  );
};

export default ForgotPassword;
