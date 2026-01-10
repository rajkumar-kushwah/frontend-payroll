// src/components/Settings/DeleteAccount.jsx
import { useState } from "react";
import { useUser } from "../context/UserContext";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount() {
  const { setUser } = useUser();
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();

 const handleDelete = async () => {
  // Step 1: Ask for confirmation
  const confirmDelete = window.confirm("Are you sure you want to delete your account?");
  if (!confirmDelete) {
    alert("Account deletion canceled");
    return;
  }

  try {
    // Step 2: Call the backend API
    await api.delete("/auth/delete-account");

    // Step 3: Handle success
    alert("Your account has been permanently deleted.");
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  } catch (err) {
    console.error("Delete account error:", err);
    alert("Failed to delete account. Please try again later.");
  }
};


  return (
    <div>
      <p className="mb-4 font-semibold">
        Definitively close your account. All data will be permanently deleted.
      </p>
      <label className="flex items-center gap-2 mb-4">
        <input
          type="checkbox"
          checked={confirm}
          onChange={(e) => setConfirm(e.target.checked)}
        />
        <span>I agree to permanently delete this user.</span>
      </label>
      <button
        className="bg-red-500 text-white cursor-pointer px-3 py-1 rounded hover:bg-red-600"
        onClick={handleDelete}
      >
        Close My Account
      </button>
    </div>
  );
}
