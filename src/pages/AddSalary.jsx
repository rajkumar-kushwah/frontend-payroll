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
    totalWorkingDays: 26,
    netSalary: 0,
    status: "Unpaid",
  });
  const [salaryHistory, setSalaryHistory] = useState([]);

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
      if (!employeeId && res.data.length) setSelectedEmployee(res.data[0]._id);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch salary history
  const fetchSalaryHistory = async () => {
    if (!selectedEmployee) return;
    try {
      const res = await getSalariesByEmployee(selectedEmployee);
      setSalaryHistory(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) setSalaryHistory([]);
    }
  };

  // Fetch single salary for edit
  useEffect(() => {
    if (salaryId) {
      const fetchSalary = async () => {
        try {
          const res = await getSalaryById(salaryId);
          setSalaryData(res.data);
          setSelectedEmployee(res.data.employeeId);
        } catch (err) {
          console.error(err);
        }
      };
      fetchSalary();
    }
  }, [salaryId]);

  useEffect(() => { fetchEmployees(); }, []);
  useEffect(() => { fetchSalaryHistory(); }, [selectedEmployee]);

  // Handle input changes & net salary calculation
  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = name !== "month" ? (value === "" ? 0 : Number(value)) : value;

    const updatedSalary = { ...salaryData, [name]: val };

    if (["basic", "hra", "allowances", "deductions", "leaves", "totalWorkingDays"].includes(name)) {
      const grossSalary =
        (Number(updatedSalary.basic) || 0) +
        (Number(updatedSalary.hra) || 0) +
        (Number(updatedSalary.allowances) || 0);

      const totalDays = Number(updatedSalary.totalWorkingDays) || 26;
      const perDaySalary = grossSalary / totalDays;
      const leaveDeduction = (updatedSalary.leaves || 0) * perDaySalary;
      const net = grossSalary - (updatedSalary.deductions || 0) - leaveDeduction;

      updatedSalary.netSalary = Number(net.toFixed(2));
    }

    setSalaryData(updatedSalary);
  };

  // Submit salary (Add or Update)
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

      if (!salaryId) {
        setSalaryData({
          month: "",
          basic: 0,
          hra: 0,
          allowances: 0,
          deductions: 0,
          leaves: 0,
          totalWorkingDays: 26,
          netSalary: 0,
          status: "Unpaid",
        });
      }

      fetchSalaryHistory();
      navigate(`/employee/${selectedEmployee}`);
    } catch (err) {
      console.error(err);
      alert("Salary save failed: " + (err.response?.data?.error || ""));
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">{salaryId ? "Edit Salary" : "Add Salary"}</h2>

      {/* Employee Selector */}
      <div className="mb-4">
        <label htmlFor="employee" className="block mb-1 font-medium text-gray-700">Select Employee:</label>
        <select
          id="employee"
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
          className="border p-2 rounded w-full"
        >
          {employees.map((emp) => (
            <option key={emp._id} value={emp._id}>{emp.name}</option>
          ))}
        </select>
      </div>

      {/* Salary Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 bg-white p-6 rounded shadow">
        {/* Month */}
        <div>
          <label htmlFor="month" className="block mb-1 font-medium text-gray-700">Month</label>
          <input
            id="month"
            type="month"
            name="month"
            value={salaryData.month}
            onChange={handleChange}
            required
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Basic */}
        <div>
          <label htmlFor="basic" className="block mb-1 font-medium text-gray-700">Basic Salary</label>
          <input
            id="basic"
            type="number"
            name="basic"
            value={salaryData.basic}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* HRA */}
        <div>
          <label htmlFor="hra" className="block mb-1 font-medium text-gray-700">HRA</label>
          <input
            id="hra"
            type="number"
            name="hra"
            value={salaryData.hra}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Allowances */}
        <div>
          <label htmlFor="allowances" className="block mb-1 font-medium text-gray-700">Allowances</label>
          <input
            id="allowances"
            type="number"
            name="allowances"
            value={salaryData.allowances}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Deductions */}
        <div>
          <label htmlFor="deductions" className="block mb-1 font-medium text-gray-700">Deductions</label>
          <input
            id="deductions"
            type="number"
            name="deductions"
            value={salaryData.deductions}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Leaves */}
        <div>
          <label htmlFor="leaves" className="block mb-1 font-medium text-gray-700">Leaves</label>
          <input
            id="leaves"
            type="number"
            step="0.5"
            name="leaves"
            value={salaryData.leaves}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
          <small className="text-gray-500">1 = full day, 0.5 = half day</small>
        </div>

        {/* Net Salary */}
       <div className="col-span-1 md:col-span-5 mt-2 flex flex-col md:flex-row md:items-center md:gap-4">
  {/* Submit Button */}
  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mb-2 md:mb-0">
    {salaryId ? "Update Salary" : "Add Salary"}
  </button>

  {/* Back Button */}
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
              <th className="p-2 border">Net Salary</th>
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
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500 italic">No salary records found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
