import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // 👁️ npm i lucide-react
import api from "../../utils/api";

export default function SecuritySettings() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle

  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newForgotPassword, setNewForgotPassword] = useState("");
  const [confirmForgotPassword, setConfirmForgotPassword] = useState("");
  const [step, setStep] = useState("update");

  // --- Validation errors ---
  const [errors, setErrors] = useState({});

  const validateUpdateFields = () => {
    const newErrors = {};
    if (!oldPassword.trim()) newErrors.oldPassword = "Old password required";
    if (!newPassword.trim()) newErrors.newPassword = "New password required";
    if (!confirmPassword.trim()) newErrors.confirmPassword = "Confirm password required";
    if (newPassword && confirmPassword && newPassword !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Update Password ---
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!validateUpdateFields()) {
      alert("Please fix the errors before submitting.");
      return;
    }

    try {
      await api.put("/auth/update-password", { oldPassword, newPassword });
      alert("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 mt-6">
      {step === "update" && (
        <form onSubmit={handleUpdatePassword} className="space-y-4 relative">
          <h2 className="text-xl font-semibold">Update Password</h2>

          {/* Old Password */}
          <div>
            <label className="block">Old Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className={`w-full border px-3 py-2 rounded ${
                  errors.oldPassword ? "border-red-500" : ""
                }`}
                placeholder="Enter your old password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5 text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="text-red-500 text-sm">{errors.oldPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block">New Password</label>
            <input
              type={showPassword ? "text" : "password" }
              className={`w-full border px-3 py-2 rounded ${
                errors.newPassword ? "border-red-500" : ""
              }`}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword}</p>
            )}
            
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block">Confirm New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className={`w-full border px-3 py-2 rounded ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
            )}
          </div>

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
    </div>
  );
}
