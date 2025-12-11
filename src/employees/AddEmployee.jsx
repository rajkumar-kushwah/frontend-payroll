// client/pages/EmployeeAdd.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { addEmployee } from "../utils/api";
import { X } from "lucide-react";

export default function EmployeeAdd() {
  const navigate = useNavigate();
  const [avatarFile, setAvatarFile] = useState(null);
  const [newEmp, setNewEmp] = useState({
    name: "", email: "", phone: "", jobRole: "employee",
    department: "", joinDate: "", status: "active", notes: ""
  });

 const handleAdd = async () => {
  if (!newEmp.name || !newEmp.email || !newEmp.department) 
    return alert("Fill required fields");

  try {
    const formData = new FormData();
    
    // Append text fields
    for (const key in newEmp) {
      if (newEmp[key] !== "") formData.append(key, newEmp[key]);
    }

    // Append avatar only if file is selected
    if (avatarFile instanceof File) {
      formData.append("avatar", avatarFile);
    }

    // Debug: check FormData entries
    // for (let pair of formData.entries()) console.log(pair[0], pair[1]);

    await addEmployee(formData);
    navigate("/employees"); // after adding, go back to list
  } catch (err) {
    console.error(err.response?.data || err);
    alert("Add failed");
  }
};


  return (
    <Layout>
      <div className="bg-white p-3 rounded shadow text-xs max-w-md mx-auto mt-5 relative">
        <button className="absolute top-2 right-2 cursor-pointer" onClick={() => navigate("/employees")}>
          <X size={18} />
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-3">
          <img src={avatarFile ? URL.createObjectURL(avatarFile) : "/default-avatar.png"} alt="Avatar" className="w-8 h-8 rounded-full cursor-pointer border mb-2 object-cover" />
          <input type="file" accept="image/*" onChange={e => setAvatarFile(e.target.files[0])} />
        </div>

        {/* Form Fields */}
        {["name", "email", "phone", "jobRole", "department", "status", "notes"].map(f => (
          <div key={f} className="flex flex-col mb-2">
            <label className="capitalize">{f}</label>
            <input
              type="text"
              className="border p-1 rounded"
              value={newEmp[f]}
              onChange={e => setNewEmp({ ...newEmp, [f]: e.target.value })}
            />
          </div>
        ))}

        <div className="flex flex-col mb-2">
          <label>Join Date</label>
          <input type="date" className="border p-1 rounded" value={newEmp.joinDate} onChange={e => setNewEmp({ ...newEmp, joinDate: e.target.value })} />
        </div>

        <button className="bg-green-500 cursor-pointer text-white p-2 rounded w-full" onClick={handleAdd}>Submit</button>
      </div>
    </Layout>
  );
}
