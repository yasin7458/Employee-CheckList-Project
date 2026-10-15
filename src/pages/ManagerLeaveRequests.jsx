import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Check, X, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';

const ManagerLeaveRequests = () => {
  const { leaveRequests, getUserById, getLeaveTypeById, approveLeave, rejectLeave } = useApp();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatDateRange = (startStr, endStr) => {
    if (!startStr) return '';
    const start = new Date(startStr);
    const end = new Date(endStr || startStr);
    const startFormatted = start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const endFormatted = end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    return startFormatted === endFormatted ? startFormatted : `${startFormatted} - ${endFormatted}`;
  };

  // Filtered requests
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter(req => {
      const employee = getUserById(req.employee_id);
      const leaveType = getLeaveTypeById(req.leave_type_id);

      const matchesSearch =
        employee?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leaveType?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.reason?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || req.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [leaveRequests, searchQuery, statusFilter, getUserById, getLeaveTypeById]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage) || 1;
  const paginatedRequests = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredRequests.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRequests, currentPage, itemsPerPage]);

  return (
    <div className="space-y-6 font-sans">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Leave Requests
        </h1>
      </div>

      {/* Controls Bar: Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, leave type..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <div className="relative inline-block text-left">
            <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm shadow-sm">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer pr-2"
              >
                <option value="All">All Requests</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Employee</th>
                <th className="py-4 px-6 font-semibold">Leave Type</th>
                <th className="py-4 px-6 font-semibold">Date Range</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-400 text-sm">
                    No leave requests match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req) => {
                  const employee = getUserById(req.employee_id);
                  const leaveType = getLeaveTypeById(req.leave_type_id);
                  const isPending = req.status.toLowerCase() === 'pending';

                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* Employee Info */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={employee?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'}
                            alt={employee?.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                          />
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{employee?.name || 'Unknown'}</p>
                            <p className="text-xs text-slate-400 font-medium">{employee?.designation || 'Employee'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Leave Type */}
                      <td className="py-4 px-6 text-slate-700 font-medium">
                        {leaveType?.name || 'Leave'}
                      </td>

                      {/* Date Range */}
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {formatDateRange(req.start_date, req.end_date)}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-6">
                        <StatusBadge status={req.status} />
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        {isPending ? (
                          <div className="inline-flex items-center gap-2 justify-end">
                            <button
                              onClick={() => approveLeave(req.id)}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => rejectLeave(req.id)}
                              className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                            <button
                              onClick={() => navigate(`/leave-details/${req.id}`)}
                              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => navigate(`/leave-details/${req.id}`)}
                            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold rounded-lg transition-colors shadow-sm inline-flex items-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>View</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredRequests.length)} of{' '}
              {filteredRequests.length} entries
            </span>

            <div className="flex items-center gap-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerLeaveRequests;
