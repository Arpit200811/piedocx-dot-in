
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Award, CheckCircle, Target, TrendingUp,
    ChevronRight, Download, Share2, Info,
    AlertCircle, Sparkles, Trophy, Star
} from 'lucide-react';
import { base_url } from '../../utils/info';
import Swal from 'sweetalert2';

const ExamResults = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('studentToken');
            const res = await axios.get(`${base_url}/api/student-auth/results`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setResults(res.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Unable to retrieve results.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Decrypting Matrix...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl text-center space-y-6"
                >
                    <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-3xl flex items-center justify-center mx-auto border border-amber-100">
                        <Info size={40} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter mb-2">Notice</h2>
                        <p className="text-slate-500 font-medium leading-relaxed">{error}</p>
                    </div>
                    <button
                        onClick={() => navigate('/student-dashboard')}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                    >
                        Back to Dashboard
                    </button>
                </motion.div>
            </div>
        );
    }

    const percentage = Math.round((results.score / results.total) * 100);

    return (
        <div className="min-h-screen bg-[#f8fafc] py-8 sm:py-12 px-3 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Hero Results Section */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-[3rem] shadow-2xl border border-slate-200 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Score Circle Area */}
                        <div className="p-8 sm:p-12 md:p-16 flex flex-col items-center justify-center bg-slate-900 text-white relative">
                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                            <motion.div
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="relative w-40 h-40 sm:w-64 sm:h-64 flex items-center justify-center"
                            >
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="50%" cy="50%" r="40%" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                    <motion.circle
                                        cx="50%" cy="50%" r="40%" fill="transparent" stroke="#2563eb" strokeWidth="8"
                                        strokeDasharray="251.2%"
                                        initial={{ strokeDashoffset: "251.2%" }}
                                        animate={{ strokeDashoffset: `${251.2 * (1 - percentage / 100)}%` }}
                                        transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                                        strokeLinecap="round"
                                        className="drop-shadow-[0_0_10px_#2563eb]"
                                    />
                                </svg>

                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1 }}
                                    >
                                        <span className="text-4xl sm:text-7xl font-black italic tracking-tighter leading-none">{results.score}</span>
                                        <p className="text-[10px] sm:text-xs font-black text-blue-400 uppercase tracking-[0.4em] mt-2 opacity-60">Out of {results.total}</p>
                                    </motion.div>
                                </div>
                            </motion.div>

                            <div className="mt-8 sm:mt-12 text-center space-y-2 relative z-10">
                                <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-widest text-blue-500">Performance Index</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{results.title}</p>
                            </div>
                        </div>

                        {/* Stats Breakdown Area */}
                        <div className="p-8 sm:p-12 md:p-16 space-y-8 relative z-10 bg-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Candidate Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-sm font-black text-slate-900 uppercase italic tracking-tight">Validation Complete</span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                    <Trophy size={24} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <CheckCircle size={20} />
                                    </div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</p>
                                    <p className="text-2xl font-black text-slate-900 italic leading-none">{percentage}%</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-purple-200 transition-all">
                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all">
                                        <Target size={20} />
                                    </div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Rank</p>
                                    <p className="text-2xl font-black text-slate-900 italic leading-none">#{results.rank}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Correct Solutions</span>
                                    <span className="text-green-600">{results.correctCount || 0}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(results.correctCount / results.total) * 100}%` }}
                                        className="h-full bg-green-500"
                                    />
                                </div>
                                <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest text-slate-400 pt-2">
                                    <span>Incorrect / Skipped</span>
                                    <span className="text-red-400">{results.wrongCount || 0}</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(results.wrongCount / results.total) * 100}%` }}
                                        className="h-full bg-red-400"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer Actions */}
                <div className="grid md:grid-cols-2 gap-6 pb-12">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-600 transition-all"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                <Download size={24} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase italic tracking-tight">Academic Certificate</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ready for download</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/student-dashboard/certificates')}
                            className="p-3 bg-slate-50 rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition-all"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.1 }}
                        className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl shadow-slate-900/20 flex items-center justify-between group hover:bg-blue-600 transition-all"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-blue-600 transition-all">
                                <Share2 size={24} />
                            </div>
                            <div>
                                <h4 className="font-black uppercase italic tracking-tight">Share Milestone</h4>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">LinkedIn / Portfolio</p>
                            </div>
                        </div>
                        <button className="p-3 bg-white/5 rounded-xl text-white/40 group-hover:text-white transition-all">
                            <ChevronRight size={20} />
                        </button>
                    </motion.div>
                </div>

                <div className="text-center space-y-4">
                    <button
                        onClick={() => navigate('/student-dashboard')}
                        className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-blue-600 transition-all flex items-center justify-center mx-auto gap-3"
                    >
                        Return to Command Center <ChevronRight size={14} />
                    </button>
                </div>

            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .float { animation: float 3s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default ExamResults;
