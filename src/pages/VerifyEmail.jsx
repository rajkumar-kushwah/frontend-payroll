import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

const VerifyEmail = () => {
  const [message, setMessage] = useState("Verifying...");
  const [expired, setExpired] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email || !token) {
      setMessage("Invalid verification link.");
      return;
    }

    api.get(`/auth/verify-email?email=${email}&token=${token}`)
      .then((res) => {
        setMessage(res.data.message);
        setTimeout(() => navigate("/login"), 3000); // redirect after 3 sec
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Verification failed";
        setMessage(msg);
        if (msg.includes("expired") || msg.includes("Invalid")) {
          setExpired(true);
        }
      });
  }, [navigate, searchParams]);

  const handleResend = async () => {
    const email = searchParams.get("email");
    if (!email) return;
    try {
      await api.post("/auth/resend-verification", { email });
      setMessage("Verification link resent! Please check your email again.");
      setExpired(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Resend failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 px-2">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-700">Email Verification</h2>
        <p className="mb-4">{message}</p>

        {expired && (
          <button
            onClick={handleResend}
            className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
          >
            Resend Verification Link
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
