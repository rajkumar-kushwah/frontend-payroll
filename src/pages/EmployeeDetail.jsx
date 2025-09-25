// client/pages/EmployeeDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getEmployeeById,
  getSalariesByEmployee,
  addSalary,
  updateSalary,
  deleteSalary,
  deleteEmployee,
} from "../utils/api";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [salaries, setSalaries] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [newSalary, setNewSalary] = useState({
    month: "",
    baseSalary: "",
    bonus: 0,
    deductions: 0,
    leaves: 0,
  });
  const [editSalaryId, setEditSalaryId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [highlightSalaryId, setHighlightSalaryId] = useState(null);

  // Fetch Employee
  const fetchEmployee = async () => {
    try {
      const res = await getEmployeeById(id);
      setEmployee(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Employee not found");
      navigate("/employees");
    }
  };

  // Fetch Salaries
  const fetchSalaries = async () => {
    try {
      const res = await getSalariesByEmployee(id);
      setSalaries(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Salary data fetch failed");
    }
  };

  useEffect(() => {
    if (!id) return navigate("/employees");
    fetchEmployee().finally(() => setLoading(false));
    fetchSalaries();
  }, [id]);

  // Add / Update Salary
  const handleSaveSalary = async () => {
    if (!newSalary.month || !newSalary.baseSalary) {
      return alert("Month and Base Salary are required");
    }

    const payload = {
      ...newSalary,
      EmployeeId: id,
      netPay:
        Number(newSalary.baseSalary) +
        Number(newSalary.bonus || 0) -
        Number(newSalary.deductions || 0),
    };

    console.log("Salary Payload:", payload); // Debug

    try {
      let res;
      if (editSalaryId) {
        await updateSalary(editSalaryId, payload);
        alert("Salary updated successfully");
        setEditSalaryId(null);
      } else {
        await addSalary(payload);
        alert("Salary added successfully");
      }
        // Fetch salaries again
       const salariesRes = await getSalariesByEmployee(id);
  setSalaries(salariesRes.data);
  
 // Highlight the last added salary
  if (salariesRes.data.length > 0) {
    const lastSalary = salariesRes.data[salariesRes.data.length - 1];
    setHighlightSalaryId(lastSalary._id);
  }

      // Reset form
      setNewSalary({ month: "", baseSalary: "", bonus: 0, deductions: 0, leaves: 0 });
      fetchSalaries();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Salary save failed");
    }
  };

// remove highlight from salary 
useEffect(()=> {
  const timer = setTimeout(()=>{
    setHighlightSalaryId(null);
  }, 10000);
  return () => {
    clearTimeout(timer);
  }
  }
, [highlightSalaryId])

  // Edit Salary
  const handleEditSalary = (sal) => {
    setEditSalaryId(sal._id);
    setNewSalary({
      month: sal.month,
      baseSalary: sal.baseSalary,
      bonus: sal.bonus,
      deductions: sal.deductions,
      leaves: sal.leaves,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete Salary
  const handleDeleteSalary = async (salaryId) => {
    if (!window.confirm("Are you sure to delete this salary?")) return;
    try {
      await deleteSalary(salaryId);
      alert("Salary deleted successfully");
      fetchSalaries();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // Delete Employee
  const handleDeleteEmployee = async () => {
    if (!window.confirm("Are you sure to delete this employee?")) return;
    try {
      await deleteEmployee(id);
      alert("Employee deleted successfully");
      navigate("/employees");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // Filter salaries by searchText
 const filteredSalaries = salaries.filter((sal) => {
  if (!sal.month) return false;
  const date = new Date(sal.month);
  const monthStr = date.toLocaleDateString("default", { month: "long", year: "numeric" });
  return monthStr.toLowerCase().includes(searchText.toLowerCase());
});


  if (loading) return <Layout><div className="p-6">Loading...</div></Layout>;
  if (!employee) return <Layout><div className="p-6">Employee not found.</div></Layout>;

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">{employee.name}</h2>

      {/* Employee Info */}
      <div className="bg-white p-5 rounded shadow space-y-2 mb-6">
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Job Role:</strong> {employee.jobrole}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Salary:</strong> ₹{employee.salary}</p>
        <p><strong>Status:</strong> {employee.status}</p>
        <p><strong>Join Date:</strong> {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : "-"}</p>
        <p><strong>Notes:</strong> {employee.notes || "-"}</p>
        <p><strong>Total Salaries:</strong>{salaries.length}</p>
        <p><strong>Last salary added: </strong>{salaries.length ? salaries[salaries.length -1 ].month : "-"} </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-6">
        <button onClick={handleDeleteEmployee} className="bg-red-500 text-white px-4 py-2 rounded">
          Delete Employee
        </button>
        <button onClick={() => navigate("/employees")} className="bg-gray-500 text-white px-4 py-2 rounded">
          Back
        </button>
      </div>

      {/* Add / Edit Salary Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-bold mb-2">{editSalaryId ? "Edit Salary" : "Add Salary"}</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              type="date"
              value={newSalary.month || ""}
              onChange={(e) => setNewSalary({ ...newSalary, month: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Base Salary</label>
            <input
              type="number"
              placeholder="Base Salary"
              value={newSalary.baseSalary}
              onChange={(e) => setNewSalary({ ...newSalary, baseSalary: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Bonus</label>
            <input
              type="number"
              placeholder="Bonus"
              value={newSalary.bonus}
              onChange={(e) => setNewSalary({ ...newSalary, bonus: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Deductions</label>
            <input
              type="number"
              placeholder="Deductions"
              value={newSalary.deductions}
              onChange={(e) => setNewSalary({ ...newSalary, deductions: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Leaves</label>
            <input
              type="number"
              placeholder="Leaves"
              value={newSalary.leaves}
              onChange={(e) => setNewSalary({ ...newSalary, leaves: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>
        <button
          onClick={handleSaveSalary}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          {editSalaryId ? "Update Salary" : "Add Salary"}
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Month..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        />
      </div>

      {/* Salary Table */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        <h3 className="font-bold mb-2">Salary History</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Base Salary</th>
              <th className="p-2 border">Bonus</th>
              <th className="p-2 border">Deductions</th>
              <th className="p-2 border">Leaves</th>
              <th className="p-2 border">Net Pay</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.length ? (
              filteredSalaries.map((sal) => (
                <tr key={sal._id} className={`hover:bg-gray-50 ${sal._id === highlightSalaryId ? "bg-green-100" : ""}`}>
                  <td className="p-2 border">{sal.month ? new Date(sal.month).toDateString() : "-"}</td>
                  <td className="p-2 border">₹{sal.baseSalary}</td>
                  <td className="p-2 border">₹{sal.bonus}</td>
                  <td className="p-2 border">₹{sal.deductions}</td>
                  <td className="p-2 border">{sal.leaves}</td>
                  <td className="p-2 border font-bold">₹{sal.netPay}</td>
                  <td className="p-2 border flex gap-1">
                    <button
                      onClick={() => handleEditSalary(sal)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSalary(sal._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500 italic">
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
