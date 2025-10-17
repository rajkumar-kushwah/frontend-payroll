import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { Users, UserCog, IndianRupee, FileClock, CalendarCheck, } from "lucide-react";
import { useUser } from "../context/UserContext";
import Clock from "../clock/Clock";
import DashboardCalendar from "../calendar/DashboardCalendar";

export default function Dashboard() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const { user } = useUser();
  const [stats, setStats] = useState({
    employees: 0,
    totalSalary: 0,
    leaves: 0,
    reports: 0,
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  // Fetch employees and payroll stats
  const fetchData = async () => {
    try {
      const [eRes, pRes] = await Promise.allSettled([
        api.get("/employees"),
        api.get("/payrolls"),
      ]);

      const allEmployees = eRes.status === "fulfilled" ? eRes.value.data : [];
      const payrolls = pRes.status === "fulfilled" ? pRes.value.data.length : 0;

      // Sort by joinDate descending and get last 4
      const latestEmployees = [...allEmployees]
        .sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate))
        .slice(0, 4);

      // Calculate total salary
      const totalSalary = allEmployees.reduce(
        (acc, emp) => acc + (emp.salary || 0),
        0
      );

      setEmployees(latestEmployees);
      setStats({
        employees: allEmployees.length,
        totalSalary,
        leaves: 0, // update if you have leaves data
        reports: payrolls,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Refresh dashboard when a new employee or salary is added
    window.addEventListener("employeeAdded", fetchData);
    window.addEventListener("salaryAdded", fetchData);

    return () => {
      window.removeEventListener("employeeAdded", fetchData);
      window.removeEventListener("salaryAdded", fetchData);
    };
  }, []);

  if (loading)
    return (
      <Layout>
        <div className="p-6">Loading dashboard...</div>
      </Layout>
    );

  return (
    <Layout>
     
      <Users className="text-black drop-shadow-[0_2px_0_rgba(16,185,129,1)]" />

      {/* Dashboard Content */}
      {user?.name && (
        <h1 className="text-2xl font-bold mb-4 text-black"><span className="text-green-400">Welcome,</span>{user.name}</h1>
      )}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2  ">
      {/* Clock and Calendar */}
      <div className="p-4 justify-center items-center ">
        <Clock />
        <DashboardCalendar />
      </div>
       
      {/* Stats Cards */}
      <div className="border-none shadow-sm rounded-xl bg-gray-100 mb-12 ml-1 mr-1 p-6 w-full ">
      <div className=" flex-wrap gap-2 grid grid-cols-1 md:grid-cols-2 mx-auto mb-5 mt-10 overflow-x-auto min-w-full  ">
        <div className="bg-gray-50 p-6 rounded-sm shadow text-center grid hover:bg-gray-100 ">
          <div className="flex items-center justify-center ">
            <UserCog className="text-green-300 w-6 h-6"  />
            <div className="text-sm text-gray-600 font-medium">Total Employees</div>
          </div>
          <div className="text-3xl font-bold text-green-300 mt-2">
            {stats.employees}
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-sm shadow text-center grid  hover:bg-gray-100">
          <div className="flex items-center justify-center ">
            <IndianRupee className="text-blue-400 w-6 h-6" />
            <div className="text-sm text-gray-600 font-medium">Total Salary</div>
          </div>
          <div className="text-3xl font-bold text-blue-400 mt-2">
            ₹{stats.totalSalary}
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-sm shadow text-center grid  hover:bg-gray-100">
          <div className="flex items-center justify-center ">
            <CalendarCheck className="text-yellow-400 w-6 h-6"  />
            <div className="text-sm text-gray-600 font-medium">Leaves</div>
          </div>
          <div className="text-3xl font-bold text-yellow-400 mt-2">
            {stats.leaves}
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-sm shadow text-center grid  hover:bg-gray-100">
          <div className="flex items-center justify-center ">
            <FileClock  className="text-red-400 w-6 h-6" />
            <div className="text-sm text-gray-600 font-medium">Pending Reports</div>
          </div>
          <div className="text-3xl font-bold text-red-400 mt-2">
            {stats.reports}
          </div>
        </div>
      </div>
      </div>
</div>
      {/* Add Employee & View All Buttons */}
      <div className="flex justify-end mb-4 gap-3">
        <button
          className="bg-green-400 text-black px-4 py-2  rounded  hover:bg-green-500 transition"
          onClick={() => navigate("/employee/add")}
        >
          + Add Employee
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          onClick={() => navigate("/employees")}
        >
          View All
        </button>
      </div>

      {/* Latest 4 Employees Table */}
      <div className="p-1 bg-white rounded shadow overflow-x-auto ">
        <table className="min-w-full text-sm text-left  ">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Job Role</th>
              <th className="px-4 py-2">Department</th>
              <th className="px-4 py-2">Salary</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Join Date</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp, index) => (
                <tr key={emp._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 border">{index + 1}</td>
                  <td className="px-4 py-2 font-bold">{emp.name}</td>
                  <td className="px-4 py-2">{emp.email}</td>
                  <td className="px-4 py-2">{emp.jobRole}</td>
                  <td className="px-4 py-2">{emp.department}</td>
                  <td className="px-4 py-2">₹{emp.salary}</td>
                  <td className="px-4 py-2">{emp.status}</td>
                  <td className="px-4 py-2">
                    {new Date(emp.joinDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-right relative">
                    <button
                      className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
                      onClick={() => setOpenDropdown(openDropdown === emp._id ? null : emp._id)}
                    >
                      ⋮
                    </button>

                    {openDropdown === emp._id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
                        <button
                          onClick={() => navigate(`/employee/${emp._id}`)}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          View
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Update
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500 italic">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
