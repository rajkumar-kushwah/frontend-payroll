import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getEmployees, getAttendance, checkIn, checkOut, addAttendance } from "../utils/api";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function AttendanceManual() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [remarks, setRemarks] = useState("");
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.employees || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await getAttendance();
      const list = Array.isArray(res.data) ? res.data : res.data?.records || [];
      setAttendanceList(list);
    } catch (err) {
      console.error(err);
      setAttendanceList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, []);

  const handleCheckIn = async () => {
    if (!selectedEmployee) return alert("Select an employee");
    try {
      await checkIn(selectedEmployee);
      setRemarks("");
      setSelectedEmployee("");
      fetchAttendance();
    } catch {
      alert("Check-in failed");
    }
  };

  const handleCheckOut = async (employeeId) => {
    try {
      await checkOut(employeeId);
      fetchAttendance();
    } catch {
      alert("Check-out failed");
    }
  };

  const formatTime = (date) => {
    if (!date) return "-";
    const d = new Date(date);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const calculateHours = (inTime, outTime) => {
    if (!inTime || !outTime) return { total: "-", overtime: "-" };
    const diffMs = new Date(outTime) - new Date(inTime);
    const totalHours = diffMs / (1000*60*60);
    const h = Math.floor(totalHours);
    const m = Math.round((totalHours - h)*60);
    const overtime = totalHours > 8 ? totalHours - 8 : 0;
    const oh = Math.floor(overtime);
    const om = Math.round((overtime - oh)*60);
    return { total: `${h}:${m.toString().padStart(2,"0")}`, overtime: `${oh}:${om.toString().padStart(2,"0")}` };
  };

  return (
    <Layout>
      <div className="p-2 text-xs">
        {/* Manual Check-In Form */}
        <div className="bg-white rounded shadow p-2 mb-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>
            <label>Employee</label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              className="border p-1 rounded w-full text-xs"
            >
              <option value="">-- Select Employee --</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} ({emp.employeeCode})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Remarks</label>
            <input
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Optional"
              className="border p-1 rounded w-full text-xs"
            />
          </div>
          <div className="flex gap-2 items-end">
            <button
              onClick={handleCheckIn}
              className="bg-green-500 text-white p-1 rounded flex items-center gap-1"
            >
              <FaCheck /> In
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="overflow-x-auto bg-white rounded shadow text-xs max-h-[60vh]">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {["Avatar", "Employee", "Code", "Date", "Status", "In", "Out", "Total Hours", "Overtime", "Remarks", "Action"].map(h => (
                  <th key={h} className="p-1">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="11" className="text-center p-2">Loading...</td></tr>
              ) : attendanceList.length ? (
                attendanceList.map(att => {
                  const { total, overtime } = calculateHours(att.checkIn, att.checkOut);
                  return (
                    <tr key={att._id} className="hover:bg-gray-50">
                      <td className="p-1">
                        <img src={att.employeeId?.avatar || "/default-avatar.png"} alt={att.employeeId?.name} className="w-6 h-6 rounded-full"/>
                      </td>
                      <td className="p-1">{att.employeeId?.name || "-"}</td>
                      <td className="p-1">{att.employeeId?.employeeCode || "-"}</td>
                      <td className="p-1">{att.date ? new Date(att.date).toLocaleDateString() : "-"}</td>
                      <td className="p-1">{att.status}</td>
                      <td className="p-1">{att.checkIn ? formatTime(att.checkIn) : "-"}</td>
                      <td className="p-1">{att.checkOut ? formatTime(att.checkOut) : "-"}</td>
                      <td className="p-1">{total}</td>
                      <td className="p-1">{overtime}</td>
                      <td className="p-1">{att.remarks || "-"}</td>
                      <td className="p-1">
                        {!att.checkOut && att.checkIn && (
                          <button
                            onClick={() => handleCheckOut(att.employeeId?._id)}
                            className="bg-red-500 text-white p-1 rounded flex items-center gap-1"
                          >
                            <FaTimes /> Out
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr><td colSpan="11" className="text-center p-2">No Records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
