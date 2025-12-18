import { useEffect, useState } from "react";
import api from "../utils/api";

const MyLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const res = await api.get("/leaves/my");
        setLeaves(res.data.data);
      } catch (err) {
        console.error("Failed to fetch leaves:", err);
      }
    };
    fetchLeaves();
  }, []);

  return (
    <div className="p-2">
      <h2 className="text-xl font-semibold mb-3">My Leaves</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-1 px-2 border-b text-left">Date</th>
              <th className="py-2 px-2 border-b text-left">Type</th>
              <th className="py-2 px-2 border-b text-left">Reason</th>
              <th className="py-2 px-2 border-b text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {leaves.length > 0 ? (
              leaves.map((l) => (
                <tr key={l._id} className="hover:bg-gray-50">
                  <td className="py-1 px-2 border-b">
                    {new Date(l.date).toLocaleDateString()}
                  </td>
                  <td className="py-1 px-2 border-b capitalize">{l.type}</td>
                  <td className="py-1 px-2 border-b">{l.reason}</td>
                  <td className="py-1 px-2 border-b capitalize font-medium">
                    <span
                      className={
                        l.status === "approved"
                          ? "text-green-600"
                          : l.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }
                    >
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="py-2 text-center text-gray-500">
                  No leaves found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyLeaves;
