import { useState, useEffect } from "react";
import EmployeeSelect from "./EmployeeSelect";
import api from "../utils/api";

export default function AddLeave({ onAdded }) {
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("casual");
  const [reason, setReason] = useState("");

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post("/leave", { employeeId, date, type, reason });
      alert("Leave added successfully");

      // Clear form
      setEmployeeId("");
      setDate("");
      setType("casual");
      setReason("");

      // Notify parent to refresh table
      if (onAdded) onAdded();
    } catch (err) {
      alert("Failed to add leave");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow mb-3">
      <form className="space-y-3" onSubmit={handleSubmit}>
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
            rows="2"
            className="w-full border rounded px-3 py-2 text-sm resize-none"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Add Leave
        </button>
      </form>
    </div>
  );
}
