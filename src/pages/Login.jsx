import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Calendar, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Login = () => {
  const { login, currentUser } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      setLoading(false);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    }, 300);
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    const result = login(demoEmail, demoPassword);
    if (result.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side: Brand & Visual Illustration */}
        <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-sky-50/60 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
          {/* Logo */}
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
              <Calendar className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 leading-none">
                Leave<span className="text-blue-600">Pro</span>
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Employee Leave Management System
              </p>
            </div>
          </div>

          {/* Center Graphic */}
          <div className="my-10 flex flex-col items-center text-center">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Decorative background shapes */}
              <div className="absolute inset-0 bg-blue-200/40 rounded-full blur-2xl transform -translate-y-4"></div>
              
              <svg className="w-full h-full relative z-10" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Desk */}
                <rect x="50" y="270" width="300" height="12" rx="6" fill="#cbd5e1" />
                <rect x="70" y="282" width="12" height="60" rx="3" fill="#94a3b8" />
                <rect x="318" y="282" width="12" height="60" rx="3" fill="#94a3b8" />
                
                {/* Big Calendar in background */}
                <rect x="180" y="70" width="160" height="150" rx="16" fill="#ffffff" stroke="#e2e8f0" strokeWidth="4" />
                <path d="M180 110 H340" stroke="#3b82f6" strokeWidth="6" />
                <rect x="180" y="70" width="160" height="36" rx="16" fill="#3b82f6" />
                <circle cx="210" cy="88" r="4" fill="#ffffff" />
                <circle cx="310" cy="88" r="4" fill="#ffffff" />
                {/* Calendar dates grid */}
                <rect x="200" y="130" width="16" height="14" rx="3" fill="#e2e8f0" />
                <rect x="230" y="130" width="16" height="14" rx="3" fill="#e2e8f0" />
                <rect x="260" y="130" width="16" height="14" rx="3" fill="#3b82f6" />
                <rect x="290" y="130" width="16" height="14" rx="3" fill="#e2e8f0" />
                <rect x="200" y="160" width="16" height="14" rx="3" fill="#10b981" />
                <rect x="230" y="160" width="16" height="14" rx="3" fill="#e2e8f0" />
                <rect x="260" y="160" width="16" height="14" rx="3" fill="#e2e8f0" />
                <rect x="290" y="160" width="16" height="14" rx="3" fill="#f59e0b" />

                {/* Clock floating badge */}
                <circle cx="320" cy="90" r="32" fill="#2563eb" />
                <circle cx="320" cy="90" r="28" fill="#ffffff" />
                <path d="M320 74 V90 H332" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />

                {/* Person working */}
                <circle cx="120" cy="150" r="26" fill="#fbcfe8" />
                {/* Hair */}
                <path d="M96 146 C96 126 144 126 144 146 C134 140 106 140 96 146 Z" fill="#1e293b" />
                {/* Body */}
                <path d="M90 220 C90 180 150 180 150 220 Z" fill="#2563eb" />
                {/* Arms & Laptop */}
                <rect x="100" y="220" width="65" height="40" rx="6" fill="#334155" />
                <path d="M85 260 H180 L170 270 H95 Z" fill="#64748b" />
                
                {/* Plant on desk */}
                <path d="M300 240 Q290 220 300 205 Q310 220 300 240 Z" fill="#10b981" />
                <path d="M312 245 Q325 230 315 215 Q308 230 312 245 Z" fill="#059669" />
                <rect x="292" y="240" width="24" height="30" rx="4" fill="#f87171" />
              </svg>
            </div>
          </div>

          {/* Bottom Caption */}
          <div className="text-center lg:text-left">
            <p className="text-sm font-medium text-slate-600 leading-relaxed max-w-sm">
              Manage your leaves, track your balance and keep your work-life balance.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form & Demo Accounts */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Welcome Back!
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Login to your account to continue
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
              >
                {loading ? 'Signing in...' : 'Login'}
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-slate-500">
                  Don't have an account?{' '}
                  <span className="text-blue-600 font-semibold cursor-pointer hover:underline">
                    Contact your HR
                  </span>
                </span>
              </div>
            </form>

            {/* Demo Accounts Box */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Demo Accounts (Click to login)
              </p>
              
              <div className="grid grid-cols-1 gap-2.5">
                {/* Employee Demo */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('employee@company.com', '123456')}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Employee Login</p>
                      <p className="text-[11px] text-slate-500 font-mono">employee@company.com / 123456</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transform group-hover:translate-x-1 transition-all" />
                </button>

                {/* Manager Demo */}
                <button
                  type="button"
                  onClick={() => handleDemoLogin('manager@company.com', '123456')}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Manager Login</p>
                      <p className="text-[11px] text-slate-500 font-mono">manager@company.com / 123456</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all" />
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
