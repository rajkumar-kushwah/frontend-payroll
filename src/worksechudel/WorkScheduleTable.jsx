import React from "react";

// Helper function to convert 24h time to 12h format
const formatTime12 = (time) => {
    if (!time) return "-";
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
};

export default function WorkScheduleTable({ schedules, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full text-xs">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 text-left">Name</th>
                        <th className="p-2 text-left">Emp ID</th>
                        <th className="p-2 text-left">Shift Name</th>
                        <th className="p-2 text-left">Shift Type</th>
                        <th className="p-2 text-left">Effective Date</th>
                        <th className="p-2 text-left">Fixed In</th>
                        <th className="p-2 text-left">Fixed Out</th>
                        <th className="p-2 text-left">Weekly Off</th>
                        <th className="p-2 text-left">Break</th>
                        <th className="p-2 text-left">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {schedules.length === 0 ? (
                        <tr>
                            <td colSpan="9" className="p-4 text-center text-gray-500">
                                No schedules found
                            </td>
                        </tr>
                    ) : (
                        schedules.map((sch) => {
                            const emp = sch.employeeId || {}; // in case employee deleted
                            return (
                                <tr key={sch._id} className="hover:bg-gray-50">

                                    {/* Employee Name + Avatar */}
                                    <td className="p-2 flex items-center gap-2">
                                        <img
                                            src={emp.avatar || "/default-avatar.png"}
                                            alt={emp.name || "Employee"}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <span>{emp.name || "Deleted Employee"}</span>
                                    </td>

                                    {/* Employee ID */}
                                    <td className="p-2 text-gray-700 font-semibold">
                                        {emp.employeeCode || "N/A"}
                                    </td>



                                    {/* Shift Details */}
                                    <td className="p-2">{sch.shiftName || "Default Shift"}</td>
                                    <td className="p-2">{sch.shiftType || "Full-day"}</td>
                                    <td className="p-2">{sch.effectiveFrom ? new Date(sch.effectiveFrom).toLocaleDateString() : "N/A"}</td>
                                    <td className="p-2">{formatTime12(sch.inTime)}</td>
                                    <td className="p-2">{formatTime12(sch.outTime)}</td>

                                    {/* Weekly Off */}
                                    <td className="p-2">
                                        {(sch.weeklyOff || []).join(", ")}
                                    </td>

                                    {/* Break Time */}
                                    <td className="p-2">
                                        {sch.breakStart && sch.breakEnd
                                            ? `${formatTime12(sch.breakStart)} - ${formatTime12(sch.breakEnd)}`
                                            : "-"}
                                    </td>

                                    {/* Action Buttons */}
                                    <td className="p-2 flex gap-2">
                                        <button
                                            onClick={() => onEdit(sch)}
                                            className="bg-yellow-400 text-white px-2 py-1 cursor-pointer rounded text-xs hover:bg-yellow-500"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => onDelete(sch._id)}
                                            className="bg-red-500 text-white px-2 py-1 cursor-pointer rounded text-xs hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}
