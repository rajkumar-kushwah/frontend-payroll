// client/pages/Employees.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEmployees, deleteEmployee } from "../utils/api";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { FaUsers, FaCheckCircle, FaTimesCircle, FaPlus, FaSearch } from "react-icons/fa";

export default function Employees() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch Employees
  const fetchEmployees = async () => {
  if(employees.length === 0) setLoading(true);
    try {
      const res = await getEmployees();
      const empArray = res.employees || [];
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

  // Delete Employee
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this employee?")) return;
    try {
      await deleteEmployee(id);
      fetchEmployees();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // Filter Employees
  const filteredEmployees = employees.filter(emp =>
    (emp.employeeCode || "").toLowerCase().includes(search.toLowerCase()) ||
    (emp.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (emp.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (emp.department || "").toLowerCase().includes(search.toLowerCase()) ||
    (emp.phone || "").toString().includes(search)
  );

  const totalEmployees = employees.length;
  const activeCount = employees.filter(e => e.status === "active").length;
  const inactiveCount = totalEmployees - activeCount;

  return (
    <Layout>
      {/* ===== TOP BAR ===== */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-2 text-xs gap-2">
        <div className="flex items-center gap-3">
          <div>{new Date().toLocaleDateString()}</div>
          <div className="hidden sm:block">Active: {activeCount}</div>
          <div className="hidden sm:block">Inactive: {inactiveCount}</div>
        </div>

        {/* Search + Add Button */}
        
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

      <div className="flex sm:flex-row justify-end items-center gap-2 sm:gap-1 ml-auto">
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

          <button
            className="flex items-center gap-1 bg-lime-400 text-white px-2 py-1 rounded text-xs"
            onClick={() => navigate("/employee/add")}
          >
            <FaPlus className="sm:hidden" />
            <span className="hidden sm:inline cursor-pointer text-xs">+ Create</span>
          </button>
        </div>

      {/* ===== EMPLOYEES TABLE ===== */}
      <div className="overflow-x-auto max-h-[60vh] bg-transparent rounded text-xs">
        <h3 className="font-semibold mb-2 text-gray-700 px-3 pt-2 text-xs">Employee Records</h3>
        <div className="overflow-auto border">
          <table className="w-full border-collapse text-left min-w-[700px]">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                {["Name", "ID", "Email", "Phone", "Role", "Dept", "Status", "Join", "BasicSalary", "Notes", "Actions"].map(h => (
                  <th key={h} className="px-3 py-2 border-b text-left text-xs">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" className="text-center px-3 py-3 text-xs">Loading...</td></tr>
              ) : filteredEmployees.length ? filteredEmployees.map(emp => (
                <tr key={emp._id} className="hover:bg-gray-50 border-b text-xs">
                  <td className="px-3 py-2 flex items-center gap-2 whitespace-nowrap text-xs">
                    <img src={emp.avatar || "/default-avatar.png"} alt="avatar" className="w-5 h-5 rounded-full object-cover" />
                    <span className="truncate text-xs">{emp.name}</span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">{emp.employeeCode}</td>
                  <td className="px-3 py-2 truncate text-xs">{emp.email}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">{emp.phone || "-"}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">{emp.jobRole}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">{emp.department}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">{emp.status}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">{emp.joinDate ? new Date(emp.joinDate).toLocaleDateString() : "-"}</td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">{emp.basicSalary || "-"}</td>
                  <td className="px-3 py-2 truncate text-xs">{emp.notes || "-"}</td>
                  <td className="px-3 py-2 flex justify-center items-center gap-1 whitespace-nowrap">
                    <Eye size={12} className="cursor-pointer text-blue-500" onClick={() => navigate(`/employee/${emp._id}`)} />
                    <Pencil size={12} className="cursor-pointer text-yellow-500" onClick={() => navigate(`/employee/${emp._id}/edit`)} />
                    <Trash2 size={12} className="cursor-pointer text-red-500" onClick={() => handleDelete(emp._id)} />
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="10" className="text-center px-3 py-3 text-xs">No Employees</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
