import React from "react";

const OfficeHolidayTable = ({ holidays = [], user, onDelete }) => {
  // Only admin/owner/hr can manage (show Delete button)
  const canDelete =
    user?.role === "admin" ||
    user?.role === "owner" ||
    user?.role === "hr";

  return (
    <div className="border border-gray-300 overflow-x-auto rounded bg-white">
      <h4 className="text-xs font-bold mb-2">Office Holidays</h4>
      <table className="w-full text-xs  border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left border-r border-gray-300">Title</th>
            <th className="p-2 text-left border-r border-gray-300">Start Date</th>
            <th className="p-2 text-left border-r border-gray-300">End Date</th>
            <th className="p-2 text-left border-r border-gray-300">Total Days</th>
            <th className="p-2 text-left border-r border-gray-300">Description</th>
            {canDelete && <th className="p-2 text-left border-r border-gray-300">Action</th>}
          </tr>
        </thead>

        <tbody>
          {holidays.length === 0 ? (
            <tr>
              <td
                colSpan={canDelete ? 5 : 4}
                className="p-3 text-center text-gray-500"
              >
                No office holidays found
              </td>
            </tr>
          ) : (
            holidays.map((h) => (
              <tr key={h._id} className=" border-t border-gray-300">
                <td className="p-2 text-left  border-r border-gray-300">{h.title}</td>
                <td className="p-2 text-left border-r border-gray-300">
                  {new Date(h.startDate).toLocaleDateString()}
                </td>
                <td className="p-2 text-left  border-r border-gray-300">
                  {new Date(h.endDate).toLocaleDateString()}
                </td>
                <td className="p-2 text-left border-r border-gray-300 ">{h.totalDays}</td>
                <td className="p-2 text-left border-r border-gray-300 ">{h.description || "-"}</td>

                {canDelete && (
                  <td className="p-2 text-left">
                    <button
                      onClick={() => onDelete(h._id)}
                      className="px-2 py-1 bg-red-500 hover:bg-red-600 cursor-pointer text-xs text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OfficeHolidayTable;
