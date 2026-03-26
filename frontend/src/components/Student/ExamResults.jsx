
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    CheckCircle, Target,
    ChevronRight, Download, Share2, Info,
    Trophy, Sparkles, Youtube, BookOpen, GraduationCap, 
    Linkedin
} from 'lucide-react';
import api from '../../utils/api';
import Swal from 'sweetalert2';
import Leaderboard from './Leaderboard';

const ExamResults = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleShare = async () => {
        const shareText = `🎓 I just completed my exam on PIEDOCX!
📊 Score: ${results.score}/${results.total} (${Math.round((results.score / results.total) * 100)}%)
🏆 Rank: #${results.rank}
\nJoin at piedocx.in`;
        
        if (navigator.share) {
            try {
                await navigator.share({ title: 'My PIEDOCX Result', text: shareText, url: 'https://piedocx.in' });
            } catch (e) { /* User cancelled */ }
        } else {
            await navigator.clipboard.writeText(shareText);
            Swal.fire({ icon: 'success', title: 'Copied!', text: 'Result text copied to clipboard.', timer: 2000, showConfirmButton: false });
        }
    };

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        setLoading(true);
        try {
            const data = await api.get('/api/student-auth/results');
            setResults(data);
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
                    <p className="text-sm font-black text-slate-400 uppercase tracking-widest animate-pulse">Loading Your Result...</p>
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

    const percentage = results.total > 0 ? Math.round((results.score / results.total) * 100) : 0;

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
                                <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-widest text-blue-500">My Score Card</h3>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">{results.title}</p>
                            </div>
                        </div>

                        {/* Stats Breakdown Area */}
                        <div className="p-8 sm:p-12 md:p-16 space-y-8 relative z-10 bg-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Student Status</p>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-sm font-black text-slate-900 uppercase italic tracking-tight">Result Verified</span>
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
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">My Percentage</p>
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
                                    <span>Correct Answers</span>
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
                                    <span>Wrong / Skipped</span>
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
                
                {/* FEATURE #1: AI Results Doctor Analysis */}
                {results.aiAnalysis && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-[3rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-blue-500/20"
                    >
                        {/* Decorative Animated Glows */}
                        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[80px]"></div>
                        
                        <div className="relative z-10 flex flex-col lg:flex-row gap-10 items-start">
                            <div className="flex-1 space-y-6">
                                <div className="inline-flex items-center gap-3 px-6 py-2 bg-blue-600/20 border border-blue-400/30 rounded-full backdrop-blur-xl">
                                    <Sparkles size={16} className="text-blue-400" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200">AI Results Doctor</span>
                                </div>
                                <h3 className="text-3xl sm:text-4xl font-black italic uppercase tracking-tighter leading-tight">
                                    Deep <span className="text-blue-400">Analysis</span> & Recommendations
                                </h3>
                                <p className="text-blue-100/70 text-base font-medium leading-relaxed italic border-l-4 border-blue-600 pl-6 py-2">
                                    "{results.aiAnalysis}"
                                </p>
                            </div>

                            <div className="w-full lg:w-80 space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-300 opacity-60 px-2 italic">Curated Resources</h4>
                                {results.recommendations?.map((rec, i) => (
                                    <a 
                                        key={rec._id || i}
                                        href={rec.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                                {rec.type === 'VIDEO' ? <Youtube size={18} /> : rec.type === 'ARTICLE' ? <BookOpen size={18} /> : <GraduationCap size={18} />}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-black uppercase tracking-widest group-hover:text-white transition-colors truncate">{rec.title}</p>
                                                <p className="text-[8px] font-bold text-blue-300 opacity-40 uppercase tracking-tighter mt-1">{rec.type} Guide</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={14} className="text-blue-500 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* FEATURE #10: Batch Leaderboard on Result Page */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-6"
                >
                    <div className="flex items-center justify-between px-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Batch <span className="text-amber-500">Standings_</span></h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 italic opacity-60">Rankings for {results.branch} - {results.year}</p>
                        </div>
                    </div>
                    <Leaderboard currentStudentId={results.studentId} type="group" />
                </motion.div>

                {/* Footer Actions */}
                <div className="grid md:grid-cols-2 gap-6 pb-12">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-600 transition-all"
                    >
                        <div className="flex items-center gap-4 sm:gap-6 w-full">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0">
                                <Download size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-black text-slate-900 uppercase italic tracking-tight truncate">My Certificate</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ready for download</p>
                            </div>
                            
                            {/* FEATURE #7: LinkedIn Add to Profile */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const baseUrl = "https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME";
                                    const params = new URLSearchParams({
                                        name: results.title,
                                        organizationName: "Piedocx Assessment Platform",
                                        issueYear: new Date().getFullYear(),
                                        issueMonth: new Date().getMonth() + 1,
                                        certUrl: "https://piedocx.in",
                                        certId: results.studentId
                                    });
                                    window.open(`${baseUrl}&${params.toString()}`, "_blank");
                                }}
                                className="px-5 py-3 bg-[#0a66c2]/10 text-[#0a66c2] border border-[#0a66c2]/20 rounded-xl flex items-center gap-2 hover:bg-[#0a66c2] hover:text-white transition-all scale-90 sm:scale-100"
                            >
                                <Linkedin size={14} fill="currentColor" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Add to Profile</span>
                            </button>
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
                        onClick={handleShare}
                        className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl shadow-slate-900/20 flex items-center justify-between group hover:bg-blue-600 transition-all cursor-pointer"
                    >
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-white group-hover:text-blue-600 transition-all">
                                <Share2 size={24} />
                            </div>
                            <div>
                                <h4 className="font-black uppercase italic tracking-tight">Share My Result</h4>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">Tap to share or copy link</p>
                            </div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl text-white/40 group-hover:text-white transition-all">
                            <ChevronRight size={20} />
                        </div>
                    </motion.div>
                </div>

                <div className="text-center space-y-4">
                    <button
                        onClick={() => navigate('/student-dashboard')}
                        className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-blue-600 transition-all flex items-center justify-center mx-auto gap-3"
                    >
                        Go Back to Dashboard <ChevronRight size={14} />
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
