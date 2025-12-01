import React, { useState, useEffect } from "react";
import { getEmployees } from "../utils/api";

const SHIFT_TYPES = ["Full-day", "Half-day", "Night", "Custom"];
const WEEK_DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function WorkScheduleForm({ selectedSchedule, onSubmit, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [inTime, setInTime] = useState("");
  const [outTime, setOutTime] = useState("");
  const [shiftName, setShiftName] = useState("Default Shift");
  const [shiftType, setShiftType] = useState("Full-day");
  const [weeklyOff, setWeeklyOff] = useState(["Sunday"]);
  const [breakStart, setBreakStart] = useState("");
  const [breakEnd, setBreakEnd] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (selectedSchedule) {
      setEmployeeId(selectedSchedule.employeeId?._id || "");
      setInTime(selectedSchedule.inTime || "");
      setOutTime(selectedSchedule.outTime || "");
      setShiftName(selectedSchedule.shiftName || "Default Shift");
      setShiftType(selectedSchedule.shiftType || "Full-day");
      setWeeklyOff(selectedSchedule.weeklyOff || ["Sunday"]);
      setBreakStart(selectedSchedule.breakStart || "");
      setBreakEnd(selectedSchedule.breakEnd || "");
    } else {
      setEmployeeId("");
      setInTime("");
      setOutTime("");
      setShiftName("Default Shift");
      setShiftType("Full-day");
      setWeeklyOff(["Sunday"]);
      setBreakStart("");
      setBreakEnd("");
    }
  }, [selectedSchedule]);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.employees || []);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleWeeklyOff = (day) => {
    if (weeklyOff.includes(day)) {
      setWeeklyOff(weeklyOff.filter(d => d !== day));
    } else {
      setWeeklyOff([...weeklyOff, day]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!employeeId) return alert("Select an employee");

    onSubmit({
      employeeId,
      inTime,
      outTime,
      shiftName,
      shiftType,
      weeklyOff,
      breakStart,
      breakEnd,
    });

    if (!selectedSchedule) {
      setEmployeeId("");
      setInTime("");
      setOutTime("");
      setShiftName("Default Shift");
      setShiftType("Full-day");
      setWeeklyOff(["Sunday"]);
      setBreakStart("");
      setBreakEnd("");
      setSearchTerm("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <div className="relative w-96 h-full bg-white shadow-lg p-4 flex flex-col z-10 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold">
            {selectedSchedule ? "Edit Schedule" : "Add Schedule"}
          </h3>
          <button onClick={onClose} className="text-xs font-bold">Back</button>
        </div>

        <form className="flex flex-col gap-2 text-xs" onSubmit={handleSubmit}>
          {/* Employee Dropdown */}
          <label>Employee</label>
          <div className="relative">
            <input
              type="text"
              value={employeeId ? employees.find(e => e._id === employeeId)?.name : searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setDropdownOpen(true); }}
              onClick={() => setDropdownOpen(true)}
              placeholder="Type to search..."
              className="border p-1 rounded w-full text-xs"
              autoComplete="off"
            />
            {dropdownOpen && (
              <ul className="absolute z-50 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto mt-1 text-xs">
                {filteredEmployees.map(emp => (
                  <li
                    key={emp._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => { setEmployeeId(emp._id); setSearchTerm(emp.name); setDropdownOpen(false); }}
                  >
                    <img src={emp.avatar || "/default-avatar.png"} className="w-5 h-5 rounded-full" />
                    <span>{emp.name} ({emp.employeeCode})</span>
                  </li>
                ))}
                {filteredEmployees.length === 0 && (
                  <li className="p-2 text-gray-500">No employees found</li>
                )}
              </ul>
            )}
          </div>

          {/* Shift Name */}
          <label>Shift Name</label>
          <input
            type="text"
            value={shiftName}
            onChange={e => setShiftName(e.target.value)}
            className="border p-1 rounded text-xs"
          />

          {/* Shift Type */}
          <label>Shift Type</label>
          <select
            value={shiftType}
            onChange={e => setShiftType(e.target.value)}
            className="border p-1 rounded text-xs"
          >
            {SHIFT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
          </select>

          {/* Weekly Off */}
          <label>Weekly Off</label>
          <div className="flex flex-wrap gap-2">
            {WEEK_DAYS.map(day => (
              <label key={day} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={weeklyOff.includes(day)}
                  onChange={() => toggleWeeklyOff(day)}
                />
                {day.slice(0,3)}
              </label>
            ))}
          </div>

          {/* Fixed In/Out */}
          <label>Fixed In</label>
          <input
            type="time"
            value={inTime}
            onChange={e => setInTime(e.target.value)}
            className="border p-1 rounded text-xs"
          />

          <label>Fixed Out</label>
          <input
            type="time"
            value={outTime}
            onChange={e => setOutTime(e.target.value)}
            className="border p-1 rounded text-xs"
          />

          {/* Break Start/End */}
          <label>Break Start</label>
          <input
            type="time"
            value={breakStart}
            onChange={e => setBreakStart(e.target.value)}
            className="border p-1 rounded text-xs"
          />

          <label>Break End</label>
          <input
            type="time"
            value={breakEnd}
            onChange={e => setBreakEnd(e.target.value)}
            className="border p-1 rounded text-xs"
          />

          {/* Submit */}
          <button
            type="submit"
            className="mt-2 border rounded bg-blue-100 hover:bg-blue-200 p-1 text-xs"
          >
            {selectedSchedule ? "Update" : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
}
