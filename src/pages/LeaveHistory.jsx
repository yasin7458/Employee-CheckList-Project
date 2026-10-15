import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import StatusBadge from '../components/StatusBadge';

const LeaveHistory = () => {
  const { currentUser, leaveRequests, leaveTypes, getLeaveTypeById } = useApp();
  const navigate = useNavigate();

  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Filter for employee's own requests
  const filteredRequests = useMemo(() => {
    return leaveRequests
      .filter(req => req.employee_id === (currentUser?.id || 1))
      .filter(req => {
        const matchesType = selectedType === 'All' || req.leave_type_id === parseInt(selectedType);
        const matchesStatus = selectedStatus === 'All' || req.status.toLowerCase() === selectedStatus.toLowerCase();
        return matchesType && matchesStatus;
      });
  }, [leaveRequests, currentUser, selectedType, selectedStatus]);

  const handleResetFilters = () => {
    setSelectedType('All');
    setSelectedStatus('All');
    setCurrentPage(1);
  };

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
          My Leave History
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Track your past and upcoming leave requests
        </p>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Leave Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm cursor-pointer"
        >
          <option value="All">All Leave Types</option>
          {leaveTypes.map(lt => (
            <option key={lt.id} value={lt.id}>{lt.name}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => {
            setSelectedStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm cursor-pointer"
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* Reset Filter Button */}
        <button
          onClick={handleResetFilters}
          className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl transition-colors shadow-sm"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold w-16">#</th>
                <th className="py-4 px-6 font-semibold">Leave Type</th>
                <th className="py-4 px-6 font-semibold">Start Date</th>
                <th className="py-4 px-6 font-semibold">End Date</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold">Applied On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedRequests.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 text-sm">
                    No leave requests found for the selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedRequests.map((req, index) => {
                  const leaveType = getLeaveTypeById(req.leave_type_id);
                  const displayIndex = (currentPage - 1) * itemsPerPage + index + 1;

                  return (
                    <tr
                      key={req.id}
                      onClick={() => navigate(`/leave-details/${req.id}`)}
                      className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold text-slate-400 text-xs">
                        {displayIndex}
                      </td>
                      <td className="py-4 px-6 font-medium text-slate-800">
                        {leaveType?.name || 'Leave'}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {formatDate(req.start_date)}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {formatDate(req.end_date)}
                      </td>
                      <td className="py-4 px-6">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {formatDate(req.applied_on || req.created_at)}
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
              {filteredRequests.length} requests
            </span>

            <div className="flex items-center gap-1.5">
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
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveHistory;
