// src/pages/attendance/EditAttendance.jsx
import { useState, useEffect } from "react";
import { getEmployees, updateAttendance } from "../utils/api";
import { FaTimes, FaEdit } from "react-icons/fa";

export default function EditAttendance({ record, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(record.employeeId?._id || "");
  const [status, setStatus] = useState(record.status || "present");
  const [date, setDate] = useState(record.date ? record.date.split("T")[0] : new Date().toISOString().split("T")[0]);
  const [checkInTime, setCheckInTime] = useState(record.checkIn ? new Date(record.checkIn).toLocaleTimeString('it-IT') : "");
  const [checkOutTime, setCheckOutTime] = useState(record.checkOut ? new Date(record.checkOut).toLocaleTimeString('it-IT') : "");
  const [remarks, setRemarks] = useState(record.remarks || "");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await getEmployees();
        setEmployees(res.employees || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEmployees();
  }, []);

  const handleUpdate = async () => {
    try {
      const checkInISO = checkInTime ? new Date(`${date}T${checkInTime}`).toISOString() : null;
      const checkOutISO = checkOutTime ? new Date(`${date}T${checkOutTime}`).toISOString() : null;

      await updateAttendance(record._id, {
        employeeId: selectedEmployee,
        date,
        status,
        checkIn: checkInISO,
        checkOut: checkOutISO,
        remarks,
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to update attendance");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-end z-50">
      <div className="bg-white w-full sm:w-96 p-4 h-full overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold">Edit Attendance</h2>
          <button onClick={onClose} className="text-red-500"><FaTimes /></button>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <div>
            <label>Employee</label>
            <select value={selectedEmployee} onChange={e => setSelectedEmployee(e.target.value)} className="border p-1 rounded w-full">
              <option value="">Select Employee</option>
              {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name} ({emp.employeeCode})</option>)}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="border p-1 rounded w-full">
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
            </select>
          </div>
          <div>
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-1 rounded w-full"/>
          </div>
          <div>
            <label>Check In</label>
            <input type="time" value={checkInTime} onChange={e => setCheckInTime(e.target.value)} className="border p-1 rounded w-full"/>
          </div>
          <div>
            <label>Check Out</label>
            <input type="time" value={checkOutTime} onChange={e => setCheckOutTime(e.target.value)} className="border p-1 rounded w-full"/>
          </div>
          <div>
            <label>Remarks</label>
            <input type="text" value={remarks} onChange={e => setRemarks(e.target.value)} className="border p-1 rounded w-full"/>
          </div>
          <button onClick={handleUpdate} className="bg-yellow-500 text-white p-2 rounded flex items-center justify-center gap-1">
            <FaEdit /> Update
          </button>
        </div>
      </div>
    </div>
  );
}
