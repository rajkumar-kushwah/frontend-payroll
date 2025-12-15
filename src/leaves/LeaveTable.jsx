import { useEffect, useState } from "react";
import api from "../utils/api";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function LeaveTable() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const res = await api.get(`/leave/${today.getFullYear()}/${today.getMonth()+1}`);
      setLeaves(res.data.leaves || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this leave?")) return;
    try {
      await api.delete(`/leave/${id}`);
      fetchLeaves();
    } catch(err) {
      alert("Delete failed");
    }
  };

  const filtered = leaves.filter(l =>
    l.employeeId?.name.toLowerCase().includes(search.toLowerCase()) ||
    (l.type || "").toLowerCase().includes(search.toLowerCase()) ||
    (l.reason || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="overflow-x-auto max-h-[60vh] bg-white rounded shadow text-sm">
      <div className="p-2 flex justify-between items-center">
        <input
          placeholder="Search..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        />
        <button onClick={fetchLeaves} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">Refresh</button>
      </div>
      <table className="w-full border-collapse text-left min-w-[700px]">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {["Employee", "Date", "Type", "Reason", "Actions"].map(h => (
              <th key={h} className="px-3 py-2 border-b text-left text-xs truncate">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="5" className="text-center p-2">Loading...</td></tr>
          ) : filtered.length ? filtered.map(l => (
            <tr key={l._id} className="hover:bg-gray-50 border-b">
              <td className="px-3 py-2 truncate">{l.employeeId?.name || "-"}</td>
              <td className="px-3 py-2 truncate">{new Date(l.date).toLocaleDateString()}</td>
              <td className="px-3 py-2 truncate">{l.type}</td>
              <td className="px-3 py-2 truncate">{l.reason}</td>
              <td className="px-3 py-2 flex gap-2">
                <Pencil size={16} className="cursor-pointer text-yellow-500" />
                <Trash2 size={16} className="cursor-pointer text-red-500" onClick={() => handleDelete(l._id)} />
              </td>
            </tr>
          )) : (
            <tr><td colSpan="5" className="text-center p-2">No leaves</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

