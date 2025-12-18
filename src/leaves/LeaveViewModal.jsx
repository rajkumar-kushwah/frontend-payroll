import React from "react";

const LeaveViewModal = ({ leave, user, onClose, onApprove, onReject }) => {
  if (!leave) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Leave Detail</h3>

        <div className="mb-2">
          <span className="font-semibold text-sm">Date:</span>{" "}
          {new Date(leave.date).toLocaleDateString()}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-sm">EmpID:</span>{" "}
          {leave.employeeCode}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-sm">Type:</span> {leave.type}
        </div>
        <div className="mb-2">
          <span className="font-semibold text-sm">Reason:</span> {leave.reason}
        </div>
        <div className="mb-4">
          <span className="font-semibold text-sm">Status:</span>{" "}
          <span
            className={`capitalize font-medium text-sm ${
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

        {/* Approve / Reject for admin/HR */}
        {user?.role !== "employee" && leave.status === "pending" && (
          <div className="flex justify-end gap-2 mb-2">
            <button
              onClick={onApprove}
              className="px-2 py-1 bg-green-500 text-sm text-white rounded hover:bg-green-600"
            >
              Approve
            </button>
            <button
              onClick={onReject}
              className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
            >
              Reject
            </button>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveViewModal;
