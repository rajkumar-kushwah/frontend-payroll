// src/components/ProfileCard.jsx
import React, { useState } from "react";
import api from "../utils/api";

export default function ProfileCard({ user, onClose, onProfileUpdated }) {
  const [preview, setPreview] = useState(user?.avatar || null);

  // handle file select
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile", file);

    try {
      const res = await api.put(`/users/${user._id}/profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPreview(res.data.avatar); // update local preview
      onProfileUpdated(res.data);  // update parent state
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-80 relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
        >
          ✖
        </button>

        <h2 className="text-lg font-bold mb-4 text-center">Update Profile</h2>

        <div className="flex flex-col items-center gap-4">
          {preview ? (
            <img
              src={preview}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border"
            />
          ) : (
            <i className="fa fa-user-circle-o text-6xl text-gray-400"></i>
          )}

          {/* Upload buttons */}
          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">
            Choose File
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
          </label>

          <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded">
            Camera
            <input
              type="file"
              accept="image/*"
              capture="environment"
              hidden
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
}
