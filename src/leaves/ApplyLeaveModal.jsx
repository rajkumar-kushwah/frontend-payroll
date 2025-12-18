import { useState } from "react";
import { applyLeaveApi } from "../utils/api";

const ApplyLeaveModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    date: "",
    type: "casual",
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.date || !form.reason) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      await applyLeaveApi(form);
      alert("Leave applied successfully");
      onSuccess && onSuccess(); // refresh parent data if needed
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Apply Leave</h3>

        <input
          type="date"
          className="w-full mb-3 p-2 border rounded"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />

        <select
          className="w-full mb-3 p-2 border rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="casual">Casual</option>
          <option value="sick">Sick</option>
        </select>

        <textarea
          className="w-full mb-3 p-2 border rounded"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
