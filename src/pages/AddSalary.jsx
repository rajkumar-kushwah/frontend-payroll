import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { addSalary, getSalariesByEmployee, updateSalary, deleteSalary } from "../utils/api";

export default function AddSalary() {
  const { employeeId } = useParams();
  const [salaryData, setSalaryData] = useState({
    month: "",
    basic: 0,
    hra: 0,
    allowances: 0,
    deductions: 0,
    leaves: 0,
    netSalary: 0,
    status: "Unpaid",
  });
  const [salaryHistory, setSalaryHistory] = useState([]);

const fetchSalaryHistory = async () => {
  if (!employeeId) return;
  try {
    const res = await getSalariesByEmployee(employeeId);
    setSalaryHistory(res.data);
  } catch (err) {
    console.error(err);
    if(err.response?.status === 404) setSalaryHistory([]); // salary na ho to empty
  }
};


  useEffect(() => { fetchSalaryHistory(); }, [employeeId]);

  const calculateNetSalary = () => {
    const { basic, hra, allowances, deductions } = salaryData;
    const net = Number(basic) + Number(hra) + Number(allowances) - Number(deductions);
    setSalaryData(prev => ({ ...prev, netSalary: net }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setSalaryData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = { ...salaryData, EmployeeId: employeeId };
    try {
      await addSalary(payload);
      setSalaryData({ month: "", basic: 0, hra: 0, allowances: 0, deductions: 0, leaves: 0, netSalary: 0, status: "Unpaid" });
      fetchSalaryHistory();
    } catch (err) {
      console.error(err);
      alert("Salary save failed");
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Add Salary</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6 bg-white p-4 rounded shadow">
        <input type="month" name="month" value={salaryData.month} onChange={handleChange} required className="border p-2 rounded"/>
        <input type="number" name="basic" placeholder="Basic" value={salaryData.basic} onChange={e => { handleChange(e); calculateNetSalary(); }} className="border p-2 rounded"/>
        <input type="number" name="hra" placeholder="HRA" value={salaryData.hra} onChange={e => { handleChange(e); calculateNetSalary(); }} className="border p-2 rounded"/>
        <input type="number" name="allowances" placeholder="Allowances" value={salaryData.allowances} onChange={e => { handleChange(e); calculateNetSalary(); }} className="border p-2 rounded"/>
        <input type="number" name="deductions" placeholder="Deductions" value={salaryData.deductions} onChange={e => { handleChange(e); calculateNetSalary(); }} className="border p-2 rounded"/>
        <input type="number" name="leaves" placeholder="Leaves" value={salaryData.leaves} onChange={handleChange} className="border p-2 rounded"/>
        <div className="col-span-1 md:col-span-5 mt-2">
          <div>Net Salary: ₹{salaryData.netSalary}</div>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded mt-2">Add Salary</button>
        </div>
      </form>

      <h3 className="text-xl font-bold mb-2">Salary History</h3>
      <table className="w-full text-sm bg-white rounded shadow border">
        <thead className="bg-gray-100">
          <tr>
            <th>Month</th><th>Basic</th><th>HRA</th><th>Allowances</th><th>Deductions</th><th>Leaves</th><th>Net Salary</th>
          </tr>
        </thead>
        <tbody>
          {salaryHistory.map(sal => (
            <tr key={sal._id}>
              <td>{sal.month}</td>
              <td>₹{sal.basic}</td>
              <td>₹{sal.hra}</td>
              <td>₹{sal.allowances}</td>
              <td>₹{sal.deductions}</td>
              <td>{sal.leaves}</td>
              <td>₹{sal.netSalary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
