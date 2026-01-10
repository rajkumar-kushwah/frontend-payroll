import { useState } from "react";
import { applyLeaveApi } from "../utils/api";
import { ChevronDown } from "lucide-react";

const ApplyLeaveModal = ({ onClose, onSuccess }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    type: "casual", // default leave type
    reason: "",
  });

  const [loading, setLoading] = useState(false);

  const leaveTypes = ["casual", "sick", "personal", "other"]; // real-world leave types

  const submit = async () => {
    if (!form.startDate || !form.endDate || !form.reason) {
      return alert("Please fill all fields");
    }

    if (new Date(form.startDate) > new Date(form.endDate)) {
      return alert("Start date cannot be after end date");
    }

    try {
      setLoading(true);
      await applyLeaveApi(form); // backend handles status = pending by default
      alert("Leave applied successfully");
      onSuccess && onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md text-xs w-full max-w-sm">
        <h3 className="text-sm font-semibold mb-4">Apply Leave</h3>

        {/* Start Date */}
        <label className="block mb-1">Start Date</label>
        <input
          type="date"
          className="w-full mb-3 p-2 border rounded"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />

        {/* End Date */}
        <label className="block mb-1">End Date</label>
        <input
          type="date"
          className="w-full mb-3 p-2 border rounded"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />

        {/* Leave Type Dropdown */}
        <div className="relative w-full mb-3">
          <div
            className="p-2 border rounded cursor-pointer flex justify-between items-center"
            onClick={() => setOpen(!open)}
          >
            <span>{form.type.charAt(0).toUpperCase() + form.type.slice(1)}</span>
            <ChevronDown
              className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              size={16}
            />
          </div>

          {open && (
            <div className="absolute w-full border rounded mt-1 bg-white z-20 shadow-md">
              {leaveTypes.map((t) => (
                <div
                  key={t}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    setForm({ ...form, type: t });
                    setOpen(false);
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reason */}
        <textarea
          className="w-full mb-3 p-2 border rounded"
          placeholder="Reason"
          value={form.reason}
          onChange={(e) => setForm({ ...form, reason: e.target.value })}
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-2 py-1 text-sm border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="px-2 py-1 text-sm bg-blue-500 text-white cursor-pointer rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
