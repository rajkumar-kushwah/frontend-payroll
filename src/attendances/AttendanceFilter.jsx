export default function AttendanceFilter({ filters, setFilters }) {
return (
   <div className="flex gap-3 items-start flex-wrap">


  {/* Search by Name or Code */}
  <div className="flex flex-col">
    <label className="text-xs mb-1">Search/Filter</label>
    <input
      type="text"
      placeholder="Name or code"
      value={filters.search || ""}
      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
      className="border px-1 py-0.5 rounded text-xs w-[140px]"
    />
  </div>

  {/* Date Filter */}
  <div className="flex flex-col">
    <label className="text-xs mb-1">Filter/Date</label>
    <input
      type="date"
      placeholder="filter date..."
      value={filters.date || ""}
      onChange={(e) => setFilters({ ...filters, date: e.target.value })}
      className="border px-1 py-0.5 rounded text-xs w-[120px]"
    />
  </div>

  {/* Status Filter */}
  <div className="flex flex-col">
    <label className="text-xs mb-1">Filter/Status</label>
    <select
      value={filters.status || ""}
      placeholder="filter status..."
      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
      className="border px-1 py-0.5 rounded text-xs w-[120px]"
    >
      <option value="">Select status</option>
      <option value="present">Present</option>
      <option value="absent">Absent</option>
      <option value="half-day">Half Day</option>
    </select>
  </div>

</div>


);
}
