// src/components/Settings/DeleteAccount.jsx
import { useState } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function DeleteAccount() {
  const { setUser } = useUser();
  const [confirm, setConfirm] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!confirm) {
      alert("Please confirm before deleting");
      return;
    }

    try {
      await api.delete("/auth/delete-account");
      alert("Account deleted permanently");
      setUser(null);
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Failed to delete account");
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
        <span>I understand the consequences</span>
      </label>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={handleDelete}
      >
        Close My Account
      </button>
    </div>
  );
}
