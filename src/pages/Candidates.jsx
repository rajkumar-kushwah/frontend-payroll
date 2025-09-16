import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null); // view details
  const [editing, setEditing] = useState(null);   // edit candidate
  const [form, setForm] = useState({ name: "", email: "", position: "" });

  // 🔹 Fetch candidates
  const fetchCandidates = async (query = "") => {
    try {
      setLoading(true);
      const res = await api.get(`/candidates?search=${query}`);
      setCandidates(res.data || []);
    } catch (err) {
      console.error(err);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // 🔹 Delete candidate
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      await api.delete(`/candidates/${id}`);
      fetchCandidates(search);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // 🔹 Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    fetchCandidates(search);
  };

  // 🔹 Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Save (create or update)
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/candidates/${editing._id}`, form);
      } else {
        await api.post("/candidates", form);
      }
      setForm({ name: "", email: "", position: "" });
      setEditing(null);
      fetchCandidates(search);
    } catch (err) {
      alert("Save failed");
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Candidates</h1>

      {/* Add / Edit Form */}
      <form
        onSubmit={handleSave}
        className="bg-white p-4 rounded shadow mb-6 grid gap-3 md:grid-cols-3"
      >
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="position"
          value={form.position}
          onChange={handleChange}
          placeholder="Position"
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 col-span-full md:col-span-1"
        >
          {editing ? "Update" : "Add"}
        </button>
      </form>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="border rounded px-3 py-2 flex-1"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="bg-white p-4 rounded shadow overflow-x-auto">
        {loading ? (
          <div>Loading...</div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No candidates found
          </div>
        ) : (
          <table className="w-full min-w-[500px]">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Position</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c._id} className="border-b">
                  <td className="py-2">{c.name}</td>
                  <td className="py-2">{c.email}</td>
                  <td className="py-2">{c.position || "-"}</td>
                  <td className="py-2 space-x-2">
                    <button
                      onClick={() => setSelected(c)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setEditing(c);
                        setForm({
                          name: c.name,
                          email: c.email,
                          position: c.position || "",
                        });
                      }}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal for View Details */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Candidate Details</h2>
            <p><span className="font-semibold">Name:</span> {selected.name}</p>
            <p><span className="font-semibold">Email:</span> {selected.email}</p>
            <p><span className="font-semibold">Position:</span> {selected.position}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
