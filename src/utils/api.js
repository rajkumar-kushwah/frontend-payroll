// client/utils/api.js
import axios from 'axios';


const api = axios.create({
  baseURL: "https://project-payroll.onrender.com/api", 
     headers: { "Content-Type": "application/json" },
});
export const getEmployees = () => api.get("/employees");
export const getEmployeeById = (id) => api.get(`/employees/${id}`);
export const addEmployee = (data) => api.post("/employees", data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`);

// Salary APIs
export const addSalary = (data) => api.post("/salary", data);
export const getSalariesByEmployee = (employeeId) => api.get(`/salary/${employeeId}`);
export const updateSalary = (id, data) => api.put(`/salary/${id}`, data);
export const deleteSalary = (id) => api.delete(`/salary/${id}`);
export const markSalaryPaid = (id) => api.put(`/salary/pay/${id}`);
export const getSalaryById = (id) => api.get(`/salary/single/${id}`);




//(Optional) Agar toen stor karna hai:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
})

export default api;
