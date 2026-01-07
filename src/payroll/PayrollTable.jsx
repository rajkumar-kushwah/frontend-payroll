import React from "react";

const PayrollTable = ({ payrolls = [], onGenerateSlip }) => {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border border-gray-300 text-xs">
        <thead className="bg-gray-100">
          <tr className="border-b border-gray-300 text-gray-700">
            <th className="px-2 py-2 border-r">Emp Code</th>
            <th className="px-2 py-2 border-r">Employee</th>
            <th className="px-2 py-2 border-r">Month</th>
            <th className="px-2 py-2 border-r text-center">Total Work</th>
            <th className="px-2 py-2 border-r text-center">Present</th>
            <th className="px-2 py-2 border-r text-center">Leave</th>
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
              <td colSpan="11" className="text-center py-4 text-gray-500">
                No payroll data found
              </td>
            </tr>
          ) : (
            payrolls.map((p) => (
              <tr key={p.employeeId} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-2 py-2 border-r font-medium">{p.employeeCode}</td>
                <td className="px-2 py-2 border-r">
                  <div className="flex items-center gap-2">
                    <img src={p.avatar || "/avatar.png"} alt={p.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="font-medium overflow-hidden truncate whitespace-nowrap">{p.name}</span>
                  </div>
                </td>
                <td className="px-2 py-2 border-r">{p.month}</td>
                <td className="px-2 py-2 border-r text-center">{p.totalWorking || 0}</td>
                <td className="px-2 py-2 border-r text-center">{p.present || 0}</td>
                <td className="px-2 py-2 border-r text-center">{p.leave || 0}</td>
                <td className="px-2 py-2 border-r text-center">{p.officeHolidays || 0}</td>
                <td className="px-2 py-2 border-r text-center">{p.weeklyOff || 0}</td>
                <td className="px-2 py-2 border-r text-center">{p.missingDays || 0}</td>
                <td className="px-2 py-2 border-r text-center">{p.overtimeHours || 0}</td>
                <td className="px-2 py-2 text-center">
                  <button onClick={() => onGenerateSlip(p.employeeId)} className="border border-blue-600 text-blue-600 px-2 py-1 rounded hover:bg-blue-50">
                    export
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
