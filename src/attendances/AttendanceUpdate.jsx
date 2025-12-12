import React, { useState } from "react";
import { updateAttendance } from "../utils/api";

export default function AttendanceUpdate({ record, onUpdate, onClose }) {

// Convert stored date to LOCAL HH:MM (without UTC shift)
const formatLocalTime = (dateStr) => {
if (!dateStr) return "";
const date = new Date(dateStr);
const hours = String(date.getHours()).padStart(2, "0");
const minutes = String(date.getMinutes()).padStart(2, "0");
return `${hours}:${minutes}`;
};

const [status, setStatus] = useState(record.status || "present");
const [checkInTime, setCheckInTime] = useState(formatLocalTime(record.checkIn));
const [checkOutTime, setCheckOutTime] = useState(formatLocalTime(record.checkOut));
const [loading, setLoading] = useState(false);

const handleUpdate = async () => {
setLoading(true);
try {
const today = record.date.split("T")[0];


  // Rebuild ISO datetime while keeping local time as entered
  const checkInISO = checkInTime ? new Date(`${today}T${checkInTime}:00`).toISOString() : null;
  const checkOutISO = checkOutTime ? new Date(`${today}T${checkOutTime}:00`).toISOString() : null;

  await updateAttendance(record._id, {
    status,
    checkIn: checkInISO,
    checkOut: checkOutISO,
    
  });

  onUpdate(); // Refresh parent attendance table
  onClose();  // Close modal
} catch (err) {
  console.error("Update failed:", err);
  alert("Failed to update attendance.");
} finally {
  setLoading(false);
}


};

return ( 
<div className="fixed inset-0 flex justify-center items-center z-50 bg-black/30">
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

    <h3 className="font-bold text-sm">Update Attendance</h3>

    {/* Status */}
    <label>Status</label>
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="border p-1 cursor-pointer rounded w-full text-xs"
    >
      <option value="present">Present</option>
      <option value="absent">Absent</option>
      <option value="leave">Leave</option>
      <option value="half-day">Half Day</option>
    </select>

    {/* Check In */}
    <label>Check In</label>
    <input
      type="time"
      value={checkInTime}
      onChange={(e) => setCheckInTime(e.target.value)}
      className="border p-1 rounded w-full text-xs"
    />

    {/* Check Out */}
    <label>Check Out</label>
    <input
      type="time"
      value={checkOutTime}
      onChange={(e) => setCheckOutTime(e.target.value)}
      className="border p-1 rounded w-full text-xs"
    />

   

    {/* Buttons */}
    <div className="flex justify-between mt-2">
      <button
        onClick={onClose}
        className="bg-gray-300 p-1 cursor-pointer rounded text-xs"
      >
        Cancel
      </button>
      <button
        onClick={handleUpdate}
        className={`bg-blue-500 text-white p-1 cursor-pointer rounded text-xs ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>

  </div>
</div>


);
}
