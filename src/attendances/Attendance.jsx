// src/pages/attendance/AttendanceMain.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import AttendanceFilter from "./AttendanceFilter";
import AttendanceActions from "./AttendanceActions";
import { getAttendance, deleteAttendance } from "../utils/api";
import { FaTrash, FaPlus, FaCheck } from "react-icons/fa";
import AttendanceForm from "./AttendanceForm";

export default function AttendanceMain() {
  const navigate = useNavigate();
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // =================== FETCH ATTENDANCE ===================
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await getAttendance();
      const list = Array.isArray(res.data) ? res.data : res.data?.records || [];

      // ✅ Correct filter: only registered employees
      const filtered = list.filter(a => a.employeeId?.registeredFromForm === true);
      setAttendanceList(filtered);

    } catch (err) {
      console.error(err);
      setAttendanceList([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  // =================== DELETE MULTIPLE ===================
  const handleDeleteSelected = async () => {
    if (!selectedRecords.length) return alert("Select records to delete");
    if (!confirm("Are you sure?")) return;

    for (let id of selectedRecords) {
      await deleteAttendance(id);
    }
    setSelectedRecords([]);
    fetchAttendance();
  };

  return (
    <Layout>
      <div className="p-2 text-xs">

        {/* ================= ACTIONS + FILTERS ================= */}
        <div className="flex flex-col md:flex-row md:justify-between gap-2 relative">
          <div className="mb-4 md:mb-0 md:absolute md:top-0 md:right-0 w-full md:w-auto">
            <h3 className="font-semibold mb-2 text-gray-700">Actions & Filters</h3>

            <div className="flex flex-wrap gap-2 items-center">
              <AttendanceFilter onFilter={setAttendanceList} />

              <button
                onClick={() => setShowRegisterForm(true)}
                className="border p-1 rounded flex items-center gap-1"
              >
                <FaPlus className="text-blue-500" /> Register Employee
              </button>

              <button
                onClick={handleDeleteSelected}
                className="border p-1 rounded flex items-center gap-1"
              >
                <FaTrash className="text-red-500" /> Delete
              </button>

              <button
                onClick={() => navigate("/manual-checkin")}
                className="border p-1 rounded flex items-center gap-1 bg-green-100 hover:bg-green-200"
              >
                <FaCheck className="text-green-500" /> Manual Check-In
              </button>
            </div>
          </div>
        </div>

        {/* ================= ATTENDANCE TABLE ================= */}
        <div className="flex flex-col mt-16">
          <h3 className="font-semibold mb-3 text-gray-700">Attendance Records</h3>

          <div className="overflow-x-auto rounded max-h-[60vh]">
            <table className="min-w-[900px] w-full text-xs border-collapse">
              <thead className="bg-gray-100 sticky top-0 text-left">
                <tr className="border-b">
                  <th className="p-2 w-10">
                    <input
                      type="checkbox"
                      checked={selectedRecords.length === attendanceList.length && attendanceList.length > 0}
                      onChange={(e) =>
                        e.target.checked
                          ? setSelectedRecords(attendanceList.map(a => a._id))
                          : setSelectedRecords([])
                      }
                    />
                  </th>
                  <th className="p-2">Employee</th>
                  <th className="p-2">Code</th>
                  <th className="p-2">Date</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">In</th>
                  <th className="p-2">Out</th>
                  <th className="p-2">Total Hours</th>
                  <th className="p-2">Overtime</th>
                  <th className="p-2">Remarks</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" className="text-center p-3">Loading...</td>
                  </tr>
                ) : attendanceList.length ? (
                  attendanceList.map(att => {
                    let totalHours = "-";
                    let overtime = "-";

                    if (att.checkIn && att.checkOut) {
                      const diffMs = new Date(att.checkOut) - new Date(att.checkIn);
                      const diffHrs = diffMs / (1000 * 60 * 60);

                      totalHours = diffHrs.toFixed(2);
                      overtime = diffHrs > 8 ? (diffHrs - 8).toFixed(2) : "0.00";
                    }

                    return (
                      <tr key={att._id} className="hover:bg-gray-200 border-b">
                        <td className="p-2">
                          <input
                            type="checkbox"
                            checked={selectedRecords.includes(att._id)}
                            onChange={(e) =>
                              e.target.checked
                                ? setSelectedRecords([...selectedRecords, att._id])
                                : setSelectedRecords(selectedRecords.filter(id => id !== att._id))
                            }
                          />
                        </td>

                        <td className="p-2 flex items-center gap-2">
                          <img
                            src={att.employeeId?.avatar || "/default-avatar.png"}
                            className="w-7 h-7 rounded-full"
                          />
                          {att.employeeId?.name}
                        </td>

                        <td className="p-2">{att.employeeId?.employeeCode}</td>
                        <td className="p-2">{new Date(att.date).toLocaleDateString()}</td>
                        <td className="p-2">{att.status}</td>
                        <td className="p-2">{att.checkIn ? new Date(att.checkIn).toLocaleTimeString() : "-"}</td>
                        <td className="p-2">{att.checkOut ? new Date(att.checkOut).toLocaleTimeString() : "-"}</td>
                        <td className="p-2">{totalHours}</td>
                        <td className="p-2">{overtime}</td>
                        <td className="p-2">{att.remarks || "-"}</td>

                        <td className="p-2">
                          <AttendanceActions record={att} onUpdate={fetchAttendance} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11" className="text-center p-3">No Records</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

       {/* REGISTER EMPLOYEE MODAL  */}
      {showRegisterForm && (
        <AttendanceForm
          onAdd={() => {
            setShowRegisterForm(false);
            fetchAttendance(); //  Refresh table after adding
          }}
          onClose={() => setShowRegisterForm(false)}
        />
      )}
    </Layout>
  );
}
