// client/utils/api.js
import axios from 'axios';



const api = axios.create({
  baseURL: "https://project-payroll.onrender.com/api", 
    headers: { "Content-Type": "application/json" },
});



// Employee APIs
export const getEmployees = () => api.get("/employees");
export const getEmployeeById = (id) => api.get(`/employees/${id}`);
export const addEmployee = (data) => api.post("/employees", data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// Salary APIs
// client/utils/api.js
export const addSalary = (data) => api.post("/salary", data);
export const getSalariesByEmployee = (employeeId) => api.get(`/salary/employee/${employeeId}`);
export const updateSalary = (id, data) => api.put(`/salary/${id}`, data);
export const deleteSalary = (id) => api.delete(`/salary/${id}`);
export const markSalaryPaid = (id) => api.patch(`/salary/${id}/pay`);
export const getSalaryById = (id) => api.get(`/salary/${id}`);


// promote user  to admin
export const addUser = (user) => api.post("/company/add-user", user);
export const promoteUser = (userId) => api.post(`/admin/${userId}`);
export const demoteUser = (adminId) => api.delete(`/admin/${adminId}`);
export const getAdminDashboardData = () => api.get("/admin-dashboard");
export const deleteUser = (userId) => api.delete(`/company/user/${userId}`);



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
