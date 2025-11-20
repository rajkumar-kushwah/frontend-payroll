// src/pages/Employees.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEmployees, addEmployee, deleteEmployee } from "../utils/api";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import { FaUsers, FaMoneyBillWave, FaCheckCircle, FaTimesCircle, FaSearch, FaFilter, FaPlus } from "react-icons/fa";

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [newEmp, setNewEmp] = useState({
    name: "", email: "", phone: "", jobRole: "employee",
    department: "", joinDate: "", salary: "", status: "active", notes: ""
  });

  // ---------------- FETCH EMPLOYEES ----------------
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees();
      const sorted = res.data.sort((a,b)=>{
        const numA = parseInt(a.employeeCode?.replace("EMP-",""))||0;
        const numB = parseInt(b.employeeCode?.replace("EMP-",""))||0;
        return numA-numB;
      });
      setEmployees(sorted);
    } catch(err){ console.error(err); alert("Failed to fetch employees"); }
    finally{ setLoading(false); }
  };

  useEffect(()=>{ fetchEmployees(); },[]);

  // ---------------- ADD EMPLOYEE ----------------
  const handleAdd = async () => {
    if(!newEmp.name || !newEmp.email || !newEmp.department) 
      return alert("Fill required fields");
    try{
      await addEmployee({
        ...newEmp,
        salary: Number(newEmp.salary)||0,
        joinDate: newEmp.joinDate || new Date().toISOString()
      });
      setNewEmp({ name:"", email:"", phone:"", jobRole:"employee", department:"", joinDate:"", salary:"", status:"active", notes:""});
      setShowForm(false);
      fetchEmployees();
    } catch(err){ console.error(err); alert("Add failed"); }
  };

  // ---------------- DELETE EMPLOYEE ----------------
  const handleDelete = async (id) => {
    if(!window.confirm("Delete this employee?")) return;
    try{ await deleteEmployee(id); fetchEmployees(); } catch(err){ alert("Delete failed"); }
  };

  // ---------------- FILTERED EMPLOYEES ----------------
  const filteredEmployees = employees.filter(emp =>
    emp.employeeCode?.toLowerCase().includes(search.toLowerCase()) ||
    emp.name.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase()) ||
    emp.department?.toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- CARDS DATA ----------------
  const totalEmployees = employees.length;
  const totalSalary = employees.reduce((acc,e)=>acc+(e.salaryDetails?.netSalary ?? e.salary ?? 0),0);
  const activeCount = employees.filter(e=>e.status==="active").length;
  const inactiveCount = employees.filter(e=>e.status!=="active").length;

  return (
    <Layout>
      {/* ---------------- TOP BAR ---------------- */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-2 text-xs gap-2 relative">
        {/* Left: Date + Active */}
        <div className="flex items-center gap-3">
          <div>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
          <div className="hidden sm:block">Active: {activeCount}</div>
          <div className="hidden sm:block">Inactive: {inactiveCount}</div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-1 relative ml-auto">
          {/* Search Icon + Input */}
          <div className="relative">
            <FaSearch className="cursor-pointer" onClick={()=>setShowSearch(prev=>!prev)} />
            {showSearch && (
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={e=>setSearch(e.target.value)}
                className="absolute top-6 right-0 w-48 sm:w-40 border rounded p-1 text-xs z-50 bg-white shadow"
              />
            )}
          </div>

          <FaFilter className="cursor-pointer"/>

          {/* Create / Add Employee */}
          <button className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded text-xs" onClick={()=>setShowForm(prev=>!prev)}>
            <FaPlus className="sm:hidden"/> <span className="hidden sm:inline">Create</span>
          </button>
        </div>
      </div>

      {/* ---------------- CARDS ---------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs">
        <div className="bg-gray-50 p-2 rounded shadow text-center">
          <FaUsers className="mx-auto text-sm"/>{totalEmployees}<div>Total</div>
        </div>
        <div className="bg-gray-50 p-2 rounded shadow text-center">
          <FaMoneyBillWave className="mx-auto text-sm"/>₹{totalSalary}<div>Salary</div>
        </div>
        <div className="bg-gray-50 p-2 rounded shadow text-center">
          <FaCheckCircle className="mx-auto text-sm"/>{activeCount}<div>Active</div>
        </div>
        <div className="bg-gray-50 p-2 rounded shadow text-center">
          <FaTimesCircle className="mx-auto text-sm"/>{inactiveCount}<div>Inactive</div>
        </div>
      </div>

      {/* ---------------- ADD EMPLOYEE FORM ---------------- */}
      {showForm && (
        <div className="bg-white p-2 rounded shadow text-xs mb-3 relative grid grid-cols-1 sm:grid-cols-2 gap-2">
          {/* Close Button */}
          <button className="absolute top-1 right-1 text-red-500" onClick={()=>setShowForm(false)}>
            <X size={16}/>
          </button>

          {["name","email","phone","jobRole","department","salary","status","notes"].map(f=>(
            <div key={f} className="flex flex-col">
              <label className="capitalize">{f}</label>
              <input
                type={f==="salary"?"number":"text"}
                className="border p-1 rounded"
                value={newEmp[f]}
                onChange={e=>setNewEmp({...newEmp,[f]:e.target.value})}
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label>Join Date</label>
            <input
              type="date"
              className="border p-1 rounded"
              value={newEmp.joinDate}
              onChange={e=>setNewEmp({...newEmp,joinDate:e.target.value})}
            />
          </div>

          <button className="bg-green-500 text-white p-1 rounded col-span-1 sm:col-span-2" onClick={handleAdd}>Submit</button>
        </div>
      )}

      {/* ---------------- EMPLOYEE TABLE ---------------- */}
      <div className="overflow-x-auto max-h-[60vh] bg-white rounded shadow text-xs">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              {["ID","Name","Email","Phone","Role","Dept","Salary","Status","Join","Actions"].map(h=>(
                <th key={h} className="p-1">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="10" className="text-center p-2">Loading...</td></tr>
            ) : filteredEmployees.length ? filteredEmployees.map(emp=>(
              <tr key={emp._id} className="hover:bg-gray-50">
                <td className="p-1">{emp.employeeCode}</td>
                <td className="p-1">{emp.name}</td>
                <td className="p-1">{emp.email}</td>
                <td className="p-1">{emp.phone||"-"}</td>
                <td className="p-1">{emp.jobRole}</td>
                <td className="p-1">{emp.department}</td>
                <td className="p-1">₹{emp.salaryDetails?.netSalary ?? emp.salary ?? 0}</td>
                <td className="p-1">{emp.status}</td>
                <td className="p-1">{emp.joinDate?new Date(emp.joinDate).toLocaleDateString():"-"}</td>
                <td className="p-1 flex gap-1">
                  <Eye size={14} className="cursor-pointer" onClick={()=>navigate(`/employee/${emp._id}`)}/>
                  <Pencil size={14} className="cursor-pointer" onClick={()=>navigate(`/employee/${emp._id}/edit`)}/>
                  <Trash2 size={14} className="cursor-pointer" onClick={()=>handleDelete(emp._id)}/>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="10" className="text-center p-2">No Employees</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
