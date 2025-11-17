import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import {
  getEmployees,
  addEmployee,
  deleteEmployee,
  updateEmployee,
} from "../utils/api";
import { Eye, Pencil, Trash2 } from "lucide-react";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEmp, setNewEmp] = useState({
    name: "",
    email: "",
    phone: "",
    jobrole: "employee",
    department: "",
    joinDate: "",
    salary: "",
    status: "active",
    notes: "",
  });
  const [search, setSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      
      setEmployees(res.data);
    } catch (err) {
      console.error("Fetch Employees Error:", err);
      alert("Failed to fetch employees");
    }
  };

 useEffect(() => {
  const fetchEmployees = async () => {
    const res = await getEmployees();

    const sorted = res.data.sort((a, b) => {
      const numA = parseInt(a.employeeCode.replace("EMP-", ""));
      const numB = parseInt(b.employeeCode.replace("EMP-", ""));
      return numA - numB;  // EMP-001 → EMP-002 → EMP-003
    });

    setEmployees(sorted);
  };

  fetchEmployees();
}, []);


  const handleAdd = async () => {
    if (!newEmp.name || !newEmp.email || !newEmp.department) {
      return alert("Please fill required fields: Name, Email, Department");
    }

    try {
      const payload = {
        name: newEmp.name,
        email: newEmp.email,
        phone: newEmp.phone,
        jobRole: newEmp.jobrole,
        department: newEmp.department,
        salary: Number(newEmp.salary) || 0,
        status: newEmp.status || "active",
        joinDate: newEmp.joinDate || new Date().toISOString(),
        notes: newEmp.notes || "",
        createdBy: localStorage.getItem("userId"), 
      };

      await addEmployee(payload);
      alert("Employee added successfully!");
      setNewEmp({
        name: "",
        email: "",
        phone: "",
        jobrole: "employee",
        department: "",
        joinDate: "",
        salary: "",
        status: "active",
        notes: "",
      });
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      console.error("Add Employee Error:", err);
      alert(err.response?.data?.message || "Failed to add employee");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteEmployee(id);
      alert("Employee deleted successfully");
      fetchEmployees();
    } catch (err) {
      console.error("Delete Employee Error:", err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const toggleSelect = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((eid) => eid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
      setSelectAll(false);
    } else {
      setSelectedEmployees(filteredEmployees.map((emp) => emp._id));
      setSelectAll(true);
    }
  };

  const handleAddSalary = () => {
    if (selectedEmployees.length !== 1) {
      return alert("Select exactly one employee to add salary");
    }
    navigate(`/employee/${selectedEmployees[0]}/add-salary`);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase()) ||
      emp.phone?.includes(search)
  );

  return (
    <Layout>
      <h2 className="text-sm font-semibold mb-3">Employees</h2>

      {/* Search + Actions */}
      <div className="flex flex-col  sm:flex-row gap-2 mb-3">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-1.5 text-xs rounded w-full sm:w-1/3"
        />
        <div className="flex gap-2">
          <button
            onClick={handleAddSalary}
            className="bg-green-500 text-black px-3 py-1.5 rounded text-xs hover:bg-green-600"
          >
            + Add Salary
          </button>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="bg-gray-700 text-white px-3 py-1.5 rounded text-xs hover:bg-gray-800"
          >
            {showForm ? "Close Form" : "+ Add Employee"}
          </button>
        </div>
      </div>

      {/* Add Employee Form */}
      {showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 bg-white p-3 rounded shadow text-sm">
          {[
            { label: "Full Name", field: "name", type: "text" },
            { label: "Email", field: "email", type: "email" },
            { label: "Phone", field: "phone", type: "text" },
            { label: "Job Role", field: "jobrole", type: "text" },
            { label: "Department", field: "department", type: "text" },
            { label: "Salary (₹)", field: "salary", type: "number" },
            { label: "Status", field: "status", type: "text" },
            { label: "Note", field: "note", type: "text" },
          ].map(({ label, field, type }) => (
            <div key={field} className="flex flex-col">
              <label className="text-xs font-semibold mb-1">{label}</label>
              <input
                type={type}
                value={newEmp[field]}
                onChange={(e) =>
                  setNewEmp({ ...newEmp, [field]: e.target.value })
                }
                className="border p-1.5 rounded text-xs"
                placeholder={label}
              />
            </div>
          ))}
          <div className="flex flex-col">
            <label className="text-xs font-semibold mb-1">Join Date</label>
            <input
              type="date"
              value={newEmp.joinDate}
              onChange={(e) =>
                setNewEmp({ ...newEmp, joinDate: e.target.value })
              }
              className="border p-1.5 rounded text-xs"
            />
          </div>
          <button
            onClick={handleAdd}
            className="bg-green-700 text-white px-4 py-2 rounded md:col-span-2 hover:bg-green-800 text-xs"
          >
            Submit
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[70vh] bg-white rounded shadow text-xs relative">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-2 text-left">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              {[
                "Emp ID",
                "Name",
                "Email",
                "Phone",
                "Job Role",
                "Department",
                "Salary",
                "Status",
                "Join Date",
                "Note",
                "Action",
              ].map((h) => (
                <th key={h} className="p-2 text-left font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length ? (
              filteredEmployees.map((emp, index) => (
                <tr key={emp._id} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.includes(emp._id)}
                      onChange={() => toggleSelect(emp._id)}
                    />
                  </td>
                  <td className="p-2">{emp.employeeCode}</td>
                  <td className="p-2">{emp.name}</td>
                  <td className="p-2">{emp.email}</td>
                  <td className="p-2">{emp.phone || "-"}</td>
                  <td className="p-2">{emp.jobRole}</td>
                  <td className="p-2">{emp.department}</td>
                  <td className="p-2">₹{emp.salary}</td>
                  <td className="p-2">{emp.status}</td>
                  <td className="p-2">
                    {emp.joinDate
                      ? new Date(emp.joinDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-2">{emp.notes || "-"}</td>
                  <td className="p-2 text-center flex justify-center gap-2">
                    <Eye
                      className="w-3 h-3 text-blue-700 cursor-pointer hover:text-blue-500"
                      onClick={() => navigate(`/employee/${emp._id}`)}
                    />
                    <Pencil
                      className="w-3 h-3 text-gray-700 cursor-pointer hover:text-gray-500"
                      onClick={() => navigate(`/employee/${emp._id}/edit`)}
                    />
                    <Trash2
                      className="w-3 h-3 text-red-600 cursor-pointer hover:text-red-500"
                      onClick={() => handleDelete(emp._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="12"
                  className="text-center py-4 text-gray-500 italic"
                >
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
