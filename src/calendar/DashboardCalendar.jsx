import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function DashboardCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div className=" w-full p-4 ml-5 justify-start mx-auto  ">
      <h3 className="text-gray-800 font-semibold mb-3 text-lg">Select Date</h3>
      <Calendar className="border rounded-lg bg-gray-100 "
        onChange={setDate}
        value={date}
      />
      <p className="mt-3 text-gray-700">📅 Selected Date: {date.toDateString()}</p>
     
    </div>
    
  );
}
