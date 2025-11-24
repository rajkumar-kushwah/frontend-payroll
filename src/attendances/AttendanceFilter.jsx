// src/pages/attendance/AttendanceFilter.jsx
import { useState } from "react";
import { filterAttendance } from "../utils/api";
import { FaSearch } from "react-icons/fa";

export default function AttendanceFilter({ onFilter }) {
  const [search, setSearch] = useState("");

  const handleSearch = async () => {
    try {
      const res = await filterAttendance({ employeeName: search });
      onFilter(res.records || []);
    } catch {}
  };

  return (
    <div className="flex gap-1 flex-wrap items-center">
      <input type="text" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search Employee" className="border p-1 rounded text-xs"/>
      <button onClick={handleSearch} className="bg-blue-500 text-white p-1 rounded text-xs flex items-center gap-1">
        <FaSearch /> Go
      </button>
    </div>
  );
}
