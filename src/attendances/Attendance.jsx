// src/pages/attendance/AttendanceList.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import {
  getAttendance,
  deleteAttendance,
  filterAttendance,
  checkIn,
  checkOut,
} from "../utils/api";
import { FaTrash, FaSearch, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import AddAttendance from "./AddAttendance";
import EditAttendance from "./EditAttendance";

export default function AttendanceList() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  const fetchAttendanceList = async () => {
    setLoading(true);
    try {
      const res = await getAttendance();
      const list = Array.isArray(res.data) ? res.data : res.data?.records || [];
      setAttendanceList(list);
    } catch (err) {
      console.error("Attendance fetch failed:", err);
      setAttendanceList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceList();
  }, []);

  const handleDeleteSelected = async () => {
    if (!selectedRecords.length) return alert("Select records to delete");
    if (!confirm("Are you sure you want to delete selected records?")) return;
    try {
      for (let id of selectedRecords) await deleteAttendance(id);
      setSelectedRecords([]);
      fetchAttendanceList();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedRecords(attendanceList.map((att) => att._id));
    else setSelectedRecords([]);
  };

  const handleSearch = async () => {
    try {
      const res = await filterAttendance({ employeeName: search });
      const list = Array.isArray(res.records) ? res.records : [];
      setAttendanceList(list);
    } catch (err) {
      console.error("Filter failed:", err);
    }
  };

  const handleCheckIn = async (employeeId) => {
    try {
      await checkIn(employeeId);
      fetchAttendanceList();
    } catch (err) {
      alert(err?.response?.data?.message || "Check-in failed");
    }
  };

  const handleCheckOut = async (employeeId) => {
    try {
      await checkOut(employeeId);
      fetchAttendanceList();
    } catch (err) {
      alert(err?.response?.data?.message || "Check-out failed");
    }
  };

  return (
    <Layout>
      <div className="p-2 text-xs">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-2 gap-2 flex-wrap">
          <div>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
          <div className="flex gap-1 items-center flex-wrap">
            <FaSearch className="cursor-pointer" onClick={handleSearch} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Employee"
              className="border p-1 rounded text-xs ml-1"
            />
            <button onClick={handleSearch} className="bg-blue-500 text-white p-1 rounded text-xs ml-1">Go</button>
            <button onClick={() => setShowAdd(true)} className="bg-green-500 text-white p-1 rounded text-xs ml-1">Add Attendance</button>
            <button onClick={handleDeleteSelected} className="bg-red-600 text-white p-1 rounded text-xs ml-1">Delete Selected</button>
          </div>
        </div>

        {/* Add Attendance Drawer */}
        {showAdd && <AddAttendance onClose={() => { setShowAdd(false); fetchAttendanceList(); }} />}

        {/* Edit Attendance Drawer */}
        {editRecord && <EditAttendance record={editRecord} onClose={() => { setEditRecord(null); fetchAttendanceList(); }} />}

        {/* Attendance Table */}
        <div className="overflow-x-auto bg-white rounded shadow text-xs max-h-[60vh]">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-1">
                  <input type="checkbox" checked={selectedRecords.length === attendanceList.length && attendanceList.length > 0} onChange={handleSelectAll} />
                </th>
                {["Employee", "Code", "Date", "Status", "Check In", "Check Out", "Total Hours", "Remarks", "Actions"].map(h => <th key={h} className="p-1">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" className="text-center p-2">Loading...</td></tr>
              ) : attendanceList.length ? (
                attendanceList.map(att => {
                  const checkInDate = att.checkIn ? new Date(att.checkIn) : null;
                  const checkOutDate = att.checkOut ? new Date(att.checkOut) : null;
                  const totalHours = checkInDate && checkOutDate ? ((checkOutDate - checkInDate)/(1000*60*60)).toFixed(2) : "-";
                  const recordDate = att.date ? new Date(att.date).toLocaleDateString() : "-";

                  return (
                    <tr key={att._id} className="hover:bg-gray-50">
                      <td className="p-1">
                        <input type="checkbox" checked={selectedRecords.includes(att._id)} onChange={e => {
                          if (e.target.checked) setSelectedRecords([...selectedRecords, att._id]);
                          else setSelectedRecords(selectedRecords.filter(id => id !== att._id));
                        }}/>
                      </td>
                      <td className="p-1">{att.employeeId?.name || "-"}</td>
                      <td className="p-1">{att.employeeId?.employeeCode || "-"}</td>
                      <td className="p-1">{recordDate}</td>
                      <td className="p-1">{att.status}</td>
                      <td className="p-1">{checkInDate?.toLocaleTimeString() || "-"}</td>
                      <td className="p-1">{checkOutDate?.toLocaleTimeString() || "-"}</td>
                      <td className="p-1">{totalHours}</td>
                      <td className="p-1">{att.remarks || "-"}</td>
                      <td className="p-1 flex gap-1">
                        {!att.checkIn && (
                          <button onClick={() => handleCheckIn(att.employeeId?._id)} className="bg-green-500 text-white p-1 rounded text-[10px] flex items-center gap-1">
                            <FaCheck /> In
                          </button>
                        )}
                        {att.checkIn && !att.checkOut && (
                          <button onClick={() => handleCheckOut(att.employeeId?._id)} className="bg-red-500 text-white p-1 rounded text-[10px] flex items-center gap-1">
                            <FaTimes /> Out
                          </button>
                        )}
                        <button onClick={() => setEditRecord(att)} className="bg-yellow-500 text-white p-1 rounded text-[10px] flex items-center gap-1">
                          <FaEdit /> Edit
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="9" className="text-center p-2">No Attendance Records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
