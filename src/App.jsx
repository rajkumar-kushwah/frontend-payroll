// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
// import Profile from "./pages/Profile";
import Employees from "./pages/Employees";
import Candidates from "./pages/Candidates";
// import Messages from "./pages/Messages";
// import Jobs from "./pages/Jobs";
// import Resumes from "./pages/Resumes";
// import Leaves from "./pages/Leaves";
// import Payrolls from "./pages/Payrolls";
// import Settings from "./pages/Settings";

function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        {/*  Protected Route */}
         {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        {/* <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} /> */}
        <Route path="/employees" element={<ProtectedRoute><Employees/></ProtectedRoute>} />
        <Route path="/candidates" element={<ProtectedRoute><Candidates/></ProtectedRoute>} />
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
