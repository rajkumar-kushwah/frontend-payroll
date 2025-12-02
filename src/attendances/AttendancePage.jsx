import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import AttendanceFilter from "./AttendanceFilter";
import AttendanceTable from "./AttendanceTable";
import { FaCheck } from "react-icons/fa";
import { getWorkSchedules, getAttendance, checkIn, checkOut, deleteAttendance } from "../utils/api";

export default function MainAttendancePage() {
const [employees, setEmployees] = useState([]);
const [attendanceList, setAttendanceList] = useState([]);
const [selectedEmployee, setSelectedEmployee] = useState("");
const [filters, setFilters] = useState({ search: "", status: "", date: "" });
const [loading, setLoading] = useState(false);
const [dropdownOpen, setDropdownOpen] = useState(false);
const dropdownRef = useRef(null);

// Close dropdown when clicking outside
useEffect(() => {
const handleClickOutside = (event) => {
if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
setDropdownOpen(false);
}
};
document.addEventListener("mousedown", handleClickOutside);
return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

// Fetch employees
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
if (!selectedEmployee) return alert("Please select an employee!");
try {
await checkIn(selectedEmployee);
setSelectedEmployee("");
fetchAttendance();
alert("Check-in recorded!");
} catch (err) {
console.error(err);
alert("Check-in failed");
}
};

// Check-out callback
const handleCheckOut = async (employeeId) => {
try {
await checkOut(employeeId);
fetchAttendance();
alert("Check-out recorded!");
} catch (err) {
console.error(err);
alert("Check-out failed");
}
};

// Delete callback
const handleDelete = async (id) => {
try {
await deleteAttendance(id);
fetchAttendance();
alert("Attendance deleted!");
} catch (err) {
console.error(err);
alert("Delete failed");
}
};

useEffect(() => {
fetchEmployees();
fetchAttendance();
}, []);

useEffect(() => {
fetchAttendance();
}, [filters.status, filters.date]);

// Filter attendance by search (name or code)
const filteredAttendance = attendanceList.filter(att => {
if (!filters.search) return true;
const searchLower = filters.search.toLowerCase();
const name = att.employeeId?.name?.toLowerCase() || "";
const code = att.employeeId?.employeeCode?.toLowerCase() || "";
return name.includes(searchLower) || code.includes(searchLower);
});

return ( <Layout> <div className="p-2 flex flex-col gap-3"> <h2 className="text-sm font-semibold">Daily Attendance</h2>

    {/* Employee Dropdown + Check-In */}
    <div className="flex gap-2 items-center mb-2">
      <div ref={dropdownRef} className="relative w-48">
        <div
          className="flex items-center justify-between border border-gray-300 rounded px-2 py-1 text-xs cursor-pointer bg-white"
          onClick={() => setDropdownOpen(prev => !prev)}
        >
          <span>
            {selectedEmployee 
              ? employees.find(e => e._id === selectedEmployee)?.name 
              : "-- Select Employee --"}
          </span>
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

    {/* Filter Component */}
    <AttendanceFilter filters={filters} setFilters={setFilters} employees={employees} />

    {/* Attendance Table */}
    <AttendanceTable
      attendanceList={filteredAttendance}
      loading={loading}
      onCheckOut={handleCheckOut}
      onDelete={handleDelete}
    />
  </div>
</Layout>


);
}
