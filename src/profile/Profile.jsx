// src/components/Profile.jsx
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { getProfile, updateProfile } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";
import Layout from "../components/Layout";

export default function Profile() {
  const { user, setUser } = useUser();
  const [edit, setEdit] = useState(false);
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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const u = res.data;
        setUser(u);
        setForm({
          companyId: u.companyId || "",
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          companyName: u.companyName || "",
          bio: u.bio || "",
          gender: u.gender || "other",
          dateOfBirth: u.dateOfBirth ? u.dateOfBirth.split("T")[0] : "",
          address: {
            Stream: u.address?.Stream || "",
            city: u.address?.city || "",
            state: u.address?.state || "",
            country: u.address?.country || "",
            pinCode: u.address?.pinCode || "",
          },
          role: u.role || "user",
          roleUpdated: u.roleUpdated || false,
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);

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
      const updatedUser = {
        ...res.data.user,
        roleUpdated: res.data.user.roleUpdated || form.roleUpdated,
      };
      setUser(updatedUser);
      setForm({ ...form, roleUpdated: updatedUser.roleUpdated });
      setEdit(false);
      setAvatarFile(null);
      alert("Profile updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (!user) return <p className="text-center mt-10 text-sm">Loading...</p>;

  return (
    <Layout>
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-md p-6 bg-gray-100 shadow-sm rounded-lg text-sm">
          <h2 className="text-xl font-semibold mb-4 text-center">My Profile</h2>

          {edit ? (
            <form onSubmit={handleUpdate} className="space-y-2">
              {/* Avatar */}
              <div className="relative w-20 h-20 mx-auto">
                <img
                  src={avatarFile ? URL.createObjectURL(avatarFile) : user.avatar || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border border-gray-300"
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
                  className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow cursor-pointer hover:bg-gray-100"
                >
                  <Pencil size={14} className="text-gray-600" />
                </label>
              </div>

              {/* Company ID (read-only) */}
              <input value={form.companyId} readOnly className="w-full border px-2 py-1 rounded bg-gray-100 text-xs" />

              {/* Editable fields */}
              <input
                className="w-full border px-2 py-1 rounded text-xs"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
                required
              />
              <input
                type="email"
                className="w-full border px-2 py-1 rounded text-xs"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                required
              />
              <input
                className="w-full border px-2 py-1 rounded text-xs"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone"
              />
              <input
                className="w-full border px-2 py-1 rounded text-xs"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                placeholder="Company Name"
              />
              <input
                className="w-full border px-2 py-1 rounded text-xs"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Bio"
              />
              <select
                className="w-full border px-2 py-1 rounded text-xs"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <input
                type="date"
                className="w-full border px-2 py-1 rounded text-xs"
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              />

              {/* Address */}
              {["Stream", "city", "state", "country", "pinCode"].map((field) => (
                <input
                  key={field}
                  className="w-full border px-2 py-1 rounded text-xs"
                  value={form.address[field]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: { ...form.address, [field]: e.target.value },
                    })
                  }
                  placeholder={field}
                />
              ))}

              <div className="flex justify-between mt-1">
                <button type="submit" className="bg-green-500 text-black px-3 py-1 rounded hover:bg-green-600 text-xs">
                  Save
                </button>
                <button type="button" className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400 text-xs" onClick={() => setEdit(false)}>
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-1">
              {/* Display */}
              <div className="flex items-center gap-2">
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-14 h-14 rounded-full border border-gray-300 object-cover" />
                ) : (
                  <div className="w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-xs">N/A</div>
                )}
                <div>
                  <p className="font-semibold text-xs">{user.name}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
              </div>

              <p className="text-xs"><b>Company ID:</b> {user.companyId}</p>
              <p className="text-xs"><b>Phone:</b> {user.phone || "—"}</p>
              <p className="text-xs"><b>Company:</b> {user.companyName || "—"}</p>
              <p className="text-xs"><b>Bio:</b> {user.bio || "—"}</p>
              <p className="text-xs"><b>Gender:</b> {user.gender || "—"}</p>
              <p className="text-xs"><b>Date of Birth:</b> {user.dateOfBirth?.split("T")[0] || "—"}</p>
              <p className="text-xs"><b>Role:</b> {user.role || "user"}</p>
              <p className="text-xs"><b>Status:</b> {user.status || "active"}</p>
              <p className="text-xs"><b>Registered:</b> {new Date(user.createdAt).toLocaleString()}</p>
              <p className="text-xs"><b>Last Login:</b> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "—"}</p>
              <p className="text-xs"><b>Address:</b>{" "}
                {[user.address?.Stream, user.address?.city, user.address?.state, user.address?.country, user.address?.pinCode]
                  .filter(Boolean)
                  .join(", ")}
              </p>

              <div className="flex justify-between mt-2">
                <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 text-xs" onClick={() => setEdit(true)}>
                  Edit Profile
                </button>
                <button className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600 text-xs" onClick={() => navigate("/dashboard")}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
