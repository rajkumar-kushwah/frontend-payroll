import React, { useState } from "react";
import { updateAttendance } from "../utils/api";

export default function AttendanceUpdate({ record, onUpdate, onClose }) {

  // Convert stored date to LOCAL HH:MM
  const formatLocalTime = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };

  const [status, setStatus] = useState(record.status || "present");
  const [checkInTime, setCheckInTime] = useState(formatLocalTime(record.checkIn));
  const [checkOutTime, setCheckOutTime] = useState(formatLocalTime(record.checkOut));
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // 🔥 Use record.date safely
      const baseDate = new Date(record.date);
      const yyyy = baseDate.getFullYear();
      const mm = String(baseDate.getMonth() + 1).padStart(2, "0");
      const dd = String(baseDate.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      // 🔥 DO NOT use toISOString() (UTC bug)
      const checkIn = checkInTime
        ? new Date(`${dateStr}T${checkInTime}:00`)
        : null;

      const checkOut = checkOutTime
        ? new Date(`${dateStr}T${checkOutTime}:00`)
        : null;

      await updateAttendance(record._id, {
        status,
        checkIn,
        checkOut
      });

      onUpdate();   // 🔥 Parent refresh (recalc OT)
      onClose();    // Close modal

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

        <div className="flex items-center gap-2 mb-2">
          <img
            src={record.employeeId?.avatar || "/default-avatar.png"}
            className="w-8 h-8 rounded-full"
            alt=""
          />
          <p className="font-semibold">{record.employeeId?.name}</p>
        </div>

        <h3 className="font-bold text-sm">Update Attendance</h3>

        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-1 rounded text-xs"
        >
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="leave">Leave</option>
          <option value="half-day">Half Day</option>
        </select>

        <label>Check In</label>
        <input
          type="time"
          value={checkInTime}
          onChange={(e) => setCheckInTime(e.target.value)}
          className="border p-1 rounded text-xs"
        />

        <label>Check Out</label>
        <input
          type="time"
          value={checkOutTime}
          onChange={(e) => setCheckOutTime(e.target.value)}
          className="border p-1 rounded text-xs"
        />

        <div className="flex justify-between mt-2">
          <button onClick={onClose} className="bg-gray-300 cursor-pointer p-1 rounded text-xs">
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer p-1 rounded text-xs"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}
