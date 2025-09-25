import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [stats, setStats] = useState({
    employees: 0,
    totalSalary: 0,
    leaves: 0,
    reports: 0,
  });

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eRes, pRes] = await Promise.allSettled([
          api.get("/employees"),
          api.get("/payrolls"), // agar reports payrolls se linked hain
        ]);

        const employeeData = eRes.status === "fulfilled" ? eRes.value.data : [];
        const payrolls = pRes.status === "fulfilled" ? pRes.value.data.length : 0;

        // ✅ Salary ka calculation (latest salaries se)
        const totalSalary = employeeData.reduce(
          (acc, emp) => acc + (emp.salary || 0),
          0
        );

        setEmployees(employeeData);
        setStats({
          employees: employeeData.length,
          totalSalary,
          leaves: 0, // agar leaves schema aayega to update kar dena
          reports: payrolls,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading)
    return (
      <Layout>
        <div className="p-6">Loading dashboard...</div>
      </Layout>
    );

  // ✅ Sirf last 4 employees (recent added)
  const recentEmployees = [...employees]
    .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate)) // latest pehle
    .slice(0, 4);

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-sm text-gray-600">Employees</div>
          <div className="text-3xl font-bold text-green-600 mt-2">
            {stats.employees}
          </div>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-sm text-gray-600">Total Salary</div>
          <div className="text-3xl font-bold text-blue-600 mt-2">
            ₹{stats.totalSalary}
          </div>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-sm text-gray-600">Leaves</div>
          <div className="text-3xl font-bold text-yellow-600 mt-2">
            {stats.leaves}
          </div>
        </div>
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="text-sm text-gray-600">Pending Reports</div>
          <div className="text-3xl font-bold text-red-600 mt-2">
            {stats.reports}
          </div>
        </div>
      </div>

      {/* Add Employee Button */}
      <div className="flex justify-end mb-4 gap-3">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => navigate("/employee/add")}
        >
          + Add Employee
        </button>
        <button
          className="bg-gray-600 text-white px-4 py-2 rounded"
          onClick={() => navigate("/employees")}
        >
          View All
        </button>
      </div>

      {/* Recent Employees List */}
      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Job Role</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Join Date</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentEmployees.length > 0 ? (
              recentEmployees.map((emp, index) => (
                <tr key={emp._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="px-4 py-2 font-bold">{emp.name}</td>
                  <td className="px-4 py-2">{emp.email}</td>
                  <td className="px-4 py-2">{emp.jobRole}</td>
                  <td className="px-4 py-2">{emp.department}</td>
                  <td className="px-4 py-2">₹{emp.salary}</td>
                  <td className="px-4 py-2">{emp.status}</td>
                  <td className="px-4 py-2">
                    {new Date(emp.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-right relative">
                    {/* Actions Dropdown Button */}
                    <button
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                      onClick={() => toggleDropdown(emp._id)}
                    >
                      ⋮
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdown === emp._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                        <button
                          onClick={() => navigate(`/employee/${emp._id}`)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          View
                        </button>
                        <button className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                          Update
                        </button>
                        <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No employees found. Add your first employee.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
