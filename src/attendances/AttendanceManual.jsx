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

  // ================= FETCH EMPLOYEES & ATTENDANCE =================
  const loadAll = async () => {
    try {
      const emp = await getEmployees();
      const att = await getAttendance();
      setEmployees(emp.employees || []);
      const filtered = (Array.isArray(att.data) ? att.data : att.data?.records || [])
        .filter(a => a.checkIn); // sirf check-in wale records
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
    if (!selectedEmployee) return alert("Select an employee");
    try {
      await checkIn(selectedEmployee);
      setSelectedEmployee("");
      loadAll();
    } catch (err) {
      console.error(err);
      alert("Check-in failed");
    }
  };

  // ================= CHECK-OUT =================
  const handleCheckOut = async (employeeId) => {
    try {
      await checkOut(employeeId);
      loadAll();
    } catch (err) {
      console.error(err);
      alert("Check-out failed");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await deleteAttendance(id);
      loadAll();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  // ================= CALCULATE HOURS & OVERTIME =================
  const calculateHours = (inTime, outTime) => {
    if (!inTime) return { total: "-", overtime: "-" };
    const start = new Date(inTime);
    const end = outTime ? new Date(outTime) : new Date();
    let diffMs = end - start;
    if (diffMs < 0) return { total: "-", overtime: "-" };

    const totalMinutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const fixedEnd = new Date(start);
    fixedEnd.setHours(18, 30, 0, 0); // 6:30 PM
    let overtimeMinutes = 0;
    if (end > fixedEnd) overtimeMinutes = Math.floor((end - fixedEnd) / 60000);

    return {
      total: `${hours}:${String(minutes).padStart(2, "0")}`,
      overtime: `${Math.floor(overtimeMinutes / 60)}:${String(overtimeMinutes % 60).padStart(2, "0")}`
    };
  };

  return (
    <Layout>
      <div className="p-2 flex flex-col gap-3">

        {/* ================= PAGE HEADING ================= */}
        <h2 className="text-left text-sm font-semibold mb-2">Attendance Report</h2>

        {/* ================= SELECT EMPLOYEE + CHECK-IN ================= */}
        <div className="flex gap-2 items-center mb-2">
          <div ref={dropdownRef} className="relative w-48">
            <div
              className="flex items-center justify-between border border-gray-300 rounded px-2 py-1 text-xs cursor-pointer bg-transparent"
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

        {/* ================= ATTENDANCE TABLE ================= */}
        <div className="overflow-auto rounded border border-gray-200">
          <table className="w-full text-xs">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 text-left">Employee</th>
                <th className="p-2">Date</th>
                <th className="p-2">In</th>
                <th className="p-2">Out</th>
                <th className="p-2">Hours</th>
                <th className="p-2">OT</th>
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
                    <td className="p-2">{item.checkIn ? new Date(item.checkIn).toLocaleTimeString() : "-"}</td>
                    <td className="p-2">{item.checkOut ? new Date(item.checkOut).toLocaleTimeString() : "-"}</td>
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
                <tr><td colSpan="7" className="text-center p-3">No Records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
