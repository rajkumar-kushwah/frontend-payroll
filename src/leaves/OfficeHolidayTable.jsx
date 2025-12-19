const OfficeHolidayTable = ({ holidays = [], user, onDelete }) => {
  const canManage =
    user?.role === "admin" ||
    user?.role === "owner" ||
    user?.role === "hr";

  return (
    <div className="border rounded bg-white">
        <h4 className="text-xs font-bold">Office Holidays</h4>
      <table className="w-full text-xs">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Title</th>
            <th className="p-2">Date</th>
            <th className="p-2">Type</th>
            <th className="p-2">Description</th>
            {canManage && <th className="p-2">Action</th>}
          </tr>
        </thead>

        <tbody>
          {holidays.length === 0 ? (
            <tr>
              <td colSpan={canManage ? 5 : 4} className="p-3 text-center text-gray-500">
                No office holidays found
              </td>
            </tr>
          ) : (
            holidays.map((h) => (
              <tr key={h._id} className="border-t">
                <td className="p-2">{h.title}</td>
                <td className="p-2">
                  {new Date(h.date).toLocaleDateString()}
                </td>
                <td className="p-2 capitalize">{h.type}</td>
                <td className="p-2">{h.description || "-"}</td>

                {canManage && (
                  <td className="p-2">
                    <button
                      onClick={() => onDelete(h._id)}
                      className="text-red-500 text-xs cursor-pointer hover:underline"
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
