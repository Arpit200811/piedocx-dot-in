import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { base_url } from '../utils/info';
import { 
    User, ChevronLeft, ShieldAlert, Timer, 
    CheckCircle, XCircle, AlertTriangle, Activity 
} from 'lucide-react';
import Swal from 'sweetalert2';

const AdminResultDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const res = await axios.get(`${base_url}/api/admins/admin/result/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (err) {
                console.error(err);
                Swal.fire('Error', 'Failed to load details', 'error');
                navigate('/admin-results');
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, navigate]);

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!data) return null;

    const { session, answers = [] } = data;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 font-sans">
            {/* Nav Back */}
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-blue-600 transition-colors"
            >
                <ChevronLeft size={16} /> Back to Archives
            </button>

            {/* Header Card */}
            <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-[80px] opacity-50 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 sm:gap-5">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-xl sm:text-2xl text-slate-400">
                            {data.fullName?.[0]}
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">{data.fullName}</h1>
                            <div className="flex flex-wrap gap-2 sm:gap-3 mt-1 sm:mt-2 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span>{data.studentId}</span> • <span>{data.branch}</span> • <span className="hidden sm:inline">{data.college}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-left md:text-right"
                        >
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Score</p>
                            <div className={`text-xl sm:text-2xl font-black ${session?.riskScore > 30 ? 'text-red-500' : 'text-green-500'} flex items-center gap-2`}>
                                <ShieldAlert size={18} className="sm:w-5 sm:h-5" />
                                {session?.riskScore || 0}%
                            </div>
                        </motion.div>
                        <div className="w-px h-8 sm:h-10 bg-slate-100"></div>
                        <motion.div 
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="text-left md:text-right"
                        >
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Score</p>
                            <div className="text-3xl sm:text-4xl font-black text-blue-600 leading-none">
                                {data.score}<span className="text-base sm:text-lg text-slate-300">/{data.totalQuestions}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column: Stats & Timeline */}
                <div className="space-y-6">
                    {/* Detailed Stats */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Activity size={16} className="text-blue-500" /> Performance Metrics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                                <p className="text-[9px] font-bold text-green-600 uppercase tracking-widest mb-1">Correct</p>
                                <p className="text-2xl font-black text-green-700">{data.correctCount}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                                <p className="text-[9px] font-bold text-red-600 uppercase tracking-widest mb-1">Incorrect</p>
                                <p className="text-2xl font-black text-red-700">{data.wrongCount}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 col-span-2">
                                <p className="text-[9px] font-bold text-amber-600 uppercase tracking-widest mb-1">Accuracy Rate</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-2xl font-black text-amber-700">{Math.round((data.score/data.totalQuestions)*100)}%</p>
                                    <div className="w-24 h-2 bg-amber-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500" style={{ width: `${(data.score/data.totalQuestions)*100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline / Risk Log */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-[400px] overflow-y-auto custom-scrollbar">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <Timer size={16} className="text-orange-500" /> Session Timeline
                        </h3>
                        {session?.violationLog?.length > 0 ? (
                            <div className="relative pl-4 space-y-6 border-l-2 border-slate-100">
                                {session.violationLog.map((log, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-red-500 border-2 border-white ring-2 ring-red-100"></div>
                                        <p className="text-xs font-bold text-slate-800">{log.type}</p>
                                        <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 opacity-40">
                                <CheckCircle size={32} className="text-green-500 mb-2"/>
                                <p className="text-[10px] font-black uppercase tracking-widest">Clean Session Record</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Question Breakdown */}
                <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-50">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Detailed Answer Sheet</h3>
                    </div>
                    {answers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50/50">
                                    <tr>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest w-16">#</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Question Node</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest w-32">Response</th>
                                        <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest w-32 text-center">Result</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {answers.map((ans, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5 text-xs font-bold text-slate-400">{i+1}</td>
                                            <td className="px-6 py-5">
                                                <p className="text-xs font-bold text-slate-700 line-clamp-2" title={ans.questionText}>
                                                    {ans.questionText || `Question ID: ${ans.questionId}`}
                                                </p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-1">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${ans.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                                        You: {ans.studentAnswer}
                                                    </span>
                                                    {!ans.isCorrect && (
                                                        <span className="text-[9px] font-bold text-slate-400">
                                                            Correct: {ans.correctAnswer}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                {ans.isCorrect ? (
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 text-green-600 border border-green-100 text-[9px] font-black uppercase tracking-widest">
                                                        <CheckCircle size={12} /> Correct
                                                    </div>
                                                ) : ans.studentAnswer === 'SKIPPED' ? (
                                                     <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-slate-500 border border-slate-100 text-[9px] font-black uppercase tracking-widest">
                                                        <AlertTriangle size={12} /> Skipped
                                                    </div>
                                                ) : (
                                                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-600 border border-red-100 text-[9px] font-black uppercase tracking-widest">
                                                        <XCircle size={12} /> Wrong
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="h-64 flex flex-col items-center justify-center p-8 text-center opacity-50">
                            <Activity size={40} className="text-slate-300 mb-4"/>
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Detailed answer logs were not captured for this legacy session.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
            `}</style>
        </div>
    );
};

export default AdminResultDetails;
