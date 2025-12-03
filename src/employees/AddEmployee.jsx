import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Pencil } from "lucide-react";
import api from "../utils/api"; // Axios instance

export default function EmployeeAdd() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    jobRole: "",
    department: "",
    joinDate: "",
    status: "active",
    notes: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) return alert("Please fill Name and Email");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (avatarFile) formData.append("avatar", avatarFile);

    try {
      await api.post("/employees/profile", formData); // ✅ correct Cloudinary route
      alert("Employee added successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response || error);
      alert("Error saving employee");
    }
  };

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4 text-center">Add New Employee</h2>
      <div className="bg-white rounded-lg shadow p-4 max-w-xl mx-auto space-y-3">

        {/* Avatar */}
        <div className="flex justify-center mb-3">
          <div className="relative w-24 h-24">
            <img
              src={avatarFile ? URL.createObjectURL(avatarFile) : "https://via.placeholder.com/150"}
              alt="Avatar"
              className="w-24 h-24 rounded-full border object-cover"
            />
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="hidden"
            />
            <label
              htmlFor="avatarInput"
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100"
            >
              <Pencil size={14} className="text-gray-600" />
            </label>
          </div>
        </div>

        {/* Form Inputs */}
        {Object.keys(form).map((key) =>
          key !== "status" && key !== "notes" && key !== "joinDate" ? (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type="text"
                name={key}
                value={form[key]}
                onChange={handleChange}
                className="border p-1.5 w-full rounded text-sm"
              />
            </div>
          ) : null
        )}

        {/* Join Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Join Date</label>
          <input
            type="date"
            name="joinDate"
            value={form.joinDate}
            onChange={handleChange}
            className="border p-1.5 w-full rounded text-sm"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border p-1.5 w-full rounded text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="terminated">Terminated</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-1">Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows="2"
            className="border p-1.5 w-full rounded text-sm"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white px-3 py-1.5 rounded text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-3 py-1.5 rounded text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </Layout>
  );
}
