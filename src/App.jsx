import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ApplyLeave from './pages/ApplyLeave';
import ManagerLeaveRequests from './pages/ManagerLeaveRequests';
import LeaveHistory from './pages/LeaveHistory';
import LeaveBalance from './pages/LeaveBalance';
import LeaveDetails from './pages/LeaveDetails';
import Employees from './pages/Employees';
import Profile from './pages/Profile';

// Dashboard router based on user role or common view
const DashboardRoute = () => {
  const { currentUser } = useApp();
  if (currentUser?.role === 'manager') {
    return <ManagerLeaveRequests />;
  }
  return <EmployeeDashboard />;
};

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Routes Layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardRoute />} />
            <Route path="apply-leave" element={<ApplyLeave />} />
            <Route path="leave-history" element={<LeaveHistory />} />
            <Route path="leave-balance" element={<LeaveBalance />} />
            <Route path="leave-requests" element={<ManagerLeaveRequests />} />
            <Route path="leave-details/:id" element={<LeaveDetails />} />
            <Route path="employees" element={<Employees />} />
            <Route path="departments" element={<Employees />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;
