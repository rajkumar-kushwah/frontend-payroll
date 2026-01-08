import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import AttendanceFilter from "./AttendanceFilter";
import AttendanceTable from "./AttendanceTable";
import AttendanceUpdate from "./AttendanceUpdate";
import { FaCheck } from "react-icons/fa";
import {
  getWorkSchedules,
  getAttendance,
  checkIn,
  checkOut,
  deleteAttendance
} from "../utils/api";

export default function MainAttendancePage() {



  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem("attendanceEmployees");
    return saved ? JSON.parse(saved) : [];
  });

  const [attendanceList, setAttendanceList] = useState(() => {
    const saved = localStorage.getItem("attendanceList");
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [filters, setFilters] = useState({ search: "", status: "", date: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const dropdownRef = useRef(null);

 

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

 

  const fetchEmployees = async () => {
    try {
      const res = await getWorkSchedules();

      const emps = (res.data || [])
        .filter(e => e.employeeId)
        .map(e => ({
          _id: e.employeeId._id,
          name: e.employeeId.name,
          avatar: e.employeeId.avatar || "/default-avatar.png",
          employeeCode: e.employeeId.employeeCode
        }));

      setEmployees(emps);
      localStorage.setItem("attendanceEmployees", JSON.stringify(emps));
    } catch (err) {
      console.error("Employee fetch error:", err);
    }
  };

  

  const fetchAttendance = async () => {
    try {
      
      localStorage.removeItem("attendanceList");

      const params = {};
      if (filters.status) params.status = filters.status;

      if (filters.date?.trim()) {
        params.startDate = filters.date;
        params.endDate = filters.date;
      }

      const res = await getAttendance(params);
      const list = res.data || [];

      setAttendanceList(list);
      localStorage.setItem("attendanceList", JSON.stringify(list));
    } catch (err) {
      console.error("Attendance fetch error:", err);
      setAttendanceList([]);
    }
  };

 

  const handleCheckIn = async () => {
    if (!selectedEmployee) {
      alert("Please select an employee");
      return;
    }

    //  CORRECT CONDITION CHECK
    const alreadyCheckedIn = attendanceList.find(
      a =>
        a.employeeId?._id === selectedEmployee &&
        a.checkIn &&
        !a.checkOut
    );

    if (alreadyCheckedIn) {
      alert("Employee already checked in");
      return;
    }

    try {
      await checkIn(selectedEmployee);
      await fetchAttendance();
      alert("Check-in successful");
    } catch {
      alert("Check-in failed");
    }
  };

 

  const handleCheckOut = async (empId) => {
    const record = attendanceList.find(
      a => a.employeeId?._id === empId
    );

    if (!record) {
      alert("No check-in record found");
      return;
    }

    if (record.checkOut) {
      alert("Already checked out");
      return;
    }

    try {
      await checkOut(empId);
      await fetchAttendance();
      alert("Check-out successful");
    } catch {
      alert("Check-out failed");
    }
  };



  const handleDelete = async (id) => {
    try {
      await deleteAttendance(id);
      await fetchAttendance();
      alert("Deleted successfully");
    } catch {
      alert("Delete failed");
    }
  };



  const handleEdit = (record) => {
    setEditingRecord(record);
  };

  const closeEditModal = () => {
    setEditingRecord(null);
  };



  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [filters.status, filters.date]);



  const filteredAttendance = attendanceList.filter((a) => {
    if (!filters.search) return true;
    const s = filters.search.toLowerCase();
    return (
      a.employeeId?.name?.toLowerCase().includes(s) ||
      a.employeeId?.employeeCode?.toLowerCase().includes(s)
    );
  });



  return (
    <Layout>
      <div className="p-2 flex flex-col gap-4">

        <h2 className="text-sm font-semibold">Daily Attendance</h2>

        {/* Employee Dropdown */}
        <div className="flex gap-2 items-center">
          <div ref={dropdownRef} className="relative w-48">
            <div
              className="border rounded px-2 py-1 text-xs bg-white cursor-pointer"
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

                {employees.map(e => (
                  <li
                    key={e._id}
                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      setSelectedEmployee(e._id);
                      setDropdownOpen(false);
                    }}
                  >
                    <img src={e.avatar} className="w-5 h-5 rounded-full" />
                    {e.name} ({e.employeeCode})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            onClick={handleCheckIn}
            className="bg-lime-400 hover:bg-lime-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1"
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

        {/* Edit Modal */}
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
