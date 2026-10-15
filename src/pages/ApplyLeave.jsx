import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, AlertCircle, CheckCircle2, RotateCcw, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ApplyLeave = () => {
  const { leaveTypes, applyLeave, getEmployeeBalance, currentUser } = useApp();
  const navigate = useNavigate();

  const [leaveTypeId, setLeaveTypeId] = useState(leaveTypes[0]?.id || 1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Available balance for currently selected leave type
  const balances = useMemo(() => {
    return getEmployeeBalance(currentUser?.id || 1);
  }, [currentUser, getEmployeeBalance]);

  const selectedBalance = useMemo(() => {
    return balances.find(b => b.id === parseInt(leaveTypeId));
  }, [balances, leaveTypeId]);

  // Calculate days dynamically
  const calculatedDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end < start) return 0;
    if (isHalfDay) return 0.5;
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate, isHalfDay]);

  const handleReset = () => {
    setLeaveTypeId(leaveTypes[0]?.id || 1);
    setStartDate('');
    setEndDate('');
    setReason('');
    setIsHalfDay(false);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('Please select both start and end dates.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('End Date cannot be earlier than Start Date.');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for the leave.');
      return;
    }

    if (selectedBalance && calculatedDays > selectedBalance.remaining) {
      setError(`Requested days (${calculatedDays}) exceed your remaining ${selectedBalance.name} balance (${selectedBalance.remaining} days).`);
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const res = applyLeave({
        leave_type_id: leaveTypeId,
        start_date: startDate,
        end_date: endDate,
        reason: reason.trim(),
        is_half_day: isHalfDay,
      });

      setSubmitting(false);
      if (res.success) {
        navigate('/leave-history');
      } else {
        setError(res.message);
      }
    }, 300);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-sans">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Apply Leave
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Fill in the details to request a leave
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-10">
        
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-100 flex items-center gap-3 text-rose-700 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Leave Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Leave Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={leaveTypeId}
              onChange={(e) => setLeaveTypeId(e.target.value)}
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm font-medium cursor-pointer"
            >
              {leaveTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.code})
                </option>
              ))}
            </select>
            {selectedBalance && (
              <p className="text-xs text-slate-500 mt-2 font-medium">
                Available balance:{' '}
                <span className="font-bold text-slate-800">
                  {selectedBalance.remaining} days remaining
                </span>{' '}
                (Used {selectedBalance.used} of {selectedBalance.total} days)
              </p>
            )}
          </div>

          {/* Dates (Start Date & End Date) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Start Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (!endDate) setEndDate(e.target.value);
                  }}
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm font-medium"
                />
              </div>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                End Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={endDate}
                  min={startDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm font-medium"
                />
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for leave..."
              className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm resize-none font-normal"
            ></textarea>
          </div>

          {/* Half Day Checkbox & Calculated Days */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-y border-slate-100">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isHalfDay}
                onChange={(e) => setIsHalfDay(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-semibold text-slate-700">
                Half Day <span className="text-xs text-slate-400 font-normal">(Optional)</span>
              </span>
            </label>

            {calculatedDays > 0 && (
              <div className="text-xs font-semibold px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg inline-flex items-center gap-1.5 self-start sm:self-auto">
                <span>Calculated Duration:</span>
                <span className="font-bold text-sm text-blue-800">
                  {calculatedDays} {calculatedDays === 1 || calculatedDays === 0.5 ? 'Day' : 'Days'}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-sm border border-slate-200 transition-all hover:border-slate-300 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
              <span>Reset</span>
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-blue-600/20 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : 'Apply Leave'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ApplyLeave;
