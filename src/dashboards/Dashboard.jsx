// src/dashboards/Dashboard.jsx
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaClipboardList, FaFileInvoiceDollar, FaCalendarAlt } from "react-icons/fa";
import { Pie, Bar, Line, Doughnut } from "react-chartjs-2";
import Chart from "chart.js/auto";
import { useUser } from "../context/UserContext";

export default function Dashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    employees: 0,
    reports: 0,
    attendance: 0,
    salaryPaid: 0,
  });

  // ----------------------------- Charts -----------------------------
  const [statusChart, setStatusChart] = useState({
    labels: ["Active", "Inactive", "Pending"],
    datasets: [{ data: [0, 0, 0], backgroundColor: ["#34D399", "#F87171", "#FBBF24"], borderWidth: 1 }],
  });

  const [reportChart, setReportChart] = useState({
    labels: [],
    datasets: [{ label: "Reports", data: [], backgroundColor: "#FBBF24", borderColor: "#B45309", fill: false }],
  });

  const [attendanceChart, setAttendanceChart] = useState({
    labels: ["Present", "Half-Day", "Absent"],
    datasets: [{
      label: "Attendance",
      data: [0, 0, 0],
      borderColor: ["#3B82F6", "#FBBF24", "#F87171"],
      backgroundColor: ["#3B82F6", "#FBBF24", "#F87171"],
      fill: true
    }],
  });

  const [salaryChart, setSalaryChart] = useState({
    labels: ["Paid", "Pending"],
    datasets: [{ data: [0, 0], backgroundColor: ["#10B981", "#F59E0B"], borderWidth: 2 }],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { font: { size: 9 } },
      },
    },
    layout: { padding: 5 },
  };

  // ----------------------------- Fetch Data -----------------------------
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Employees
      const empRes = await api.get("/employees");
      const empData = empRes.data.employees || empRes.data || [];
      setEmployees(empData);

      // Attendance (from AttendancePage API)
      const attRes = await api.get("/attendance");
      const attData = attRes.data.data || [];
      setAttendanceList(attData);

      // ----------------- Stats -----------------
      const totalReports = empData.reduce((acc, emp) => acc + (emp.reports?.length || 0), 0);
      const salaryPaidCount = empData.filter(emp => emp.paymentStatus === "paid").length;

      const presentCount = attData.filter(a => a.status === "present").length;
      const halfDayCount = attData.filter(a => a.status === "half-day").length;

      setStats({
        employees: empData.length,
        reports: totalReports,
        attendance: presentCount + halfDayCount,
        salaryPaid: salaryPaidCount
      });

      // ----------------- Status Chart -----------------
      const active = empData.filter(e => e.status === "active").length;
      const inactive = empData.filter(e => e.status === "inactive").length;
      const pending = empData.filter(e => e.status === "pending").length;
      setStatusChart({ ...statusChart, datasets: [{ ...statusChart.datasets[0], data: [active, inactive, pending] }] });

      // ----------------- Report Chart -----------------
      setReportChart({
        labels: empData.map(e => e.name),
        datasets: [{
          ...reportChart.datasets[0],
          data: empData.map(e => e.reports?.length || 0)
        }]
      });

      // ----------------- Attendance Chart -----------------
      const absentCount = empData.length - presentCount - halfDayCount;
      setAttendanceChart({
        ...attendanceChart,
        datasets: [{
          ...attendanceChart.datasets[0],
          data: [presentCount, halfDayCount, absentCount]
        }]
      });

      // ----------------- Salary Chart -----------------
      const pendingSalary = empData.length - salaryPaidCount;
      setSalaryChart({
        ...salaryChart,
        datasets: [{
          ...salaryChart.datasets[0],
          data: [salaryPaidCount, pendingSalary]
        }]
      });

    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  return (
    <Layout>
      <h1 className="text-sm font-semibold mb-2">Welcome, {user?.name || "User"}</h1>

      {/* Top Buttons */}
      <div className="flex justify-end gap-1 mb-2">
        <button onClick={() => navigate("/employee/add")} className="bg-blue-600 p-1 rounded text-white text-[9px]">+ Create</button>
        <button onClick={() => navigate("/employees")} className="bg-white p-1 rounded text-blue-600 text-[9px]">All</button>
        <button onClick={() => navigate("/attendance-page")} className="bg-green-600 p-1 rounded text-white text-[9px]">Attendance</button>
      </div>

      {/* Small Cards */}
      <div className="grid grid-cols-4 gap-1 mb-2 text-center text-[9px]">
        <div className="bg-green-50 p-1 rounded shadow-sm">
          <FaUsers className="w-3 h-3 mx-auto text-green-600" />
          <div className="font-bold text-green-600">{stats.employees}</div>
          <div>Employees</div>
        </div>
        <div className="bg-purple-50 p-1 rounded shadow-sm">
          <FaClipboardList className="w-3 h-3 mx-auto text-purple-600" />
          <div className="text-purple-600 font-bold">{stats.reports}</div>
          <div>Reports</div>
        </div>
        <div className="bg-blue-50 p-1 rounded shadow-sm">
          <FaCalendarAlt className="w-3 h-3 mx-auto text-blue-600" />
          <div className="text-blue-600 font-bold">{stats.attendance}</div>
          <div>Attendance</div>
        </div>
        <div className="bg-yellow-50 p-1 rounded shadow-sm">
          <FaFileInvoiceDollar className="w-3 h-3 mx-auto text-yellow-600" />
          <div className="text-yellow-600 font-bold">{stats.salaryPaid}</div>
          <div>Salary Paid</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 text-[8px]">
        <div className="bg-white p-1 rounded shadow-sm" style={{ height: '160px' }}>
          <h3 className="text-center mb-0.5 text-[9px] font-semibold">Employee Status</h3>
          <Doughnut data={statusChart} options={{ ...chartOptions, layout: { padding: 10 } }} />
        </div>
        <div className="bg-white p-1 rounded shadow-sm" style={{ height: '160px' }}>
          <h3 className="text-center mb-0.5 text-[9px] font-semibold">Reports</h3>
          <Line data={reportChart} options={{ ...chartOptions, layout: { padding: 10 } }} />
        </div>
        <div className="bg-white p-1 rounded shadow-sm" style={{ height: '160px' }}>
          <h3 className="text-center mb-0.5 text-[9px] font-semibold">Attendance</h3>
          <Bar data={attendanceChart} options={{ ...chartOptions, layout: { padding: 10 } }} />
        </div>
        <div className="bg-white p-1 rounded shadow-sm" style={{ height: '160px' }}>
          <h3 className="text-center mb-0.5 text-[9px] font-semibold">Salary</h3>
          <Pie data={salaryChart} options={{ ...chartOptions, layout: { padding: 10 } }} />
        </div>
      </div>
    </Layout>
  );
}
