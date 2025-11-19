import React, { useState } from "react";

export default function AddUserForm({ onAdd }) {
  const [user, setUser] = useState({ name: "", email: "", password: "", role: "user" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(user);
    setUser({ name: "", email: "", password: "", role: "user" });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
      <input
        placeholder="Name"
        required
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
        className="border p-2 rounded mb-2 w-full"
      />
      <input
        placeholder="Email"
        type="email"
        required
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        className="border p-2 rounded mb-2 w-full"
      />
      <input
        placeholder="Password"
        type="password"
        required
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        className="border p-2 rounded mb-2 w-full"
      />
      <select
        value={user.role}
        onChange={(e) => setUser({ ...user, role: e.target.value })}
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
  );
}
