import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import EmployeeSelect from "../components/EmployeeSelect";
import api from "../utils/api";

export default function UpdateLeave() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("casual");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch leave
  useEffect(() => {
    const fetchLeave = async () => {
      try {
        const res = await api.get(`/leave/${new Date().getFullYear()}/${new Date().getMonth() + 1}`);
        const leave = res.data.leaves.find(l => l._id === id);
        if (!leave) {
          alert("Leave not found");
          navigate("/leave");
          return;
        }

        setEmployeeId(leave.employeeId?._id || "");
        setDate(leave.date ? new Date(leave.date).toISOString().split("T")[0] : "");
        setType(leave.type || "casual");
        setReason(leave.reason || "");
      } catch (err) {
        console.error(err);
        alert("Failed to load leave");
      } finally {
        setLoading(false);
      }
    };
    fetchLeave();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/leave/${id}`, { employeeId, date, type, reason });
      alert("Leave updated successfully");
      navigate("/leave");
    } catch (err) {
      alert("Update failed");
    }
  };

  if (loading) return <Layout><div className="p-6 text-center">Loading...</div></Layout>;

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-6 bg-white p-5 rounded shadow">
        <h2 className="font-semibold mb-4">Update Leave</h2>
        <form className="space-y-3" onSubmit={handleUpdate}>
          <div>
            <label className="block mb-1 text-sm">Employee</label>
            <EmployeeSelect value={employeeId} onChange={e => setEmployeeId(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 text-sm">Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm">Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="casual">Casual</option>
              <option value="sick">Sick</option>
              <option value="office">Office</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 text-sm">Reason</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              rows="3"
              className="w-full border rounded px-3 py-2 text-sm resize-none"
            />
          </div>
          <div className="flex justify-between pt-2">
            <button type="button" onClick={() => navigate("/leave")} className="px-4 py-2 bg-gray-400 text-white rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Update
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
