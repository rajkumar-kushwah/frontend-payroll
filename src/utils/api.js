// client/utils/api.js
import axios from 'axios';



const api = axios.create({
  baseURL: "https://project-payroll.onrender.com/api", 
    headers: { "Content-Type": "application/json" },
});



// Employee APIs
// Employee APIs
export const getEmployees = async () => {
  const res = await api.get("/employees");
  return res.data; // backend response = { success, employees: [...] }
};

// ======================
// EMPLOYEE PROFILE (with Avatar Upload)
// ======================

// Create employee with avatar
export const createEmployeeProfile = (formData) =>
  api.post("/employees/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Update employee profile with avatar
export const updateEmployeeProfile = (id, formData) =>
  api.put(`/employees/profile/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getEmployeeById = (id) => api.get(`/employees/${id}`);
export const addEmployee = (data) => api.post("/employees", data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
export const filterEmployees = async (filters) => {
  const response = await api.get(`/employees/filter`, {
    params: {...filters },
  });
  return response.data;
};


// Salary APIs
export const addSalary = (data) => api.post("/salary", data);
export const getSalariesByEmployee = (employeeId, month = "") => {
  const params = {};
  if (month) params.month = month;          // optional filter
  params.employeeId = employeeId;           // always filter by employee
  return api.get("/salary/filter", { params });
};
// client/utils/api.js
export const updateSalary = (id, data) => api.put(`/salary/${id}`, data);
export const deleteSalary = (id) => api.delete(`/salary/${id}`);
export const markSalaryPaid = (id) => api.patch(`/salary/${id}/pay`);
export const getSalaryById = (id) => api.get(`/salary/${id}`);


// ADD user
export const addUser = (user) => api.post("/company/add-user", user);

// FETCH all users
export const getAdminDashboardData = () => api.get("/admin-dashboard");

// TOGGLE (Promote ↔ Demote + Active ↔ Inactive)
export const toggleUser = (userId) =>
  api.put(`/company/user/toggle/${userId}`);

// DELETE user
export const deleteUser = (userId) =>
  api.delete(`/company/user/${userId}`);


// ======================
// 1) Check-In (Admin/Owner can provide employeeId)
// ======================
// 1) Auto Check In
export const checkIn = async (employeeId) => {
  const res = await api.post("/attendance/check-in", { employeeId }); // send string, not object
  return res.data;
};


// ======================
// 2) Check-Out (Admin/Owner can provide employeeId)
// ======================
// 2) Auto Check Out
export const checkOut = async (employeeId) => {
  const res = await api.post("/attendance/check-out", { employeeId }); // send string
  return res.data;
};
// ======================
// 3) Get All Attendance (Admin/Owner only)
// filters = { employeeId, status, startDate, endDate, page, limit }
// ======================
export const getAttendance = async (filters = {}) => {
  const res = await api.get("/attendance", { params: filters });
  return res.data; // { success, count, data }
};

// ======================
// 4) Filter Attendance (Advanced search)
// filters = { employeeName, employeeCode, department, role, status, startDate, endDate, page, limit }
// ======================
export const filterAttendance = async (filters = {}) => {
  const res = await api.get("/attendance/filter", { params: filters });
  return res.data; // { success, count, records }
};




// ======================
// 5) Add Attendance manually (Admin/Owner)
// data = { employeeId, date, status, checkIn, checkOut, remarks }
// ======================
export const addAttendance = async (data) => {
  const res = await api.post("/attendance/add", data);
  return res.data;
};

// ======================
// 6) Update Attendance (Admin/Owner)
// data = { date, status, checkIn, checkOut, remarks }
// ======================
export const updateAttendance = async (id, data) => {
  const res = await api.put(`/attendance/${id}`, data);
  return res.data;
};

// ======================
// 7) Delete Attendance (Admin/Owner)
// ======================
export const deleteAttendance = async (id) => {
  const res = await api.delete(`/attendance/${id}`);
  return res.data;
};





// Profile APIs
export const getProfile = () => api.get("/auth/profile");
export const updateProfile = (data, isFormData = false) =>
  api.put("/auth/profile", data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });


  // DELETE Account
export const deleteAccount = () => api.delete("/auth/delete-account");
export const updatePassword = (data) => api.put("/auth/update-password", data);

//(Optional) Agar toen stor karna hai:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
})

export default api;
