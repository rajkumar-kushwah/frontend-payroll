import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { FaPlus, FaCheck, FaTimes, FaSearch, FaFilter, FaTrash, FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  getEmployees,
  getAttendance,
  addAttendance,
  checkIn,
  checkOut,
  deleteAttendance,
  filterAttendance,
} from "../utils/api";

export default function AttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("present");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [checkInTime, setCheckInTime] = useState("");
  const [checkOutTime, setCheckOutTime] = useState("");
  const [remarks, setRemarks] = useState("");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [showForm, setShowForm] = useState(false); // Collapse/expand form

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees();
      const empArray = res.employees || [];
      const sorted = empArray.sort((a, b) => {
        const numA = parseInt(a.employeeCode?.replace("EMP-", "")) || 0;
        const numB = parseInt(b.employeeCode?.replace("EMP-", "")) || 0;
        return numA - numB;
      });
      setEmployees(sorted);
    } catch (err) {
      console.error("Failed to fetch employees", err);
      setEmployees([]);
      alert("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await getAttendance();
      const list = Array.isArray(res.data) ? res.data : res.data?.records || [];
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

  const handleSearch = async () => {
    try {
      const res = await filterAttendance({ employeeName: search });
      const list = Array.isArray(res.records) ? res.records : [];
      setAttendanceList(list);
    } catch (err) {
      console.error("Filter failed:", err);
    }
  };

  const handleAddAttendance = async () => {
    if (!selectedEmployee) return alert("Select an employee");
    try {
      const today = date;
      const checkInISO = checkInTime ? new Date(`${today}T${checkInTime}`).toISOString() : new Date().toISOString();
      const checkOutISO = checkOutTime ? new Date(`${today}T${checkOutTime}`).toISOString() : null;

      await addAttendance({
        employeeId: selectedEmployee,
        date: today,
        status,
        checkIn: checkInISO,
        checkOut: checkOutISO,
        remarks,
      });

      setSelectedEmployee("");
      setStatus("present");
      setCheckInTime("");
      setCheckOutTime("");
      setRemarks("");
      setDate(new Date().toISOString().split("T")[0]);
      fetchAttendance();
    } catch (err) {
      console.error("Add attendance failed:", err);
      alert(err?.response?.data?.message || "Failed to add attendance");
    }
  };

  const handleCheckIn = async (employeeId) => {
    try {
      await checkIn({ employeeId });
      alert("Checked in successfully!");
      fetchAttendance();
    } catch (err) {
      alert(err?.response?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async (employeeId) => {
    try {
      await checkOut({ employeeId });
      alert("Checked out successfully!");
      fetchAttendance();
    } catch (err) {
      alert(err?.response?.data?.message || "Check-out failed");
    }
  };

  const handleDeleteSelected = async () => {
    if (!selectedRecords.length) return alert("Select records to delete");
    if (!confirm("Are you sure you want to delete selected records?")) return;
    try {
      for (let id of selectedRecords) {
        await deleteAttendance(id);
      }
      alert("Deleted successfully!");
      setSelectedRecords([]);
      fetchAttendance();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRecords(attendanceList.map(att => att._id));
    } else {
      setSelectedRecords([]);
    }
  };

  return (
    <Layout>
      <div className="p-2 text-xs">

        {/* ---------------- TOP BAR ---------------- */}
        <div className="flex justify-between items-center mb-2 gap-2 flex-wrap">
          <div>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
          <div className="flex gap-1 items-center flex-wrap">
            <FaSearch className="cursor-pointer" onClick={() => setShowSearch(!showSearch)} />
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
            <button onClick={() => setShowForm(!showForm)} className="bg-yellow-500 text-white p-1 rounded text-xs ml-1 flex items-center gap-1">
              {showForm ? <FaChevronUp /> : <FaChevronDown />} Attendance Form
            </button>
            <button onClick={handleDeleteSelected} className="bg-red-600 text-white p-1 rounded text-xs ml-1 flex items-center gap-1">
              <FaTrash /> Delete Selected
            </button>
          </div>
        </div>

        {/* ---------------- COLLAPSIBLE MANUAL ATTENDANCE FORM ---------------- */}
        {showForm && (
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
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="border p-1 rounded w-full text-xs"
              />
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
        )}

        {/* ---------------- ATTENDANCE TABLE ---------------- */}
        <div className="overflow-x-auto bg-white rounded shadow text-xs max-h-[60vh]">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-1">
                  <input
                    type="checkbox"
                    checked={selectedRecords.length === attendanceList.length && attendanceList.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                {["Employee", "Code", "Date", "Status", "Check In", "Check Out", "Total Hours", "Remarks", "Actions"].map(h => (
                  <th key={h} className="p-1">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center p-2">Loading...</td></tr>
              ) : attendanceList.length ? (
                attendanceList.map(att => {
                  const checkInDate = att.checkIn ? new Date(att.checkIn) : null;
                  const checkOutDate = att.checkOut ? new Date(att.checkOut) : null;
                  const totalHours = checkInDate && checkOutDate ? ((checkOutDate - checkInDate) / (1000*60*60)).toFixed(2) : "-";
                  const recordDate = att.date ? new Date(att.date).toLocaleDateString() : "-";

                  return (
                    <tr key={att._id} className="hover:bg-gray-50">
                      <td className="p-1">
                        <input
                          type="checkbox"
                          checked={selectedRecords.includes(att._id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedRecords([...selectedRecords, att._id]);
                            } else {
                              setSelectedRecords(selectedRecords.filter(id => id !== att._id));
                            }
                          }}
                        />
                      </td>
                      <td className="p-1">{att.employeeId?.name || "-"}</td>
                      <td className="p-1">{att.employeeId?.employeeCode || "-"}</td>
                      <td className="p-1">{recordDate}</td>
                      <td className="p-1">{att.status}</td>
                      <td className="p-1">{checkInDate ? checkInDate.toLocaleTimeString() : "-"}</td>
                      <td className="p-1">{checkOutDate ? checkOutDate.toLocaleTimeString() : "-"}</td>
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
