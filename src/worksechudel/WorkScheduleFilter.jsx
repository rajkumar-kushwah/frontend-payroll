import React, { useState, useEffect } from "react";

export default function WorkScheduleFilter({ onFilter }) {
  const [text, setText] = useState("");

  // Optional: Debounce filter for better performance
  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilter(text.trim());
    }, 300); // 300ms debounce
    return () => clearTimeout(timeout);
  }, [text, onFilter]);

  return (
    <input
      type="text"
      placeholder="Filter by Employee Name"
      value={text}
      onChange={(e) => setText(e.target.value)}
      className="border p-1 rounded text-xs w-full md:w-50 focus:outline-none focus:ring-1 focus:ring-blue-300"
    />
  );
}
