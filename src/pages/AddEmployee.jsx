import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../utils/api";

export default function EmployeeAdd() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    jobrole: "employee",
    department: "",
    joinDate: "",
    salary: "0",
    status: "active",
    notes: "",
  });

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "salary" ? Number(value) : value });
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.department) {
      return alert("Please fill Name, Email, and Department");
    }

    try {
      await api.post("/employees", form);
      alert("Employee added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error adding employee");
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6">Add New Employee</h2>

      <div className="bg-white rounded shadow p-6 max-w-xl mx-auto space-y-4">
        {/* Name */}
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Email */}
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Job Role Dropdown */}
        <label htmlFor="jobrole">Job Role</label>
        <select
          name="jobrole"
          value={form.jobrole}
          onChange={handleChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>

        {/* Department */}
        <label htmlFor="department">Department</label>
        <input
          type="text"
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Join Date */}
        <label htmlFor="joinDate">Join Date</label>
        <input
          type="date"
          name="joinDate"
          value={form.joinDate}
          onChange={handleChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Salary */}
        <label htmlFor="salary">Salary</label>
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Status Dropdown */}
        <label htmlFor="status">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="terminated">Terminated</option>
        </select>

        {/* Notes */}
        <label htmlFor="notes">Notes</label>
        <textarea
          name="notes"
          placeholder="Notes"
          value={form.notes}
          onChange={handleChange}
          className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows="3"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </Layout>
  );
}
