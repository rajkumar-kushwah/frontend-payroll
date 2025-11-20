import React, { useState } from "react";
import { addUser } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function AddUser() {
  const navigate = useNavigate();
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await addUser(newUser);
      window.dispatchEvent(new Event("employeeAdded")); // auto-refresh AdminManagement
      alert("User added successfully");
      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <Layout>
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-lg font-bold mb-2">Add New User</h1>
        <form onSubmit={handleAddUser} className="flex flex-col gap-2 border p-3 rounded">
          <input
            type="text"
            placeholder="Name"
            required
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="border p-2 rounded text-sm"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="border p-2 rounded text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            className="border p-2 rounded text-sm"
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            className="border p-2 rounded text-sm"
          >
            <option value="user">Employee</option>
            <option value="admin">Admin</option>
            <option value="ceo">CEO</option>
            <option value="hr">HR</option>
            <option value="manager">Manager</option>
          </select>
          <button type="submit" className="bg-green-500 text-white px-3 py-1.5 rounded text-sm">
            Add User
          </button>
        </form>
      </div>
    </Layout>
  );
}
