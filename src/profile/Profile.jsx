import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { getProfile, updateProfile } from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, setUser } = useUser();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(user || {});
  const [avatarFile, setAvatarFile] = useState(null); // File for avatar upload
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      const fetchData = async () => {
        try {
          const res = await getProfile();
          setUser(res.data);
          setForm(res.data);
        } catch (err) {
          console.log("Failed to fetch profile:", err);
        }
      };
      fetchData();
    }
  }, [user, setUser]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // FormData for file upload
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("bio", form.bio);
      formData.append("gender", form.gender);
      formData.append("dateofBirth", form.dateofBirth);
      formData.append("address", JSON.stringify(form.address));
      if (avatarFile) formData.append("avatar", avatarFile);

      const res = await updateProfile(formData, true); // true -> FormData
      setUser(res.data.user);
      setForm(res.data.user);
      setEdit(false);
      setAvatarFile(null);
      navigate("/dashboard");
    } catch (err) {
      console.log("Update failed:", err);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

      {edit ? (
        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            required
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.email || ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            type="email"
            required
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.phone || ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.bio || ""}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Bio"
          />
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.gender || "other"}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={form.dateofBirth ? form.dateofBirth.split("T")[0] : ""}
            onChange={(e) => setForm({ ...form, dateofBirth: e.target.value })}
          />

          {/* Address fields */}
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.address?.Stream || ""}
            onChange={(e) => setForm({ ...form, address: { ...form.address, Stream: e.target.value } })}
            placeholder="Street"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.address?.city || ""}
            onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
            placeholder="City"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.address?.state || ""}
            onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })}
            placeholder="State"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.address?.country || ""}
            onChange={(e) => setForm({ ...form, address: { ...form.address, country: e.target.value } })}
            placeholder="Country"
          />
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.address?.pinCode || ""}
            onChange={(e) => setForm({ ...form, address: { ...form.address, pinCode: e.target.value } })}
            placeholder="Pin Code"
          />

          {/* Avatar Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />

          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Save
            </button>
            <button type="button" className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400" onClick={() => setEdit(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" className="w-16 h-16 rounded-full" />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">N/A</div>
            )}
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>
          <p><b>Phone:</b> {user.phone}</p>
          <p><b>Bio:</b> {user.bio || "—"}</p>
          <p><b>Gender:</b> {user.gender}</p>
          <p><b>Date of Birth:</b> {user.dateofBirth?.split("T")[0]}</p>
          <p><b>Role:</b> {user.role}</p>
          <p><b>Address:</b> {user.address?.Stream}, {user.address?.city}, {user.address?.state}, {user.address?.country} - {user.address?.pinCode}</p>
          <div className="flex justify-between mt-4">
            <button className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500" onClick={() => setEdit(true)}>Edit Profile</button>
            <button className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600" onClick={() => { navigate("/dashboard") }}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
