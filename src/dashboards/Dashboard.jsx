import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaClipboardList,
  FaFileInvoiceDollar,
  FaCalendarAlt,
} from "react-icons/fa";
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

  /* ---------------- Charts State ---------------- */

  const [statusChart, setStatusChart] = useState({
    labels: ["Active", "Inactive", "Pending"],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ["#34D399", "#F87171", "#FBBF24"],
      },
    ],
  });

  const [reportChart, setReportChart] = useState({
    labels: [],
    datasets: [
      {
        label: "Reports",
        data: [],
        borderColor: "#B45309",
        backgroundColor: "#FBBF24",
        fill: false,
      },
    ],
  });

  const [attendanceChart, setAttendanceChart] = useState({
    labels: ["Present", "Half-Day", "Absent"],
    datasets: [
      {
        label: "Attendance",
        data: [0, 0, 0],
        backgroundColor: ["#3B82F6", "#FBBF24", "#F87171"],
      },
    ],
  });

  const [salaryChart, setSalaryChart] = useState({
    labels: ["Paid", "Pending"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#10B981", "#F59E0B"],
      },
    ],
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { font: { size: 9 } } },
    },
  };

  /* ---------------- Fetch Dashboard Data ---------------- */

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Employees
      const empRes = await api.get("/employees");
      const empData = empRes.data.employees || empRes.data || [];
      setEmployees(empData);

      // Attendance
      const attRes = await api.get("/attendance");
      const attData = attRes.data.data || [];
      setAttendanceList(attData);

      /* -------- LocalStorage Payroll Export Logs -------- */
      const reportLogs =
        JSON.parse(localStorage.getItem("reportLogs")) || [];

      const exportCountByEmployee = {};
      reportLogs.forEach((log) => {
        if (log.type === "payroll-pdf") {
          exportCountByEmployee[log.employeeId] =
            (exportCountByEmployee[log.employeeId] || 0) + 1;
        }
      });

      /* ---------------- Stats ---------------- */

      const backendReports = empData.reduce(
        (sum, e) => sum + (e.reports?.length || 0),
        0
      );

      const exportReports = reportLogs.length;

      const presentCount = attData.filter(
        (a) => a.status === "present"
      ).length;
      const halfDayCount = attData.filter(
        (a) => a.status === "half-day"
      ).length;

      const salaryPaidCount = empData.filter(
        (e) => e.paymentStatus === "paid"
      ).length;

      setStats({
        employees: empData.length,
        reports: backendReports + exportReports,
        attendance: presentCount + halfDayCount,
        salaryPaid: salaryPaidCount,
      });

      /* ---------------- Status Chart ---------------- */

      setStatusChart({
        ...statusChart,
        datasets: [
          {
            ...statusChart.datasets[0],
            data: [
              empData.filter((e) => e.status === "active").length,
              empData.filter((e) => e.status === "inactive").length,
              empData.filter((e) => e.status === "pending").length,
            ],
          },
        ],
      });

      /* ---------------- Reports Chart (FIXED) ---------------- */

      setReportChart({
        labels: empData.map((e) => e.name),
        datasets: [
          {
            ...reportChart.datasets[0],
            data: empData.map(
              (e) =>
                (e.reports?.length || 0) +
                (exportCountByEmployee[e._id] || 0)
            ),
          },
        ],
      });

      /* ---------------- Attendance Chart ---------------- */

      setAttendanceChart({
        ...attendanceChart,
        datasets: [
          {
            ...attendanceChart.datasets[0],
            data: [
              presentCount,
              halfDayCount,
              empData.length - presentCount - halfDayCount,
            ],
          },
        ],
      });

      /* ---------------- Salary Chart ---------------- */

      setSalaryChart({
        ...salaryChart,
        datasets: [
          {
            ...salaryChart.datasets[0],
            data: [
              salaryPaidCount,
              empData.length - salaryPaidCount,
            ],
          },
        ],
      });
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* ---------------- UI ---------------- */

  return (
    <Layout>
      <h1 className="text-sm font-semibold mb-2">
        Welcome, {user?.name || "User"}
      </h1>

      {/* Buttons */}
      <div className="flex justify-end gap-1.5 mb-2">
        <button
          onClick={() => navigate("/employee/add")}
          className="bg-blue-600 p-1 rounded cursor-pointer text-white text-[9px]"
        >
          + Create
        </button>
        <button
          onClick={() => navigate("/employees")}
          className="bg-white p-1  rounded cursor-pointer text-blue-600 text-[9px]"
        >
          All
        </button>
        <button
          onClick={() => navigate("/attendance-page")}
          className="bg-green-600 p-1 rounded cursor-pointer text-white text-[9px]"
        >
          Attendance
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-4 gap-1 mb-2 text-center text-[9px]">
        <div className="bg-green-50 p-1 rounded">
          <FaUsers className="mx-auto text-green-600" />
          <div className="font-bold">{stats.employees}</div>
          Employees
        </div>
        <div className="bg-purple-50 p-1 rounded">
          <FaClipboardList className="mx-auto text-purple-600" />
          <div className="font-bold">{stats.reports}</div>
          Reports
        </div>
        <div className="bg-blue-50 p-1 rounded">
          <FaCalendarAlt className="mx-auto text-blue-600" />
          <div className="font-bold">{stats.attendance}</div>
          Attendance
        </div>
        <div className="bg-yellow-50 p-1 rounded">
          <FaFileInvoiceDollar className="mx-auto text-yellow-600" />
          <div className="font-bold">{stats.salaryPaid}</div>
          Salary Paid
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-white p-1 h-[160px]">
          <Doughnut data={statusChart} options={chartOptions} />
        </div>
        <div className="bg-white p-1 h-[160px]">
          <Line data={reportChart} options={chartOptions} />
        </div>
        <div className="bg-white p-1 h-[160px]">
          <Bar data={attendanceChart} options={chartOptions} />
        </div>
        <div className="bg-white p-1 h-[160px]">
          <Pie data={salaryChart} options={chartOptions} />
        </div>
      </div>
    </Layout>
  );
}
