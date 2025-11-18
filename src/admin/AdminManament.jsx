import React, { useEffect, useState } from "react";
import { addUser, promoteUser, demoteUser, getAdminDashboardData } from "../utils/api";
import Layout from "../components/Layout";

export default function AdminManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });

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

  useEffect(() => { fetchUsers(); }, []);

  // ---------------- Add User ----------------
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addUser(newUser);
      setNewUser({ name: "", email: "", password: "", role: "user" });
      setShowAddForm(false);
      fetchUsers();
      alert("User added successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add user");
    }
  };

  // ---------------- Promote User ----------------
  const handlePromote = async (userId) => {
    try {
      await promoteUser(userId);
      fetchUsers();
      alert("User promoted to admin");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to promote user");
    }
  };

  // ---------------- Demote Admin ----------------
  const handleDemote = async (adminId) => {
    try {
      await demoteUser(adminId);
      fetchUsers();
      alert("Admin demoted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to demote admin");
    }
  };

  const promotableUsers = users.filter(u => u.role !== "admin" && u.role !== "owner");
  const admins = users.filter(u => u.role === "admin");

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Layout>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Owner Dashboard - Admin Management</h1>

      {/* -------- Add User Button -------- */}
      <button
        onClick={() => setShowAddForm(!showAddForm)}
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        {showAddForm ? "Cancel" : "Add New User"}
      </button>

      {/* -------- Add User Form -------- */}
      {showAddForm && (
        <form onSubmit={handleAddUser} className="mb-6 p-4 border rounded">
          <input
            placeholder="Name"
            required
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border p-2 rounded mb-2 w-full"
          />
          <input
            placeholder="Email"
            type="email"
            required
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 rounded mb-2 w-full"
          />
          <input
            placeholder="Password"
            type="password"
            required
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border p-2 rounded mb-2 w-full"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border p-2 rounded mb-2 w-full"
          >
            <option value="ceo">CEO</option>
            <option value="hr">HR</option>
            <option value="manager">Manager</option>
            <option value="user">Employee</option>
          </select>
          <button type="submit" className="px-3 py-2 bg-green-700 text-white rounded">
            Add User
          </button>
        </form>
      )}

      {/* -------- Users List -------- */}
      <div className="p-4 border rounded">
        <h2 className="font-semibold mb-2">Existing Users</h2>
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2 flex gap-2">
                  {u.role !== "admin" && u.role !== "owner" && (
                    <button
                      onClick={() => handlePromote(u._id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Promote
                    </button>
                  )}
                  {u.role === "admin" && (
                    <button
                      onClick={() => handleDemote(u._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Demote
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-3">
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
