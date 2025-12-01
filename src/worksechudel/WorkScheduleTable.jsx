import React from "react";

export default function WorkScheduleTable({ schedules, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-xs border-separate border-spacing-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Avatar</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2 text-left">Shift Name</th>
            <th className="p-2 text-left">Shift Type</th>
            <th className="p-2 text-left">Fixed In</th>
            <th className="p-2 text-left">Fixed Out</th>
            <th className="p-2 text-left">Weekly Off</th>
            <th className="p-2 text-left">Break</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((sch) => (
            <tr key={sch._id} className="hover:bg-gray-50">
              <td className="p-2">
                <img
                  src={sch.employeeId.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-6 h-6 rounded-full"
                />
              </td>
              <td className="p-2">{sch.employeeId.name}</td>
              <td className="p-2">{sch.shiftName || "Default Shift"}</td>
              <td className="p-2">{sch.shiftType || "Full-day"}</td>
              <td className="p-2">{sch.inTime}</td>
              <td className="p-2">{sch.outTime}</td>
              <td className="p-2">{(sch.weeklyOff || []).join(", ")}</td>
              <td className="p-2">
                {sch.breakStart && sch.breakEnd
                  ? `${sch.breakStart} - ${sch.breakEnd}`
                  : "-"}
              </td>
              <td className="p-2 flex gap-2">
                <button
                  onClick={() => onEdit(sch)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded text-xs hover:bg-yellow-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(sch._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
