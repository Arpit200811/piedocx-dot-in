import React, { useState, useEffect, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ShieldCheck, ShieldAlert, BadgeCheck, User, Building, GraduationCap, MapPin, Calendar, CheckCircle2, XCircle, ArrowLeft, Eye, X, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load the full certificate preview
const Certificate = lazy(() => import('./Certificate'));

const VerifyCertificate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        const verify = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/api/certificate/verify-public/${id}`);
                setStudent(res);
            } catch (err) {
                setError(err.response?.data?.message || 'Verification failed. Serial number not found.');
            } finally {
                setLoading(false);
            }
        };
        verify();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-white rounded-full animate-spin"></div>
                <p className="mt-4 text-blue-600 font-black uppercase tracking-[0.2em] text-[10px]">Verifying Credential...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 sm:p-6 font-sans">
            {/* Top Branding Bar */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center px-6 justify-between z-50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <ShieldCheck className="text-white" size={18} />
                    </div>
                    <span className="font-black text-sm text-slate-900 tracking-tighter uppercase">Pie<span className="text-blue-600">Verify</span></span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Secured</span>
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-blue-500/10 border border-slate-100 p-8 pt-12 relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>

                <AnimatePresence mode="wait">
                    {error ? (
                        <motion.div 
                            key="error"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6 py-4"
                        >
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-inner border border-red-100">
                                <ShieldAlert size={48} className="text-red-500" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">Record <span className="text-red-600">Not Found</span></h1>
                                <p className="text-slate-500 text-xs mt-3 leading-relaxed px-4">{error}</p>
                            </div>
                            <button 
                                onClick={() => navigate('/')}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95"
                            >
                                Help Center
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="success"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            {/* Validation Status */}
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center shadow-inner border border-emerald-100">
                                        <BadgeCheck size={52} className="text-emerald-500" />
                                    </div>
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-lg"
                                    >
                                        <CheckCircle2 size={24} className="text-emerald-500" />
                                    </motion.div>
                                </div>
                                <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Credential <span className="text-emerald-600">Active</span></h1>
                                <div className="mt-2 flex items-center gap-2 justify-center">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Student</span>
                                </div>
                            </div>

                            {/* Data Matrix */}
                            <div className="space-y-4">
                                {/* Name Card */}
                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white hover:shadow-lg transition-all">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                                        <User size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Full Name</p>
                                        <p className="text-base font-black text-slate-900 uppercase italic truncate">{student.fullName}</p>
                                    </div>
                                </div>

                                {/* College Card */}
                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-4 hover:bg-white hover:shadow-lg transition-all">
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-blue-600">
                                        <Building size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">College / Institution</p>
                                        <p className="text-xs font-black text-slate-700 uppercase leading-tight italic line-clamp-2">{student.college}</p>
                                    </div>
                                </div>

                                {/* Dynamic Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col gap-1.5">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Stream</p>
                                        <p className="text-[11px] font-black text-slate-900 uppercase leading-none truncate">{student.branch}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col gap-1.5">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Grade</p>
                                        <p className="text-[11px] font-black text-emerald-600 uppercase leading-none truncate">A++ (DISTINCTION)</p>
                                    </div>
                                </div>

                                {/* Status Protocol Card */}
                                <div className="p-6 bg-slate-900 rounded-[2rem] relative overflow-hidden shadow-xl shadow-slate-900/20 group">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                                    <div className="relative z-10 flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Verification Status</p>
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${student.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                                                <span className={`text-2xl font-black uppercase italic ${student.status === 'active' ? 'text-white' : 'text-red-500'}`}>
                                                    {student.status === 'active' ? 'AUTHENTIC' : 'REVOKED'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                             <p className="text-slate-600 font-bold text-[8px] uppercase tracking-widest mb-1 tabular-nums">Serial No.</p>
                                             <p className="text-blue-400 font-black text-[10px] leading-none tabular-nums font-mono">{student.certificateId || id}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Area */}
                            <div className="space-y-3 pt-2">
                                <button 
                                    onClick={() => setShowPreview(true)}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                                >
                                    <Eye size={16} /> View Full Certificate
                                </button>
                                <button 
                                    onClick={() => window.print()}
                                    className="w-full flex items-center justify-center gap-3 py-4 bg-slate-50 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95"
                                >
                                    <Printer size={16} /> Download Transcript
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Footer Trust Bar */}
            <div className="mt-8 flex flex-col items-center gap-4 opacity-40">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Official Verification Authority</p>
                <div className="flex gap-6 items-center">
                    <img src="/mca.png" alt="MCA" className="h-5 grayscale" />
                    <img src="/iso.png" alt="ISO" className="h-5 grayscale" />
                    <img src="/digital_india.png" alt="Digital India" className="h-5 grayscale" />
                </div>
            </div>

            {/* PREVIEW OVERLAY */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl p-4 md:p-10 overflow-auto max-h-[95vh]"
                        >
                            <button
                                onClick={() => setShowPreview(false)}
                                className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-600 transition-all z-[110] shadow-sm"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-6 text-center">
                                <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-1">Official <span className="text-blue-600">Document</span></h1>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Record Hash: {student.studentId || id}</p>
                            </div>

                            <Suspense fallback={
                                <div className="h-96 flex flex-col items-center justify-center gap-3">
                                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rendering HD Asset...</p>
                                </div>
                            }>
                                <div className="flex justify-center">
                                    <Certificate
                                        student={{
                                            name: student.fullName,
                                            college: student.college,
                                            branch: student.branch,
                                            year: student.year,
                                            studentId: student.studentId || id,
                                            certificateId: student.certificateId || id,
                                            _id: student._id
                                        }}
                                        userEmail={student.email}
                                        autoSend={false}
                                    />
                                </div>
                            </Suspense>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            
            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700;900&display=swap');
                body { font-family: 'Montserrat', sans-serif; }
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; }
                }
            `}</style>
        </div>
    );
};

export default VerifyCertificate;
