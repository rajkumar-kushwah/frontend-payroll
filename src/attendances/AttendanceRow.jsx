import axios from "axios";

const formatTime12H = (timeStr) => {
  if (!timeStr) return "-";
  const date = new Date(timeStr);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
};

export default function AttendanceRow({ record, refresh }) {
  const checkIn = async () => {
    await axios.post("/api/attendance/check-in", { employeeId: record.employeeId._id });
    refresh();
  };
  const checkOut = async () => {
    await axios.post("/api/attendance/check-out", { employeeId: record.employeeId._id });
    refresh();
  };
  const deleteRecord = async () => {
    if (confirm("Are you sure to delete?")) {
      await axios.delete(`/api/attendance/${record._id}`);
      refresh();
    }
  };

  const canCheckIn = !record.checkIn && record.status !== "holiday";
  const canCheckOut = record.checkIn && !record.checkOut && record.status === "present";

  return (
    <tr className="border-b text-center text-xs">
      <td className="flex items-center gap-1 p-1">
        <img src={record.employeeId.avatar} alt="avatar" className="w-5 h-5 rounded-full" />
        {record.employeeId.name}
      </td>
      <td className="p-1">{record.shiftName || "-"}</td>
      <td className="p-1">{formatTime12H(record.checkIn)}</td>
      <td className="p-1">{formatTime12H(record.checkOut)}</td>
      <td className="p-1">{record.status}</td>
      <td className="p-1">{record.totalHours || 0}</td>
      <td className="p-1">{record.overtimeHours || 0}</td>
      <td className="flex gap-1 justify-center p-1">
        {canCheckIn && <button onClick={checkIn} className="bg-green-500 text-white text-xs p-1 rounded">Check-in</button>}
        {canCheckOut && <button onClick={checkOut} className="bg-blue-500 text-white text-xs p-1 rounded">Check-out</button>}
        <button onClick={deleteRecord} className="bg-red-500 text-white text-xs p-1 rounded">Delete</button>
      </td>
    </tr>
  );
}
