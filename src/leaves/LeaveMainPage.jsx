import { useEffect, useState } from "react";
import {
  getLeavesApi,
  updateLeaveStatusApi,
  getMyLeavesApi,
  deleteLeaveApi,
} from "../utils/api";

import LeaveTable from "../leaves/LeaveTable";
import LeaveFilter from "../leaves/LeaveFilter";
import LeaveViewModal from "../leaves/LeaveViewModal";
import ApplyLeaveModal from "../leaves/ApplyLeaveModal";

import { useUser } from "../context/UserContext"; // use context
import Layout from "../components/Layout";


const LeaveDashboard = () => {
  const { user, loading } = useUser();
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [openApply, setOpenApply] = useState(false);

  const fetchLeaves = async () => {
    if (!user) return;

    try {
      if (user.role === "employee") {
        const res = await getMyLeavesApi();
        setLeaves(res.data.data);
      } else {
        const res = await getLeavesApi();
        setLeaves(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, [user, filter]);

  const filteredLeaves =
    user?.role === "employee"
      ? leaves
      : leaves.filter((l) => l.status === filter);

  const updateStatus = async (id, status) => {
    try {
      await updateLeaveStatusApi(id, status);
      setSelectedLeave(null);
      fetchLeaves();
    } catch (err) {
      console.error("Failed to update leave status:", err);
    }
  };


  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this leave?")) return;
  try {
    await deleteLeaveApi(id);
    fetchLeaves(); // refresh table
  } catch (err) {
    console.error(err);
    alert("Failed to delete leave");
  }
};


  if (loading) return <p className="text-center mt-10">Loading user...</p>;
  if (!user) return <p className="text-center mt-10">User not found</p>;

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center">
          <h2 className="text-sm font-semibold">Leave Management</h2>

          <div className="flex  items-center gap-2">
            {user?.role !== "employee" && (
              <LeaveFilter filter={filter} setFilter={setFilter} />
            )}

            {user?.role === "employee" && (
              <button
                onClick={() => setOpenApply(true)}
                className="px-2 py-1 bg-blue-500 text-xs text-white rounded hover:bg-blue-600"
              >
                + Apply Leave
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <LeaveTable
          leaves={filteredLeaves}
          onView={(leave) => setSelectedLeave(leave)}
           onDelete={handleDelete}
        />

        {/* MODALS */}
        {selectedLeave && (
          <LeaveViewModal
            leave={selectedLeave}
            user={user}
            onClose={() => setSelectedLeave(null)}
            onApprove={() => updateStatus(selectedLeave._id, "approved")}
            onReject={() => updateStatus(selectedLeave._id, "rejected")}
          />
        )}

        {openApply && (
          <ApplyLeaveModal
            onClose={() => setOpenApply(false)}
            onSuccess={fetchLeaves}
          />
        )}
      </div>
    </Layout>
  );
};

export default LeaveDashboard;
