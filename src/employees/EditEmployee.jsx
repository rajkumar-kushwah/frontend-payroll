import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getEmployeeById, updateEmployeeProfile } from "../utils/api";

export default function EditEmployee() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatar, setAvatar] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [department, setDepartment] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [status, setStatus] = useState("active");
  const [basicSalary, setBasicSalary] = useState("");
  // const [notes, setNotes] = useState("");
  const [password, setPassword] = useState("");


  const [loading, setLoading] = useState(true);

  // ================= FETCH EMPLOYEE =================
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await getEmployeeById(id);
        const emp = res.data.emp;

        setName(emp.name || "");
        setEmail(emp.email || "");
        setPhone(emp.phone || "");
        setDob(emp.dateOfBirth ? emp.dateOfBirth.split("T")[0] : "");
        setJobRole(emp.jobRole || "");
        setDepartment(emp.department || "");
        setJoinDate(emp.joinDate ? emp.joinDate.split("T")[0] : "");
        setStatus(emp.status || "active");
        setBasicSalary(emp.basicSalary || "");
        // setNotes(emp.notes || "");
        setAvatar(emp.avatar || "");
      } catch (err) {
        alert("Employee load failed");
        navigate("/employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id, navigate]);

  // ================= UPDATE =================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("dateOfBirth", dob); //  DOB
      formData.append("jobRole", jobRole);
      formData.append("department", department);
      formData.append("joinDate", joinDate);
      formData.append("status", status);
      formData.append("basicSalary", basicSalary);
      // formData.append("notes", notes);
      formData.append("password", password);
      if (password) formData.append("password", password);



      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      await updateEmployeeProfile(id, formData);
      alert("Employee updated successfully!");
      navigate("/employees");
    } catch (err) {
      alert("Update failed");
    }
  };

  // if (loading) {
  //   return (
  //     <Layout>
  //       <div className="p-6 text-center text-sm">Loading...</div>
  //     </Layout>
  //   );
  // }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto mt-6 bg-white p-5 rounded-lg shadow text-sm">

        <h2 className="font-semibold mb-4">Edit Employee</h2>

        <form onSubmit={handleUpdate} className="space-y-3">

          {/* Avatar */}
          <div className="flex flex-col items-center">
            <img
              src={avatarFile ? URL.createObjectURL(avatarFile) : avatar || "/default-avatar.png"}
              className="w-16 h-16 rounded-full  object-cover border mb-2"
            />
            <input
              type="file"
              accept="image/*"
              onChange={e => setAvatarFile(e.target.files[0])}
              className="text-xs cursor-pointer"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1">Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          {/* DOB + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Date of Birth</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={dob}
                onChange={e => setDob(e.target.value)}
              />

            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Phone + Department */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Phone</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Department</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={department}
                onChange={e => setDepartment(e.target.value)}
              />
            </div>
          </div>

          {/* Job Role + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Job Role</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={jobRole}
                onChange={e => setJobRole(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Status</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Join Date + Salary */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block mb-1">Join Date</label>
              <input
                type="date"
                className="w-full border rounded px-3 py-2"
                value={joinDate}
                onChange={e => setJoinDate(e.target.value)}
              />
            </div>

            <div>
              <label className="block mb-1">Basic Salary</label>
              <input
                className="w-full border rounded px-3 py-2"
                value={basicSalary}
                onChange={e => setBasicSalary(e.target.value)}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block mb-1">Password</label>
            <input
              type="password"
              className="w-full border rounded px-3 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password (leave blank to keep current)"
            />
          </div>


          {/* Notes */}

          {/* <div>
            <label className="block mb-1">Notes</label>
            <textarea
              rows="2"
              className="w-full border rounded px-3 py-2 resize-none"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div> */}

          {/* Buttons */}
          <div className="flex justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate("/employees")}
              className="px-4 py-2 bg-gray-400 cursor-pointer text-white rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-lime-400 cursor-pointer text-white rounded hover:bg-lime-500"
            >
              Update
            </button>
          </div>

        </form>
      </div>
    </Layout>
  );
}
