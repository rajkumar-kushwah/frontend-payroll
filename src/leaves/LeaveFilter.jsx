import React from "react";

const LeaveFilter = ({ filter, setFilter }) => {
  return (
    <div className="flex text-xs items-center gap-2">
      <h4 className="font-semibold text-sm mr-2">Status:</h4>
      {["pending", "approved", "rejected"].map((s) => (
        <button
          key={s}
          onClick={() => setFilter(s)}
          className={`px-3 py-1 rounded border cursor-pointer ${
            filter === s ? "bg-blue-500 text-white" : "bg-white text-gray-700 border-gray-300"
          }`}
        >
          {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
        </button>
      ))}
    </div>
  );
};

export default LeaveFilter;
