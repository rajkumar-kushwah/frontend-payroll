// src/pages/attendance/AttendanceFilter.jsx
export default function AttendanceFilter({ filters, setFilters, employees }) {
  return (
    <div className="flex gap-2 items-center">
      <select
        value={filters.employeeId}
        onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
        className="border px-2 py-1 rounded text-sm"
      >
        <option value="">-- Filter by Employee --</option>
        {employees.map(emp => (
          <option key={emp._id} value={emp._id}>
            {emp.name}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={filters.date}
        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        className="border px-2 py-1 rounded text-sm"
      />

      <select
        value={filters.status}
        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        className="border px-2 py-1 rounded text-sm"
      >
        <option value="">-- Filter by Status --</option>
        <option value="Present">Present</option>
        <option value="Absent">Absent</option>
        <option value="Leave">Leave</option>
      </select>
    </div>
  );
}
