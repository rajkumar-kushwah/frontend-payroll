import React from "react";

const LeaveTable = ({ leaves = [], onView, onDelete, userRole }) => {
  const isEmployee = userRole === "employee";

  return (
    <div className="overflow-x-auto w-full border border-gray-300 rounded">
      <table className="min-w-full text-xs">
        <thead className="bg-gray-100">
          <tr>
            {!isEmployee && (
              <>
                <th className="p-2 text-left">Employee</th>
                <th className="p-2 text-left">EmpID</th>
              </>
            )}
            <th className="p-2 text-left">From</th>
            <th className="p-2 text-left">To</th>
            <th className="p-2 text-left">Days</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Reason</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td
                colSpan={isEmployee ? 7 : 9}
                className="p-3 text-center text-gray-500"
              >
                No leaves found
              </td>
            </tr>
          ) : (
            leaves.map((l) => (
              <tr key={l._id} className="hover:bg-gray-50 border-t">
                {!isEmployee && (
                  <>
                    {/* Employee + Avatar */}
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        {l.avatar ? (
                          <img
                            src={l.avatar}
                            alt={l.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-semibold">
                            {l.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                        <span className="truncate max-w-[120px]">
                          {l.name || "-"}
                        </span>
                      </div>
                    </td>

                    <td className="p-2">{l.employeeCode || "-"}</td>
                  </>
                )}

                <td className="p-2">
                  {l.startDate
                    ? new Date(l.startDate).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-2">
                  {l.endDate
                    ? new Date(l.endDate).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-2 text-center">{l.totalDays ?? "-"}</td>

                <td className="p-2 capitalize">{l.type || "-"}</td>

                <td className="p-2 capitalize">
                  <span
                    className={`px-2 py-0.5 rounded text-white text-[10px]
                      ${
                        l.status === "approved"
                          ? "bg-green-500"
                          : l.status === "rejected"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                  >
                    {l.status}
                  </span>
                </td>

                <td className="p-2 max-w-[200px] truncate">
                  {l.reason || "-"}
                </td>

                <td className="flex gap-2 p-2">
                  <button
                    onClick={() => onView(l)}
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
                  >
                    View
                  </button>

                  {!isEmployee && (
                    <button
                      onClick={() => onDelete(l._id)}
                      className="px-2 py-1 bg-red-500 text-white text-xs rounded"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;
