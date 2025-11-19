import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import AddUserForm from "./AddUserForm";
import UserList from "./UserList";
import { getAdminDashboardData, addUser, promoteUser, demoteUser, deleteUser } from "../utils/api";

export default function AdminManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboardData();
      setUsers(res.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAddUser = async (newUser) => {
    try {
      await addUser(newUser);
      fetchUsers();
      setShowAddForm(false);
      alert("User added successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add user");
    }
  };

//  admin delete




  const handlePromote = async (id) => { await promoteUser(id); fetchUsers(); alert("User promoted"); };
  const handleDemote = async (id) => { await demoteUser(id); fetchUsers(); alert("Admin demoted"); };
const handleDelete = async (id) => {
  try {
    const res = await deleteUser(id); // api.js me define
    fetchUsers(); // refresh list
    alert(res.message || "User deleted successfully");
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to delete user");
  }
};


  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Owner Dashboard - Admin Management</h1>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="mb-4 px-4 py-2 bg-green-500 text-white rounded"
        >
          {showAddForm ? "Cancel" : "Add New User"}
        </button>

        {showAddForm && <AddUserForm onAdd={handleAddUser} />}
        <UserList users={users} onPromote={handlePromote} onDemote={handleDemote} onDelete={handleDelete} />
      </div>
    </Layout>
  );
}
