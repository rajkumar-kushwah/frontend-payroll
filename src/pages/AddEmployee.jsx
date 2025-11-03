import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../utils/api";

export default function EmployeeAdd() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    jobRole: "",
    department: "",
    joinDate: "",
    salary: "",
    status: "active",
    notes: "",
  });

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "salary" ? Number(value) : value,
    });
  };

  // Handle form submit
  const handleSubmit = async () => {
    // Required validations (same as backend)
    if (!form.name || !form.email || !form.salary) {
      return alert("Please fill Name, Email, and Salary");
    }

    try {
      await api.post("/employees", form);
      alert("✅ Employee added successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("❌ Error adding employee");
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-6 text-center">Add New Employee</h2>

      <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto space-y-4">

        {/* Name */}
        <div>
          <label className="block font-semibold mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold mb-1">Email *</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block font-semibold mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Job Role */}
        <div>
          <label className="block font-semibold mb-1">Job Role</label>
          <input
            type="text"
            name="jobRole"
            placeholder="e.g. Manager, Sales Executive"
            value={form.jobRole}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block font-semibold mb-1">Department</label>
          <input
            type="text"
            name="department"
            placeholder="e.g. HR, Finance, Marketing"
            value={form.department}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Join Date */}
        <div>
          <label className="block font-semibold mb-1">Join Date</label>
          <input
            type="date"
            name="joinDate"
            value={form.joinDate}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Salary */}
        <div>
          <label className="block font-semibold mb-1">Salary (₹) *</label>
          <input
            type="number"
            name="salary"
            placeholder="Enter salary amount"
            value={form.salary}
            onChange={handleChange}
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block font-semibold mb-1">Status</label>
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
        </div>

        {/* Notes */}
        <div>
          <label className="block font-semibold mb-1">Notes</label>
          <textarea
            name="notes"
            placeholder="Additional remarks or notes"
            value={form.notes}
            onChange={handleChange}
            rows="3"
            className="border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Employee
          </button>
        </div>
      </div>
    </Layout>
  );
}
