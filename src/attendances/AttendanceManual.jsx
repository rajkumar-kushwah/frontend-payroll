// src/pages/attendance/AttendancePage.jsx
import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import { getEmployees, getAttendance, checkIn, checkOut, deleteAttendance } from "../utils/api";
import { FaTrash, FaCheck } from "react-icons/fa";

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Default office time (can later fetch from backend)
  const OFFICE_START = "09:30"; // 9:30 AM
  const OFFICE_END = "18:30";   // 6:30 PM

  // ================= FETCH EMPLOYEES & ATTENDANCE =================
  const loadAll = async () => {
    try {
      const emp = await getEmployees();
      const att = await getAttendance();
      setEmployees(emp.employees || []);
      const filtered = (Array.isArray(att.data) ? att.data : att.data?.records || [])
        .filter(a => a.checkIn);
      setAttendanceList(filtered);
    } catch (err) {
      console.error(err);
      setEmployees([]);
      setAttendanceList([]);
    }
  };

  useEffect(() => { loadAll(); }, []);

  // ================= CLICK OUTSIDE DROPDOWN =================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ================= CHECK-IN =================
  const handleCheckIn = async () => {
    if (!selectedEmployee) {
      return alert("⚠️ Please select an employee first!");
    }

    // Check if attendance already exists today
    const todayStr = new Date().toISOString().slice(0, 10);
    const existing = attendanceList.find(a => 
      a.employeeId?._id === selectedEmployee && a.date?.startsWith(todayStr)
    );

    if (existing) {
      return alert("⚠️ Attendance already recorded for today!");
    }

    // Optional: Validate office time (just an example)
    if (!OFFICE_START || !OFFICE_END) {
      return alert("⚠️ Office start/end time is not set. Cannot check-in.");
    }

    try {
      await checkIn(selectedEmployee);
      setSelectedEmployee("");
      loadAll();
      alert("✅ Check-in recorded successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Check-in failed. Try again.");
    }
  };

  // ================= CHECK-OUT =================
  const handleCheckOut = async (employeeId) => {
    if (!employeeId) return alert("⚠️ Employee ID missing!");
    try {
      await checkOut(employeeId);
      loadAll();
      alert("✅ Check-out recorded successfully!");
    } catch {
      alert("❌ Check-out failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await deleteAttendance(id);
      loadAll();
      alert("✅ Attendance deleted!");
    } catch {
      alert("❌ Delete failed");
    }
  };

  // ================= CALCULATE HOURS & OVERTIME =================
  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime) return { total: "-", overtime: "-" };

    const start = new Date(inTime);
    const end = new Date(outTime);

    const diffMs = end - start;
    if (diffMs < 0) return { total: "-", overtime: "-" };

    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const fixedEnd = new Date(start);
    fixedEnd.setHours(18, 30, 0, 0);
    let overtimeMinutes = 0;
    if (end > fixedEnd) overtimeMinutes = Math.floor((end - fixedEnd) / 60000);

    const oh = Math.floor(overtimeMinutes / 60);
    const om = overtimeMinutes % 60;

    return {
      total: `${hours}:${String(minutes).padStart(2,"0")}`,
      overtime: overtimeMinutes > 0 ? `${oh}:${String(om).padStart(2,"0")}` : "0:00"
    };
  };

  // ================= FORMAT TIME 12-HOUR =================
  const formatTime12 = (time) => {
    if (!time) return "-";
    return new Date(time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  };

  return (
    <Layout>
      <div className="p-2 flex flex-col gap-3">
        <h2 className="text-left text-sm font-semibold mb-2">Attendance Report</h2>

        {/* Employee Dropdown + Check-in */}
        <div className="flex gap-2 items-center mb-2">
          <div ref={dropdownRef} className="relative w-48">
            <div
              className="flex items-center justify-between border border-gray-300 rounded px-2 py-1 text-xs cursor-pointer bg-white"
              onClick={() => setDropdownOpen(prev => !prev)}
            >
              <span>{selectedEmployee ? employees.find(e => e._id === selectedEmployee)?.name : "-- Select Employee --"}</span>
            </div>
            {dropdownOpen && (
              <ul className="absolute z-50 mt-1 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto text-xs">
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => { setSelectedEmployee(""); setDropdownOpen(false); }}
                >
                  -- Select Employee --
                </li>
                {employees.map(emp => (
                  <li
                    key={emp._id}
                    className="p-1 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => { setSelectedEmployee(emp._id); setDropdownOpen(false); }}
                  >
                    <img src={emp.avatar || "/default-avatar.png"} className="w-5 h-5 rounded-full"/>
                    <span>{emp.name} ({emp.employeeCode})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={handleCheckIn}
            className="bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
          >
            <FaCheck size={12}/> Check In
          </button>
        </div>

        {/* Attendance Table */}
        <div className="overflow-auto rounded border border-gray-200">
          <table className="w-full text-xs">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 text-left">Employee</th>
                <th className="p-2">Date</th>
                <th className="p-2">Status</th>
                <th className="p-2">In</th>
                <th className="p-2">Out</th>
                <th className="p-2">Total Hours</th>
                <th className="p-2">Overtime</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.length ? attendanceList.map(item => {
                const { total, overtime } = calculateHours(item.checkIn, item.checkOut);
                return (
                  <tr key={item._id} className="border-t hover:bg-gray-50">
                    <td className="p-2 flex items-center gap-2">
                      <img src={item.employeeId?.avatar || "/default-avatar.png"} className="w-5 h-5 rounded-full"/>
                      <span>{item.employeeId?.name}</span>
                    </td>
                    <td className="p-2">{item.date ? new Date(item.date).toLocaleDateString() : "-"}</td>
                    <td className="p-2">{item.status || "-"}</td>
                    <td className="p-2">{formatTime12(item.checkIn)}</td>
                    <td className="p-2">{formatTime12(item.checkOut)}</td>
                    <td className="p-2">{total}</td>
                    <td className="p-2">{overtime}</td>
                    <td className="p-2 flex gap-1">
                      {!item.checkOut && (
                        <button
                          onClick={() => handleCheckOut(item.employeeId?._id)}
                          className="bg-blue-500 text-white p-1 rounded text-[10px]"
                        >
                          Out
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white p-1 rounded text-[10px]"
                      >
                        <FaTrash size={10}/>
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="8" className="text-center p-3">No Records</td></tr>
              )}
            </tbody>
          </table>
        </div>

      </div>
    </Layout>
  );
}
