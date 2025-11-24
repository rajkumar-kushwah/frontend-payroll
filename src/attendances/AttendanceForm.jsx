// src/pages/attendance/AttendanceForm.jsx
import { useEffect, useState } from "react";
import { getEmployees, addAttendance } from "../utils/api";
import { FaPlus } from "react-icons/fa";

export default function AttendanceForm({ onAdd }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [status, setStatus] = useState("present");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState("");         // New field
  const [inTime, setInTime] = useState("");     // New field
  const [outTime, setOutTime] = useState("");   // New field

  useEffect(() => {
    fetchEmployees();
    // default to today
    const today = new Date().toISOString().slice(0,10);
    setDate(today);
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.employees || []);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const handleAdd = async () => {
    if (!selectedEmployees.length) return alert("Select employees");
    for (let empId of selectedEmployees) {
      await addAttendance({
        employeeId: empId,
        status,
        remarks,
        date,                // send date
        checkIn: inTime ? new Date(`${date}T${inTime}`) : null,
        checkOut: outTime ? new Date(`${date}T${outTime}`) : null
      });
    }
    // Reset
    setSelectedEmployees([]);
    setStatus("present");
    setRemarks("");
    setInTime("");
    setOutTime("");
    const today = new Date().toISOString().slice(0,10);
    setDate(today);
    onAdd();
  };

  return (
    <div className="bg-white rounded shadow p-2 mb-3 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
      
      {/* Employee Select */}
      <div>
        <label>Employees</label>
        <div className="border p-1 rounded max-h-40 overflow-y-auto">
          {employees.map(emp => (
            <div key={emp._id} className="flex items-center gap-1 mb-1">
              <input
                type="checkbox"
                value={emp._id}
                checked={selectedEmployees.includes(emp._id)}
                onChange={e => {
                  if (e.target.checked) setSelectedEmployees([...selectedEmployees, emp._id]);
                  else setSelectedEmployees(selectedEmployees.filter(id => id !== emp._id));
                }}
              />
              <img src={emp.avatar || "/default-avatar.png"} alt={emp.name} className="w-6 h-6 rounded-full"/>
              <span>{emp.name} ({emp.employeeCode})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label>Status</label>
        <select value={status} onChange={e => setStatus(e.target.value)} className="border p-1 rounded w-full">
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">Leave</option>
        </select>
      </div>

      {/* Date */}
      <div>
        <label>Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-1 rounded w-full"/>
      </div>

      {/* In Time */}
      <div>
        <label>In Time</label>
        <input type="time" value={inTime} onChange={e => setInTime(e.target.value)} className="border p-1 rounded w-full"/>
      </div>

      {/* Out Time */}
      <div>
        <label>Out Time</label>
        <input type="time" value={outTime} onChange={e => setOutTime(e.target.value)} className="border p-1 rounded w-full"/>
      </div>

      {/* Remarks */}
      <div>
        <label>Remarks</label>
        <input value={remarks} onChange={e => setRemarks(e.target.value)} className="border p-1 rounded w-full"/>
      </div>

      {/* Submit */}
      <div className="sm:col-span-4 flex justify-end mt-1">
        <button onClick={handleAdd} className="bg-green-500 text-white p-1 rounded flex items-center gap-1">
          <FaPlus /> Add Attendance
        </button>
      </div>

    </div>
  );
}
