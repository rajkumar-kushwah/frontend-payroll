// client/utils/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: "https://project-payroll.onrender.com/api", 
     headers: { "Content-Type": "application/json" },
});

//(Optional) Agar toen stor karna hai:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if(token) config.headers.Authorization = `Bearer ${token}`;
  return config;
})

export default api;
