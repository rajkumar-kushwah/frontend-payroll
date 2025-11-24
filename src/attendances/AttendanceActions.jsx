import { useState } from "react";
import { checkIn, checkOut } from "../utils/api";
import AttendanceUpdate from "./AttendanceUpdate";
import { FaCheck, FaTimes, FaEdit } from "react-icons/fa";

export default function AttendanceActions({ record, onUpdate }) {
  const [showUpdate, setShowUpdate] = useState(false);

  const handleIn = async () => { await checkIn(record.employeeId?._id); onUpdate(); }
  const handleOut = async () => { await checkOut(record.employeeId?._id); onUpdate(); }

  return (
    <>
      <div className="flex gap-1 text-[10px]">
        {!record.checkIn && <button onClick={handleIn} className="bg-green-500 text-white p-1 rounded flex items-center gap-1"><FaCheck /> In</button>}
        {record.checkIn && !record.checkOut && <button onClick={handleOut} className="bg-red-500 text-white p-1 rounded flex items-center gap-1"><FaTimes /> Out</button>}
        <button onClick={()=>setShowUpdate(true)} className="bg-yellow-500 text-white p-1 rounded flex items-center gap-1"><FaEdit /> Edit</button>
      </div>
      {showUpdate && <AttendanceUpdate record={record} onUpdate={onUpdate} onClose={()=>setShowUpdate(false)} />}
    </>
  );
}
