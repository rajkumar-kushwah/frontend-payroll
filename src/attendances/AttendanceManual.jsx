// src/pages/attendance/AttendanceMain.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AttendanceFilter from "./AttendanceFilter";
import {
  getEmployees,
  getAttendance,
  checkIn,
  checkOut,
  deleteAttendance
} from "../utils/api";

import { FaTrash, FaCheck, FaTimes } from "react-icons/fa";

export default function AttendanceMain() {
  const [employees, setEmployees] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [remarks, setRemarks] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fixed Office Hours
  const OFFICE_START_HOUR = 9; // 9:00 AM
  const OFFICE_END_HOUR = 18; // 6:00 PM
  const OFFICE_END_MIN = 30; // 6:30 PM

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    const emp = await getEmployees();
    const att = await getAttendance();
    setEmployees(emp || []);
    setAttendanceList(att.records || []);
  };

 const handleCheckIn = async () => {
  if (!selectedEmployee) return alert("Select Employee");

  const empExists = employees.find(e => e._id === selectedEmployee);
  if (!empExists) return alert("Employee not added");

  // Check if employee has inTime set
  if (!empExists.inTime) return alert("In time not set for this employee");

  await checkIn({
    employeeId: selectedEmployee,
    remarks,
    inTime: empExists.inTime // employee record se inTime use
  });

  setSelectedEmployee("");
  setRemarks("");
  loadAll();
};

const handleCheckOut = async (id) => {
  const attendanceItem = attendanceList.find(a => a._id === id);
  if (!attendanceItem) return alert("Attendance record not found");

  // Check if outTime is set in employee record
  if (!attendanceItem.outTime) return alert("Out time not set for this employee");

  await checkOut(id, { outTime: attendanceItem.outTime }); 
  loadAll();
};


  const handleDelete = async (id) => {
    await deleteAttendance(id);
    loadAll();
  };

  const handleFilterData = (filtered) => setAttendanceList(filtered);

  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime) return { total: "-", overtime: "-" };

    const start = new Date(inTime);
    const end = new Date(outTime);
    let diffMs = end - start;
    if (diffMs < 0) return { total: "-", overtime: "-" };

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const totalH = Math.floor(totalMinutes / 60);
    const totalM = totalMinutes % 60;
    const total = `${totalH}:${String(totalM).padStart(2, "0")}`;

    // Fixed Office End
    const fixedEnd = new Date(start);
    fixedEnd.setHours(OFFICE_END_HOUR, OFFICE_END_MIN, 0, 0);

    let overtimeMinutes = 0;
    if (end > fixedEnd) {
      overtimeMinutes = Math.floor((end - fixedEnd) / (1000 * 60));
    }

    const oh = Math.floor(overtimeMinutes / 60);
    const om = overtimeMinutes % 60;
    const overtime = `${oh}:${String(om).padStart(2, "0")}`;

    return { total, overtime };
  };

  return (
    <Layout>
      <div className="p-2 flex flex-col gap-3">
        <AttendanceFilter onFilter={handleFilterData} />

        {/* Manual Check-in */}
        <div className="rounded p-3 bg-transparent border border-gray-200 shadow-sm backdrop-blur-xl flex flex-col gap-3">

          {/* Employee Dropdown */}
          <div className="relative">
            <div
              className="border rounded w-full p-1 text-xs bg-white cursor-pointer flex justify-between items-center"
              onClick={() => setDropdownOpen(prev => !prev)}
            >
              <span>
                {selectedEmployee
                  ? employees.find(e => e._id === selectedEmployee)?.name
                  : "-- Select Employee --"}
              </span>
              <i className="fa fa-chevron-down text-gray-500 text-[10px]"></i>
            </div>

            {dropdownOpen && (
              <ul className="absolute z-50 mt-1 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto text-xs">
                <li
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => { setSelectedEmployee(""); setDropdownOpen(false); }}
                >
                  -- Select Employee --
                </li>
                {employees.length === 0 ? (
                  <li className="p-2 text-gray-500">No employees</li>
                ) : (
                  employees.map(emp => (
                    <li
                      key={emp._id}
                      className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                      onClick={() => { setSelectedEmployee(emp._id); setDropdownOpen(false); }}
                    >
                      <img src={emp.avatar || "/default-avatar.png"} className="w-5 h-5 rounded-full"/>
                      <span>{emp.name} ({emp.employeeCode})</span>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>

          {/* Remarks */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-600 text-xs font-medium">Remarks</label>
            <input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional"
              className="w-full border border-gray-300 rounded-lg py-2 px-2 text-xs bg-transparent focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCheckIn}
              className="bg-green-500 text-white px-3 py-2 rounded-lg text-xs flex items-center gap-1 shadow"
            >
              <FaCheck size={10} /> Check In
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-auto rounded border border-gray-200">
          <table className="w-full text-xs">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2 text-left">Employee</th>
                <th className="p-2">Date</th>
                <th className="p-2">In</th>
                <th className="p-2">Out</th>
                <th className="p-2">Hours</th>
                <th className="p-2">OT</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {attendanceList.map(item => {
                const { total, overtime } = calculateHours(item.inTime, item.outTime);
                return (
                  <tr key={item._id} className="border-t">
                    <td className="p-2">{item.employeeName}</td>
                    <td className="p-2">{item.date}</td>
                    <td className="p-2">{item.inTimeDisplay}</td>
                    <td className="p-2">{item.outTimeDisplay || "-"}</td>
                    <td className="p-2">{total}</td>
                    <td className="p-2">{overtime}</td>
                    <td className="p-2 flex gap-2">
                      {!item.outTime && (
                        <button
                          onClick={() => handleCheckOut(item._id)}
                          className="bg-blue-500 text-white p-1 rounded"
                        >
                          <FaTimes size={10} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        <FaTrash size={10} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
