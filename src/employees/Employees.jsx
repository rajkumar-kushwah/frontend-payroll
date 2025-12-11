// client/pages/Employees.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEmployees, addEmployee, deleteEmployee } from "../utils/api";
import { Eye, Pencil, Trash2, X } from "lucide-react";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaPlus, FaSearch } from "react-icons/fa";

export default function Employees() {
  const navigate = useNavigate();

  // ---------------- STATE ----------------
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [newEmp, setNewEmp] = useState({
    name: "", email: "", phone: "", jobRole: "employee",
    department: "", joinDate: "", status: "active", notes: "", 
  });

  // ---------------- FETCH EMPLOYEES ----------------
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getEmployees(); // { success: true, employees: [...] }
      const empArray = res.employees || [];

      // Sort employees by employeeCode
      empArray.sort((a, b) => {
        const numA = parseInt(a.employeeCode?.replace("EMP-", "")) || 0;
        const numB = parseInt(b.employeeCode?.replace("EMP-", "")) || 0;
        return numA - numB;
      });

      setEmployees(empArray);
    } catch (err) {
      console.error("Failed to fetch employees", err);
      setEmployees([]);
      alert("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  // ---------------- ADD EMPLOYEE ----------------
  const handleAdd = async () => {
    if (!newEmp.name || !newEmp.email || !newEmp.department)
      return alert("Fill required fields");

    try {
      const formData = new FormData();
      for (const key in newEmp) formData.append(key, newEmp[key]);
      if (avatarFile) formData.append("avatar", avatarFile);

      await addEmployee(formData);

      setNewEmp({
        name: "", email: "", phone: "", jobRole: "employee",
        department: "", joinDate: "", status: "active", notes: "", avatar: "",
      });
      setAvatarFile(null);
      setShowForm(false);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Add failed");
    }
  };

  // ---------------- DELETE EMPLOYEE ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // ---------------- FILTER EMPLOYEES ----------------
  const filteredEmployees = employees.filter(emp =>
    (emp.employeeCode || "").toLowerCase().includes(search.toLowerCase()) ||
    (emp.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (emp.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (emp.department || "").toLowerCase().includes(search.toLowerCase())
  );

  // ---------------- STATS ----------------
  const totalEmployees = employees.length;
  const activeCount = employees.filter(e => e.status === "active").length;
  const inactiveCount = totalEmployees - activeCount;

  // ---------------- RENDER ----------------
  return (
    <Layout>
      {/* ===== TOP BAR ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-2 text-xs gap-2">
        {/* Date + Stats */}
        <div className="flex items-center gap-3">
          <div>{new Date().toLocaleDateString()} </div>
          <div className="hidden sm:block">Active: {activeCount}</div>
          <div className="hidden sm:block">Inactive: {inactiveCount}</div>
        </div>

        
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3 text-xs">
        <div className="bg-gray-50 p-2 rounded shadow text-center">
          <FaUsers className="mx-auto text-sm" />{totalEmployees}<div>Total</div>
        </div>
        <div className="bg-gray-50 p-2 rounded shadow text-center">
          <FaCheckCircle className="mx-auto text-sm" />{activeCount}<div>Active</div>
        </div>
        <div className="bg-gray-50 p-2 rounded shadow text-center">
          <FaTimesCircle className="mx-auto text-sm" />{inactiveCount}<div>Inactive</div>
        </div>
      </div>

{/* Search + Add Button */}
<div className=" flex flex-col sm:flex-row justify-end mb-2">
        <div className="flex items-center gap-2 sm:gap-1 ml-auto">
          {/* Search Input with Icon */}
          <div className="relative">
            <FaSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-7 pr-2 border rounded p-1 text-xs"
            />
          </div>

          {/* Add Employee */}
          <button
            className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded text-xs"
            onClick={() => setShowForm(prev => !prev)}
          >
            <FaPlus className="sm:hidden" /> <span className="hidden sm:inline text-xs">+ Create</span>
          </button>
        </div>
      </div>

      {/* ===== ADD EMPLOYEE FORM ===== */}
      {showForm && (
        <div className="bg-white p-2 rounded shadow text-xs mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2 relative">
          <button className="absolute top-1 right-1 text-red-500" onClick={() => setShowForm(false)}>
            <X size={16} />
          </button>

          {/* Avatar */}
          <div className="flex flex-col col-span-1 sm:col-span-2 items-center">
            <img
              src={avatarFile ? URL.createObjectURL(avatarFile) :  "/default-avatar.png"}
              id="avatar"
              alt="Avatar"
              className="w-8 h-8 border rounded-full mb-1 object-cover"
            />
            <input type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files[0])} />
          </div>

          {/* Form Fields */}
          {["name", "email", "phone", "jobRole", "department", "status", "notes"].map(f => (
            <div key={f} className="flex flex-col">
              <label className="capitalize">{f}</label>
              <input
                type="text"
                className="border p-1 rounded"
                value={newEmp[f]}
                onChange={e => setNewEmp({ ...newEmp, [f]: e.target.value })}
              />
            </div>
          ))}

          <div className="flex flex-col">
            <label>Join Date</label>
            <input
              type="date"
              className="border p-1 rounded"
              value={newEmp.joinDate}
              onChange={e => setNewEmp({ ...newEmp, joinDate: e.target.value })}
            />
          </div>

          <button className="bg-green-500 text-white p-1 rounded col-span-1 sm:col-span-2" onClick={handleAdd}>
            Submit
          </button>
        </div>
      )}

      
{/* ===== EMPLOYEES TABLE ===== */}
<div className="overflow-x-auto max-h-[60vh] bg-transparent rounded text-xs">
  <h3 className="font-semibold mb-2 text-gray-700 px-3 pt-2 text-xs">Employee Records</h3>
  <div className="overflow-auto border">
    <table className="w-full border-collapse text-left min-w-[700px]">
      <thead className="bg-gray-100 sticky top-0">
        <tr>
          {["Name", "ID", "Email", "Phone", "Role", "Dept", "Status", "Join", "Notes", "Actions"].map(h => (
            <th key={h} className="px-3 py-2 border-b text-left text-xs">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan="9" className="text-center px-3 py-3 text-xs">Loading...</td></tr>
        ) : filteredEmployees.length ? filteredEmployees.map(emp => (
          <tr key={emp._id} className="hover:bg-gray-50 border-b text-xs">
            {/* Name + Avatar */}
            <td className="px-3 py-2 flex items-center gap-2 whitespace-nowrap text-xs">
              <img src={emp.avatar || "/default-avatar.png"} alt="avatar" className="w-5 h-5 rounded-full object-cover" />
              <span className="truncate text-xs">{emp.name}</span>
            </td>

            {/* Employee ID */}
            <td className="px-3 py-2 whitespace-nowrap text-xs">{emp.employeeCode}</td>
            <td className="px-3 py-2 truncate text-xs">{emp.email}</td>
            <td className="px-3 py-2 whitespace-nowrap text-xs">{emp.phone || "-"}</td>
            <td className="px-3 py-2 whitespace-nowrap text-xs">{emp.jobRole}</td>
            <td className="px-3 py-2 whitespace-nowrap text-xs">{emp.department}</td>
            <td className="px-3 py-2 whitespace-nowrap text-xs">{emp.status}</td>
            <td className="px-3 py-2 whitespace-nowrap text-xs">{emp.joinDate ? new Date(emp.joinDate).toLocaleDateString() : "-"}</td>
            <td className="px-3 py-2 truncate text-xs">{emp.notes || "-"}</td>

            {/* Actions */}
            <td className="px-3 py-2 flex justify-center items-center gap-1 whitespace-nowrap">
              <Eye size={12} className="cursor-pointer text-blue-500" onClick={() => navigate(`/employee/${emp._id}`)} />
              <Pencil size={12} className="cursor-pointer text-yellow-500" onClick={() => navigate(`/employee/${emp._id}/edit`)} />
              <Trash2 size={12} className="cursor-pointer text-red-500" onClick={() => handleDelete(emp._id)} />
            </td>
          </tr>
        )) : (
          <tr><td colSpan="9" className="text-center px-3 py-3 text-xs">No Employees</td></tr>
        )}
      </tbody>
    </table>
  </div>
</div>



    </Layout>
  );
}
