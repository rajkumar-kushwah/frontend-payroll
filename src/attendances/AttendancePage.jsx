import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import AttendanceFilter from "./AttendanceFilter";
import AttendanceTable from "./AttendanceTable";
import AttendanceUpdate from "./AttendanceUpdate";
import { FaCheck } from "react-icons/fa";
import { getWorkSchedules, getAttendance, checkIn, checkOut, deleteAttendance } from "../utils/api";

export default function MainAttendancePage() {
  const [employees, setEmployees] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [filters, setFilters] = useState({ search: "", status: "", date: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch Employees
  const fetchEmployees = async () => {
    try {
      const data = await getWorkSchedules();
      const emps = (data.data || [])
        .filter(e => e.employeeId)
        .map(e => ({
          _id: e.employeeId._id,
          name: e.employeeId.name,
          avatar: e.employeeId.avatar || "/default-avatar.png",
          employeeCode: e.employeeId.employeeCode,
        }));
      setEmployees(emps);
    } catch (err) {
      console.error("Employee Fetch Error:", err);
    }
  };

  // Fetch Attendance
  const fetchAttendance = async () => {
    try {
      const params = {};
      if (filters.status) params.status = filters.status;
      if (filters.date && filters.date.trim() !== "") {
        params.startDate = filters.date;
        params.endDate = filters.date;
      }
      const data = await getAttendance(params);
      setAttendanceList(data.data || []);
    } catch (err) {
      console.error("Attendance Fetch Error:", err);
      setAttendanceList([]);
    }
  };

  // Check-in
  const handleCheckIn = async () => {
    if (!selectedEmployee) return alert("Please select an employee!");


    // Check if already checked in today
    const alreadyCheckedIn = attendanceList.find(
      a => a.employeeId?._id === selectedEmployee && a.status === "checked-in"
    );
    if (alreadyCheckedIn) {
      return alert("Employee already checked in!");
    }

    try {
      await checkIn(selectedEmployee);
      fetchAttendance(); // Update table immediately
      alert("Check-in recorded!");
    } catch {
      alert("Check-in failed");
    }


  };

  // Check-out
  const handleCheckOut = async (empId) => {
    const record = attendanceList.find(a => a.employeeId?._id === empId);
    if (!record) return alert("No check-in record found!");
    if (record.status === "checked-out")
      return alert("Employee already checked out!");

    try {
      await checkOut(empId);
      fetchAttendance(); // Update table immediately
      alert("Checked out!");
    } catch {
      alert("Check-out failed");
    }


  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await deleteAttendance(id);
      fetchAttendance(); // Update table immediately
      alert("Deleted!");
    } catch {
      alert("Delete failed");
    }
  };

  // Edit modal
  const handleEdit = (record) => setEditingRecord(record);
  const closeEditModal = () => {
    setEditingRecord(null);
    fetchAttendance();
  };

  // Initial fetch
  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  // Fetch attendance on filter change
  useEffect(() => {
    fetchAttendance();
  }, [filters.status, filters.date]);

  // Search filter
  const filteredAttendance = attendanceList.filter((a) => {
    if (!filters.search) return true;
    const s = filters.search.toLowerCase();
    return (
      a.employeeId?.name?.toLowerCase().includes(s) ||
      a.employeeId?.employeeCode?.toLowerCase().includes(s)
    );
  });

  return (<Layout> <div className="p-2 flex flex-col gap-4"> <h2 className="text-sm font-semibold">Daily Attendance</h2>

    {/* Dropdown */}
    <div className="flex gap-2 items-center">
      <div ref={dropdownRef} className="relative w-48">
        <div
          className="flex items-center justify-between border border-gray-300 rounded px-2 py-1 text-xs bg-white cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {selectedEmployee
            ? employees.find(e => e._id === selectedEmployee)?.name
            : "-- Select Employee --"}
        </div>

        {dropdownOpen && (
          <ul className="absolute z-50 w-full bg-white border rounded shadow max-h-40 overflow-y-auto text-xs mt-1">
            <li
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedEmployee("");
                setDropdownOpen(false);
              }}
            >
              -- Select Employee --
            </li>

            {employees.map((e) => (
              <li
                key={e._id}
                className="p-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                onClick={() => {
                  setSelectedEmployee(e._id);
                  setDropdownOpen(false);
                }}
              >
                <img src={e.avatar} className="w-5 h-5 rounded-full" alt="" />
                {e.name} ({e.employeeCode})
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={handleCheckIn}
        className="bg-lime-400 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
      >
        <FaCheck size={12} /> Check In
      </button>
    </div>

    {/* Filters */}
    <div className="flex justify-end">
      <AttendanceFilter filters={filters} setFilters={setFilters} />
    </div>

    {/* Table */}
    <AttendanceTable
      attendanceList={filteredAttendance}
      onCheckOut={handleCheckOut}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />

    {editingRecord && (
      <AttendanceUpdate
        record={editingRecord}
        onUpdate={fetchAttendance}
        onClose={closeEditModal}
      />
    )}
  </div>
  </Layout>


  );
}
