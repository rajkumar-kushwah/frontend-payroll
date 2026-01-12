// src/components/Profile.jsx
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import EditProfile from "./EditProfile";

export default function Profile() {
  const { user } = useUser();
  const navigate = useNavigate();

  if (!user) return <p className="text-center mt-10 text-xs">Loading...</p>;

  return (
    <Layout>
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-md p-6 bg-gray-100 shadow-sm rounded-lg text-xs space-y-1">
          <h2 className="text-xl font-semibold mb-4 text-center">My Profile</h2>

          {/* Avatar */}
          <div className="flex items-center gap-2 mb-2">
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

          <p><b>Company ID:</b> {user.companyId}</p>
          <p><b>Phone:</b> {user.phone || "—"}</p>
          <p><b>Company:</b> {user.companyName || "—"}</p>
          <p><b>Bio:</b> {user.bio || "—"}</p>
          <p><b>Gender:</b> {user.gender || "—"}</p>
          <p><b>Date of Birth:</b> {user.dateOfBirth?.split("T")[0] || "—"}</p>
          <p><b>Role:</b> {user.role || "user"}</p>
          <p><b>Status:</b> {user.status || "active"}</p>
          <p><b>Registered:</b> {new Date(user.createdAt).toLocaleString()}</p>
          <p><b>Last Login:</b> {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "—"}</p>
          <p><b>Address:</b>{" "}
            {[user.address?.Stream, user.address?.city, user.address?.state, user.address?.country, user.address?.pinCode]
              .filter(Boolean)
              .join(", ")}
          </p>

          <div className="flex justify-between mt-2">
            <button 
              onClick={() => navigate("/profile/edit")} 
              className="bg-yellow-400 px-3 py-1 rounded cursor-pointer hover:bg-yellow-500 text-xs">
              Edit Profile
            </button>
            <button 
              onClick={() => navigate("/dashboard")} 
              className="bg-red-500 px-3 py-1 rounded cursor-pointer hover:bg-red-600 text-white text-xs">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
