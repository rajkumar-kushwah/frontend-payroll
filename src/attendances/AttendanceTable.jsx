// src/attendances/AttendanceTable.jsx
import React from "react";

export default function AttendanceTable({ attendanceList, loading, employees, onCheckIn, onCheckOut }) {
  if (loading) return <p className="text-xs">Loading...</p>;
  if (!attendanceList.length) return <p className="text-xs">No attendance records found.</p>;

  // Format time to 12-hour
  const formatTime12 = (time) => {
    if (!time) return "-";
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Calculate total hours and overtime
  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return { total: "-", overtime: "-" };
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffMs = end - start;
    if (diffMs < 0) return { total: "-", overtime: "-" };
    const totalMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;

    // Example: office end 18:30
    const officeEnd = new Date(start);
    officeEnd.setHours(18, 30, 0, 0);
    let overtimeMins = end > officeEnd ? Math.floor((end - officeEnd)/60000) : 0;
    return {
      total: `${hours}:${String(mins).padStart(2,"0")}`,
      overtime: `${Math.floor(overtimeMins/60)}:${String(overtimeMins%60).padStart(2,"0")}`
    };
  };

  return (
    <div className="overflow-auto rounded border border-gray-200">
      <table className="w-full text-xs">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-2 text-left">Employee</th>
            <th className="p-2">Shift</th>
            <th className="p-2">In</th>
            <th className="p-2">Out</th>
            <th className="p-2">Status</th>
            <th className="p-2">Total Hours</th>
            <th className="p-2">Overtime</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {attendanceList.map(att => {
            const { total, overtime } = calculateHours(att.checkIn, att.checkOut);
            return (
              <tr key={att._id} className="border-t hover:bg-gray-50">
                <td className="p-2 flex items-center gap-2">
                  <img src={att.employeeId?.avatar || "/default-avatar.png"} className="w-5 h-5 rounded-full"/>
                  <span>{att.employeeId?.name}</span>
                </td>
                <td className="p-2">{att.shiftId?.shiftName || "N/A"}</td>
                <td className="p-2">{formatTime12(att.checkIn)}</td>
                <td className="p-2">{formatTime12(att.checkOut)}</td>
                <td className="p-2">{att.status || "-"}</td>
                <td className="p-2">{total}</td>
                <td className="p-2">{overtime}</td>
                <td className="p-2 flex gap-1">
                  {!att.checkIn && (
                    <button
                      className="bg-green-500 text-white p-1 rounded text-xs"
                      onClick={() => onCheckIn(att.employeeId?._id)}
                    >
                      Check In
                    </button>
                  )}
                  {att.checkIn && !att.checkOut && (
                    <button
                      className="bg-blue-500 text-white p-1 rounded text-xs"
                      onClick={() => onCheckOut(att.employeeId?._id)}
                    >
                      Check Out
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
