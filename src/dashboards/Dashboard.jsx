import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api, { getEmployees } from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FaUsers } from "react-icons/fa";
import {
  Users,

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

  // ----------------------------
  // MAIN FETCH FUNCTION
  // ----------------------------
  const fetchData = async () => {
    try {
      const [eRes, pRes] = await Promise.allSettled([
        api.get("/employees"),
        api.get("/payrolls"),
      ]);

      const allEmployees =
        eRes.status === "fulfilled" ? eRes.value.data : [];

      const payrolls =
        pRes.status === "fulfilled" ? pRes.value.data.length : 0;

      // -------- SORT EMPLOYEES BY EMP-XXX --------
      const sortedEmployees = allEmployees.sort((a, b) => {
        const numA = parseInt(a.employeeCode.replace("EMP-", ""));
        const numB = parseInt(b.employeeCode.replace("EMP-", ""));
        return numA - numB;
      });

      setEmployees(sortedEmployees);

      // -------- CALCULATE TOTAL SALARY --------
      const totalSalary = allEmployees.reduce(
        (acc, emp) => acc + (emp.salary || 0),
        0
      );

      // -------- DASHBOARD STATS --------
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

  // ----------------------------
  // INITIAL FETCH
  // ----------------------------
  useEffect(() => {
    fetchData();

    window.addEventListener("employeeAdded", fetchData);
    window.addEventListener("salaryAdded", fetchData);

    return () => {
      window.removeEventListener("employeeAdded", fetchData);
      window.removeEventListener("salaryAdded", fetchData);
    };
  }, []);

  // ----------------------------
  // DELETE HANDLER
  // ----------------------------
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
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
      <Users className="text-black w-5 h-5 drop-shadow-[0_2px_0_rgba(16,185,129,1)]" />

      {user?.name && (
        <h1 className="text-xl font-bold mb-4 text-black">
          <span className="ai-text-gradient">Welcome, </span>
          {user.name}
        </h1>
      )}

      
      {/* Stats Section */}
<div className="grid grid-cols-3 sm:grid-cols-8 gap-2 mb-4">
  {/* Card 1: Total Employees */}
  <div className="bg-gray-50 p-3 rounded shadow text-center hover:bg-gray-100 transition-transform duration-200 md:hover:-translate-y-1">
    <div className="flex items-center justify-center gap-1">
      <FaUsers className="text-black w-5 h-5" />  
      <span className="text-xs text-gray-600 font-medium">Employees</span>
    </div>
    <div className="text-sm font-bold text-lime-300 mt-1">{stats.employees}</div>
  </div>

  {/* Card 2: Total Salary */}
  <div className="bg-gray-50 p-3 rounded shadow text-center hover:bg-gray-100 transition-transform duration-200 md:hover:-translate-y-1">
    <div className="flex items-center justify-center gap-1">
      <IndianRupee className="text-blue-400 w-5 h-5" />
      <span className="text-xs text-gray-600 font-medium">Salary</span>
    </div>
    <div className="text-sm font-bold text-blue-400 mt-1">₹{stats.totalSalary}</div>
  </div>

  {/* Card 3: Leaves */}
  <div className="bg-gray-50 p-3 rounded shadow text-center hover:bg-gray-100 transition-transform duration-200 md:hover:-translate-y-1">
    <div className="flex items-center justify-center gap-1">
      <CalendarCheck className="text-yellow-400 w-5 h-5" />
      <span className="text-xs text-gray-600 font-medium">Leaves</span>
    </div>
    <div className="text-sm font-bold text-yellow-400 mt-1">{stats.leaves}</div>
  </div>

  {/* Card 4: Pending Reports */}
  <div className="bg-gray-50 p-3 rounded shadow text-center hover:bg-gray-100 transition-transform duration-200 md:hover:-translate-y-1">
    <div className="flex items-center justify-center gap-1">
      <FileClock className="text-red-400 w-5 h-5" />
      <span className="text-xs text-gray-600 font-medium">Reports</span>
    </div>
    <div className="text-sm font-bold text-red-400 mt-1">{stats.reports}</div>
  </div>
</div>


      {/* Buttons */}
      <div className="flex justify-end mb-4 gap-3">
        <button
          className="bg-lime-400 text-white px-2 py-1.5 font-light text-xs sm:px-3 sm:py-2 sm:text-xs rounded hover:bg-lime-500 transition"
          onClick={() => navigate("/employee/add")}
        >
          + Add employee
        </button>
        <button
          className="bg-gray-500 text-white px-2 py-1.5 font-light text-xs sm:px-3 sm:py-2 sm:text-xs rounded hover:bg-gray-600 transition"
          onClick={() => navigate("/employees")}
        >
          View All
        </button>
      </div>

      {/* Table Header */}
      <div className="flex font-light text-gray-700 gap-1 ">
        <Home className="w-4 h-4" />
        <span className="text-xs p-0.5">Users</span>
      </div>

      {/* Employee Table */}
      <div className="p-1 overflow-x-auto overflow-y-auto max-h-[400px]">
        <table className="min-w-full text-sm text-left border-separate border-spacing-y-1">
          <thead className="bg-gray-100 sticky top-0 z-10">
            <tr className="text-gray-700 text-xs">
              <th className="px-4 py-2">Emp ID</th>
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
              employees.map((emp) => (
                <tr
                  key={emp._id}
                  className="bg-gray-100 text-xs hover:bg-gray-200 transition rounded"
                >
                  <td className="px-4 py-2">{emp.employeeCode}</td>
                  <td
                    className="px-4 py-2 font-bold max-w-[140px] truncate"
                    title={emp.name}
                  >
                    {emp.name}
                  </td>
                  <td
                    className="px-4 py-2 max-w-[180px] truncate"
                    title={emp.email}
                  >
                    {emp.email}
                  </td>
                  <td
                    className="px-4 py-2 max-w-[120px] truncate"
                    title={emp.phone}
                  >
                    {emp.phone}
                  </td>
                  <td
                    className="px-4 py-2 max-w-[150px] truncate"
                    title={emp.jobRole}
                  >
                    {emp.jobRole}
                  </td>
                  <td
                    className="px-4 py-2 max-w-[150px] truncate"
                    title={emp.department}
                  >
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
                  colSpan="10"
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
