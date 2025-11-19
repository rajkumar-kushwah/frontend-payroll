import React, { useEffect, useState } from "react";
import { getAdminDashboardData, promoteUser, demoteUser, deleteUser } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function AdminManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ---------------- FETCH USERS ----------------
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
    fetchUsers();
  }, []);

  // ---------------- PROMOTE USER ----------------
  const handlePromote = async (userId) => {
    try {
      await promoteUser(userId);
      fetchUsers();
      alert("User promoted to admin");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to promote user");
    }
  };

  // ---------------- DEMOTE ADMIN ----------------
  const handleDemote = async (adminId) => {
    try {
      await demoteUser(adminId);
      fetchUsers();
      alert("Admin demoted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to demote admin");
    }
  };

  // ---------------- DELETE USER ----------------
  const handleDelete = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await deleteUser(userId);
      fetchUsers();
      alert("User deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (loading) return <p className="text-sm">Loading...</p>;
  if (error) return <p className="text-red-500 text-sm">{error}</p>;

  return (
    <Layout>
      <div className="p-4">
        <h1 className="text-lg font-bold mb-2">Owner Dashboard - Admin Management</h1>

        {/* -------- Add New User Button -------- */}
        <button
          onClick={() => navigate("/admin/add-user")}
          className="mb-4 px-3 py-1.5 bg-green-500 text-white text-sm rounded"
        >
          + Add New User
        </button>

        {/* -------- Users Table -------- */}
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? users.map(u => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2 flex gap-2">
                  {u.role !== "admin" && u.role !== "owner" && (
                    <button
                      onClick={() => handlePromote(u._id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                    >
                      Promote
                    </button>
                  )}
                  {u.role === "admin" && (
                    <button
                      onClick={() => handleDemote(u._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                    >
                      Demote
                    </button>
                  )}
                  {/* Delete Button for all non-owner users */}
                  {u.role !== "owner" && (
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="px-2 py-1 bg-gray-500 text-white rounded text-xs"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} className="text-center p-2 text-gray-500 italic text-xs">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
