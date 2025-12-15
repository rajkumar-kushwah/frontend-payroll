import { useEffect, useState } from "react";
import api from "../utils/api";

export default function EmployeeSelect({ value, onChange }) {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await api.get("/leave/employees");
        setEmployees(res.data.employees || []);
      } catch (err) {
        console.error("Failed to fetch employees", err);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <select
      value={value}
      onChange={onChange}
      className="w-full border rounded px-3 py-2 text-sm"
    >
      <option value="">Select Employee</option>
      {employees.map(emp => (
        <option key={emp._id} value={emp._id}>
          {emp.name} ({emp.email})
        </option>
      ))}
    </select>
  );
}
