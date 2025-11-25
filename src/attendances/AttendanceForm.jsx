import { useEffect, useState } from "react";
import { getEmployees, addAttendance, getAttendance } from "../utils/api";
import { FaPlus, FaTimes } from "react-icons/fa";

export default function AttendanceForm({ onAdd, onClose }) {
  const [employees, setEmployees] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [status, setStatus] = useState("present");
  const [remarks, setRemarks] = useState("");
  const [date, setDate] = useState("");        
  const [inTime, setInTime] = useState("");     
  const [outTime, setOutTime] = useState("");   
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
    const today = new Date().toISOString().slice(0,10);
    setDate(today);
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.employees || []);
    } catch (err) {
      console.error("Failed to fetch employees", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await getAttendance();
      const list = Array.isArray(res.data) ? res.data : res.data?.records || [];
      setAttendanceList(list);
    } catch (err) {
      console.error("Failed to fetch attendance", err);
    }
  };

  const handleAdd = async () => {
    if (!selectedEmployee) return alert("Select an employee");

    // Check if employee already exists (ignore date)
    const existing = attendanceList.find(att => att.employeeId?._id === selectedEmployee);
    if (existing) return alert("Employee already added");

    try {
      await addAttendance({
        employeeId: selectedEmployee,
        status,
        remarks,
        date,
        checkIn: inTime ? new Date(`${date}T${inTime}`) : null,
        checkOut: outTime ? new Date(`${date}T${outTime}`) : null
      });

      // Refresh attendance list after adding
      await fetchAttendance();

      // Reset form
      setSelectedEmployee(null);
      setSearchTerm("");
      setStatus("present");
      setRemarks("");
      setInTime("");
      setOutTime("");
      const today = new Date().toISOString().slice(0,10);
      setDate(today);

      onAdd();
    } catch (err) {
      console.error("Failed to add attendance", err);
      alert("Failed to add attendance");
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 bg-black opacity-50" 
        onClick={onClose} 
      />

      {/* Modal */}
      <div className="bg-white rounded shadow-lg z-10 p-4 w-full max-w-xl relative">
        {/* Close Button */}
        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <h3 className="font-semibold mb-3 text-gray-700">Add Attendance</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* Employee Select */}
          <div className="sm:col-span-2 relative">
            <label>Employee</label>
            <input
              type="text"
              value={selectedEmployee ? employees.find(e => e._id === selectedEmployee)?.name : searchTerm}
              placeholder="Type to search..."
              onChange={e => {
                setSearchTerm(e.target.value);
                setDropdownOpen(true);
              }}
              onClick={() => setDropdownOpen(true)}
              className="border p-1 rounded w-full"
            />

            {dropdownOpen && (
              <ul className="absolute z-50 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto mt-1 text-xs">
                {filteredEmployees.map(emp => (
                  <li
                    key={emp._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setSelectedEmployee(emp._id);
                      setSearchTerm(emp.name);
                      setDropdownOpen(false);
                    }}
                  >
                    <img
                      src={emp.avatar || "/default-avatar.png"}
                      className="w-5 h-5 rounded-full"
                    />
                    <span>{emp.name} ({emp.employeeCode})</span>
                  </li>
                ))}
                {filteredEmployees.length === 0 && (
                  <li className="p-2 text-gray-500">No employees found</li>
                )}
              </ul>
            )}
          </div>

          {/* Status */}
          <div>
            <label>Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="border p-1 rounded w-full">
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="leave">Leave</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-1 rounded w-full"/>
          </div>

          {/* In Time */}
          <div>
            <label>In Time</label>
            <input type="time" value={inTime} onChange={e => setInTime(e.target.value)} className="border p-1 rounded w-full"/>
          </div>

          {/* Out Time */}
          <div>
            <label>Out Time</label>
            <input type="time" value={outTime} onChange={e => setOutTime(e.target.value)} className="border p-1 rounded w-full"/>
          </div>

          {/* Remarks */}
          <div className="sm:col-span-2">
            <label>Remarks</label>
            <input value={remarks} onChange={e => setRemarks(e.target.value)} className="border p-1 rounded w-full"/>
          </div>

          {/* Submit */}
          <div className="sm:col-span-2 flex justify-end mt-2 gap-2">
            <button 
              onClick={handleAdd} 
              className="bg-green-500 text-white p-1 rounded flex items-center gap-1"
            >
              <FaPlus /> Add Attendance
            </button>
            <button 
              onClick={onClose} 
              className="bg-gray-300 text-gray-800 p-1 rounded flex items-center gap-1"
            >
              <FaTimes /> Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
