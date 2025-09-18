import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEmployeeById, deleteEmployee } from "../utils/api";

export default function EmployeeDetail() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmp = async () => {
      try {
        const res = await getEmployeeById(id);
        setEmployee(res.data);
      } catch (err) {
        console.error(err);
        alert("Employee not found");
        navigate("/dashboard");
      }
    };
    fetchEmp();
  }, [id]);

  if (!employee) return <Layout><div className="p-6">Loading...</div></Layout>;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteEmployee(id);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">{employee.name}</h2>
      <div className="bg-white p-6 rounded shadow space-y-2">
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Job Role:</strong> {employee.jobrole}</p>
        <p><strong>Department:</strong> {employee.department}</p>
        <p><strong>Salary:</strong> {employee.salary}</p>
        <p><strong>Status:</strong> {employee.status}</p>
        <p><strong>Join Date:</strong> {new Date(employee.joinDate).toLocaleDateString()}</p>
        <p><strong>Notes:</strong> {employee.notes || "-"}</p>
      </div>
      <div className="mt-4 flex gap-2">
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
        <button onClick={() => navigate("/dashboard")} className="bg-gray-500 text-white px-4 py-2 rounded">Back</button>
      </div>
    </Layout>
  );
}
