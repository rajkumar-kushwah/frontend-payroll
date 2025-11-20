import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Users, IndianRupee, FileClock, CalendarCheck, Eye, Pencil, Trash2, Home } from "lucide-react";
import { useUser } from "../context/UserContext";
import { FaUsers } from "react-icons/fa";

export default function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState({ employees: 0, totalSalary: 0, leaves: 0, reports: 0 });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ----------------------------
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/dashboard"); // backend route
      const allEmployees = res.data.users || [];

      // Sort employees
      const sortedEmployees = allEmployees.sort((a, b) => {
        const numA = parseInt(a.employeeCode?.replace("EMP-", "") || 0);
        const numB = parseInt(b.employeeCode?.replace("EMP-", "") || 0);
        return numA - numB;
      });

      setEmployees(sortedEmployees);

      // Total salary
      const totalSalary = allEmployees.reduce((acc, emp) => acc + (emp.salary || 0), 0);

      // Dashboard stats
      setStats({
        employees: allEmployees.length,
        totalSalary,
        leaves: 0,
        reports: 0, // fetch reports separately if needed
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  useEffect(() => {
    if (!["owner", "admin"].includes(user?.role)) return;

    fetchData();

    window.addEventListener("employeeAdded", fetchData);
    window.addEventListener("salaryAdded", fetchData);

    return () => {
      window.removeEventListener("employeeAdded", fetchData);
      window.removeEventListener("salaryAdded", fetchData);
    };
  }, [user]);

  // ----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    try {
      await api.delete(`/employees/${id}`);
      alert("Employee deleted successfully");
      window.dispatchEvent(new Event("employeeAdded")); // auto refresh
    } catch (err) {
      alert("Failed to delete employee");
      console.error(err);
    }
  };

  if (!["owner", "admin"].includes(user?.role)) {
    return <p className="text-red-500 text-center mt-10">Access Denied</p>;
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // ----------------------------
  return (
    <Layout>
      <Users className="text-black w-5 h-5" />
      <h1 className="text-xl font-bold mb-4">Welcome, {user.name}</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-8 gap-2 mb-4">
        <div className="bg-gray-50 p-3 rounded shadow text-center hover:bg-gray-100">
          <div className="flex items-center justify-center gap-1"><FaUsers className="w-5 h-5" /> Employees</div>
          <div className="text-sm font-bold mt-1 text-lime-300">{stats.employees}</div>
        </div>

        <div className="bg-gray-50 p-3 rounded shadow text-center hover:bg-gray-100">
          <div className="flex items-center justify-center gap-1"><IndianRupee className="w-5 h-5" /> Salary</div>
          <div className="text-sm font-bold mt-1 text-blue-400">₹{stats.totalSalary}</div>
        </div>

        <div className="bg-gray-50 p-3 rounded shadow text-center hover:bg-gray-100">
          <div className="flex items-center justify-center gap-1"><CalendarCheck className="w-5 h-5" /> Leaves</div>
          <div className="text-sm font-bold mt-1 text-yellow-400">{stats.leaves}</div>
        </div>

        <div className="bg-gray-50 p-3 rounded shadow text-center hover:bg-gray-100">
          <div className="flex items-center justify-center gap-1"><FileClock className="w-5 h-5" /> Reports</div>
          <div className="text-sm font-bold mt-1 text-red-400">{stats.reports}</div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mb-4 gap-3">
        <button className="bg-lime-400 text-white px-3 py-2 rounded" onClick={() => navigate("/employee/add")}>+ Add employee</button>
        <button className="bg-gray-500 text-white px-3 py-2 rounded" onClick={() => navigate("/employees")}>View All</button>
      </div>

      {/* Table */}
      <div className="p-1 overflow-x-auto max-h-[400px]">
        <table className="min-w-full text-sm border-separate border-spacing-y-1">
          <thead className="bg-gray-100 sticky top-0">
            <tr className="text-gray-700 text-xs">
              <th>Emp ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Job Role</th><th>Dept</th><th>Salary</th><th>Status</th><th>Join Date</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? employees.map(emp => (
              <tr key={emp._id} className="bg-gray-100 hover:bg-gray-200">
                <td>{emp.employeeCode}</td>
                <td title={emp.name}>{emp.name}</td>
                <td title={emp.email}>{emp.email}</td>
                <td title={emp.phone}>{emp.phone}</td>
                <td title={emp.jobRole}>{emp.jobRole}</td>
                <td title={emp.department}>{emp.department}</td>
                <td>₹{emp.salary}</td>
                <td>{emp.status}</td>
                <td>{new Date(emp.joinDate).toLocaleDateString()}</td>
                <td className="flex justify-end gap-2">
                  <Eye className="w-4 h-4 text-blue-500 cursor-pointer" onClick={() => navigate(`/employee/${emp._id}`)} />
                  <Pencil className="w-4 h-4 text-green-500 cursor-pointer" onClick={() => navigate(`/employee/${emp._id}/edit`)} />
                  <Trash2 className="w-4 h-4 text-red-500 cursor-pointer" onClick={() => handleDelete(emp._id)} />
                </td>
              </tr>
            )) : (
              <tr><td colSpan="10" className="text-center py-4 text-gray-500 italic">No employees found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
