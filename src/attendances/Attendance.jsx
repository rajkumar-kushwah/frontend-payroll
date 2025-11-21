// client/pages/Attendance.jsx
import { useEffect, useState } from "react";
import { getEmployees, getAttendance, addAttendance, checkIn, checkOut, filterAttendance } from "../utils/api";
import Layout from "../components/Layout";
import { FaPlus, FaCheck, FaTimes, FaSearch, FaFilter } from "react-icons/fa";

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("present");
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [remarks, setRemarks] = useState("");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // ---------------- FETCH EMPLOYEES ----------------
  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      const empArray = Array.isArray(res.employees) ? res.employees : [];
      setEmployees(empArray);
    } catch (err) {
      console.error("Employees fetch failed:", err);
      setEmployees([]);
    }
  };

  // ---------------- FETCH ATTENDANCE ----------------
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await getAttendance();
      const list = Array.isArray(res.data) ? res.data : [];
      setAttendanceList(list);
    } catch (err) {
      console.error("Attendance fetch failed:", err);
      setAttendanceList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  // ---------------- FILTER ATTENDANCE ----------------
  const handleSearch = async () => {
    try {
      const res = await filterAttendance({ employeeName: search });
      const list = Array.isArray(res.records) ? res.records : [];
      setAttendanceList(list);
    } catch (err) {
      console.error("Filter failed:", err);
    }
  };

  // ---------------- ADD MANUAL ATTENDANCE ----------------
  const handleAddAttendance = async () => {
    if (!selectedEmployee) return alert("Select an employee");
    try {
      await addAttendance({
        employeeId: selectedEmployee,
        status,
        checkIn: checkInTime || new Date().toISOString(),
        checkOut: checkOutTime || null,
        remarks,
      });
      setSelectedEmployee("");
      setStatus("present");
      setCheckInTime("");
      setCheckOutTime("");
      setRemarks("");
      fetchAttendance();
    } catch (err) {
      console.error("Add attendance failed:", err);
    }
  };

  // ---------------- AUTO CHECK IN ----------------
  const handleCheckIn = async (employeeId) => {
    try {
      await checkIn({ employeeId });
      fetchAttendance();
    } catch (err) {
      console.error("Check in failed:", err);
    }
  };

  // ---------------- AUTO CHECK OUT ----------------
  const handleCheckOut = async (employeeId) => {
    try {
      await checkOut({ employeeId });
      fetchAttendance();
    } catch (err) {
      console.error("Check out failed:", err);
    }
  };

  return (
    <Layout>
      <div className="p-2 text-xs">

        {/* ---------------- TOP BAR ---------------- */}
        <div className="flex justify-between items-center mb-2 gap-2">
          <div>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
          <div className="flex gap-1 items-center">
            <FaSearch className="cursor-pointer" onClick={() => setShowSearch(!showSearch)} />
            <FaFilter className="cursor-pointer" />
            {showSearch && (
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search Employee"
                className="border p-1 rounded text-xs ml-1"
              />
            )}
            <button onClick={handleSearch} className="bg-blue-500 text-white p-1 rounded text-xs ml-1">Go</button>
          </div>
        </div>

        {/* ---------------- MANUAL ATTENDANCE FORM ---------------- */}
        <div className="bg-white rounded shadow p-2 mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label>Employee</label>
            <select
              value={selectedEmployee}
              onChange={e => setSelectedEmployee(e.target.value)}
              className="border p-1 rounded w-full text-xs"
            >
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.employeeCode})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="border p-1 rounded w-full text-xs"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
            </select>
          </div>

          <div>
            <label>Check In</label>
            <input
              type="time"
              value={checkInTime}
              onChange={e => setCheckInTime(e.target.value)}
              className="border p-1 rounded w-full text-xs"
            />
          </div>

          <div>
            <label>Check Out</label>
            <input
              type="time"
              value={checkOutTime}
              onChange={e => setCheckOutTime(e.target.value)}
              className="border p-1 rounded w-full text-xs"
            />
          </div>

          <div className="sm:col-span-2">
            <label>Remarks</label>
            <input
              type="text"
              value={remarks}
              onChange={e => setRemarks(e.target.value)}
              className="border p-1 rounded w-full text-xs"
            />
          </div>

          <button
            onClick={handleAddAttendance}
            className="bg-green-500 text-white p-1 rounded text-xs sm:col-span-2 flex items-center justify-center gap-1"
          >
            <FaPlus /> Add Attendance
          </button>
        </div>

        {/* ---------------- ATTENDANCE TABLE ---------------- */}
        <div className="overflow-x-auto bg-white rounded shadow text-xs max-h-[60vh]">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {["Employee", "Code", "Status", "Check In", "Check Out", "Right Work Day", "Total Hours", "Remarks", "Actions"].map(h => (
                  <th key={h} className="p-1">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center p-2">Loading...</td></tr>
              ) : attendanceList.length ? (
                attendanceList.map(att => {
                  const checkInTime = att.checkIn ? new Date(att.checkIn) : null;
                  const checkOutTime = att.checkOut ? new Date(att.checkOut) : null;
                  const totalHours = checkInTime && checkOutTime ? ((checkOutTime - checkInTime) / (1000*60*60)).toFixed(2) : "-";

                  return (
                    <tr key={att._id} className="hover:bg-gray-50">
                      <td className="p-1">{att.employeeId?.name}</td>
                      <td className="p-1">{att.employeeId?.employeeCode}</td>
                      <td className="p-1">{att.status}</td>
                      <td className="p-1">{checkInTime ? checkInTime.toLocaleTimeString() : "-"}</td>
                      <td className="p-1">{checkOutTime ? checkOutTime.toLocaleTimeString() : "-"}</td>
                      <td className="p-1">{att.status === "present" ? 1 : 0}</td>
                      <td className="p-1">{totalHours}</td>
                      <td className="p-1">{att.remarks || "-"}</td>
                      <td className="p-1 flex gap-1">
                        <button
                          onClick={() => handleCheckIn(att.employeeId?._id)}
                          className="bg-green-500 text-white p-1 rounded text-[10px] flex items-center gap-1"
                        >
                          <FaCheck /> In
                        </button>
                        <button
                          onClick={() => handleCheckOut(att.employeeId?._id)}
                          className="bg-red-500 text-white p-1 rounded text-[10px] flex items-center gap-1"
                        >
                          <FaTimes /> Out
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="9" className="text-center p-2">No Attendance Records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
