import React from "react";

const LeaveTable = ({ leaves, onView, onDelete, userRole }) => {
  const isEmployee = userRole === "employee";

  return (
    <div className="overflow-x-auto w-full border border-gray-300 rounded">
      <table className="min-w-full text-xs">
        <thead className="bg-gray-100">
          <tr>
            {!isEmployee && (
              <>
                <th className="p-2 text-left">EmpID</th>
                <th className="p-2 text-left">Employee</th>
              </>
            )}
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Reason</th>
            <th className="p-2 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {leaves.length === 0 ? (
            <tr>
              <td colSpan={!isEmployee ? 6 : 4} className="p-3 text-center text-gray-500">
                No leaves or holidays found
              </td>
            </tr>
          ) : (
            leaves.map((l) => (
              <tr key={l._id} className="hover:bg-gray-50 border-t">
                {!isEmployee && (
                  <>
                    <td className="p-2">{l.employeeCode || "-"}</td>
                    <td className="p-2">{l.name || l.title || "-"}</td>
                  </>
                )}

                <td className="p-2">{new Date(l.date).toLocaleDateString()}</td>
                <td className="p-2 capitalize">{l.type || l.holidayType || "-"}</td>
                <td className="p-2 capitalize">{l.status || "-"}</td>
                <td className="p-2">{l.reason || l.reason || "-"}</td>

                <td className="flex gap-2 p-2">
                  <button
                    onClick={() => onView(l)}
                    className="px-2 py-1 bg-blue-500 text-white text-xs rounded"
                  >
                    View
                  </button>
                  {!isEmployee && l.employeeCode && (
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
