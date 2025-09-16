// src/pages/Employees.jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", position: "" });

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      setEmployees(res.data || []);
    } catch (err) {
      console.error(err);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleAdd = async () => {
    try {
      await api.post("/employees", form);
      setForm({ name: "", email: "", position: "" });
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || "Add failed");
    }
  };

  const startEdit = (emp) => {
    setEditingId(emp._id);
    setForm({
      name: emp.name,
      email: emp.email,
      position: emp.position || "",
    });
  };

  const handleSave = async () => {
    try {
      await api.put(`/employees/${editingId}`, form);
      setEditingId(null);
      setForm({ name: "", email: "", position: "" });
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <Layout>
      <h1 className="text-xl font-bold mb-4">Employees</h1>

      {/* Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">
          {editingId ? "Edit Employee" : "Add Employee"}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border rounded p-2"
              required
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="border rounded p-2"
              required
          />
          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Position"
            className="border rounded p-2"
              required
          />
        </div>
        <div className="mt-3 flex gap-2">
          {editingId ? (
            <>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: "", email: "", position: "" });
                }}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Add
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        {loading ? (
          <div>Loading...</div>
        ) : employees.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No employees found
          </div>
        ) : (
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Position</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="border-b">
                  <td className="py-2">{emp.name}</td>
                  <td className="py-2">{emp.email}</td>
                  <td className="py-2">{emp.position || "-"}</td>
                  <td className="py-2">
                    <button
                      onClick={() => startEdit(emp)}
                      className="mr-3 text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Layout>
  );
}
