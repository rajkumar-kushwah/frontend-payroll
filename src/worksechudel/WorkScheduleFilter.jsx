// src/pages/workSchedule/WorkScheduleFilter.jsx
import React, { useState } from "react";

export default function WorkScheduleFilter({ onFilter }) {
  const [text, setText] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    onFilter(value); // send filter value to parent
  };

  return (
    <input
      type="text"
      placeholder="Filter by Employee Name"
      value={text}
      onChange={handleChange}
      className="border p-1 rounded text-xs w-full md:w-60 focus:outline-none focus:ring-1 focus:ring-blue-300"
    />
  );
}
