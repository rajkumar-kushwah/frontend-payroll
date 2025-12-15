import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEmployeeById, deleteEmployee } from "../utils/api";

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployee = async () => {
    try {
      const res = await getEmployeeById(id);
      setEmployee(res.data.emp || res.data); // <-- grab the employee object correctly
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

  if (loading) return <Layout><div className="p-6 text-center">Loading...</div></Layout>;
  if (!employee) return <Layout><div className="p-6 text-center">Employee not found.</div></Layout>;

  return (
    <Layout>
      <div className="max-w-sm mx-auto bg-white shadow rounded-lg p-4 text-xs space-y-2">
        {/* Avatar + Name */}
        <div className="flex flex-col items-center mb-2">
          <img
            src={employee.avatar || "https://via.placeholder.com/80"}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover mb-1"
          />
          <h2 className="text-sm font-semibold">{employee.name}</h2>
          <p className="text-gray-500 text-xs">{employee.jobRole || "-"}</p>
        </div>

        {/* Employee Details */}
        <div className="space-y-1">
          <p><strong>ID:</strong> {employee.employeeCode}</p>
          <p><strong>Email:</strong> {employee.email}</p>
          <p><strong>Phone:</strong> {employee.phone || "-"}</p>
          <p><strong>DOB:</strong> {employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : "-"}</p>
          <p><strong>Department:</strong> {employee.department || "-"}</p>
          <p><strong>Status:</strong> {employee.status}</p>
          <p><strong>Join Date:</strong> {employee.joinDate ? new Date(employee.joinDate).toLocaleDateString() : "-"}</p>
          <p><strong>BasicSalary:</strong> {employee.basicSalary || "-"}</p>
          {/* <p><strong>Notes:</strong> {employee.notes || "-"}</p> */}
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-2">
          <button
            onClick={handleDeleteEmployee}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
          >
            Delete
          </button>
          <button
            onClick={() => navigate("/employees")}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs"
          >
            Back
          </button>
        </div>
      </div>
    </Layout>
  );
}
