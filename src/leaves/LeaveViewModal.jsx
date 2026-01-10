import React from "react";

const LeaveViewModal = ({ leave, user, onClose, onApprove, onReject }) => {
  if (!leave) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Leave Details</h3>

        {/* Employee Info */}
        <div className="flex items-center gap-3 mb-4">
          {leave.avatar ? (
            <img
              src={leave.avatar}
              alt={leave.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-400 text-white flex items-center justify-center font-semibold">
              {leave.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}

          <div>
            <div className="font-semibold text-sm">{leave.name}</div>
            <div className="text-xs text-gray-500">
              EmpID: {leave.employeeCode}
            </div>
          </div>
        </div>

        {/* Date Range */}
        <div className="mb-2 text-sm">
          <span className="font-semibold">From:</span>{" "}
          {new Date(leave.startDate).toLocaleDateString()}
        </div>
        <div className="mb-2 text-sm">
          <span className="font-semibold">To:</span>{" "}
          {new Date(leave.endDate).toLocaleDateString()}
        </div>

        <div className="mb-2 text-sm">
          <span className="font-semibold">Total Days:</span>{" "}
          {leave.totalDays}
        </div>

        <div className="mb-2 text-sm">
          <span className="font-semibold">Type:</span>{" "}
          <span className="capitalize">{leave.type}</span>
        </div>

        <div className="mb-2 text-sm">
          <span className="font-semibold">Reason:</span>{" "}
          {leave.reason || "-"}
        </div>

        <div className="mb-4 text-sm">
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`capitalize font-semibold ml-1 ${
              leave.status === "approved"
                ? "text-green-600"
                : leave.status === "rejected"
                ? "text-red-600"
                : "text-yellow-600"
            }`}
          >
            {leave.status}
          </span>
        </div>

        {/* Approve / Reject */}
        {user?.role !== "employee" && leave.status === "pending" && (
          <div className="flex justify-end gap-2 mb-3">
            <button
              onClick={onApprove}
              className="px-3 py-1 bg-green-500 text-sm cursor-pointer text-white rounded hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={onReject}
              className="px-3 py-1 bg-red-500 text-sm cursor-pointer text-white rounded hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs cursor-pointer border rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveViewModal;
