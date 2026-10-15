import React from 'react';
import { Clock, Calendar, CheckCircle, Info, Shield, HeartPulse, Award, Sun } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LeaveBalance = () => {
  const { currentUser, getEmployeeBalance } = useApp();
  const balances = getEmployeeBalance(currentUser?.id || 1);

  const icons = {
    CL: Calendar,
    SL: HeartPulse,
    EL: Award,
    PL: Sun,
  };

  const colorStyles = {
    CL: {
      bar: 'bg-blue-600',
      text: 'text-blue-600',
      bgLight: 'bg-blue-50',
      border: 'border-blue-100',
      iconColor: 'text-blue-600',
    },
    SL: {
      bar: 'bg-emerald-500',
      text: 'text-emerald-600',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-100',
      iconColor: 'text-emerald-600',
    },
    EL: {
      bar: 'bg-purple-600',
      text: 'text-purple-600',
      bgLight: 'bg-purple-50',
      border: 'border-purple-100',
      iconColor: 'text-purple-600',
    },
    PL: {
      bar: 'bg-amber-500',
      text: 'text-amber-600',
      bgLight: 'bg-amber-50',
      border: 'border-amber-100',
      iconColor: 'text-amber-600',
    },
  };

  return (
    <div className="max-w-5xl space-y-8 font-sans">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Leave Balance
        </h1>
        <p className="text-slate-500 font-medium mt-1">
          Your current leave balance
        </p>
      </div>

      {/* 4 Balance Cards (2x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {balances.map((item) => {
          const Icon = icons[item.code] || Calendar;
          const style = colorStyles[item.code] || colorStyles.CL;

          return (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-800 text-base">
                    {item.name} ({item.code})
                  </h2>
                  <div className={`w-8 h-8 rounded-full ${style.bgLight} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${style.iconColor}`} />
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                    {item.used}
                  </span>
                  <span className="text-xl font-bold text-slate-400">
                    / {item.total}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 ml-auto">
                    {item.remaining} remaining
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${style.bar}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Leave Balance Policy Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-6">
          Leave Balance Policy
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-slate-50 text-sm">
            <span className="flex items-center gap-2.5 text-slate-700 font-medium">
              <span className="w-2 h-2 rounded-full border border-slate-400"></span>
              Casual Leave (CL)
            </span>
            <span className="font-semibold text-slate-900">7 per year</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-50 text-sm">
            <span className="flex items-center gap-2.5 text-slate-700 font-medium">
              <span className="w-2 h-2 rounded-full border border-slate-400"></span>
              Sick Leave (SL)
            </span>
            <span className="font-semibold text-slate-900">5 per year</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-50 text-sm">
            <span className="flex items-center gap-2.5 text-slate-700 font-medium">
              <span className="w-2 h-2 rounded-full border border-slate-400"></span>
              Earned Leave (EL)
            </span>
            <span className="font-semibold text-slate-900">10 per year</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-50 text-sm">
            <span className="flex items-center gap-2.5 text-slate-700 font-medium">
              <span className="w-2 h-2 rounded-full border border-slate-400"></span>
              Privilege Leave (PL)
            </span>
            <span className="font-semibold text-slate-900">5 per year</span>
          </div>
        </div>
      </div>

      {/* Informational Note Callout */}
      <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center gap-3.5 text-blue-900">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <p className="text-xs sm:text-sm font-medium">
          <span className="font-bold">Note: </span>
          Leave balance will be updated after approval of your leave request.
        </p>
      </div>
    </div>
  );
};

export default LeaveBalance;
