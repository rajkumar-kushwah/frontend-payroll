// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './dashboards/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import { UserProvider } from './context/UserContext';
import Profile from './profile/Profile';
import Employees from "./employees/Employees";
import Settings from "./settings/SettingsPage";
import EmployeeDetail from "./employees/EmployeeDetail";
import AddEmployee from "./employees/AddEmployee";
import PublicRoute from "./routes/PublicRoute";
import AddSalary from "./salarys/AddSalary";
import NotFound from "./notfound/NotFound";
import EditEmployee from "./employees/EditEmployee";
import AdminList from './admin/AdminManagment';
import AddUser from './admin/UserList';
import WorkScheduleMain from './worksechudel/WorkScheduleMain';
import AttendancePage from './attendances/AttendancePage';
import LeavemainPage from './leaves/LeavemainPage';
import PayrollPage from './payroll/PayrollPage';
import SecondCounter from './seconds/Second';
import EditProfile from './profile/EditProfile';

function App() {
  return (
     <UserProvider>
    
    <Router >
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="*" element={<PublicRoute><NotFound /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/*  Protected Route */}
        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
        <Route path="/employee/add" element={<ProtectedRoute> <AddEmployee /></ProtectedRoute>} />
        <Route path="/employee/:employeeId/add-salary/:salaryId?" element={<ProtectedRoute><AddSalary /></ProtectedRoute>} />
        <Route path="/employee/:id" element={<ProtectedRoute><EmployeeDetail /></ProtectedRoute>} />
        <Route path="/employee/:id/edit" element={<ProtectedRoute><EditEmployee /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute allowedRoles={["owner"]}><Settings/></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminList /></ProtectedRoute>} />
        <Route path='/admin/add-user' element={<ProtectedRoute><AddUser /></ProtectedRoute>} />
        <Route path="/worksechudel" element={<ProtectedRoute><WorkScheduleMain /></ProtectedRoute>} />
        <Route path="/attendance-page" element={<ProtectedRoute><AttendancePage /></ProtectedRoute>} />
        <Route path="/leave"  element={<ProtectedRoute><LeavemainPage /></ProtectedRoute>}/>
        <Route path="/payroll" element={<ProtectedRoute><PayrollPage/></ProtectedRoute>} />
        <Route path='/second' element={<ProtectedRoute><SecondCounter /></ProtectedRoute>}/>
        {/* protected route end */}
      </Routes>
    </Router>

    </UserProvider>
  );
}

export default App;
