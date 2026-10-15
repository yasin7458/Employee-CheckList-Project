import React from 'react';
import { User, Mail, Shield, Building2, Calendar, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';

const Profile = () => {
  const { currentUser, getDepartmentById, getEmployeeStats } = useApp();
  const department = getDepartmentById(currentUser?.department_id);
  const stats = getEmployeeStats(currentUser?.id || 1);

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          User Profile
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Manage your personal information and account settings
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-10 space-y-8">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-slate-100 text-center sm:text-left">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
            alt={currentUser?.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-50 shadow-md"
          />
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h2 className="text-xl font-bold text-slate-900">{currentUser?.name}</h2>
              <StatusBadge status={currentUser?.status || 'Active'} />
            </div>
            <p className="text-sm font-semibold text-blue-600">{currentUser?.designation}</p>
            <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
              <Building2 className="w-3.5 h-3.5" />
              <span>Department of {department?.name || 'Technology'}</span>
            </p>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3 mb-1">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</span>
            </div>
            <p className="text-sm font-bold text-slate-800 ml-7">{currentUser?.email}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3 mb-1">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Role</span>
            </div>
            <p className="text-sm font-bold text-slate-800 ml-7 capitalize">{currentUser?.role}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3 mb-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Leave Allowance</span>
            </div>
            <p className="text-sm font-bold text-slate-800 ml-7">{stats.totalLeaves} Days / Year</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-3 mb-1">
              <Award className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Leaves Remaining</span>
            </div>
            <p className="text-sm font-bold text-slate-800 ml-7">{stats.remainingLeaves} Days</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
