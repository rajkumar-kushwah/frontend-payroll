import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEmployees, addEmployee, deleteEmployee } from "../utils/api";
import { useHighlight } from "../context/HighlightContext"; // import highlight context

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [newEmp, setNewEmp] = useState({
    name: "", email: "", jobrole: "employee", department: "", joinDate: "", salary: "", status: "active", notes: ""
  });
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { highlightEmployeeId, setHighlightEmployeeId } = useHighlight(); // use context

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
        salary: Number(newEmp.salary) || 0,
        joinDate: newEmp.joinDate ? new Date(newEmp.joinDate).toISOString() : undefined
      };

      // await addEmployee(newEmp);
      const res = await addEmployee(payload); // get added employee id
      setNewEmp({ name: "", email: "", jobrole: "employee", department: "", joinDate: "", salary: "", status: "active", notes: "" });
      fetchEmployees();// refresh table

      setHighlightEmployeeId(res.data._id); // highlight new employee
      setTimeout(() => setHighlightEmployeeId(null), 5 * 60 * 1000); // remove highlight after 5 mins
     
      alert("Employee added successfully!");
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
  const highlightId = localStorage.getItem("highlightEmployeeId");
  if (highlightId) {
    setHighlightEmployeeId(highlightId);
    localStorage.removeItem("highlightEmployeeId");
    setTimeout(() => setHighlightEmployeeId(null), 5 * 60 * 1000);
  }
}, []);


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
      
      {/* Add Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-white p-4 rounded shadow">
        {["name","email","jobrole","department","salary","status","notes"].map(f => (
          <input key={f} type="text" placeholder={f} value={newEmp[f]} onChange={e => setNewEmp({...newEmp,[f]: e.target.value})} className="border p-2 rounded"/>
        ))}
        <input type="date" value={newEmp.joinDate} onChange={e=>setNewEmp({...newEmp,joinDate:e.target.value})} className="border p-2 rounded"/>
        <button onClick={handleAdd} className="bg-green-600 text-white px-4 py-2 rounded md:col-span-2">Add Employee</button>
      </div>

      {/* Employees Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">#</th> {/* Serial Number */}
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
              <tr key={emp._id} className={`hover:bg-gray-50 ${emp._id === highlightEmployeeId ? "bg-green-100" : ""}`}>
                <td className="p-2 border">{index + 1}</td> {/* This is your 1,2,3 */}
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
