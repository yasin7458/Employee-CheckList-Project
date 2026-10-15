import React from 'react';

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-[#fef3c7] text-[#d97706] border-[#fde68a]';
      case 'approved':
        return 'bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]';
      case 'rejected':
        return 'bg-[#fee2e2] text-[#dc2626] border-[#fecaca]';
      case 'active':
        return 'bg-[#dcfce7] text-[#16a34a] border-[#bbf7d0]';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 text-xs font-semibold rounded-full border ${getStyles()}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
