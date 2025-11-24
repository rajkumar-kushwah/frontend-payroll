// src/pages/attendance/AttendanceTable.jsx
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getAttendance, checkIn, checkOut } from "../utils/api";
import { FaCheck, FaTimes } from "react-icons/fa";

export default function AttendanceTable() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => { fetchAttendance(); }, []);

  const handleCheckIn = async (employeeId) => {
    try {
      await checkIn(employeeId);
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
    const totalHours = diffMs / (1000 * 60 * 60); // decimal hours
    const h = Math.floor(totalHours);
    const m = Math.round((totalHours - h) * 60);
    const overtime = totalHours > 8 ? totalHours - 8 : 0;
    const oh = Math.floor(overtime);
    const om = Math.round((overtime - oh) * 60);
    return { total: `${h}:${m.toString().padStart(2,"0")}`, overtime: `${oh}:${om.toString().padStart(2,"0")}` };
  };

  return (
    <Layout>
      <div className="p-2 text-xs">
        <div className="overflow-x-auto bg-white rounded shadow max-h-[60vh]">
          <table className="w-full border-collapse text-xs">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {["Avatar/Name","Code","Date","Status","In Time","Out Time","Total Hours","Overtime","Remarks","Actions"].map(h => (
                  <th key={h} className="p-1">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" className="text-center p-2">Loading...</td></tr>
              ) : attendanceList.length ? (
                attendanceList.map(att => {
                  const { total, overtime } = calculateHours(att.checkIn, att.checkOut);
                  const recordDate = att.date ? new Date(att.date).toLocaleDateString() : "-";

                  return (
                    <tr key={att._id} className="hover:bg-gray-50">
                      <td className="p-1 flex items-center gap-2">
                        <img 
                          src={att.employeeId?.avatar || "/default-avatar.png"} 
                          alt={att.employeeId?.name || "Avatar"} 
                          className="w-6 h-6 rounded-full"
                        />
                        {att.employeeId?.name || "-"}
                      </td>
                      <td className="p-1">{att.employeeId?.employeeCode || "-"}</td>
                      <td className="p-1">{recordDate}</td>
                      <td className="p-1">{att.status}</td>
                      <td className="p-1">{att.checkIn ? formatTime(att.checkIn) : "-"}</td>
                      <td className="p-1">{att.checkOut ? formatTime(att.checkOut) : "-"}</td>
                      <td className="p-1">{total}</td>
                      <td className="p-1">{overtime}</td>
                      <td className="p-1">{att.remarks || "-"}</td>
                      <td className="p-1 flex gap-1">
                        {!att.checkIn && (
                          <button onClick={()=>handleCheckIn(att.employeeId?._id)} className="bg-green-500 text-white p-1 rounded text-[10px] flex items-center gap-1">
                            <FaCheck /> In
                          </button>
                        )}
                        {att.checkIn && !att.checkOut && (
                          <button onClick={()=>handleCheckOut(att.employeeId?._id)} className="bg-red-500 text-white p-1 rounded text-[10px] flex items-center gap-1">
                            <FaTimes /> Out
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="10" className="text-center p-2">No Records</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
