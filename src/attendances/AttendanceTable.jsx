// src/attendances/AttendanceTable.jsx
import React from "react";

export default function AttendanceTable({
  attendanceList,
  loading,
  employees,
  onCheckIn,
  onCheckOut,
}) {
  if (loading) return <p className="text-xs">Loading...</p>;
  if (!attendanceList.length) return <p className="text-xs">No attendance records found.</p>;

  const formatTime12 = (time) => {
    if (!time) return "-";
    return new Date(time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calculateHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return { total: "-", overtime: "-" };

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const totalMins = Math.floor((end - start) / 60000);
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;


    return {
      total: `${hours}:${String(mins).padStart(2, "0")}`,
      overtime: "0:00",
    };
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg bg-transparent scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <table className="w-full text-xs border-collapse min-w-[750px]">
        <thead className="bg-gray-100/70 backdrop-blur-sm sticky top-0 z-10 text-gray-700">
          <tr>
            <th className="p-3 text-left">Employee</th>
            <th className="p-3 text-center">Date</th>
            <th className="p-3 text-center">In</th>
            <th className="p-3 text-center">Out</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Total</th>
            <th className="p-3 text-center">OverTime</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>


        <tbody>
          {attendanceList.map((att) => {
            const { total, overtime } = calculateHours(att.checkIn, att.checkOut);
            return (
              <tr key={att._id} className="border-t hover:bg-gray-50/70 transition-all text-[11px]">
                <td className="p-3 flex items-center gap-2 flex-wrap">
                  <img
                    src={att.employeeId?.avatar || "/default-avatar.png"}
                    className="w-6 h-6 rounded-full border border-gray-300"
                  />
                  <div className="flex flex-col leading-tight">
                    <span className="text-[11px] font-medium">{att.employeeId?.name}</span>
                    <span className="text-[10px] text-gray-500">{att.employeeId?.employeeCode || "-"}</span>
                  </div>
                </td>
                <td className="p-3 text-center">{formatDate(att.date || att.checkIn)}</td>
                <td className="p-3 text-center">{formatTime12(att.checkIn)}</td>
                <td className="p-3 text-center">{formatTime12(att.checkOut)}</td>
                <td className="p-3 text-center">{att.status || "-"}</td>
                <td className="p-3 text-center">{total}</td>
                <td className="p-3 text-center">{overtime}</td>
                <td className="p-3 flex gap-2 justify-center flex-wrap">
                  {!att.checkIn && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded text-[10px] shadow-sm"
                      onClick={() => onCheckIn(att.employeeId?._id)}
                    >
                      Check In
                    </button>
                  )}
                  {att.checkIn && !att.checkOut && (
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded text-[10px] shadow-sm"
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
