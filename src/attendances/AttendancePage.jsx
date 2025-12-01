// src/pages/attendance/MainAttendancePage.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AttendanceFilter from "./AttendanceFilter";
import AttendanceTable from "./AttendanceTable";
import { getWorkSchedules, getAttendance, checkIn, checkOut, deleteAttendance } from "../utils/api";

export default function MainAttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [filters, setFilters] = useState({ employeeId: "", status: "", date: "" });
  const [loading, setLoading] = useState(false);

  // Fetch employees from WorkSchedule
  const fetchEmployees = async () => {
    try {
      const data = await getWorkSchedules();
      const emps = (data.data || [])
        .filter(s => s.employeeId)
        .map(s => ({
          _id: s.employeeId._id,
          name: s.employeeId.name,
          avatar: s.employeeId.avatar || "/default-avatar.png",
          employeeCode: s.employeeId.employeeCode,
        }));
      setEmployees(emps);
    } catch (err) {
      console.error("Fetch Employees Error:", err);
      setEmployees([]);
    }
  };

  // Fetch attendance records
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.employeeId) params.employeeId = filters.employeeId;
      if (filters.status) params.status = filters.status;
      if (filters.date) {
        params.startDate = filters.date;
        params.endDate = filters.date;
      }
      const data = await getAttendance(params);
      setAttendanceList(data.data || []);
    } catch (err) {
      console.error("Fetch Attendance Error:", err);
      setAttendanceList([]);
    } finally {
      setLoading(false);
    }
  };

  // Check-in selected employee
  const handleCheckIn = async () => {
    if (!selectedEmployee) return alert("⚠️ Please select an employee!");
    try {
      await checkIn(selectedEmployee);
      setSelectedEmployee("");
      fetchAttendance();
      alert("✅ Check-in recorded!");
    } catch (err) {
      console.error(err);
      alert("❌ Check-in failed");
    }
  };

  // Check-out callback (table se)
  const handleCheckOut = async (employeeId) => {
    try {
      await checkOut(employeeId);
      fetchAttendance();
      alert("✅ Check-out recorded!");
    } catch (err) {
      console.error(err);
      alert("❌ Check-out failed");
    }
  };

  // Delete callback (table se)
  const handleDelete = async (id) => {
    try {
      await deleteAttendance(id);
      fetchAttendance();
      alert("✅ Attendance deleted!");
    } catch (err) {
      console.error(err);
      alert("❌ Delete failed");
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  return (
    <Layout>
      <div className="p-2 flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Daily Attendance</h2>

        {/* Select Employee + Check-In */}
        <div className="flex gap-2 items-center">
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="">-- Select Employee --</option>
            {employees.map(emp => (
              <option key={emp._id} value={emp._id}>
                {emp.name} ({emp.employeeCode})
              </option>
            ))}
          </select>
          <button
            onClick={handleCheckIn}
            className="bg-green-500 text-white px-3 py-1 rounded text-sm"
          >
            Check In
          </button>
        </div>

        {/* Filter Component */}
        <AttendanceFilter
          filters={filters}
          setFilters={setFilters}
          employees={employees}
        />

        {/* Attendance Table */}
        <AttendanceTable
          attendanceList={attendanceList}
          loading={loading}
          onCheckOut={handleCheckOut}
          onDelete={handleDelete}
        />
      </div>
    </Layout>
  );
}
