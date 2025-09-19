// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
// import Profile from "./pages/Profile";
import Employees from "./pages/Employees";
import Candidates from "./pages/Candidates";
// import Messages from "./pages/Messages";
// import Jobs from "./pages/Jobs";
// import Resumes from "./pages/Resumes";
// import Leaves from "./pages/Leaves";
// import Payrolls from "./pages/Payrolls";
// import Settings from "./pages/Settings";
import EmployeeDetail from "./pages/EmployeeDetail";
import AddEmployee from "./pages/AddEmployee";
import PublicRoute from "./routes/PublicRoute";


function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPassword /></PublicRoute>} />
        <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />

        {/*  Protected Route */}
        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        {/* <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} /> */}
        <Route path="/employees" element={<ProtectedRoute><Employees /></ProtectedRoute>} />
        <Route path="/employee/add" element={<ProtectedRoute> <AddEmployee /></ProtectedRoute>} />
        <Route path="/employee/:id" element={<ProtectedRoute><EmployeeDetail /></ProtectedRoute>} />
        <Route path="/candidates" element={<ProtectedRoute><Candidates /></ProtectedRoute>} />
        {/* <Route path="/messages" element={<ProtectedRoute><Messages/></ProtectedRoute>} /> */}
        {/* <Route path="/jobs" element={<ProtectedRoute><Jobs/></ProtectedRoute>} /> */}
        {/* <Route path="/resumes" element={<ProtectedRoute><Resumes/></ProtectedRoute>} /> */}
        {/* <Route path="/leaves" element={<ProtectedRoute><Leaves/></ProtectedRoute>} /> */}
        {/* <Route path="/payrolls" element={<ProtectedRoute><Payrolls/></ProtectedRoute>} /> */}
        {/* <Route path="/settings" element={<ProtectedRoute><Settings/></ProtectedRoute>} /> */}
        {/* protected route end */}
      </Routes>
    </Router>
  );
}

export default App;
