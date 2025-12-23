import { useEffect, useState } from "react";
import {
  getLeavesApi,
  updateLeaveStatusApi,
  getMyLeavesApi,
  deleteLeaveApi,
  getOfficeHolidaysApi,
  deleteOfficeHolidayApi,
} from "../utils/api";

import LeaveTable from "../leaves/LeaveTable";
import LeaveFilter from "../leaves/LeaveFilter";
import LeaveViewModal from "../leaves/LeaveViewModal";
import ApplyLeaveModal from "../leaves/ApplyLeaveModal";
import OfficeLeaveForm from "../leaves/OfficeLeaveForm";
import OfficeHolidayTable from "../leaves/OfficeHolidayTable";
import { useUser } from "../context/UserContext";
import Layout from "../components/Layout";

const LeaveDashboard = () => {
  const { user, loading } = useUser();

  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [openApply, setOpenApply] = useState(false);
  const [openOfficeLeave, setOpenOfficeLeave] = useState(false);
  const [officeHolidays, setOfficeHolidays] = useState([]);

  /* ================= LEAVES ================= */

  const fetchLeaves = async () => {
    if (!user) return;

    try {
      const res =
        user.role === "employee"
          ? await getMyLeavesApi()
          : await getLeavesApi();

      setLeaves(res.data.data);
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
    await deleteLeaveApi(id);
    fetchLeaves();
  };

  /* ================= OFFICE HOLIDAYS ================= */

  const fetchOfficeHolidays = async () => {
    try {
      const res = await getOfficeHolidaysApi();
      setOfficeHolidays(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user && user.role !== "employee") {
      fetchOfficeHolidays();
    }
  }, [user]);

  const handleOfficeDelete = async (id) => {
    if (!window.confirm("Delete this holiday?")) return;
    await deleteOfficeHolidayApi(id);
    fetchOfficeHolidays();
  };

  /* ================= UI ================= */

  if (loading) return <p className="text-center mt-10">Loading user...</p>;
  if (!user) return <p className="text-center mt-10">User not found</p>;

  return (
    <Layout>
      <div className="flex flex-col gap-4">
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center">
          <h2 className="text-sm font-semibold">Leave Management</h2>

          <div className="flex gap-2">
            {user.role !== "employee" && (
              <>
                <LeaveFilter filter={filter} setFilter={setFilter} />
                <button
                  onClick={() => setOpenOfficeLeave(true)}
                  className="px-2 py-1 bg-green-500 text-xs text-white rounded"
                >
                  + Office Leave
                </button>
              </>
            )}

            {user.role === "employee" && (
              <button
                onClick={() => setOpenApply(true)}
                className="px-2 py-1 bg-blue-500 text-xs text-white rounded"
              >
                + Apply Leave
              </button>
            )}
          </div>
        </div>

        {/* LEAVE TABLE */}
        <LeaveTable
          leaves={filteredLeaves}
          userRole={user.role}   
          onView={(leave) => setSelectedLeave(leave)}
          onDelete={handleDelete}
        />

        {/* OFFICE HOLIDAYS */}
        {user.role !== "employee" && (
          <OfficeHolidayTable
            holidays={officeHolidays}
            user={user}
            onDelete={handleOfficeDelete}
          />
        )}

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

        {openOfficeLeave && (
          <OfficeLeaveForm
            onClose={() => setOpenOfficeLeave(false)}
            onSuccess={fetchOfficeHolidays}
          />
        )}
      </div>
    </Layout>
  );
};

export default LeaveDashboard;
