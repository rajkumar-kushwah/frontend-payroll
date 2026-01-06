import React from "react";
import { exportPayrollCsv } from "../utils/api";

const PayrollTable = ({ payrolls = [], month }) => {
  const handleExport = async (employeeId, employeeName) => {
    try {
      const response = await exportPayrollCsv(employeeId, month);

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Payroll_${employeeName}_${month}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export CSV");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300 text-xs">
        <thead className="bg-gray-100">
          <tr className="border-b border-gray-300 text-gray-700">
            <th className="px-2 py-2 border-r">Emp Code</th>
            <th className="px-2 py-2 border-r">Employee</th>
            <th className="px-2 py-2 border-r">Month</th>
            <th className="px-2 py-2 border-r text-center">Total work</th>
            <th className="px-2 py-2 border-r text-center">Present</th>
            <th className="px-2 py-2 border-r text-center">Paid Leave</th>
            <th className="px-2 py-2 border-r text-center">Unpaid Leave</th>
            <th className="px-2 py-2 border-r text-center">Holidays</th>
            <th className="px-2 py-2 border-r text-center">Weekly Off</th>
            <th className="px-2 py-2 border-r text-center">Missing</th>
            <th className="px-2 py-2 border-r text-center">Overtime</th>
            <th className="px-2 py-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {payrolls.length === 0 ? (
            <tr>
              <td colSpan="12" className="text-center py-4 text-gray-500">
                No payroll data found
              </td>
            </tr>
          ) : (
            payrolls.map((item) => (
              <tr
                key={item.employeeId}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-2 py-2 border-r font-medium">
                  {item.employeeCode}
                </td>

                <td className="px-2 py-2 border-r">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.avatar || "/avatar.png"}
                      alt={item.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="whitespace-nowrap">{item.name}</span>
                  </div>
                </td>

                <td className="px-2 py-2 border-r">{item.month}</td>
                <td className="px-2 py-2 border-r text-center">{item.totalWorking}</td>
                <td className="px-2 py-2 border-r text-center">{item.present}</td>
                <td className="px-2 py-2 border-r text-center">{item.paidLeaves}</td>
                <td className="px-2 py-2 border-r text-center">{item.unpaidLeaves}</td>
                <td className="px-2 py-2 border-r text-center">{item.officeHolidays}</td>
                <td className="px-2 py-2 border-r text-center">{item.weeklyOffCount}</td>
                <td className="px-2 py-2 border-r text-center">{item.missingDays}</td>
                <td className="px-2 py-2 border-r text-center">{item.overtimeHours}</td>

                <td className="px-2 py-2 text-center">
                  <button
                    onClick={() =>
                      handleExport(item.employeeId, item.name)
                    }
                    className="border border-blue-600 text-blue-600 px-2 py-1 rounded hover:bg-blue-50"
                  >
                    Export CSV
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollTable;
