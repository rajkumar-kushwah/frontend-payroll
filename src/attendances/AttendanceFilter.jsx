// src/pages/attendance/AttendanceFilter.jsx
export default function AttendanceFilter({ filters, setFilters }) {
  return (
    <div className="flex gap-2 items-center flex-wrap">
      {/*  Search by Name or Code */}
      <input
        type="text"
        placeholder="Search by name or code..."
        value={filters.search || ""}
        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        className="border px-2 py-1 rounded text-sm w-[180px]"
      />

      {/* Date Filter */}
      <input
        type="date"
        value={filters.date || ""}
        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        className="border px-2 py-1 rounded text-sm"
      />

      {/* Status Filter */}
      <select
        value={filters.status || ""}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className="border px-2 py-1 rounded text-sm"
      >
        <option value="">Status</option>
        <option value="present">Present</option>
        <option value="absent">Absent</option>
        <option value="half-day">Half Day</option>
      </select>
    </div>
  );
}
