import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEmployees, addEmployee, deleteEmployee } from "../utils/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEmp, setNewEmp] = useState({
    name: "",
    email: "",
    jobrole: "employee",
    department: "",
    joinDate: "",
    salary: "",
    status: "active",
    notes: ""
  });
  const [search, setSearch] = useState("");
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const navigate = useNavigate();

  // Fetch all employees
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
    fetchEmployees();
  }, []);

  // Add Employee
  const handleAdd = async () => {
    if (!newEmp.name || !newEmp.email || !newEmp.department) {
      return alert("Please fill required fields: Name, Email, Department");
    }

    try {
      const payload = {
        name: newEmp.name,
        email: newEmp.email,
        jobRole: newEmp.jobrole, // match backend schema
        department: newEmp.department,
        salary: Number(newEmp.salary) || 0,
        status: newEmp.status || "active",
        joinDate: newEmp.joinDate || new Date().toISOString(),
        notes: newEmp.notes || ""
      };

      await addEmployee(payload);
      alert("Employee added successfully!");

      // Reset form
      setNewEmp({
        name: "",
        email: "",
        jobrole: "employee",
        department: "",
        joinDate: "",
        salary: "",
        status: "active",
        notes: ""
      });
      setShowForm(false);
      fetchEmployees(); // refresh table
    } catch (err) {
      console.error("Add Employee Error:", err);
      alert(err.response?.data?.message || "Failed to add employee");
    }
  };

  // Delete Employee
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

  // Selection logic
  const toggleSelect = (id) => {
    setSelectedEmployees(prev =>
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([]);
      setSelectAll(false);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp._id));
      setSelectAll(true);
    }
  };

  // Navigate to Add Salary page for selected employee
  const handleAddSalary = () => {
    if (selectedEmployees.length !== 1) {
      return alert("Select exactly one employee to add salary");
    }
    navigate(`/employee/${selectedEmployees[0]}/add-salary`);
  };

  // Filter employees by search
  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Employees</h2>

      {/* Search + Actions */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search by name, email, department..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border p-2 rounded w-1/3"
        />
        <button onClick={handleAddSalary} className="bg-green-500 text-white px-4 py-2 rounded">+ Add Salary</button>
        <button onClick={() => setShowForm(prev => !prev)} className="bg-blue-500 text-white px-4 py-2 rounded">
          {showForm ? "Close Add Employee Form" : "+ Add Employee"}
        </button>
      </div>

      {/* Add Employee Form */}
      {showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-4 rounded shadow">
          {["name","email","jobrole","department","salary","status","notes"].map(f => (
            <input
              key={f}
              type={f === "salary" ? "number" : "text"}
              placeholder={f}
              value={newEmp[f]}
              onChange={e => setNewEmp({...newEmp,[f]: e.target.value})}
              className="border p-2 rounded"
            />
          ))}
          <input
            type="date"
            value={newEmp.joinDate}
            onChange={e => setNewEmp({...newEmp, joinDate: e.target.value})}
            className="border p-2 rounded"
          />
          <button onClick={handleAdd} className="bg-green-700 text-white px-4 py-2 rounded md:col-span-2">Submit</button>
        </div>
      )}

      {/* Employee Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border"><input type="checkbox" checked={selectAll} onChange={toggleSelectAll}/></th>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Job Role</th>
              <th className="p-2 border">Department</th>
              <th className="p-2 border">Salary</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Join Date</th>
              <th className="p-2 border">Notes</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.length ? filteredEmployees.map((emp,index)=> (
              <tr key={emp._id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  <input type="checkbox" checked={selectedEmployees.includes(emp._id)} onChange={() => toggleSelect(emp._id)}/>
                </td>
                <td className="p-2 border">{index + 1}</td>
                <td className="p-2 border">{emp.name}</td>
                <td className="p-2 border">{emp.email}</td>
                <td className="p-2 border">{emp.jobrole}</td>
                <td className="p-2 border">{emp.department}</td>
                <td className="p-2 border">₹{emp.salary}</td>
                <td className="p-2 border">{emp.status}</td>
                <td className="p-2 border">{emp.joinDate ? new Date(emp.joinDate).toLocaleDateString() : "-"}</td>
                <td className="p-2 border">{emp.notes || "-"}</td>
                <td className="p-2 border flex gap-1">
                  <button onClick={() => navigate(`/employee/${emp._id}`)} className="bg-blue-500 text-white px-2 py-1 rounded">View</button>
                  <button onClick={() => handleDelete(emp._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="11" className="text-center py-4 text-gray-500 italic">No employees found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
