import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Check, X, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';

const LeaveDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { leaveRequests, getUserById, getLeaveTypeById, approveLeave, rejectLeave, currentUser } = useApp();

  const request = leaveRequests.find(r => r.id === parseInt(id) || r.id === id);

  if (!request) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">Leave request not found</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const employee = getUserById(request.employee_id);
  const manager = getUserById(request.approved_by || 2);
  const leaveType = getLeaveTypeById(request.leave_type_id);

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const isPending = request.status.toLowerCase() === 'pending';
  const isManager = currentUser?.role === 'manager';

  const handleApprove = () => {
    approveLeave(request.id);
  };

  const handleReject = () => {
    rejectLeave(request.id);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      {/* Header with Back button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Leave Request Details
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-10 space-y-8">
        
        {/* Employee Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
          <div className="flex items-center gap-4">
            <img
              src={employee?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
              alt={employee?.name}
              className="w-14 h-14 rounded-full object-cover ring-4 ring-slate-50"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900">{employee?.name}</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">{employee?.designation || 'Employee'}</p>
            </div>
          </div>

          <div>
            <StatusBadge status={request.status} />
          </div>
        </div>

        {/* 2x2 Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Leave Type
            </p>
            <p className="text-base font-bold text-slate-800">
              {leaveType?.name} ({leaveType?.code})
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Start Date
            </p>
            <p className="text-base font-bold text-slate-800">
              {formatDate(request.start_date)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              End Date
            </p>
            <p className="text-base font-bold text-slate-800">
              {formatDate(request.end_date)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Total Days
            </p>
            <p className="text-base font-bold text-slate-800">
              {request.total_days} {request.total_days === 1 || request.total_days === 0.5 ? 'Day' : 'Days'}
              {request.is_half_day && <span className="text-xs font-normal text-slate-500 ml-1">(Half Day)</span>}
            </p>
          </div>
        </div>

        {/* Reason Section */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Reason
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-700 leading-relaxed font-normal">
            {request.reason}
          </div>
        </div>

        {/* Approver Information */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Approver / Manager
          </p>
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100">
            <div className="flex items-center gap-3">
              <img
                src={manager?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256'}
                alt={manager?.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white"
              />
              <div>
                <p className="text-sm font-bold text-slate-900">{manager?.name || 'Rahul Patel'}</p>
                <p className="text-xs text-slate-500 font-medium">Reporting Manager</p>
              </div>
            </div>
            <StatusBadge status={request.status} />
          </div>
        </div>

        {/* Action Section (Manager view or allow quick approval testing) */}
        <div className="pt-4 border-t border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Action
          </p>

          {isPending ? (
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleApprove}
                className="flex items-center gap-2 px-7 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-emerald-500/20"
              >
                <Check className="w-4 h-4" />
                <span>Approve</span>
              </button>

              <button
                onClick={handleReject}
                className="flex items-center gap-2 px-7 py-3 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-rose-500/20"
              >
                <X className="w-4 h-4" />
                <span>Reject</span>
              </button>
            </div>
          ) : (
            <div className={`p-4 rounded-2xl flex items-center gap-3 ${
              request.status === 'Approved' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
            }`}>
              {request.status === 'Approved' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600" />
              )}
              <span className="text-sm font-semibold">
                This request has been {request.status.toLowerCase()} on {formatDate(request.updated_at || request.created_at)}.
              </span>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default LeaveDetails;
