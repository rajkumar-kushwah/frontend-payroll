import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCog,
  IndianRupee,
  FileClock,
  CalendarCheck,
  Eye,
  Pencil,
  Trash2,
  Home,
} from "lucide-react";
import { useUser } from "../context/UserContext";

export default function Dashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    employees: 0,
    totalSalary: 0,
    leaves: 0,
    reports: 0,
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [eRes, pRes] = await Promise.allSettled([
        api.get("/employees"),
        api.get("/payrolls"),
      ]);

      const allEmployees = eRes.status === "fulfilled" ? eRes.value.data : [];
      const payrolls = pRes.status === "fulfilled" ? pRes.value.data.length : 0;

      const latestEmployees = [...allEmployees]
        .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
        .slice(0, 4);

      const totalSalary = allEmployees.reduce(
        (acc, emp) => acc + (emp.salary || 0),
        0
      );

      setEmployees(latestEmployees);
      setStats({
        employees: allEmployees.length,
        totalSalary,
        leaves: 0,
        reports: payrolls,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener("employeeAdded", fetchData);
    window.addEventListener("salaryAdded", fetchData);
    return () => {
      window.removeEventListener("employeeAdded", fetchData);
      window.removeEventListener("salaryAdded", fetchData);
    };
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/employees/${id}`);
      alert("Employee deleted successfully");
      fetchData();
    } catch (err) {
      alert("Failed to delete employee");
      console.error(err);
    }
  };

  return (
    <Layout>
      <Users className="text-black drop-shadow-[0_2px_0_rgba(16,185,129,1)]" />

      {user?.name && (
        <h1 className="text-2xl font-bold mb-4 text-black">
          <span className="ai-text-gradient">Welcome, </span>
          {user.name}
        </h1>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="border-none shadow-sm rounded-xl bg-gray-100 mb-12 ml-1 mr-1 p-6 w-full">
          <div className="flex-wrap gap-2 grid grid-cols-1 md:grid-cols-2 mx-auto mb-5 mt-10 overflow-x-auto min-w-full">
            {/* Card 1 */}
            <div className="bg-gray-50 p-6 rounded-sm shadow text-center grid hover:bg-gray-100 transition-transform duration-300 md:hover:-translate-y-2">
              <div className="flex items-center justify-center">
                <UserCog className="text-lime-300 w-6 h-6" />
                <div className="text-xs text-gray-600 font-medium ml-2">Total Employees</div>
              </div>
              <div className="text-xl font-bold text-lime-300 mt-2">{stats.employees}</div>
            </div>

            {/* Card 2 */}
            <div className="bg-gray-50 p-6 rounded-sm shadow text-center grid hover:bg-gray-100 transition-transform duration-300 md:hover:-translate-y-2">
              <div className="flex items-center justify-center">
                <IndianRupee className="text-blue-400 w-6 h-6" />
                <div className="text-xs text-gray-600 font-medium ml-2">Total Salary</div>
              </div>
              <div className="text-xl font-bold text-blue-400 mt-2">₹{stats.totalSalary}</div>
            </div>

            {/* Card 3 */}
            <div className="bg-gray-50 p-6 rounded-sm shadow text-center grid hover:bg-gray-100 transition-transform duration-300 md:hover:-translate-y-2">
              <div className="flex items-center justify-center">
                <CalendarCheck className="text-yellow-400 w-6 h-6" />
                <div className="text-xs text-gray-600 font-medium ml-2">Leaves</div>
              </div>
              <div className="text-xl font-bold text-yellow-400 mt-2">{stats.leaves}</div>
            </div>

            {/* Card 4 */}
            <div className="bg-gray-50 p-4 rounded-sm shadow text-center grid hover:bg-gray-100 transition-transform duration-300 md:hover:-translate-y-2">
              <div className="flex items-center justify-center">
                <FileClock className="text-red-400 w-4 h-4" />
                <div className="text-xs text-gray-600 font-medium ml-2">Pending Reports</div>
              </div>
              <div className="text-xl font-bold text-red-400 mt-2">{stats.reports}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end mb-4  gap-3">
        <button
          className="bg-lime-400 text-white px-2 py-1.5 font-light  text-xs sm:px-3 sm:py-2 sm:text-xs rounded hover:bg-lime-500 transition"
          onClick={() => navigate("/employee/add")}
        >
         <span className="text-xs  ">+ Add employee </span> 
        </button>
        <button
          className="bg-gray-500 text-white px-2 py-1.5 font-light text-xs sm:px-3 sm:py-2 sm:text-xs rounded hover:bg-gray-600 transition"
          onClick={() => navigate("/employees")}
        >
        <span className="text-xs"> View All</span> 
        </button>
      </div>

      {/* Employee Table */}
    <div className="flex font-light text-gray-700 gap-1 ">
    <Home className="w-4 h-4"/>
    <span className="text-xs p-0.5">Users</span>
  </div>
<div className="p-1 overflow-x-auto overflow-y-auto max-h-[400px]">
  <table className="min-w-full text-sm text-left border-separate border-spacing-y-1">
    <thead className="bg-gray-100 sticky top-0 z-10">
      <tr className="text-gray-700 text-xs">
        <th className="px-4 py-2">#</th>
        <th className="px-4 py-2">Name</th>
        <th className="px-4 py-2">Email</th>
        <th className="px-4 py-2">Phone</th>
        <th className="px-4 py-2">Job Role</th>
        <th className="px-4 py-2">Department</th>
        <th className="px-4 py-2">Salary</th>
        <th className="px-4 py-2">Status</th>
        <th className="px-4 py-2">Join Date</th>
        <th className="px-4 py-2 text-right">Actions</th>
      </tr>
    </thead>
    <tbody>
      {employees.length > 0 ? (
        employees.map((emp, index) => (
          <tr
            key={emp._id}
            className="bg-gray-100 text-xs  hover:bg-gray-200  transition rounded"
          >
            <td className="px-4 py-2">{index + 1}</td>

            {/* Truncate long text fields */}
            <td className="px-4 py-2 font-bold max-w-[140px] truncate" title={emp.name}>
              {emp.name}
            </td>
            <td className="px-4 py-2 max-w-[180px] truncate" title={emp.email}>
              {emp.email}
            </td>
            <td className="px-4 py-2 max-w-[120px] truncate" title={emp.phone}>
              {emp.phone}
            </td>
            <td className="px-4 py-2 max-w-[150px] truncate" title={emp.jobRole}>
              {emp.jobRole}
            </td>
            <td className="px-4 py-2 max-w-[150px] truncate" title={emp.department}>
              {emp.department}
            </td>

            <td className="px-4 py-2">₹{emp.salary}</td>
            <td className="px-4 py-2">{emp.status}</td>
            <td className="px-4 py-2">
              {new Date(emp.joinDate).toLocaleDateString()}
            </td>
            <td className="px-4 py-2 text-right flex justify-end gap-3">
              <Eye
                className="w-3 h-3 text-blue-500 cursor-pointer hover:text-blue-700"
                onClick={() => navigate(`/employee/${emp._id}`)}
              />
              <Pencil
                className="w-3 h-3 text-black cursor-pointer hover:text-green-700"
                onClick={() => navigate(`/employee/${emp._id}/edit`)}
              />
              <Trash2
                className="w-3 h-3 text-red-500 cursor-pointer hover:text-red-700"
                onClick={() => handleDelete(emp._id)}
              />
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan="9"
            className="text-center py-4 text-gray-500 italic bg-white shadow-sm rounded"
          >
            No employees found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </Layout>
  );
}
