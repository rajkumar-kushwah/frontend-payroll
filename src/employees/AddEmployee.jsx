// client/pages/EmployeeAdd.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { addEmployee } from "../utils/api";
import { X } from "lucide-react";

export default function EmployeeAdd() {
  const navigate = useNavigate();

  const [avatarFile, setAvatarFile] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [jobRole, setJobRole] = useState("employee");
  const [department, setDepartment] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [dob, setDob] = useState("");
  const [status, setStatus] = useState("active");
  const [basicSalary, setBasicSalary] = useState("");
  // const [notes, setNotes] = useState("");
  const [password, setPassword] = useState("");


  const handleAdd = async () => {
    if (!name || !email || !department) {
      alert("Name, Email, Department required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("jobRole", jobRole);
      formData.append("department", department);
      formData.append("joinDate", joinDate);
      formData.append("dob", dob); //  DOB
      formData.append("status", status);
      formData.append("basicSalary", basicSalary);
      // formData.append("notes", notes);
      formData.append("password", password);


      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await addEmployee(formData);
      alert("Employee added successfully!");
      navigate("/employees");
    } catch (err) {
      alert("Employee add failed");
    }
  };

  return (
    <Layout>
      <div className="max-w-lg mx-auto mt-8 bg-white rounded-lg shadow p-5 relative text-sm">

        {/* Close */}
        <button
          onClick={() => navigate("/employees")}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          <X size={18} />
        </button>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-5">
          <img
            src={avatarFile ? URL.createObjectURL(avatarFile) : "/default-avatar.png"}
            className="w-12 h-12 rounded-full border object-cover mb-1"
          />
          <input
            type="file"
            accept="image/*"
            className="text-xs cursor-pointer"
            onChange={(e) => setAvatarFile(e.target.files[0])}
          />
        </div>

        {/* Name */}
        <div className="mb-3">
          <label className="block mb-1">Name</label>
          <input
            className="w-full border rounded px-2 py-1"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* DOB + Email */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block mb-1">Date of Birth</label>
            <input
              type="date"
              className="w-full border rounded px-2 py-1"
              value={dob}
              onChange={e => setDob(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Phone + Department */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block mb-1">Phone</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Department</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={department}
              onChange={e => setDepartment(e.target.value)}
            />
          </div>
        </div>

        {/* Job Role + Status */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block mb-1">Job Role</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={jobRole}
              onChange={e => setJobRole(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1">Status</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={status}
              onChange={e => setStatus(e.target.value)}
            />
          </div>
        </div>

        {/* Join Date + Salary */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block mb-1">Join Date</label>
            <input
              type="date"
              className="w-full border rounded px-2 py-1"
              value={joinDate}
              onChange={e => setJoinDate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded px-2 py-1"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Set password for employee"
            />
          </div>


          <div>
            <label className="block mb-1">Basic Salary</label>
            <input
              className="w-full border rounded px-2 py-1"
              value={basicSalary}
              onChange={e => setBasicSalary(e.target.value)}
            />
          </div>
        </div>

        {/* Notes */}

        {/* <div className="mb-4">
      <label className="block mb-1">Notes</label>
      <textarea
        rows="2"
        className="w-full border rounded px-2 py-1 resize-none"
        value={notes}
        onChange={e => setNotes(e.target.value)}
      />
    </div> */}

        {/* Submit */}
        <button
          onClick={handleAdd}
          className="w-full bg-lime-400 cursor-pointer hover:bg-lime-500 text-white py-2 rounded"
        >
          Submit
        </button>
      </div>
    </Layout>

  );
}
