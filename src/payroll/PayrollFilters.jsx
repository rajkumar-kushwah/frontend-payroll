import React, { useState } from "react";

const monthNames = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const PayrollFilters = ({ month, setMonth }) => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear - 1, currentYear, currentYear + 1];

  const [dropdownMonthOpen, setDropdownMonthOpen] = useState(false);
  const [dropdownYearOpen, setDropdownYearOpen] = useState(false);

  const [selectedMonth, selectedYear] = month.split(" ");

  const handleMonthChange = (m) => {
    setMonth(`${m} ${selectedYear}`);
    setDropdownMonthOpen(false); // close dropdown
  };

  const handleYearChange = (y) => {
    setMonth(`${selectedMonth} ${y}`);
    setDropdownYearOpen(false); // close dropdown
  };

  return (
    <div className="flex flex-wrap items-center gap-4 mb-3">
      {/* Month Dropdown */}
      <div className="relative flex flex-col">
        <label className="text-xs font-medium text-gray-600 mb-1">Month</label>
        <div
          className="border border-gray-300 rounded px-2 py-1 gap-2 text-xs flex justify-between items-center cursor-pointer"
          onClick={() => setDropdownMonthOpen(!dropdownMonthOpen)}
        >
          <span>{selectedMonth}</span>
          <span
            className={`transition-transform duration-300 ${
              dropdownMonthOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            <i class="fa fa-caret-down" aria-hidden="true"></i>
          </span>
        </div>
        {dropdownMonthOpen && (
          <ul className="absolute top-full left-0 right-0 border border-gray-300 rounded bg-white z-10 max-h-40 overflow-y-auto">
            {monthNames.map((m) => (
              <li
                key={m}
                onClick={() => handleMonthChange(m)}
                className="px-2 py-1 hover:bg-blue-100 cursor-pointer text-xs"
              >
                {m}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Year Dropdown */}
      <div className="relative flex flex-col">
        <label className="text-xs font-medium text-gray-600 mb-1">Year</label>
        <div
          className="border border-gray-300 rounded px-2 py-1 gap-2 text-xs flex justify-between items-center cursor-pointer"
          onClick={() => setDropdownYearOpen(!dropdownYearOpen)}
        >
          <span>{selectedYear}</span>
          <span
            className={`transition-transform duration-300 ${
              dropdownYearOpen ? "rotate-180" : "rotate-0"
            }`}
          >
        <i class="fa fa-caret-down" aria-hidden="true"></i>
          </span>
        </div>
        {dropdownYearOpen && (
          <ul className="absolute top-full left-0 right-0 border border-gray-300 rounded bg-white z-10 max-h-40 overflow-y-auto">
            {years.map((y) => (
              <li
                key={y}
                onClick={() => handleYearChange(y)}
                className="px-2 py-1 hover:bg-blue-100 cursor-pointer text-xs"
              >
                {y}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default PayrollFilters;
