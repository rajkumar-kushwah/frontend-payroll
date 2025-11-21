import React, { useEffect, useState } from "react";
import { getAdminDashboardData, promoteUser, demoteUser, deleteUser } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useUser } from "../context/UserContext";

export default function AdminManagement() {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboardData();
      setUsers(res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "owner" || user?.role === "admin") fetchUsers();
  }, [user]);

  const handlePromote = async (userId) => {
    try {
      await promoteUser(userId);
      fetchUsers();
      alert("User promoted to admin");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to promote user");
    }
  };

  const handleDemote = async (adminId) => {
    try {
      await demoteUser(adminId);
      fetchUsers();
      alert("Admin demoted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to demote admin");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      fetchUsers();
      alert("User deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) return <p className="text-xs">Loading...</p>;
  if (error) return <p className="text-xs text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="p-2 text-xs">
        <h1 className="text-sm font-bold mb-2">Owner/Admin Dashboard</h1>

        <button
          onClick={() => navigate("/admin/add-user")}
          className="mb-2 px-2 py-1 bg-green-500 text-white text-xs rounded"
        >
          + Add New User
        </button>

        <div className="overflow-x-auto">
          <table className="w-full text-xs border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-1">Name</th>
                <th className="p-1">Email</th>
                <th className="p-1">Role</th>
                <th className="p-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? users.map(u => (
                <tr key={u._id} className="border-t">
                  <td className="p-1">{u.name}</td>
                  <td className="p-1">{u.email}</td>
                  <td className="p-1">{u.role}</td>
                  <td className="p-1 flex flex-wrap gap-1">
                    {u.role !== "admin" && u.role !== "owner" && (
                      <button
                        onClick={() => handlePromote(u._id)}
                        className="px-2 py-0.5 bg-blue-500 text-white rounded text-[10px]"
                      >
                        Promote
                      </button>
                    )}
                    {u.role === "admin" && (
                      <button
                        onClick={() => handleDemote(u._id)}
                        className="px-2 py-0.5 bg-red-500 text-white rounded text-[10px]"
                      >
                        Demote
                      </button>
                    )}
                    {u.role !== "owner" && (
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="px-2 py-0.5 bg-gray-500 text-white rounded text-[10px]"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="text-center p-1 text-gray-500 italic text-xs">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
