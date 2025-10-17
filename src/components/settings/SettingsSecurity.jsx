// src/components/Settings/SecuritySettings.jsx
import { useState } from "react";
import api from "../../utils/api";

export default function SecuritySettings() {
  // --- Existing password update ---
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- Forgot Password Flow ---
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newForgotPassword, setNewForgotPassword] = useState("");
  const [confirmForgotPassword, setConfirmForgotPassword] = useState("");

  const [step, setStep] = useState("update"); 
  // steps: "update" | "forgotEmail" | "verifyOtp" | "resetPassword"

  // --- Update Password ---
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await api.put("/auth/change-password", { oldPassword, newPassword });
      alert("Password updated successfully!");
      setOldPassword(""); 
      setNewPassword(""); 
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  // --- Send OTP ---
  const handleSendOtp = async () => {
    if (!forgotEmail) {
      alert("Enter your email");
      return;
    }
    try {
      await api.post("/auth/send-otp", { email: forgotEmail }, { headers: { Authorization: "" } });
      alert("OTP sent to your email");
      setStep("verifyOtp");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // --- Verify OTP ---
  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }
    try {
      const res = await api.post("/auth/verify-otp", { email: forgotEmail, otp }, { headers: { Authorization: "" } });
      alert("OTP verified. You can now reset your password.");
      setResetToken(res.data.resetToken);
      setStep("resetPassword");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  // --- Reset Password ---
  const handleResetPassword = async () => {
    if (newForgotPassword !== confirmForgotPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await api.post("/auth/reset-password", {
        email: forgotEmail,
        newPassword: newForgotPassword,
        resetToken,
      }, { headers: { Authorization: "" } });
      alert("Password reset successfully!");
      // Reset all
      setForgotEmail(""); setOtp(""); setResetToken("");
      setNewForgotPassword(""); setConfirmForgotPassword("");
      setStep("update");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    
    <div className="max-w-md mx-auto space-y-6 mt-6">
      {/* --- Update Password --- */}
      {step === "update" && (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <h2 className="text-xl font-semibold">Update Password</h2>
          <label className="block">Old Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter your old password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <label className="block">New Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label className="block">Confirm New Password</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Password
          </button>
          <p
            className="text-sm text-blue-600 cursor-pointer mt-2"
            onClick={() => setStep("forgotEmail")}
          >
            Forgot Password?
          </p>
        </form>
      )}

      {/* --- Forgot Password: Enter Email --- */}
      {step === "forgotEmail" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Forgot Password</h2>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter your email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
          <button
            onClick={handleSendOtp}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Send OTP
          </button>
          <p
            className="text-sm text-blue-600 cursor-pointer mt-2"
            onClick={() => setStep("update")}
          >
            Back to Update Password
          </p>
        </div>
      )}

      {/* --- Verify OTP --- */}
      {step === "verifyOtp" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Verify OTP</h2>
          <input
            type="text"
            className="w-full border px-3 py-2 rounded"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Verify OTP
          </button>
        </div>
      )}

      {/* --- Reset Password --- */}
      {step === "resetPassword" && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Reset Password</h2>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder="New Password"
            value={newForgotPassword}
            onChange={(e) => setNewForgotPassword(e.target.value)}
          />
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            placeholder="Confirm New Password"
            value={confirmForgotPassword}
            onChange={(e) => setConfirmForgotPassword(e.target.value)}
          />
          <button
            onClick={handleResetPassword}
            className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Reset Password
          </button>
        </div>
      )}
    </div>
  );
}
