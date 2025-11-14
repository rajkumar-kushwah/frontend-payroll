// client/pages/EmployeeDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getEmployeeById,
  getSalariesByEmployee,
  deleteSalary,
  deleteEmployee,
} from "../utils/api";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [salaries, setSalaries] = useState([]);
  const [searchText, setSearchText] = useState("");
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

  // Filter salaries by month search
  const filteredSalaries = (salaries || []).filter((sal) => {
    if (!sal?.month) return false;
    return sal.month.toLowerCase().includes(searchText.toLowerCase());
  });

  if (loading) return <Layout><div className="p-6">Loading...</div></Layout>;
  if (!employee) return <Layout><div className="p-6">Employee not found.</div></Layout>;

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">{employee.name}</h2>
      <div className="text-xs transform">
      <p><strong className="text-sm font-mono">Employee ID :</strong> {employee.employeeCode}</p>
</div>
      {/* Employee Info */}
      <div className="bg-gray-100 p-5 rounded shadow space-y-2 mb-6">
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Job Role:</strong> {employee.jobRole}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Salary:</strong> ₹{employee.salary}</p>
        <p><strong>Status:</strong> {employee.status}</p>
        <p><strong>Join Date:</strong> {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : "-"}</p>
        <p><strong>Notes:</strong> {employee.notes || "-"}</p>
        <p><strong>Total Salaries:</strong>{salaries.length}</p>
        <p><strong>Last salary added: </strong>{salaries.length ? salaries[salaries.length - 1].month : "-"} </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mb-6">
        <button onClick={handleDeleteEmployee} className="bg-red-500 text-xs text-white px-4 py-2 rounded">
          Delete Employee
        </button>
        <button onClick={() => navigate("/employees")} className="bg-gray-500 text-xs text-white px-4 py-2 rounded">
          Back
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
      <div className=" p-4 rounded shadow overflow-x-auto">
        <h3 className="font-bold mb-2">Salary History</h3>
        <table className="w-full text-sm min-w-max border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Month</th>
              <th className="p-2 border">Basic</th>
              <th className="p-2 border">HRA</th>
              <th className="p-2 border">Allowances</th>
              <th className="p-2 border">Deductions</th>
              <th className="p-2 border">Leaves</th>
              <th className="p-2 border">Net Salary</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSalaries.length ? (
              filteredSalaries.map((sal) => (
                <tr key={sal._id} className={`hover:bg-gray-50 ${sal._id === highlightSalaryId ? "bg-green-100" : ""}`}>
                  <td className="p-2 border">{sal.month}</td>
                  <td className="p-2 border">₹{sal.basic}</td>
                  <td className="p-2 border">₹{sal.hra}</td>
                  <td className="p-2 border">₹{sal.allowances}</td>
                  <td className="p-2 border">₹{sal.deductions}</td>
                  <td className="p-2 border">{sal.leaves}</td>
                  <td className="p-2 border font-bold">₹{sal.netSalary}</td>
                  <td className="p-2 border flex gap-1">
                    <Pencil
                    size={30}
                      onClick={() => navigate(`/employee/${id}/add-salary/${sal._id}`)}
                      className=" text-blue-500 px-2 py-1 rounded"
                    >
                      
                    </Pencil>

                    <Trash2
                    size={30}
                      onClick={() => handleDeleteSalary(sal._id)}
                      className=" text-red-500 px-2 py-1 rounded"
                    >
                      Delete
                    </Trash2>
                  </td>
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
