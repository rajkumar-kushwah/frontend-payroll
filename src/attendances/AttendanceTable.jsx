import React from "react";
import { FaTrash } from "react-icons/fa";

export default function AttendanceTable({
  attendanceList,
  loading,
  onCheckIn,
  onCheckOut,
  onDelete,
  onEdit,
}) {
  if (loading) return <p className="text-xs">Loading...</p>;
  if (!attendanceList.length) return <p className="text-xs">No attendance records found.</p>;

  // Format Date to 12-hour time
  const formatTime12 = (time) => {
    if (!time) return "-";
    const dt = new Date(time);
    return dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const formatDate = (date) => {
    if (!date) return "-";
    const dt = new Date(date);
    return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  // Convert decimal hours to hh:mm
  const formatDecimalHours = (hoursDecimal) => {
    if (hoursDecimal == null) return "-";
    const h = Math.floor(hoursDecimal);
    const m = Math.round((hoursDecimal - h) * 60);
    return `${h}:${String(m).padStart(2, "0")}`;
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg bg-transparent scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      <table className="w-full text-xs border border-gray-300 border-collapse min-w-[750px]">
      <thead className="bg-gray-200 border-b border-gray-400">

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
          {attendanceList.map((att) => (
            <tr
              key={att._id}
              className=" hover:bg-gray-50/70 transition-all  border border-gray-300  text-[11px]"
            >
              <td className="p-2 flex items-center gap-2 flex-wrap">
                <img
                  src={att.employeeId?.avatar || "/default-avatar.png"}
                  className="w-6 h-6 rounded-full border border-gray-300"
                />
                <div className="flex  flex-col leading-tight">
                  <span className="text-[11px] font-medium">{att.employeeId?.name}</span>
                  <span className="text-[10px] text-gray-500">{att.employeeId?.employeeCode || "-"}</span>
                </div>
              </td>

              <td className="p-3 text-center border border-gray-300">{formatDate(att.date || att.checkIn)}</td>
              <td className="p-3 text-center border border-gray-300">{formatTime12(att.checkIn)}</td>
              <td className="p-3 text-center border border-gray-300">{formatTime12(att.checkOut)}</td>
              <td className="p-3 text-center border border-gray-300">{att.status || "-"}</td>
              <td className="p-3 text-center border border-gray-300">{formatDecimalHours(att.totalHours)}</td>
              <td className="p-3 text-center border border-gray-300">{formatDecimalHours(att.overtimeHours)}</td>

              <td className="p-3 flex gap-1 justify-center flex-wrap">
                {!att.checkIn && (
                  <button
                    className="bg-lime-400 hover:bg-lime-500 text-white cursor-pointer px-2 py-1 rounded text-[10px] shadow-sm"
                    onClick={() => onCheckIn(att.employeeId?._id)}
                  >
                    Check In
                  </button>
                )}

                {att.checkIn && !att.checkOut && (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 cursor-pointer rounded text-[10px] shadow-sm"
                    onClick={() => onCheckOut(att.employeeId?._id)}
                  >
                    Check Out
                  </button>
                )}

                <button
                  className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 cursor-pointer py-1 rounded text-[10px] shadow-sm"
                  onClick={() => onEdit(att)}
                >
                  Edit
                </button>

                <button
                  className="bg-red-500 hover:bg-red-600 text-white p-1 cursor-pointer rounded text-[10px] shadow-sm flex items-center justify-center"
                  onClick={() => onDelete(att._id)}
                >
                  <FaTrash size={10} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
