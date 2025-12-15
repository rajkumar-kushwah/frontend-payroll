import React, { useEffect, useState } from "react";
import { getAdminDashboardData, toggleUser, deleteUser } from "../utils/api";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { useUser } from "../context/UserContext";

export default function AdminManagement() {
  const { user } = useUser();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboardData();

      // Ensure we include the OWNER in user list
      const owner = res.data.owner ? [res.data.owner] : [];
      const allUsers = [...owner, ...(res.data.users || [])];

      setUsers(allUsers);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "owner" || user?.role === "admin") fetchUsers();
  }, [user]);

  const handleToggle = async (u) => {
    try {
      await toggleUser(u._id);
      fetchUsers();

      let msg = "";
      if (u.role === "admin") msg = "Admin demoted to User";
      else if (u.role === "user") msg = "User promoted to Admin";

      if (u.status === "active") msg = "User disabled";
      else if (u.status === "inactive") msg = "User enabled";

      alert(msg);
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user permanently?")) return;

    try {
      await deleteUser(userId);
      fetchUsers();
      alert("User deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  // if (loading) return <p className="text-xs">Loading...</p>;
  if (error) return <p className="text-xs text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="p-2 text-xs">
        <h1 className="text-sm font-bold mb-2">Owner/Admin Dashboard</h1>

        {(user.role === "owner" || user.role === "admin") && (
          <button
            onClick={() => navigate("/admin/add-user")}
            className="mb-2 px-2 py-1 bg-green-600 cursor-pointer text-white text-xs rounded"
          >
            + Add New User
          </button>
        )}

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
              {users.length > 0 ? (
                users.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="p-1">{u.name}</td>
                    <td className="p-1">{u.email}</td>
                    <td className="p-1 font-semibold">
                      {u.role === "owner" ? (
                        <span className="text-purple-600 text-xs ">Owner</span>
                      ) : u.role === "admin" ? (
                        <span className="text-blue-600">Admin</span>
                      ) : (
                        "User"
                      )}
                    </td>

                    <td className="p-1">
                      {u.role === "owner" ? (
                        <span className="text-gray-600">Always Active</span>
                      ) : u.status === "active" ? (
                        <span className="text-green-600 font-semibold">Active</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Inactive</span>
                      )}
                    </td>

                    <td className="p-1 flex flex-wrap gap-1">
                      {u.role !== "owner" && (
                        <button
                          onClick={() => handleToggle(u)}
                          className="px-2 py-0.5 bg-red-500 text-white cursor-pointer rounded text-[10px]"
                        >
                          {u.role === "admin"
                            ? "Demote"
                            : u.status === "active"
                            ? "Disable"
                            : "Enable"}
                        </button>
                      )}

                      {u.role !== "owner" && (
                        <button
                          onClick={() => handleDelete(u._id)}
                          className="px-2 py-0.5 bg-gray-600 cursor-pointer text-white rounded text-[10px]"
                        >
                          Delete
                        </button>
                      )}

                      {u.role === "owner" && (
                        <span className="text-gray-500 text-[10px]">Protected</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>

                  <td colSpan={5} className="text-center p-1 text-gray-500 italic text-xs">
                    <td>{loading && "Loading..."}No users found</td>
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
