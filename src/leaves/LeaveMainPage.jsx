import { useState } from "react";
import Layout from "../components/Layout";
import LeaveTable from "../leaves/LeaveTable";
import AddLeave from "../leaves/AddLeave";

export default function LeaveMainPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <Layout>
      <div className="space-y-3">
        {/* Header + Add Button */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg">Leave Management</h2>
          <button
            onClick={() => setShowModal(true)}
            className="px-3 py-1 bg-lime-400 text-white rounded text-sm"
          >
            Add Leave
          </button>
        </div>

        {/* Leave Table */}
        <LeaveTable />

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50">
            <div className="bg-white p-5 rounded shadow-md w-full max-w-md relative">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>

              {/* AddLeave Form */}
              <AddLeave onClose={() => setShowModal(false)} />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
