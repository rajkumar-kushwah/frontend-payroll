// src/pages/attendance/AttendanceUpdate.jsx
import { useState } from "react";
import { updateAttendance } from "../utils/api";

export default function AttendanceUpdate({ record, onUpdate, onClose }) {
  
  // Convert stored date to LOCAL HH:MM (NO UTC SHIFT)
  const formatLocalTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    });
  };

  const [status, setStatus] = useState(record.status || "present");
  const [checkInTime, setCheckInTime] = useState(formatLocalTime(record.checkIn));
  const [checkOutTime, setCheckOutTime] = useState(formatLocalTime(record.checkOut));
  const [remarks, setRemarks] = useState(record.remarks || "");

  const handleUpdate = async () => {
    const today = record.date.split("T")[0];

    // Rebuild ISO but keep LOCAL time exactly as user selects
    const checkInISO = checkInTime
      ? new Date(`${today}T${checkInTime}:00`).toISOString()
      : null;

    const checkOutISO = checkOutTime
      ? new Date(`${today}T${checkOutTime}:00`).toISOString()
      : null;

    await updateAttendance(record._id, {
      status,
      checkIn: checkInISO,
      checkOut: checkOutISO,
      remarks,
    });

    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded shadow w-80 text-xs grid gap-2">

        {/* Avatar + Name */}
        <div className="flex items-center gap-2 mb-2">
          <img
            src={record.employeeId?.avatar || "/default-avatar.png"}
            alt={record.employeeId?.name || "Avatar"}
            className="w-8 h-8 rounded-full"
          />
          <p className="font-semibold text-xs">{record.employeeId?.name || "-"}</p>
        </div>

        <h3 className="font-bold">Update Attendance</h3>

        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-1 rounded w-full text-xs"
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">Leave</option>
        </select>

        <label>Check In</label>
        <input
          type="time"
          value={checkInTime}
          onChange={(e) => setCheckInTime(e.target.value)}
          className="border p-1 rounded w-full text-xs"
        />

        <label>Check Out</label>
        <input
          type="time"
          value={checkOutTime}
          onChange={(e) => setCheckOutTime(e.target.value)}
          className="border p-1 rounded w-full text-xs"
        />

        <label>Remarks</label>
        <input
          type="text"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          className="border p-1 rounded w-full text-xs"
        />

        <div className="flex justify-between mt-2">
          <button
            onClick={onClose}
            className="bg-gray-300 p-1 rounded text-xs"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="bg-blue-500 text-white p-1 rounded text-xs"
          >
            Update
          </button>
        </div>

      </div>
    </div>
  );
}
