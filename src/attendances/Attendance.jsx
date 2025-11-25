import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import AttendanceForm from "./AttendanceForm";
import AttendanceFilter from "./AttendanceFilter";
import AttendanceActions from "./AttendanceActions";
import {
  getAttendance,
  getEmployees,
  deleteAttendance,
  checkIn
} from "../utils/api";
import { FaTrash, FaPlus, FaCheck } from "react-icons/fa";

export default function AttendanceMain() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // =================== FETCH EMPLOYEES ===================
  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.employees || []);
    } catch (err) {
      console.error(err);
    }
  };

  // =================== FETCH ATTENDANCE ===================
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await getAttendance();
      const list = Array.isArray(res.data) ? res.data : res.data?.records || [];
      setAttendanceList(list);
    } catch (err) {
      console.error(err);
      setAttendanceList([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  // =================== CLICK OUTSIDE DROPDOWN ===================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // =================== CHECK-IN ===================
  const handleCheckIn = async () => {
    if (!selectedEmployee) return alert("Select an employee");

    const emp = employees.find(e => e._id === selectedEmployee);
    if (!emp) return alert("Employee not added");

    // Check if employee already has attendance record today
    const alreadyChecked = attendanceList.some(a => a.employeeId?._id === selectedEmployee);
    if (alreadyChecked) return alert("This employee is already checked in");

    // Ensure employee has inTime set
    if (!emp.inTime) return alert("In time not set for this employee");

    try {
      await checkIn({ employeeId: selectedEmployee, inTime: emp.inTime });
      setSelectedEmployee("");
      fetchAttendance();
    } catch (err) {
      console.error(err);
      alert("Check-in failed");
    }
  };

  // =================== DELETE MULTIPLE ===================
  const handleDeleteSelected = async () => {
    if (!selectedRecords.length) return alert("Select records to delete");
    if (!confirm("Are you sure?")) return;

    for (let id of selectedRecords) {
      await deleteAttendance(id);
    }
    setSelectedRecords([]);
    fetchAttendance();
  };

  // =================== FORMAT TIME ===================
  const formatTime = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
  };

  // =================== CALCULATE HOURS ===================
  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime) return { total: "-", overtime: "-" };
    const start = new Date(inTime);
    const end = new Date(outTime);
    let diffMs = end - start;
    if (diffMs < 0) return { total: "-", overtime: "-" };

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalH = Math.floor(totalMinutes / 60);
    const totalM = totalMinutes % 60;
    const total = `${totalH}:${String(totalM).padStart(2, "0")}`;

    // Overtime = anything beyond employee's in-out difference?
    // If you have a separate overtime rule, you can modify here
    const overtime = "-"; // Placeholder for now, or calculate if needed

    return { total, overtime };
  };

  // =================================================================
  //                           UI START
  // =================================================================
  return (
    <Layout>
      <div className="p-2 text-xs">

        {/* ================= ACTIONS + FILTERS ================= */}
        <div className="flex flex-col md:flex-row md:justify-between  gap-2 relative">

          {/* ACTIONS & FILTERS */}
          <div className="mb-4 md:mb-0 md:absolute md:top-0 md:right-0  w-full md:w-auto">
            <h3 className="font-semibold mb-2 text-gray-700">Actions & Filters</h3>
            <div className="flex flex-wrap gap-2 items-center">
              <AttendanceFilter onFilter={setAttendanceList} />
              <button
                onClick={() => setShowForm(!showForm)}
                className="border p-1 rounded flex items-center gap-1"
              >
                <FaPlus className="text-blue-500" /> New
              </button>
              <button
                onClick={handleDeleteSelected}
                className="border p-1 rounded flex items-center gap-1"
              >
                <FaTrash className="text-red-500" /> Delete
              </button>
            </div>
          </div>

          {/* ADD ATTENDANCE FORM */}
          {showForm && (
            <div className="mb-4 border rounded-lg p-3 bg-white shadow-sm w-full md:w-auto">
              <AttendanceForm
                onAdd={() => { fetchAttendance(); setShowForm(false); }}
                onClose={() => setShowForm(false)}
                existingAttendance={attendanceList}
              />
            </div>
          )}
        </div>

        {/* ================= CHECK-IN PANEL ================= */}
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-700">Check-In Panel</h3>
          <div className="grid sm:grid-cols-3 gap-2">
            {/* Employee Dropdown */}
            <div ref={dropdownRef} className="relative">
              <label className="block mb-1 text-xs">Employee</label>
              <div
                onClick={() => setDropdownOpen(prev => !prev)}
                className="border p-1 rounded w-full text-xs bg-white cursor-pointer flex justify-between items-center z-20"
              >
                <span>{selectedEmployee ? employees.find(e => e._id === selectedEmployee)?.name : "-- Select Employee --"}</span>
                <i className={`fa fa-chevron-down text-xs text-gray-500 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`} />
              </div>
              {dropdownOpen && (
                <ul className="absolute z-50 mt-1 w-full bg-gray-100 border rounded shadow-lg max-h-40 overflow-y-auto text-xs">
                  <li
                    className="p-2 hover:bg-gray-200 text-center cursor-pointer"
                    onClick={() => { setSelectedEmployee(""); setDropdownOpen(false); }}
                  >
                    -- Select Employee --
                  </li>
                  {employees.length === 0 ? (
                    <li className="p-2 text-gray-500"> No employees</li>
                  ) : employees.map(emp => (
                    <li
                      key={emp._id}
                      className="p-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                      onClick={() => { setSelectedEmployee(emp._id); setDropdownOpen(false); }}
                    >
                      <img src={emp.avatar || "/default-avatar.png"} className="w-5 h-5 rounded-full" />
                      <span>{emp.name} ({emp.employeeCode})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Check-In Button */}
            <div className="flex items-end">
              <button onClick={handleCheckIn} className="bg-green-500 text-white p-1 px-3 rounded flex items-center gap-1 text-xs">
                <FaCheck /> Check In
              </button>
            </div>
          </div>
        </div>

        {/* ================= ATTENDANCE TABLE ================= */}
        <div className="flex flex-col">
          <h3 className="font-semibold mb-3 text-gray-700">Attendance Records</h3>
          <div className="overflow-x-auto rounded max-h-[60vh]">
            <table className="min-w-[900px] w-full text-xs border-collapse">
              <thead className="bg-gray-100 sticky top-0 text-left">
                <tr className="border-b">
                  <th className="p-2 w-10">
                    <input
                      type="checkbox"
                      checked={selectedRecords.length === attendanceList.length && attendanceList.length > 0}
                      onChange={(e) => e.target.checked ? setSelectedRecords(attendanceList.map(a => a._id)) : setSelectedRecords([])}
                    />
                  </th>
                  <th className="p-2 min-w-[150px]">Employee</th>
                  <th className="p-2 min-w-[80px]">Code</th>
                  <th className="p-2 min-w-[100px]">Date</th>
                  <th className="p-2 min-w-[80px]">Status</th>
                  <th className="p-2 min-w-[70px]">In</th>
                  <th className="p-2 min-w-[70px]">Out</th>
                  <th className="p-2 min-w-[110px]">Total Hours</th>
                  <th className="p-2 min-w-[100px]">Overtime</th>
                  <th className="p-2 min-w-[120px]">Remarks</th>
                  <th className="p-2 min-w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="11" className="text-center p-3">Loading...</td></tr>
                ) : attendanceList.length ? (
                  attendanceList.map(att => {
                    const { total, overtime } = calculateHours(att.checkIn, att.checkOut);
                    return (
                      <tr key={att._id} className="hover:bg-gray-200 border-b">
                        <td className="p-2 align-middle">
                          <input type="checkbox" checked={selectedRecords.includes(att._id)}
                            onChange={(e) => e.target.checked ? setSelectedRecords([...selectedRecords, att._id]) : setSelectedRecords(selectedRecords.filter(id => id !== att._id))}
                          />
                        </td>
                        <td className="p-2 flex items-center gap-2 min-w-[150px] align-middle">
                          <img src={att.employeeId?.avatar || "/default-avatar.png"} className="w-7 h-7 rounded-full shrink-0" />
                          <span className="whitespace-nowrap">{att.employeeId?.name || "-"}</span>
                        </td>
                        <td className="p-2 whitespace-nowrap">{att.employeeId?.employeeCode || "-"}</td>
                        <td className="p-2 whitespace-nowrap">{att.date ? new Date(att.date).toLocaleDateString() : "-"}</td>
                        <td className="p-2 whitespace-nowrap">{att.status}</td>
                        <td className="p-2 whitespace-nowrap">{formatTime(att.checkIn)}</td>
                        <td className="p-2 whitespace-nowrap">{formatTime(att.checkOut)}</td>
                        <td className="p-2 whitespace-nowrap">{total}</td>
                        <td className="p-2 whitespace-nowrap">{overtime}</td>
                        <td className="p-2 whitespace-nowrap">{att.remarks || "-"}</td>
                        <td className="p-2 whitespace-nowrap">
                          <AttendanceActions record={att} onUpdate={fetchAttendance} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="11" className="text-center p-3">No Records</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
}
