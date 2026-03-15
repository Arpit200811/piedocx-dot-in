import React from 'react';
import { motion } from 'framer-motion';

const SimpleDonut = ({ score, total = 30 }) => {
    const percentage = Math.min(100, Math.max(0, (score / total) * 100));
    const strokeWidth = 8;
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    // Dynamic colors based on performance
    const getColor = () => {
        if (percentage >= 75) return "#10b981"; // Emerald
        if (percentage >= 40) return "#f59e0b"; // Amber
        return "#ef4444"; // Red
    };

    const color = getColor();

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 drop-shadow-[0_0_8px_rgba(0,0,0,0.05)]">
                <circle cx="64" cy="64" r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
                <motion.circle
                    cx="64" cy="64" r={radius} fill="transparent" stroke={color} strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 2, ease: "circOut" }}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_var(--tw-shadow-color)]"
                    style={{ '--tw-shadow-color': color }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-2xl font-black text-slate-800 leading-none"
                >
                    {score}
                </motion.span>
                <span className="text-[8px] font-black text-slate-400 uppercase mt-1 tracking-widest">Marks</span>
            </div>
        </div>
    );
};

const StatsScore = ({ student }) => {
    if (!student) return null;

    const score = student.score || 0;
    const total = 30;
    const percentage = Math.round((score / total) * 100);

    return (
        <div className="w-full lg:w-96 bg-white rounded-[2.5rem] p-6 md:p-8 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden group hover:shadow-xl transition-all duration-500">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="flex flex-col items-center gap-6 relative z-10">
                <div className="relative">
                    <div className="absolute inset-0 bg-blue-600/5 rounded-full blur-2xl animate-pulse scale-150" />
                    <SimpleDonut score={score} total={total} />
                </div>

                <div className="text-center w-full">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 mb-3">
                         <span className={`w-1.5 h-1.5 rounded-full animate-ping ${student.testAttempted ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                         <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest leading-none italic">
                            {student.testAttempted ? 'Results Published' : 'Action Required'}
                         </p>
                    </div>

                    <h4 className={`text-xl font-black uppercase italic tracking-tighter mb-6 ${student.testAttempted ? 'text-slate-900' : 'text-amber-600'}`}>
                        {student.testAttempted ? 'Final Evaluation' : 'Exam Pending'}
                    </h4>

                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <div className="text-left">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Performance</p>
                                <p className="text-sm font-black text-slate-800 uppercase italic">
                                    {percentage >= 75 ? 'Excellent' : percentage >= 40 ? 'Good Progress' : 'Needs Practice'}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-xl font-black text-blue-600 italic leading-none">{percentage}%</span>
                            </div>
                        </div>

                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${percentage}%` }} 
                                className={`h-full rounded-full shadow-[0_0_10px_rgba(0,0,0,0.1)] ${
                                    percentage >= 75 ? 'bg-emerald-500' : 
                                    percentage >= 40 ? 'bg-blue-600' : 'bg-red-500'
                                }`}
                                transition={{ duration: 1.5, delay: 0.5 }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="bg-slate-50/80 p-3 rounded-2xl border border-white flex flex-col items-center">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">Total Marks</span>
                                <span className="text-xs font-black text-slate-800">{total}</span>
                            </div>
                            <div className="bg-slate-50/80 p-3 rounded-2xl border border-white flex flex-col items-center">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">Status</span>
                                <span className={`text-[9px] font-black uppercase italic ${student.testAttempted ? 'text-emerald-600' : 'text-amber-600'}`}>
                                    {student.testAttempted ? 'Verified' : 'Unchecked'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsScore;
