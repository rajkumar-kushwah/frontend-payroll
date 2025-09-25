import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEmployees, addEmployee, deleteEmployee } from "../utils/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false); // toggle state
  const [newEmp, setNewEmp] = useState({
    name: "", email: "", jobrole: "employee", department: "", joinDate: "", salary: "", status: "active", notes: ""
  });
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const res = await getEmployees();
      setEmployees(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleAdd = async () => {
    if (!newEmp.name || !newEmp.email || !newEmp.department) return alert("Fill required fields");
    try {
      const payload = {
        ...newEmp,
        salary: Number(newEmp.salary),
        joinDate: newEmp.joinDate ? new Date(newEmp.joinDate) : undefined
      };
      await addEmployee(payload);
      setNewEmp({ name: "", email: "", jobrole: "employee", department: "", joinDate: "", salary: "", status: "active", notes: "" });
      fetchEmployees();
      setShowForm(false); // form close after add
      alert("Employee added successfully!");
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">Employees</h2>
      <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="border p-2 rounded mb-4 w-1/3"/>
      
      {/* Toggle Add Employee Form */}
      <button 
        onClick={() => setShowForm(prev => !prev)} 
        className="bg-green-600 text-white px-4 py-2 flex  ml-auto rounded mb-4"
      >
        {showForm ? "Close Add Employee Form" : "+Add Employee"}
      </button>

      {showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-4 rounded shadow">
          {["name","email","jobrole","department","salary","status","notes"].map(f => (
            <input key={f} type="text" placeholder={f} value={newEmp[f]} onChange={e => setNewEmp({...newEmp,[f]: e.target.value})} className="border p-2 rounded"/>
          ))}
          <input type="date" value={newEmp.joinDate} onChange={e=>setNewEmp({...newEmp,joinDate:e.target.value})} className="border p-2 rounded"/>
          <button onClick={handleAdd} className="bg-green-700 text-white px-4 py-2 rounded md:col-span-2">Submit</button>
        </div>
      )}

      {/* Employees Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
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
            )) : <tr><td colSpan="9" className="text-center py-4 text-gray-500 italic">No employees found.</td></tr>}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
