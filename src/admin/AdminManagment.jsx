import React, { useEffect, useState } from "react";
import {
  getAdminDashboardData,
  toggleUser,
  deleteUser,
  getEmployeesForAdminPromotion,
  promoteEmployeeToAdmin,
} from "../utils/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useUser } from "../context/UserContext";

export default function AdminManagement() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch Admin Users
  const fetchUsers = async () => {
    try {
      const res = await getAdminDashboardData();
      const owner = res.data.owner ? [res.data.owner] : [];
      setUsers([...owner, ...(res.data.users || [])]);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  // Fetch Employees for Promotion
  const fetchEmployees = async () => {
    try {
      const res = await getEmployeesForAdminPromotion();
      setEmployees(res.data.employees || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.role === "owner") {
      setLoading(true);
      Promise.all([fetchUsers(), fetchEmployees()]).finally(() =>
        setLoading(false)
      );
    }
  }, [user]);

  const handlePromote = async () => {
    if (!selectedEmployee) return alert("Please select an employee");
    if (!window.confirm("Promote this employee to Admin?")) return;

    try {
      await promoteEmployeeToAdmin(selectedEmployee);
      alert("Employee promoted to Admin");
      setSelectedEmployee("");
      setSearchTerm("");
      setDropdownOpen(false);
      fetchUsers();
      fetchEmployees();
    } catch (err) {
      alert(err.response?.data?.message || "Promotion failed");
    }
  };

  const handleToggle = async (u, newRole) => {
    try {
      await toggleUser(u._id, newRole);
      fetchUsers();
      alert(`Role updated to ${newRole}`);
    } catch (err) {
      alert("Operation failed");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await deleteUser(userId);
      fetchUsers();
      alert("User deleted successfully");
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const filteredEmployees = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) return <p className="text-xs text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="p-2 text-xs">
        <h1 className="text-sm font-bold mb-2">Owner / Admin Management</h1>

        {/* ===== Promote Employee ===== */}
        {user?.role === "owner" && (
          <div className="mb-3 flex flex-col sm:flex-row gap-2">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={
                  selectedEmployee
                    ? employees.find((e) => e._id === selectedEmployee)?.name ||
                      ""
                    : searchTerm
                }
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setDropdownOpen(true);
                  setSelectedEmployee("");
                }}
                onClick={() => setDropdownOpen(true)}
                placeholder="Type to search..."
                className="border p-1 rounded w-full text-xs"
                autoComplete="off"
              />
              {dropdownOpen && (
                <ul className="absolute z-50 w-full bg-white border rounded shadow-lg max-h-40 overflow-y-auto mt-1 text-xs">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((emp) => (
                      <li
                        key={emp._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                        onClick={() => {
                          setSelectedEmployee(emp._id);
                          setSearchTerm(emp.name);
                          setDropdownOpen(false);
                        }}
                      >
                        <img
                          src={emp.avatar || "/default-avatar.png"}
                          className="w-5 h-5 rounded-full"
                        />
                        <span>
                          {emp.name} ({emp.employeeCode})
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="p-2 text-gray-500">No employees found</li>
                  )}
                </ul>
              )}
            </div>

            <button
              onClick={handlePromote}
              className="bg-blue-600 text-white rounded px-3 py-1 text-xs hover:bg-blue-700"
            >
              Promote to Admin
            </button>
          </div>
        )}

        {/* ===== Add New Admin/User ===== */}
        {(user.role === "owner" || user.role === "admin") && (
          <button
            onClick={() => navigate("/admin/add-user")}
            className="mb-2 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
          >
            + Add New Admin/User
          </button>
        )}

        {/* ===== Admin Table ===== */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-1">Name</th>
                <th className="p-1">Email</th>
                <th className="p-1">Role</th>
                <th className="p-1">Status</th>
                <th className="p-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length ? (
                users.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="p-1">{u.name}</td>
                    <td className="p-1">{u.email}</td>
                    <td className="p-1">
                      {u.role === "owner" ? (
                        <span className="text-purple-600 text-xs">Owner</span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleToggle(u, e.target.value)
                          }
                          className="border p-1 rounded text-xs"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          <option value="employee">Employee</option>
                        </select>
                      )}
                    </td>
                    <td className="p-1">
                      {u.role === "owner" ? (
                        <span className="text-gray-600">Always Active</span>
                      ) : u.status === "active" ? (
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-1 flex flex-wrap gap-1">
                      {u.role !== "owner" && (
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="px-2 py-0.5 bg-gray-600 cursor-pointer text-white rounded text-[10px] hover:bg-gray-700"
                        >
                          Delete
                        </button>
                      )}
                      {u.role === "owner" && (
                        <span className="text-gray-500 text-[10px]">
                          Protected
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center p-1 text-gray-500 italic text-xs"
                  >
                    {loading ? "Loading..." : "No users found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
} 