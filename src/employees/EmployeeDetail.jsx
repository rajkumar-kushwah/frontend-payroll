// client/pages/EmployeeDetail.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEmployeeById, deleteEmployee } from "../utils/api";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch employee
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

  useEffect(() => {
    if (!id) return navigate("/employees");
    fetchEmployee().finally(() => setLoading(false));
  }, [id]);

  // Delete employee
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

  if (loading) return <Layout><div className="p-6">Loading...</div></Layout>;
  if (!employee) return <Layout><div className="p-6">Employee not found.</div></Layout>;

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">{employee.name}</h2>
      <div className="bg-gray-100 p-5 rounded shadow space-y-2 mb-6 text-xs">
        <p><strong>ID:</strong> {employee.employeeCode}</p>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Job Role:</strong> {employee.jobRole}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Status:</strong> {employee.status}</p>
        <p><strong>Join Date:</strong> {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : "-"}</p>
        <p><strong>Notes:</strong> {employee.notes || "-"}</p>
      </div>

      <div className="flex gap-2 mb-6">
        <button onClick={handleDeleteEmployee} className="bg-red-500 text-xs text-white px-4 py-2 rounded">Delete Employee</button>
        <button onClick={() => navigate("/employees")} className="bg-gray-500 text-xs text-white px-4 py-2 rounded">Back</button>
      </div>
    </Layout>
  );
}
