// src/dashboards/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaRupeeSign, FaFileInvoiceDollar, FaClipboardList } from "react-icons/fa";
import { Pie, Bar } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { useUser } from "../context/UserContext";

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    employees: 0,
    totalSalary: 0,
    reports: 0,
    tasksComplete: 0,
    paymentsPaid: 0,
  });

  // ----------------------------- Charts -----------------------------
  const [statusChart, setStatusChart] = useState({
    labels: ["Active", "Inactive", "Pending"],
    datasets: [{ data: [0, 0, 0], backgroundColor: ["#34D399", "#F87171", "#FBBF24"] }],
  });

  const [taskChart, setTaskChart] = useState({
    labels: ["Complete", "Incomplete"],
    datasets: [{ data: [0, 0], backgroundColor: ["#34D399", "#F87171"] }],
  });

  const [salaryChart, setSalaryChart] = useState({
    labels: [],
    datasets: [{ label: "Salary", data: [], backgroundColor: "#3B82F6" }],
  });

  const [reportChart, setReportChart] = useState({
    labels: [],
    datasets: [{ label: "Reports", data: [], backgroundColor: "#FBBF24" }],
  });

  const [slipChart, setSlipChart] = useState({
    labels: ["Issued", "Pending"],
    datasets: [{ data: [0, 0], backgroundColor: ["#3B82F6", "#F87171"] }],
  });

  // ----------------------------- Fetch Data -----------------------------
  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees");
      const data = res.data.employees || res.data || [];
      setEmployees(data);

      // Stats
      const totalSalary = data.reduce((acc, emp) => acc + (emp.salary || 0), 0);
      const reports = data.reduce((acc, emp) => acc + (emp.reports?.length || 0), 0);
      const tasksComplete = data.filter((e) => e.tasksCompleted).length;
      const paymentsPaid = data.filter((e) => e.paymentStatus === "paid").length;

      setStats({ employees: data.length, totalSalary, reports, tasksComplete, paymentsPaid });

      // Status Chart
      const active = data.filter((e) => e.status === "active").length;
      const inactive = data.filter((e) => e.status === "inactive").length;
      const pending = data.filter((e) => e.status === "pending").length;
      setStatusChart({ ...statusChart, datasets: [{ ...statusChart.datasets[0], data: [active, inactive, pending] }] });

      // Task Chart
      setTaskChart({ ...taskChart, datasets: [{ ...taskChart.datasets[0], data: [tasksComplete, data.length - tasksComplete] }] });

      // Salary Chart
      setSalaryChart({ labels: data.map((e) => e.name), datasets: [{ ...salaryChart.datasets[0], data: data.map((e) => e.salary || 0) }] });

      // Report Chart
      setReportChart({ labels: data.map((e) => e.name), datasets: [{ ...reportChart.datasets[0], data: data.map((e) => e.reports?.length || 0) }] });

      // Slip Chart
      const issued = data.filter((e) => e.paySlipIssued).length;
      const pendingSlip = data.length - issued;
      setSlipChart({ ...slipChart, datasets: [{ ...slipChart.datasets[0], data: [issued, pendingSlip] }] });

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    await api.delete(`/employees/${id}`);
    fetchEmployees();
  };

  return (
    <Layout>
      <h1 className="text-sm font-semibold mb-2">Welcome, {user?.name || "User"}</h1>

      {/* Top Buttons */}
      <div className="flex justify-end gap-1 mb-2">
        <button onClick={() => navigate("/employee/add")} className="bg-blue-600 p-1 rounded text-white text-[9px]">+ Create</button>
        <button onClick={() => navigate("/employee/filter")} className="p-1 rounded border text-[9px]">Filter</button>
        <button onClick={() => navigate("/employees")} className="bg-white p-1 rounded text-blue-600 text-[9px]">All</button>
      </div>

      {/* Small Cards */}
      <div className="grid grid-cols-5 gap-1 mb-2 text-center text-[9px]">
        <div className="bg-green-50 p-1 rounded shadow-sm">
          <FaUsers className="w-3 h-3 mx-auto text-green-600" />
          <div className="font-bold text-green-600">{stats.employees}</div>
          <div>Employees</div>
        </div>
        <div className="bg-blue-50 p-1 rounded shadow-sm">
          <FaRupeeSign className="w-3 h-3 mx-auto text-blue-600" />
          <div className="font-bold text-blue-600">₹{stats.totalSalary}</div>
          <div>Salary</div>
        </div>
        <div className="bg-yellow-50 p-1 rounded shadow-sm">
          <FaClipboardList className="w-3 h-3 mx-auto text-yellow-600" />
          <div className="font-bold text-yellow-600">{stats.tasksComplete}</div>
          <div>Tasks</div>
        </div>
        <div className="bg-red-50 p-1 rounded shadow-sm">
          <FaFileInvoiceDollar className="w-3 h-3 mx-auto text-red-600" />
          <div className="font-bold text-red-600">{stats.paymentsPaid}</div>
          <div>Paid</div>
        </div>
        <div className="bg-purple-50 p-1 rounded shadow-sm">
          <div className="text-purple-600 font-bold">{stats.reports}</div>
          <div>Reports</div>
        </div>
      </div>

      {/* Compact Charts */}
      <div className="grid grid-cols-3 gap-2 mb-2 text-[8px]">
        <div className="bg-white p-1 rounded shadow-sm">
          <h3 className="text-center mb-1">Employee Status</h3>
          <Pie data={statusChart} height={80} />
        </div>
        <div className="bg-white p-1 rounded shadow-sm">
          <h3 className="text-center mb-1">Tasks</h3>
          <Pie data={taskChart} height={80} />
        </div>
        <div className="bg-white p-1 rounded shadow-sm">
          <h3 className="text-center mb-1">Pay Slips</h3>
          <Pie data={slipChart} height={80} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2 text-[8px]">
        <div className="bg-white p-1 rounded shadow-sm">
          <h3 className="text-center mb-1">Salary Per Employee</h3>
          <Bar data={salaryChart} height={80} />
        </div>
        <div className="bg-white p-1 rounded shadow-sm">
          <h3 className="text-center mb-1">Reports Per Employee</h3>
          <Bar data={reportChart} height={80} />
        </div>
      </div>

      {/* Employee Table (Compact) */}
      <div className="overflow-x-auto max-h-[250px] text-[8px]">
        <table className="min-w-full border-separate border-spacing-y-1">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="px-1 py-0.5">Code</th>
              <th className="px-1 py-0.5">Name</th>
              <th className="px-1 py-0.5">Dept</th>
              <th className="px-1 py-0.5">Salary</th>
              <th className="px-1 py-0.5">Tasks</th>
              <th className="px-1 py-0.5">Payment</th>
              <th className="px-1 py-0.5">Reports</th>
              <th className="px-1 py-0.5 text-right">Act</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? employees.map(emp => (
              <tr key={emp._id} className="bg-gray-100 hover:bg-gray-200">
                <td className="px-1 py-0.5">{emp.employeeCode}</td>
                <td className="px-1 py-0.5">{emp.name}</td>
                <td className="px-1 py-0.5">{emp.department || "-"}</td>
                <td className="px-1 py-0.5">₹{emp.salary || 0}</td>
                <td className="px-1 py-0.5 text-center">{emp.tasksCompleted ? "C" : "I"}</td>
                <td className="px-1 py-0.5 text-center">{emp.paymentStatus === "paid" ? "Paid" : "Pending"}</td>
                <td className="px-1 py-0.5 text-center">{emp.reports?.length || 0}</td>
                <td className="px-1 py-0.5 text-right flex justify-end gap-1">
                  <button className="text-blue-500 text-[7px]" onClick={() => navigate(`/employee/${emp._id}`)}>V</button>
                  <button className="text-black text-[7px]" onClick={() => navigate(`/employee/${emp._id}/edit`)}>E</button>
                  <button className="text-red-500 text-[7px]" onClick={() => handleDelete(emp._id)}>D</button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="8" className="text-center py-1">No employees found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
