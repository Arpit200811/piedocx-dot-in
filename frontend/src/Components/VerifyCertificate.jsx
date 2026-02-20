import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ShieldCheck, ShieldAlert, Award, Loader2, Calendar, User, Printer, Download, Eye, X, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load Certificate to keep verification page light
const Certificate = lazy(() => import('./Certificate'));

const VerifyCertificate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // loading, valid, invalid, error
    const [data, setData] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await api.get(`/api/certificate/verify-public/${id}`);
                if (res) {
                    setData(res);
                    setStatus('valid');
                } else {
                    setStatus('invalid');
                }
            } catch (err) {
                console.error(err);
                if (err.response && err.response.status === 404) {
                    setStatus('invalid');
                } else {
                    setStatus('error');
                }
            }
        };
        if (id) verify();
    }, [id]);

    if (status === 'loading') return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm animate-pulse">Verifying Cryptographic Signature...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans no-bg-on-print">
            {/* Home Navigation */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-6 left-6 p-3 bg-white rounded-2xl shadow-xl text-slate-400 hover:text-blue-600 transition-all z-20 no-print"
            >
                <Home size={20} />
            </button>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white w-full max-w-md rounded-2xl sm:rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 relative certificate-card z-10"
            >
                {/* Status Banner */}
                <div className={`p-8 sm:p-10 text-center relative overflow-hidden ${status === 'valid' ? 'bg-[#0f172a]' : 'bg-red-500'}`}>
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] no-print"></div>
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-emerald-500 transform translate-x-16 -translate-y-16 rotate-45 z-0 ${status !== 'valid' && 'hidden'}`}></div>

                    <div className="relative z-10 flex flex-col items-center gap-4">
                        <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center shadow-2xl relative bg-white`}>
                            {status === 'valid' ? (
                                <>
                                    <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping"></div>
                                    <ShieldCheck size={40} className="text-emerald-500 sm:w-12 sm:h-12" />
                                </>
                            ) : (
                                <ShieldAlert size={40} className="text-red-500 sm:w-12 sm:h-12" />
                            )}
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tighter">
                            {status === 'valid' ? 'Credential Verified' : 'Invalid ID'}
                        </h1>
                        <div className={`flex items-center gap-2 bg-emerald-500/20 px-4 py-1.5 rounded-full border border-emerald-500/30 ${status !== 'valid' && 'hidden'}`}>
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active & Authenticated</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 sm:p-10 space-y-6">
                    {status === 'valid' && data ? (
                        <>
                            {/* Verification Header */}
                            <div className="flex justify-between items-start border-b border-slate-100 pb-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Asset</p>
                                    <h2 className="text-xl font-bold text-slate-800">Student Record</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md uppercase">Verified</span>
                                </div>
                            </div>

                            {/* Data Grid */}
                            <div className="grid gap-4">
                                <div className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100 shrink-0">
                                        <User size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Candidate</p>
                                        <p className="text-base font-black text-slate-900 leading-none truncate">{data.fullName}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Year</p>
                                        <p className="text-sm font-bold text-slate-800">{data.year}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Grade</p>
                                        <p className="text-sm font-bold text-emerald-600">A++</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Branch</p>
                                    <p className="text-sm font-bold text-slate-800 uppercase line-clamp-1">{data.branch}</p>
                                </div>
                            </div>

                            {/* Official Token */}
                            <div className="relative bg-[#f8fafc] p-5 rounded-2xl border border-slate-100 text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 italic">Global Credential ID</p>
                                <p className="text-lg font-mono font-bold text-[#0f172a] tracking-wider select-all">{data.certificateId || id}</p>
                            </div>

                            {/* Official Footer */}
                            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src="/Logo_Pie.png" alt="" className="h-6 w-auto grayscale opacity-40 shrink-0" />
                                    <div className="h-4 w-[1px] bg-slate-200"></div>
                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tight">
                                        Piedocx Technologies Pvt Ltd
                                    </p>
                                </div>
                                <p className="text-[8px] text-slate-300 font-bold italic">ISO 9001:2015</p>
                            </div>
                        </>
                    ) : (
                        <div className="p-4 text-center space-y-6">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto text-red-500">
                                <ShieldAlert size={32} />
                            </div>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                ID <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">{id}</span> was not found.
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="space-y-3 no-print">
                        {status === 'valid' && (
                            <>
                                <button
                                    onClick={() => setShowPreview(true)}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                                >
                                    <Eye size={18} /> View & Download Certificate
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
                                >
                                    <Printer size={16} /> Print Official Transcript
                                </button>
                            </>
                        )}
                        <button
                            onClick={() => navigate('/')}
                            className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-blue-600"
                        >
                            Return To Hub
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* PREVIEW OVERLAY */}
            <AnimatePresence>
                {showPreview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-10"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="relative w-full max-w-6xl max-h-screen overflow-auto bg-white rounded-[2rem] shadow-2xl p-4 md:p-8"
                        >
                            <button
                                onClick={() => setShowPreview(false)}
                                className="absolute top-6 right-6 p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-600 transition-all z-50 shadow-lg"
                            >
                                <X size={24} />
                            </button>

                            <div className="mb-8 text-center md:text-left">
                                <h2 className="text-2xl font-black text-slate-900 tracking-tighter italic">CERTIFICATE <span className="text-blue-600">PREVIEW</span></h2>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] italic">Official Academic Asset Node: {id}</p>
                            </div>

                            <Suspense fallback={<div className="h-[400px] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>}>
                                <div className="flex justify-center origin-top transform scale-[0.95] md:scale-100">
                                    <Certificate
                                        student={{
                                            name: data.fullName,
                                            college: data.college,
                                            branch: data.branch,
                                            year: data.year,
                                            studentId: data.studentId || id,
                                            certificateId: data.certificateId || id,
                                            _id: data._id
                                        }}
                                        userEmail={data.email}
                                        autoSend={false}
                                    />
                                </div>
                            </Suspense>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @media print {
                    @page { margin: 0; }
                    body { background: white !important; margin: 0; }
                    .no-print { display: none !important; }
                    .no-bg-on-print { background: white !important; padding: 0 !important; height: auto !important; min-height: 0 !important; }
                    .min-h-screen { background: white !important; min-height: 0 !important; padding: 0 !important; }
                }
                .origin-top { transform-origin: top center; }
            `}</style>
        </div>
    );
};

export default VerifyCertificate;
