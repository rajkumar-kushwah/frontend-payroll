// client/utils/api.js
import axios from 'axios';



const api = axios.create({
  baseURL: "https://project-payroll.onrender.com/api", 
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});



// utils/api.js
export const getMyProfile = () => api.get("/employees/me/profile");


// Employee APIs
export const getEmployees = async () => {
  const res = await api.get("/employees");
  return res.data; // backend response = { success, employees: [...] }
};


  // ADD employee (with avatar support)
export const addEmployee = (formData) =>
  api.post("/employees", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

 
// Update employee profile with avatar
export const updateEmployeeProfile = (id, formData) =>
  api.put(`/employees/profile/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const getEmployeeById = (id) => api.get(`/employees/${id}`);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);
// export const addEmployee = (data) => api.post("/employees", data);

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
export const toggleUser = (userId,newRole) =>
  api.put(`/company/user/toggle/${userId}`, { newRole });

// DELETE user
export const deleteUser = (userId) =>
  api.delete(`/company/user/${userId}`);

export const getWorkSchedules = async () => {
  const res = await api.get("/workSchedule"); // fix typo
  return res.data;
};
 
// 🔹 Fetch only employees (non-admin)
export const getEmployeesForAdminPromotion = () =>
  api.get("/employees?onlyEmployees=true");


// 🔹 Promote employee → admin
export const promoteEmployeeToAdmin = (employeeId) =>
  api.put(`/company/employee/promote/${employeeId}`);




export const addWorkSchedule = async (data) => {
  const res = await api.post("/workSchedule/add", data);
  return res.data;
};

export const updateWorkSchedule = async (id, data) => {
  const res = await api.put(`/workSchedule/${id}`, data);
  return res.data;
};

export const deleteWorkSchedule = async (id) => {
  const res = await api.delete(`/workSchedule/${id}`);
  return res.data;
};



// 1) Check-In (Admin/Owner can provide employeeId)

export const checkIn = async (employeeId) => {
  const res = await api.post("/attendance/check-in", { employeeId });
  return res.data;
};


// 2) Check-Out (Admin/Owner can provide employeeId)

export const checkOut = async (employeeId) => {
  const res = await api.post("/attendance/check-out", { employeeId });
  return res.data;
};


// 3) Get All Attendance (Admin/Owner only)
// filters = { employeeId, status, startDate, endDate, month, year, page, limit }

export const getAttendance = async (filters = {}) => {
  const res = await api.get("/attendance", { params: filters });
  return res.data;
};



// 4) Filter Attendance (Advanced search)
// filters = { employeeName, employeeCode, department, role, status, startDate,  page, limit }

// Filter attendance (Advanced search)
export const filterAttendance = async (filters = {}) => {
  const res = await api.get("/attendance", { params: filters });
  return res.data;
};


// 5) Add Attendance manually (Admin/Owner)
// data = { employeeId, date, status, checkIn, checkOut, remarks }

export const addAttendance = async (data) => {
  const res = await api.post("/attendance/add", data);
  return res.data;
};


// 6) Update Attendance (Admin/Owner)
// data = { date, status, checkIn, checkOut, remarks }

export const updateAttendance = async (id, data) => {
  const res = await api.put(`/attendance/${id}`, data);
  return res.data;
};


// 7) Delete Attendance (Admin/Owner)

export const deleteAttendance = async (id) => {
  const res = await api.delete(`/attendance/${id}`);
  return res.data;
};

// leave APIs
// Client
export const applyLeaveApi = (data) => api.post("/leaves", data);

export const getMyLeavesApi = () => api.get("/leaves/my");

// delete leave
export const deleteLeaveApi = (id) => api.delete(`/leaves/${id}`);

// Admin / Owner / HR → Leaves with optional status filter
export const getLeavesApi = (status) =>
  api.get(`/leaves${status ? `?status=${status}` : ""}`);

export const updateLeaveStatusApi = (id, status) =>
  api.put(`/leaves/${id}`, { status });
// ======================================================


// Office leaves
// utils/officeHolidayApi.js (ya utils/api.js me hi)

// Get all office holidays (HR/Admin/Owner)
export const getOfficeHolidaysApi = () => {
  return api.get("/holidays");
};

// Add new office holiday
export const addOfficeHolidayApi = (data) => {
  return api.post("/holidays", data);
};

// Update office holiday
export const updateOfficeHolidayApi = (id, data) => {
  return api.put(`/holidays/${id}`, data);
};

// Delete office holiday
export const deleteOfficeHolidayApi = (id) => {
  return api.delete(`/holidays/${id}`);
};

 // =====================================================

// Profile APIs
export const getProfile = () => api.get("/auth/profile");
export const updateProfile = (data, isFormData = false) =>
  api.put("/auth/profile", data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });



//  Payroll APIs


// 1️ Generate / Save Payroll Summary
export const savePayroll = (employeeId, month, notes = "") => {
  return api.post("/payroll/generate", {
    employeeId,
    month,
    notes,
  });
};

// 2️ Get all payroll summaries (Month / Filters)
export const getPayrolls = (params = {}) => {
  // params = { month, employeeId, department }
  return api.get("/payroll", { params });
};

// 3️ Get single employee payroll (Payslip)
export const getPayrollByEmployee = (employeeId, month) => {
  return api.get("/payroll/single", {
    params: { employeeId, month },
  });
};
// 4️ Export all payrolls for a month (CSV)
export const exportPayrollCsv = (month, employeeId) => {
  return api.get("/payroll/export/csv", {
    params: {
      month,
      employeeId, // optional
    },
    responseType: "blob", // file download
  });
};

// 5️ Export single employee payroll as PDF
export const exportPayrollPdf = (employeeId, month) => {
  return api.get("/payroll/export/pdf", {
    params: { employeeId, month },
    responseType: "blob"
  });
};



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