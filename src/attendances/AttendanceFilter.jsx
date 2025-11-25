// src/pages/attendance/AttendanceFilter.jsx
import { useState, useEffect } from "react";
import { filterAttendance } from "../utils/api";
import { FaSearch } from "react-icons/fa";

export default function AttendanceFilter({ onFilter }) {
  const [search, setSearch] = useState("");

  // Auto search + auto refresh
  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await filterAttendance({ employeeName: search });
        onFilter(res.records || []);
      } catch {}
    }, 300); // delay for smooth auto-search

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="flex gap-1 flex-wrap items-center">

      {/* input + icon inside */}
      <div className="relative">
        <FaSearch className="absolute left-2 top-2 text-gray-400 text-xs" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Employee"
          className="border pl-6 p-1 rounded text-xs w-40"
        />
      </div>

    </div>
  );
}
