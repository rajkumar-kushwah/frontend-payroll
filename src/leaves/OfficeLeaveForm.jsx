// components/OfficeLeaveForm.jsx
import { useState } from "react";
import { addOfficeHolidayApi } from "../utils/api";

const OfficeLeaveForm = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    startDate: "",
    endDate: "",
    type: "PAID",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.startDate || !form.endDate) {
      return alert("Start date and End date are required");
    }
    if (new Date(form.startDate) > new Date(form.endDate)) {
      return alert("Start date cannot be after End date");
    }

    setLoading(true);
    try {
      await addOfficeHolidayApi(form); // send start & end date to API
      onSuccess(); // parent table refresh
      onClose();   // close modal
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-5 rounded-lg w-96 shadow-lg">
        <h2 className="text-sm font-bold mb-4">Add Office Holiday</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full text-xs border p-2 rounded"
              placeholder="Title"
            />
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="w-full text-xs border p-2 rounded"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="w-full text-xs border p-2 rounded"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full text-xs border p-2 rounded"
            >
              <option value="PAID">Paid</option>
              <option value="OPTIONAL">Optional</option>
              <option value="UNPAID">Unpaid</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full text-xs border p-2 rounded"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-2 py-1 text-xs border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
            >
              {loading ? "Saving..." : "Add"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default OfficeLeaveForm;
