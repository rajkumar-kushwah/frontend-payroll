// src/components/EditProfile.jsx
import { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { updateProfile } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import Layout from "../components/Layout";

export default function EditProfile() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyId: "",
    name: "",
    email: "",
    phone: "",
    companyName: "",
    bio: "",
    gender: "other",
    dateOfBirth: "",
    address: { Stream: "", city: "", state: "", country: "", pinCode: "" },
    role: "user",
    roleUpdated: false,
  });
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (!user) return;
    setForm({
      companyId: user.companyId || "",
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      companyName: user.companyName || "",
      bio: user.bio || "",
      gender: user.gender || "other",
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
      address: {
        Stream: user.address?.Stream || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        country: user.address?.country || "",
        pinCode: user.address?.pinCode || "",
      },
      role: user.role || "user",
      roleUpdated: user.roleUpdated || false,
    });
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("companyId", form.companyId);
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("companyName", form.companyName);
      formData.append("bio", form.bio);
      formData.append("gender", form.gender);
      formData.append("dateOfBirth", form.dateOfBirth);
      formData.append("address", JSON.stringify(form.address));
      if (!form.roleUpdated) formData.append("role", form.role);
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await updateProfile(formData, true);
      setUser(res.data.user);
      alert("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (!user) return <p className="text-center mt-10 text-xs">Loading...</p>;

  return (
    <Layout>
      <div className="flex justify-center mt-10">
        <form onSubmit={handleUpdate} className="w-full max-w-lg p-6 bg-gray-100 shadow-sm rounded-lg text-xs space-y-4">

          {/* Avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24">
              <img
                src={avatarFile ? URL.createObjectURL(avatarFile) : user.avatar || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border border-gray-300"
              />
              <input
                id="avatarInput"
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])}
                className="hidden"
              />
              <label htmlFor="avatarInput" className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100">
                <Pencil size={16} className="text-gray-600" />
              </label>
            </div>
          </div>

          {/* Company ID read-only */}
          <div>
            <label className="text-xs font-semibold">Company ID</label>
            <input
              value={form.companyId}
              readOnly
              className="w-full border px-2 py-1 rounded bg-gray-100 text-xs"
            />
          </div>

          {/* Name & Email side-by-side */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold">Name</label>
              <input
                className="w-full border px-2 py-1 rounded text-xs"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                required
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold">Email</label>
              <input
                type="email"
                className="w-full border px-2 py-1 rounded text-xs"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                required
              />
            </div>
          </div>

          {/* Phone & Company Name side-by-side */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold">Phone</label>
              <input
                className="w-full border px-2 py-1 rounded text-xs"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold">Company Name</label>
              <input
                className="w-full border px-2 py-1 rounded text-xs"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="Company Name"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="text-xs font-semibold">Bio</label>
            <input
              className="w-full border px-2 py-1 rounded text-xs"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Bio"
            />
          </div>

          {/* Gender & DOB side-by-side */}
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs font-semibold">Gender</label>
              <select
                className="w-full border px-2 py-1 rounded text-xs"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-semibold">Date of Birth</label>
              <input
                type="date"
                className="w-full border px-2 py-1 rounded text-xs"
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              />
            </div>
          </div>

          {/* Address Fields in separate rows */}
          <div>
            <label className="text-xs font-semibold">Stream</label>
            <input
              className="w-full border px-2 py-1 rounded text-xs"
              value={form.address.Stream}
              onChange={(e) => setForm({ ...form, address: { ...form.address, Stream: e.target.value } })}
              placeholder="Stream"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">City</label>
            <input
              className="w-full border px-2 py-1 rounded text-xs"
              value={form.address.city}
              onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
              placeholder="City"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">State</label>
            <input
              className="w-full border px-2 py-1 rounded text-xs"
              value={form.address.state}
              onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })}
              placeholder="State"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">Country</label>
            <input
              className="w-full border px-2 py-1 rounded text-xs"
              value={form.address.country}
              onChange={(e) => setForm({ ...form, address: { ...form.address, country: e.target.value } })}
              placeholder="Country"
            />
          </div>
          <div>
            <label className="text-xs font-semibold">Pin Code</label>
            <input
              className="w-full border px-2 py-1 rounded text-xs"
              value={form.address.pinCode}
              onChange={(e) => setForm({ ...form, address: { ...form.address, pinCode: e.target.value } })}
              placeholder="Pin Code"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-2">
            <button type="submit" className="bg-green-500 px-3 py-1 cursor-pointer rounded hover:bg-green-600">Save</button>
            <button type="button" onClick={() => navigate("/profile")} className="bg-gray-300 px-3 py-1 rounded cursor-pointer hover:bg-gray-400">Cancel</button>
          </div>

        </form>
      </div>
    </Layout>
  );
}
