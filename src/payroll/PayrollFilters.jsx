import React from "react";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const PayrollFilters = ({ month, setMonth }) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const [selectedMonth, selectedYear] = month.split(" ");

  const handleMonthChange = (m) => setMonth(`${m} ${selectedYear}`);
  const handleYearChange = (y) => setMonth(`${selectedMonth} ${y}`);

  return (
    <div className="flex flex-wrap items-center gap-4 mb-3">
      {/* Month Dropdown */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-600 mb-1">
          Month
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {monthNames.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* Year Dropdown */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-600 mb-1">
          Year
        </label>
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default PayrollFilters;
