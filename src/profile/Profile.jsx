// src/components/Profile.jsx
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { getProfile, updateProfile } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Pencil } from "lucide-react";

export default function Profile() {
  const { user, setUser } = useUser();
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    bio: "",
    gender: "other",
    dateofBirth: "",
    address: { Stream: "", city: "", state: "", country: "", pinCode: "" },
    role: "user",
    roleUpdated: false,
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const navigate = useNavigate();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const u = res.data;
        setUser(u);
        setForm({
          name: u.name || "",
          email: u.email || "",
          phone: u.phone || "",
          companyName: u.companyName || "",
          bio: u.bio || "",
          gender: u.gender || "other",
          dateofBirth: u.dateofBirth ? u.dateofBirth.split("T")[0] : "",
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
    
     useEffect(() => {
         if (!user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        companyName: user.companyName || "",
        bio: user.bio || "",
        gender: user.gender || "other",
        dateofBirth: user.dateofBirth ? user.dateofBirth.split("T")[0] : "",
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
    }
  }, [user]);
  
    
   

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("companyName", form.companyName);
      formData.append("bio", form.bio);
      formData.append("gender", form.gender);
      formData.append("dateofBirth", form.dateofBirth);
      formData.append("address", JSON.stringify(form.address));

      // Append role only if roleUpdated is false
      if (!form.roleUpdated) formData.append("role", form.role);

      if (avatarFile) formData.append("avatar", avatarFile);

      // Debug: Check FormData
      // for (let pair of formData.entries()) console.log(pair[0], pair[1]);

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

  // if (!user) return <p className="text-center mt-10">Loading...</p>;

  // const canEditRole = !form.roleUpdated;

  return (
    <div className=" flex items-center dashboard-bg min-h-screen relative  ">
    <div className="max-w-md mx-auto mt-10 p-15 bg-white  shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">My Profile</h2>

      {edit ? (
        <form onSubmit={handleUpdate} className="space-y-4">

            {/* Avatar */}
            
{/* Avatar upload + preview */}
<div className="relative w-32 h-32 mx-auto">
  {/* Image preview */}
  <img
    src={
      avatarFile
        ? URL.createObjectURL(avatarFile)
        : user.avatar || "https://via.placeholder.com/150"
    }
    alt="Profile"
    className="w-32 h-32 rounded-full object-cover border border-gray-300"
  />

  {/* Hidden file input */}
  <input
    id="avatarInput"
    type="file"
    accept="image/*"
    onChange={(e) => setAvatarFile(e.target.files[0])}
    className="hidden"
  />

  {/* Edit (pen) icon */}
  <label
    htmlFor="avatarInput"
    className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow cursor-pointer hover:bg-gray-100"
  >
    <Pencil size={16} className="text-gray-600" />
  </label>
</div>

       
          {/* Name */}
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            required
          />

          {/* Email */}
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            required
          />

          {/* Phone */}
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone"
          />

          {/* Company Name */}
            <input
              className="w-full border px-3 py-2 rounded"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="Company Name"
            />

          {/* Bio */}
          <input
            className="w-full border px-3 py-2 rounded"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            placeholder="Bio"
          />

          {/* Gender */}
          <select
            className="w-full border px-3 py-2 rounded"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* DOB */}
          <label htmlFor="dob">dateofBirth</label>
          <input
           id="dob"
            type="date"
            className="w-full border px-3 py-2 rounded"
            value={form.dateofBirth}
            onChange={(e) => setForm({ ...form, dateofBirth: e.target.value })}
          />

          {/* Address */}
          {["Stream", "city", "state", "country", "pinCode"].map((field) => (
            <input
              key={field}
              className="w-full border px-3 py-2 rounded"
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

          {/* Role */}

          {/* {canEditRole && (
            <select
              className="w-full border px-3 py-2 rounded"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="hr">HR</option>
              <option value="it_manager">IT Manager</option>
              <option value="finance">Finance</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          )} */}

        

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-green-500 text-black px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
            <button
              type="button"
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              onClick={() => setEdit(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-2">
          {/* Display */}
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt="avatar"
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                N/A
              </div>
            )}
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          <p>
            <b>Phone:</b> {user.phone || "—"}
          </p>
           <p>
              <b>Company:</b> {user?.companyName || "—"}
            </p>
          <p>
            <b>Bio:</b> {user.bio || "—"}
          </p>
          <p>
            <b>Gender:</b> {user.gender || "—"}
          </p>
          <p>
            <b>Date of Birth:</b> {user.dateofBirth?.split("T")[0] || "—"}
          </p>
          <p>
            <b>Role:</b> {user.role || "user"}
          </p>
          <p>
            <b>Address:</b>{" "}
            {[
              user.address?.Stream,
              user.address?.city,
              user.address?.state,
              user.address?.country,
              user.address?.pinCode,
            ]
              .filter(Boolean)
              .join(", ")}
          </p>

          <div className="flex justify-between mt-4">
            <button
              className="bg-yellow-400 px-4 py-2 rounded hover:bg-yellow-500"
              onClick={() => setEdit(true)}
            >
              Edit Profile
            </button>
            <button
              className="bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
