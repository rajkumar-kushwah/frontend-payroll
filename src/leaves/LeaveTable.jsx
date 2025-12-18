import React from "react";

const LeaveTable = ({ leaves, onView, onDelete, userRole }) => {
  const isEmployee = userRole === "employee";

  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100 text-xs">
          <tr>
            {!isEmployee && (
              <>
                <th className="py-1 px-2 border-b text-left">EmpID</th>
                <th className="py-1 px-2 border-b text-left">Employee</th>
              </>
            )}
            <th className="py-1 px-2 border-b text-left">Date</th>
            <th className="py-1 px-2 border-b text-left">Type</th>
            <th className="py-1 px-2 border-b text-left">Status</th>
            <th className="py-1 px-2 border-b text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((l) => (
            <tr key={l._id} className="hover:bg-gray-50 text-xs">
              {!isEmployee && (
                <>
                  <td className="py-1 px-2 border-b">
                    {l.employeeCode || "-"}
                  </td>
                  <td className="py-1 px-2 border-b">
                    {l.name || "-"}
                  </td>
                </>
              )}

              <td className="py-1 px-2 border-b">
                {new Date(l.date).toLocaleDateString()}
              </td>
              <td className="py-1 px-2 border-b">{l.type}</td>
              <td className="py-1 px-2 border-b capitalize">{l.status}</td>

              <td className="flex py-1 px-2 gap-2 border-b">
                <button
                  onClick={() => onView(l)}
                  className="px-2 py-1 bg-blue-500 text-xs text-white rounded"
                >
                  View
                </button>

                {!isEmployee && (
                  <button
                    onClick={() => onDelete(l._id)}
                    className="px-2 py-1 bg-red-500 text-xs text-white rounded"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}

          {leaves.length === 0 && (
            <tr>
              <td
                colSpan={!isEmployee ? 6 : 4}
                className="py-4 text-center text-gray-500"
              >
                No leaves found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveTable;
