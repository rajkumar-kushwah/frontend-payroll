import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployee,
} from "../utils/api";
import { MoreVertical } from "lucide-react";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [newEmp, setNewEmp] = useState({
    name: "",
    email: "",
    phone: "",
    jobRole: "",
    department: "",
    salary: "",
    status: "active",
    joinDate: "",
  });
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (err) {
      alert("Failed to fetch employees");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Add or Update Employee
  const handleSubmit = async () => {
    if (!newEmp.name || !newEmp.email || !newEmp.department) {
      return alert("Please fill Name, Email, Department");
    }

    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee._id, newEmp);
        alert("Employee updated!");
      } else {
        await addEmployee(newEmp);
        alert("Employee added!");
      }

      setNewEmp({
        name: "",
        email: "",
        phone: "",
        jobRole: "",
        department: "",
        salary: "",
        status: "active",
        joinDate: "",
      });
      setShowForm(false);
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err) {
      alert("Error saving employee");
      console.error(err);
    }
  };

  // Edit employee
  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setNewEmp({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      jobRole: emp.jobRole,
      department: emp.department,
      salary: emp.salary,
      status: emp.status,
      joinDate: emp.joinDate ? emp.joinDate.split("T")[0] : "",
    });
    setShowForm(true);
    setActiveMenu(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteEmployee(id);
      alert("Employee deleted");
      fetchEmployees();
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };

  const filtered = employees.filter((e) =>
    [e.name, e.email, e.department, e.jobRole].some((f) =>
      f?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Employees</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingEmployee(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          {showForm ? "Close Form" : "+ Add Employee"}
        </button>
      </div>

      {/* Search bar */}
      <input
        type="text"
        placeholder="Search employees..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-3">
            {editingEmployee ? "Edit Employee" : "Add Employee"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Full Name", field: "name", type: "text" },
              { label: "Email", field: "email", type: "email" },
              { label: "Phone", field: "phone", type: "text" },
              { label: "Job Role", field: "jobRole", type: "text" },
              { label: "Department", field: "department", type: "text" },
              { label: "Salary (₹)", field: "salary", type: "number" },
              { label: "Status", field: "status", type: "text" },
              { label: "Join Date", field: "joinDate", type: "date" },
            ].map(({ label, field, type }) => (
              <div key={field} className="flex flex-col">
                <label className="text-sm font-medium mb-1">{label}</label>
                <input
                  type={type}
                  value={newEmp[field]}
                  onChange={(e) => setNewEmp({ ...newEmp, [field]: e.target.value })}
                  className="border p-2 rounded"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded mt-4"
          >
            {editingEmployee ? "Update Employee" : "Add Employee"}
          </button>
        </div>
      )}

      {/* Employee Table (Excel-style list) */}
      <div className="overflow-x-auto  bg-white rounded shadow border">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Job Role</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Salary</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Join Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length ? (
              filtered.map((emp, i) => (
                <tr key={emp._id} className="hover:bg-gray-50">
                  <td className="p-2 border">{i + 1}</td>
                  <td className="p-2 border">{emp.name}</td>
                  <td className="p-2 border">{emp.email}</td>
                  <td className="p-2 border">{emp.phone || "-"}</td>
                  <td className="p-2 border">{emp.jobRole || "-"}</td>
                  <td className="p-2 border">{emp.department || "-"}</td>
                  <td className="p-2 border">₹{emp.salary}</td>
                  <td className="p-2 border capitalize">{emp.status}</td>
                  <td className="p-2 border">
                    {emp.joinDate
                      ? new Date(emp.joinDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2 border relative text-center">
                    <button
                      onClick={() =>
                        setActiveMenu(activeMenu === emp._id ? null : emp._id)
                      }
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {activeMenu === emp._id && (
                      <div
                        className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10"
                        onMouseLeave={() => setActiveMenu(null)}
                      >
                        <button
                          onClick={() => navigate(`/employee/${emp._id}`)}
                          className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(emp)}
                          className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center text-gray-500 py-4">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
