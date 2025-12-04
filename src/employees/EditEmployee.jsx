import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEmployeeById, updateEmployeeProfile } from '../utils/api';
import Layout from '../components/Layout';

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    jobRole: "",
    department: "",
    joinDate: "",
    status: "active",
    notes: "",
    avatar: ""
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await getEmployeeById(id);
        const emp = res.data.emp; // <-- important: use emp

        if (!emp) throw new Error("Employee not found");

        setEmployee({
          name: emp.name || "",
          email: emp.email || "",
          phone: emp.phone || "",
          jobRole: emp.jobRole || "",
          department: emp.department || "",
          joinDate: emp.joinDate ? emp.joinDate.split("T")[0] : "",
          status: emp.status || "active",
          notes: emp.notes || "",
          avatar: emp.avatar || ""
        });

      } catch (err) {
        console.error("Error fetching employee:", err);
        alert("Failed to load employee data.");
        navigate("/employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

 const handleUpdate = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();

    // Append all fields except avatar
    for (const key in employee) {
      if (key !== "avatar") formData.append(key, employee[key]);
    }

    // Append avatar only if a new file is selected
    if (avatarFile) formData.append("avatar", avatarFile);

    await updateEmployeeProfile(id, formData);
    alert("Employee updated successfully!");
    navigate("/employees");
  } catch (err) {
    console.error("Error updating employee:", err.response || err);
    alert("Failed to update employee.");
  }
};


  if (loading) {
    return <Layout><div className='p-6 text-center text-xs'>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className='min-h-screen flex items-center justify-center bg-gray-200 p-2'>
        <div className='p-4 max-w-2xl w-full'>
          <h2 className="text-sm font-semibold mb-3">Edit Employee</h2>

          <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-2 bg-gray-100 p-3 rounded shadow text-xs">

            {/* Avatar */}
            <div className="flex flex-col items-center col-span-2">
              <img
                src={avatarFile ? URL.createObjectURL(avatarFile) : (employee.avatar || "https://via.placeholder.com/60")}
                alt="Avatar"
                className="w-16 h-16 rounded-full mb-1 object-cover"
              />
              <input type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files[0])} className="text-xs"/>
            </div>

            {/* Text inputs */}
            {["name","email","phone","jobRole","department","notes"].map(f => (
              <div key={f} className="flex flex-col">
                <label className="capitalize">{f}</label>
                {f === "notes" ? (
                  <textarea
                    value={employee.notes}
                    onChange={e => setEmployee({...employee, notes: e.target.value})}
                    className="border p-1 rounded text-xs"
                  />
                ) : (
                  <input
                    type="text"
                    value={employee[f]}
                    onChange={e => setEmployee({...employee, [f]: e.target.value})}
                    className="border p-1 rounded text-xs"
                  />
                )}
              </div>
            ))}

            {/* Status */}
            <div className="flex flex-col">
              <label>Status</label>
              <select
                value={employee.status}
                onChange={e => setEmployee({...employee, status: e.target.value})}
                className="border p-1 rounded text-xs"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Join Date */}
            <div className="flex flex-col">
              <label>Join Date</label>
              <input
                type="date"
                value={employee.joinDate}
                onChange={e => setEmployee({...employee, joinDate: e.target.value})}
                className="border p-1 rounded text-xs"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-between col-span-2">
              <button
                type="button"
                onClick={() => navigate("/employees")}
                className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
