import React, { useState } from 'react';
import axios from 'axios';
import { base_url } from '../utils/info';
import { ShieldCheck, Mail, Lock, KeyRound, ArrowRight, Loader2, Sparkles, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [step, setStep] = useState(1); // 1: Login, 2: OTP, 3: Forgot Password (Email), 4: Reset Password (OTP + New)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRequestLogin = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await axios.post(`${base_url}/api/admins/admin/request-login`, { email, password });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(`${base_url}/api/admins/admin/verify-otp`, { email, otp });
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('adminUser', JSON.stringify(res.data.admin));
      navigate('/admin-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      await axios.post(`${base_url}/api/admins/admin/forgot-password`, { email });
      setStep(4);
      setSuccess('OTP sent for password reset.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(`${base_url}/api/admins/admin/reset-password`, { email, otp, newPassword });
      setStep(1);
      setSuccess('Password updated successfully! Login now.');
      setOtp('');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[480px]">
        {/* Logo/Icon Area */}
        {/* Logo/Icon Area */}
        <div className="text-center mb-8 md:mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-[24px] md:rounded-[32px] bg-blue-600/10 border border-blue-500/20 shadow-[0_0_50px_rgba(37,99,235,0.2)] mb-6 animate-pulse">
            <ShieldCheck className="w-10 h-10 md:w-12 md:h-12 text-blue-500" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-2">
            ADMIN <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent italic">COMMAND</span>
          </h1>
          <p className="text-slate-400 font-medium text-sm md:text-base">System Authorization Required</p>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[30px] md:rounded-[40px] p-6 md:p-10 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs md:text-sm font-bold flex items-center gap-3 animate-shake">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs md:text-sm font-bold flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
              {success}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestLogin} className="space-y-5 md:space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-[0.2em] ml-2">Secure Email</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  <input type="email" required placeholder="admin@piedocx.in" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-5 pl-12 md:pl-14 pr-6 text-white text-sm md:text-base placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] md:text-xs font-black text-white/40 uppercase tracking-[0.2em] ml-2">Access Key</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  <input type="password" required placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-5 pl-12 md:pl-14 pr-6 text-white text-sm md:text-base placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="flex justify-end pr-2">
                   <button type="button" onClick={() => setStep(3)} className="text-[9px] md:text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-white transition-colors">Forgot Key?</button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white py-4 md:py-5 rounded-2xl font-black text-base md:text-lg transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 group active:scale-95">
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>INITIATE LOGIN <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /> </>}
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-block p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 mb-4 font-black">
                  <KeyRound className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">Verify Identity</h3>
                <p className="text-slate-500 text-xs md:text-sm">OTP has been sent to <span className="text-blue-400 font-bold break-all">{email}</span></p>
              </div>
              <input type="text" maxLength="6" required autoFocus placeholder="0 0 0 0 0 0" className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 md:py-6 text-center text-3xl md:text-4xl font-black text-white tracking-[0.5em] placeholder:text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} />
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-blue-400 text-white py-4 md:py-5 rounded-2xl font-black text-base md:text-lg shadow-xl active:scale-95">
                 {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'AUTHORIZE & ACCESS'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-white transition-colors pt-4">← Back to Login</button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleForgotRequest} className="space-y-6">
              <div className="text-center mb-6 md:mb-8">
                <div className="inline-block p-4 bg-purple-500/10 rounded-2xl border border-purple-500/20 mb-4">
                  <RefreshCcw className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-1">Key Recovery</h3>
                <p className="text-slate-500 text-xs md:text-sm">Enter your registered admin email.</p>
              </div>
              <input type="email" required placeholder="admin@piedocx.in" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 md:py-5 px-6 text-white text-center font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all" value={email} onChange={(e) => setEmail(e.target.value)} />
              <button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 md:py-5 rounded-2xl font-black text-base md:text-lg transition-all shadow-xl active:scale-95">
                 {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'SEND RESET OTP'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-white pt-4">← Return to Login</button>
            </form>
          )}

          {step === 4 && (
            <form onSubmit={handleResetSubmit} className="space-y-6">
              <div className="text-center mb-6 md:mb-8">
                 <h3 className="text-lg md:text-xl font-bold text-white mb-1">Set New Key</h3>
                 <p className="text-slate-500 text-xs md:text-sm">Check OTP in your inbox.</p>
              </div>
              <div className="space-y-4">
                 <input type="text" maxLength="6" required placeholder="OTP Code" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-center text-xl md:text-2xl font-black text-white tracking-[0.2em] focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} />
                 <input type="password" required placeholder="Enter New Password" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 md:py-5 rounded-2xl font-black text-base md:text-lg shadow-xl">
                 {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'RECOVER ACCESS'}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-white pt-4">← Cancel Recovery</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
