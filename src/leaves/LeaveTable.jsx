import React from "react";

const LeaveTable = ({ leaves, onView }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-left">Employee</th>
            <th className="py-2 px-4 border-b text-left">Date</th>
            <th className="py-2 px-4 border-b text-left">Type</th>
            <th className="py-2 px-4 border-b text-left">Status</th>
            <th className="py-2 px-4 border-b text-left">View</th>
          </tr>
        </thead>

        <tbody>
          {leaves.map((l) => (
            <tr key={l._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">
                {l.employeeId?.name || "You"}
              </td>
              <td className="py-2 px-4 border-b">
                {new Date(l.date).toLocaleDateString()}
              </td>
              <td className="py-2 px-4 border-b">{l.type}</td>
              <td className="py-2 px-4 border-b capitalize">{l.status}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => onView(l)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  View
                </button>
              </td>
            </tr>
          ))}

          {leaves.length === 0 && (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">
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
