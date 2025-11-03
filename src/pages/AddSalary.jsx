// client/pages/AddSalary.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { 
  getEmployees, 
  addSalary, 
  getSalariesByEmployee, 
  getSalaryById, 
  updateSalary 
} from "../utils/api";

export default function AddSalary() {
  const { employeeId, salaryId } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(employeeId || "");
  const [salaryData, setSalaryData] = useState({
    month: "",
    basic: 0,
    hra: 0,
    allowances: 0,
    deductions: 0,
    leaves: 0,
    totalWorkingDays: 30,
    netSalary: 0,
    status: "unpaid", // ✅ match backend
  });
  const [salaryHistory, setSalaryHistory] = useState([]);

  // ✅ Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
      if (!employeeId && res.data.length) setSelectedEmployee(res.data[0]._id);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  // ✅ Fetch salary history
  const fetchSalaryHistory = async () => {
    if (!selectedEmployee) return;
    try {
      const res = await getSalariesByEmployee(selectedEmployee);
      setSalaryHistory(res.data);
    } catch (err) {
      if (err.response?.status === 404) setSalaryHistory([]);
      else console.error("Failed to fetch salary history:", err);
    }
  };

  // ✅ Fetch single salary for edit
  useEffect(() => {
    if (salaryId) {
      const fetchSalary = async () => {
        try {
          const res = await getSalaryById(salaryId);
          setSalaryData(res.data);
          setSelectedEmployee(res.data.employeeId);
        } catch (err) {
          console.error("Failed to fetch salary details:", err);
        }
      };
      fetchSalary();
    }
  }, [salaryId]);

  useEffect(() => { fetchEmployees(); }, []);
  useEffect(() => { fetchSalaryHistory(); }, [selectedEmployee]);

  // ✅ Handle input change & salary calculation
  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = ["month", "status"].includes(name) ? value : Number(value) || 0;

    const updated = { ...salaryData, [name]: val };

    if (["basic", "hra", "allowances", "deductions", "leaves", "totalWorkingDays"].includes(name)) {
      const gross = (updated.basic || 0) + (updated.hra || 0) + (updated.allowances || 0);
      const perDay = gross / (updated.totalWorkingDays || 30);
      const leaveCut = (updated.leaves || 0) * perDay;
      updated.netSalary = Number((gross - (updated.deductions || 0) - leaveCut).toFixed(2));
    }

    setSalaryData(updated);
  };

  // ✅ Submit salary (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmployee) return alert("Select an employee first");

    const payload = { ...salaryData, employeeId: selectedEmployee };

    try {
      if (salaryId) {
        await updateSalary(salaryId, payload);
        alert("Salary updated successfully");
      } else {
        await addSalary(payload);
        alert("Salary added successfully");
      }

      // Reset after adding
      if (!salaryId) {
        setSalaryData({
          month: "",
          basic: 0,
          hra: 0,
          allowances: 0,
          deductions: 0,
          leaves: 0,
          totalWorkingDays: 30,
          netSalary: 0,
          status: "unpaid",
        });
      }

      fetchSalaryHistory();
      navigate(`/employee/${selectedEmployee}`);
    } catch (err) {
      console.error("Salary save failed:", err);
      alert("Failed: " + (err.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">
        {salaryId ? "Edit Salary" : "Add Salary"}
      </h2>

      {/* Employee Selector */}
      <div className="mb-4">
        <label className="block mb-1 font-medium text-gray-700">Select Employee:</label>
        <select
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="border p-2 rounded w-full"
        >
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>
              {emp.name} ({emp.jobRole || "No Role"})
            </option>
          ))}
        </select>
      </div>

      {/* Salary Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-white p-6 rounded shadow">
        {[
          { id: "month", label: "Month", type: "month" },
          { id: "basic", label: "Basic", type: "number" },
          { id: "hra", label: "HRA", type: "number" },
          { id: "allowances", label: "Allowances", type: "number" },
          { id: "deductions", label: "Deductions", type: "number" },
          { id: "leaves", label: "Leaves", type: "number", step: "0.5" },
          { id: "totalWorkingDays", label: "Total Working Days", type: "number" },
        ].map((f) => (
          <div key={f.id}>
            <label className="block mb-1 font-medium text-gray-700">{f.label}</label>
            <input
              id={f.id}
              type={f.type}
              step={f.step}
              name={f.id}
              value={salaryData[f.id]}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
          </div>
        ))}

        {/* Net Salary */}
        <div className="md:col-span-5">
          <label className="block mb-1 font-medium text-gray-700">Net Salary</label>
          <input
            type="number"
            name="netSalary"
            value={salaryData.netSalary}
            readOnly
            className="border p-2 rounded w-full bg-gray-100"
          />
        </div>

        {/* Status */}
        <div className="md:col-span-5">
          <label className="block mb-1 font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={salaryData.status}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="col-span-1 md:col-span-5 mt-2 flex flex-col md:flex-row md:items-center md:gap-4">
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mb-2 md:mb-0">
            {salaryId ? "Update Salary" : "Add Salary"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/employee/${selectedEmployee}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      </form>

      {/* Salary History */}
      <h3 className="text-xl font-bold mb-2">Salary History</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-sm bg-white rounded shadow border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Basic</th>
              <th className="p-2 border">HRA</th>
              <th className="p-2 border">Allowances</th>
              <th className="p-2 border">Deductions</th>
              <th className="p-2 border">Leaves</th>
              <th className="p-2 border">Net</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {salaryHistory.length ? (
              salaryHistory.map((sal) => (
                <tr key={sal._id}>
                  <td className="p-2 border">{sal.month}</td>
                  <td className="p-2 border">₹{sal.basic}</td>
                  <td className="p-2 border">₹{sal.hra}</td>
                  <td className="p-2 border">₹{sal.allowances}</td>
                  <td className="p-2 border">₹{sal.deductions}</td>
                  <td className="p-2 border">{sal.leaves}</td>
                  <td className="p-2 border">₹{sal.netSalary}</td>
                  <td className="p-2 border">{sal.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500 italic">
                  No salary records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
