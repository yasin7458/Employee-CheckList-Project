import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarPlus, History, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';

const EmployeeDashboard = () => {
  const { currentUser, leaveRequests, getEmployeeStats, getEmployeeBalance, getLeaveTypeById } = useApp();
  const navigate = useNavigate();

  // If user is manager, they might prefer Manager View or we show employee dashboard for their own leaves
  const stats = getEmployeeStats(currentUser?.id || 1);
  const balances = getEmployeeBalance(currentUser?.id || 1);

  // Recent requests for this employee
  const recentRequests = leaveRequests
    .filter(req => req.employee_id === (currentUser?.id || 1))
    .slice(0, 5);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-8 animate-fade-in font-sans">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Dashboard
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Welcome back, {currentUser?.name?.split(' ')[0] || 'Employee'}!
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Leaves */}
        <div className="bg-[#eff6ff] border border-[#dbeafe] rounded-2xl p-5 sm:p-6 transition-transform hover:-translate-y-1">
          <p className="text-xs sm:text-sm font-semibold text-slate-600">Total Leaves</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#2563eb] mt-2">
            {stats.totalLeaves}
          </p>
        </div>

        {/* Used Leaves */}
        <div className="bg-[#f0fdf4] border border-[#dcfce7] rounded-2xl p-5 sm:p-6 transition-transform hover:-translate-y-1">
          <p className="text-xs sm:text-sm font-semibold text-slate-600">Used Leaves</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#16a34a] mt-2">
            {stats.usedLeaves}
          </p>
        </div>

        {/* Remaining Leaves */}
        <div className="bg-[#faf5ff] border border-[#f3e8ff] rounded-2xl p-5 sm:p-6 transition-transform hover:-translate-y-1">
          <p className="text-xs sm:text-sm font-semibold text-slate-600">Remaining Leaves</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#9333ea] mt-2">
            {stats.remainingLeaves}
          </p>
        </div>

        {/* Pending Requests */}
        <div className="bg-[#fffbeb] border border-[#fef3c7] rounded-2xl p-5 sm:p-6 transition-transform hover:-translate-y-1">
          <p className="text-xs sm:text-sm font-semibold text-slate-600">Pending Requests</p>
          <p className="text-3xl sm:text-4xl font-extrabold text-[#d97706] mt-2">
            {stats.pendingRequests}
          </p>
        </div>
      </div>

      {/* Middle Section: Leave Balance & Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Leave Balance (Current Year) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-6">
              Leave Balance <span className="text-slate-400 font-normal text-xs">(Current Year)</span>
            </h2>

            <div className="space-y-6">
              {balances.map((balance) => {
                const colors = {
                  CL: { bar: 'bg-blue-600', text: 'text-blue-600' },
                  SL: { bar: 'bg-emerald-500', text: 'text-emerald-600' },
                  EL: { bar: 'bg-purple-600', text: 'text-purple-600' },
                  PL: { bar: 'bg-amber-500', text: 'text-amber-600' },
                }[balance.code] || { bar: 'bg-blue-600', text: 'text-blue-600' };

                return (
                  <div key={balance.id} className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-semibold text-slate-700">
                        {balance.name} ({balance.code})
                      </span>
                      <span className="font-bold text-slate-900">
                        {balance.used} <span className="text-slate-400 font-normal">/ {balance.total}</span>
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                        style={{ width: `${Math.min(100, (balance.used / balance.total) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
            <span>Quota resets annually on Jan 1st</span>
            <button
              onClick={() => navigate('/leave-balance')}
              className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
            >
              View policy details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900">
                Recent Leave Requests
              </h2>
              <button
                onClick={() => navigate('/leave-history')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View all
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Type</th>
                    <th className="pb-3 font-semibold">Start Date</th>
                    <th className="pb-3 font-semibold">End Date</th>
                    <th className="pb-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {recentRequests.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-400 text-xs">
                        No recent leave requests found.
                      </td>
                    </tr>
                  ) : (
                    recentRequests.map((req) => {
                      const leaveType = getLeaveTypeById(req.leave_type_id);
                      return (
                        <tr
                          key={req.id}
                          onClick={() => navigate(`/leave-details/${req.id}`)}
                          className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                        >
                          <td className="py-3.5 font-medium text-slate-800 text-xs sm:text-sm">
                            {leaveType?.name || 'Leave'}
                          </td>
                          <td className="py-3.5 text-slate-600 text-xs sm:text-sm">
                            {formatDate(req.start_date)}
                          </td>
                          <td className="py-3.5 text-slate-600 text-xs sm:text-sm">
                            {formatDate(req.end_date)}
                          </td>
                          <td className="py-3.5 text-right">
                            <StatusBadge status={req.status} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-base font-bold text-slate-900 mb-4">
          Quick Actions
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigate('/apply-leave')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-600/20"
          >
            <CalendarPlus className="w-4 h-4" />
            <span>Apply Leave</span>
          </button>

          <button
            onClick={() => navigate('/leave-history')}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm border border-slate-200 transition-all hover:border-slate-300"
          >
            <History className="w-4 h-4 text-slate-500" />
            <span>View Leave History</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default EmployeeDashboard;
