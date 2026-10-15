import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { initialUsers, initialDepartments, initialLeaveTypes, initialLeaveRequests } from '../data/initialData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Load users from localStorage or default
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('leavepro_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  // Current logged in user (Default to employee Piyush Nakrani)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('leavepro_current_user');
    return saved ? JSON.parse(saved) : initialUsers[0];
  });

  // Leave Requests state
  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem('leavepro_leave_requests');
    return saved ? JSON.parse(saved) : initialLeaveRequests;
  });

  // Departments state
  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('leavepro_departments');
    return saved ? JSON.parse(saved) : initialDepartments;
  });

  // Leave types state
  const [leaveTypes, setLeaveTypes] = useState(() => {
    const saved = localStorage.getItem('leavepro_leave_types');
    return saved ? JSON.parse(saved) : initialLeaveTypes;
  });

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('leavepro_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('leavepro_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('leavepro_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  useEffect(() => {
    localStorage.setItem('leavepro_departments', JSON.stringify(departments));
  }, [departments]);

  // Show Toast helper
  const showToast = (message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Auth functions
  const login = (email, password) => {
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return { success: false, message: 'User not found with this email' };
    }
    if (user.password !== password) {
      return { success: false, message: 'Invalid password' };
    }
    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}!`, 'success');
    return { success: true, user };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('leavepro_current_user');
    showToast('Logged out successfully', 'info');
  };

  const switchRole = (role) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      showToast(`Switched to ${role} (${targetUser.name})`, 'info');
    }
  };

  // Leave Request operations
  const applyLeave = ({ leave_type_id, start_date, end_date, reason, is_half_day }) => {
    if (!currentUser) return { success: false, message: 'Please login first' };
    if (!leave_type_id || !start_date || !end_date || !reason) {
      return { success: false, message: 'Please fill in all required fields' };
    }

    const start = new Date(start_date);
    const end = new Date(end_date);

    if (end < start) {
      return { success: false, message: 'End date cannot be earlier than start date' };
    }

    // Calculate days
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const total_days = is_half_day ? 0.5 : diffDays;

    const newRequest = {
      id: Date.now(),
      employee_id: currentUser.id,
      leave_type_id: parseInt(leave_type_id),
      start_date,
      end_date,
      total_days,
      is_half_day: !!is_half_day,
      reason,
      status: 'Pending',
      approved_by: null,
      applied_on: new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setLeaveRequests(prev => [newRequest, ...prev]);
    showToast('Leave request submitted successfully!', 'success');
    return { success: true, request: newRequest };
  };

  const approveLeave = (requestId) => {
    setLeaveRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'Approved',
            approved_by: currentUser?.id || 2,
            updated_at: new Date().toISOString(),
          };
        }
        return req;
      })
    );
    showToast('Leave request approved successfully!', 'success');
  };

  const rejectLeave = (requestId) => {
    setLeaveRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          return {
            ...req,
            status: 'Rejected',
            approved_by: currentUser?.id || 2,
            updated_at: new Date().toISOString(),
          };
        }
        return req;
      })
    );
    showToast('Leave request rejected', 'warning');
  };

  const addEmployee = (newEmployee) => {
    const id = Date.now();
    const created = {
      ...newEmployee,
      id,
      status: 'Active',
      avatar: newEmployee.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    };
    setUsers(prev => [...prev, created]);
    showToast(`Employee ${newEmployee.name} added successfully!`, 'success');
    return created;
  };

  // Helper getters
  const getUserById = (id) => users.find(u => u.id === id);
  const getLeaveTypeById = (id) => leaveTypes.find(lt => lt.id === id);
  const getDepartmentById = (id) => departments.find(d => d.id === id);

  // Compute balance breakdown for an employee
  const getEmployeeBalance = (employeeId) => {
    const empRequests = leaveRequests.filter(r => r.employee_id === employeeId);
    
    return leaveTypes.map(lt => {
      // Used leaves are strictly Approved leaves
      const used = empRequests
        .filter(r => r.leave_type_id === lt.id && r.status === 'Approved')
        .reduce((sum, r) => sum + Number(r.total_days), 0);
      
      const total = lt.annual_limit;
      const remaining = Math.max(0, total - used);
      const percentage = Math.min(100, Math.round((used / total) * 100));

      return {
        ...lt,
        used,
        total,
        remaining,
        percentage
      };
    });
  };

  // Compute high level stats for employee dashboard
  const getEmployeeStats = (employeeId) => {
    const empRequests = leaveRequests.filter(r => r.employee_id === employeeId);
    const balances = getEmployeeBalance(employeeId);
    
    // Total annual quota across all types
    const totalLeaves = balances.reduce((sum, b) => sum + b.total, 0);
    const usedLeaves = balances.reduce((sum, b) => sum + b.used, 0);
    const remainingLeaves = Math.max(0, totalLeaves - usedLeaves);
    const pendingRequests = empRequests.filter(r => r.status === 'Pending').length;

    return {
      totalLeaves,
      usedLeaves,
      remainingLeaves,
      pendingRequests,
    };
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        leaveRequests,
        departments,
        leaveTypes,
        toast,
        login,
        logout,
        switchRole,
        applyLeave,
        approveLeave,
        rejectLeave,
        addEmployee,
        showToast,
        getUserById,
        getLeaveTypeById,
        getDepartmentById,
        getEmployeeBalance,
        getEmployeeStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
