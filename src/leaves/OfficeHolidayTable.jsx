import React from "react";

const OfficeHolidayTable = ({ holidays = [], user, onDelete }) => {
  // Only admin/owner/hr can manage (show Delete button)
  const canDelete =
    user?.role === "admin" ||
    user?.role === "owner" ||
    user?.role === "hr";

  return (
    <div className="border overflow-x-auto rounded bg-white">
      <h4 className="text-xs font-bold mb-2">Office Holidays</h4>
      <table className="w-full text-xs border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left border-b">Title</th>
            <th className="p-2 text-left border-b">Date</th>
            <th className="p-2 text-left border-b">Type</th>
            <th className="p-2 text-left border-b">Description</th>
            {canDelete && <th className="p-2 text-left border-b">Action</th>}
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
              <tr key={h._id} className="border-t">
                <td className="p-2 text-left border-b">{h.title}</td>
                <td className="p-2 text-left border-b">
                  {new Date(h.date).toLocaleDateString()}
                </td>
                <td className="p-2 text-left border-b capitalize">{h.type}</td>
                <td className="p-2  text-left border-b">{h.description || "-"}</td>

                {canDelete && (
                  <td className="p-2 text-left border-b">
                    <button
                      onClick={() => onDelete(h._id)}
                      className="px-2 py-1 text-left bg-red-500 hover:bg-red-600 cursor-pointer text-xs text-white rounded"
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
