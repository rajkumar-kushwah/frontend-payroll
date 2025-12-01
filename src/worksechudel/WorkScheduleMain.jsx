// src/pages/workSchedule/WorkScheduleMain.jsx
import React, { useState, useEffect } from "react";
import WorkScheduleForm from "./WorkScheduleForm";
import WorkScheduleFilter from "./WorkScheduleFilter";
import WorkScheduleTable from "./WorkScheduleTable";
import {
  getWorkSchedules,
  addWorkSchedule,
  updateWorkSchedule,
  deleteWorkSchedule,
} from "../utils/api";

export default function WorkScheduleMain() {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [filterText, setFilterText] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch schedules
  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await getWorkSchedules();
      setSchedules(res.data || []);
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
      setSchedules([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // Add / Update schedule
  const handleSubmit = async (data) => {
    try {
      if (selectedSchedule) {
        await updateWorkSchedule(selectedSchedule._id, data);
        setSelectedSchedule(null);
      } else {
        await addWorkSchedule(data);
      }
      setShowForm(false);
      fetchSchedules();
    } catch (err) {
      console.error("Failed to save schedule:", err);
      alert("Failed to save schedule");
    }
  };

  // Delete schedule
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    try {
      await deleteWorkSchedule(id);
      fetchSchedules();
    } catch (err) {
      console.error("Failed to delete schedule:", err);
      alert("Failed to delete");
    }
  };

  // Edit schedule
  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setShowForm(true);
  };

  // Filtered schedules (by employee name or shift name)
  const filteredSchedules = schedules.filter((sch) => {
    const nameMatch = sch.employeeId?.name
      ?.toLowerCase()
      .includes(filterText.toLowerCase());
    const shiftMatch = sch.shiftName
      ?.toLowerCase()
      .includes(filterText.toLowerCase());
    return nameMatch || shiftMatch;
  });

  return (
    <div className="p-2 text-xs">
      <h2 className="text-sm font-bold mb-2">Work Schedule Management</h2>

      {/* Filter + Add Button */}
      <div className="flex flex-col md:flex-row md:justify-between gap-2 mb-2 items-center">
        <WorkScheduleFilter onFilter={setFilterText} />
        <button
          onClick={() => { setSelectedSchedule(null); setShowForm(true); }}
          className="border p-1 text-xs rounded bg-blue-100 hover:bg-blue-200 flex items-center gap-1"
        >
          Add Schedule
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded max-h-[60vh] border">
        {loading ? (
          <div className="text-center p-3">Loading...</div>
        ) : filteredSchedules.length === 0 ? (
          <div className="text-center p-3 text-gray-500">No schedules found</div>
        ) : (
          <WorkScheduleTable
            schedules={filteredSchedules}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>

      {/* Side Drawer Form */}
      {showForm && (
        <WorkScheduleForm
          selectedSchedule={selectedSchedule}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
