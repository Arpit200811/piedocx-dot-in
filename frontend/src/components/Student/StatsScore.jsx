import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

const SimpleDonut = ({ score, total = 30 }) => {
    const percentage = Math.min(100, Math.max(0, (score / total) * 100));
    const strokeWidth = 8;
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    const getColor = () => {
        if (percentage >= 75) return "#10b981"; // Emerald
        if (percentage >= 40) return "#3b82f6"; // Blue
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
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <motion.span 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-2xl font-black text-slate-800 leading-none italic"
                >
                    {score}
                </motion.span>
                <span className="text-[8px] font-black text-slate-400 uppercase mt-1 tracking-widest italic">Marks</span>
            </div>
        </div>
    );
};

const StatsScore = ({ student }) => {
    if (!student) return null;

    const score = student.score || 0;
    const total = student.assignedQuestions?.length || student.totalQuestions || 30;
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    return (
        <div className="w-full bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 sm:p-8 md:p-8 border border-white/50 shadow-[0_40px_100px_rgba(0,0,0,0.02)] relative overflow-hidden group/stats hover:shadow-2xl transition-all duration-700 h-full flex flex-col justify-center" data-aos="fade-left">
            {/* Glassmorphic Accent */}
            <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-blue-600/5 rounded-full blur-3xl group-hover/stats:scale-150 transition-transform duration-1000" />
            
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-8 md:gap-10 relative z-10 w-full">
                <div className="relative group/donut shrink-0">
                    <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-3xl group-hover/donut:scale-150 transition-transform duration-700" />
                    <div className="scale-110 md:scale-125 transition-transform duration-500">
                        <SimpleDonut score={score} total={total} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 w-8 h-8 md:w-10 md:h-10 bg-white shadow-xl rounded-xl flex items-center justify-center border border-slate-50">
                        <Trophy size={14} className="text-blue-600 md:w-4 md:h-4" />
                    </div>
                </div>

                <div className="text-center sm:text-left lg:text-center xl:text-left flex-1 w-full flex flex-col justify-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50/50 rounded-full border border-blue-100/30 mb-3 md:mb-4 backdrop-blur-sm">
                         <span className="relative flex h-1.5 w-1.5">
                             <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${student.testAttempted ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                             <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${student.testAttempted ? 'bg-emerald-500' : 'bg-blue-600'}`} />
                         </span>
                         <p className="text-[9px] text-blue-600 font-black uppercase tracking-[0.2em] italic">
                            {student.testAttempted ? 'Archive Validated' : 'Awaiting Data'}
                         </p>
                    </div>

                    <h4 className="text-xl md:text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-4 md:mb-6 leading-none">
                        Performance <br className="hidden sm:block lg:hidden xl:block" />
                        <span className="text-blue-600">Metric_</span>
                    </h4>

                    <div className="space-y-4 md:space-y-5">
                        <div className="flex justify-between items-end gap-2">
                            <div className="text-left">
                                <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-0.5 md:mb-1 italic">Efficiency Score</p>
                                <p className="text-sm md:text-base font-black text-slate-800 uppercase italic tracking-tight">
                                    {percentage >= 75 ? 'Superior' : percentage >= 40 ? 'Synchronized' : 'Calibrating'}
                                </p>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl md:text-3xl font-black text-slate-900 italic tracking-tighter leading-none">{percentage}<span className="text-blue-600 text-lg sm:text-base md:text-lg">%</span></span>
                            </div>
                        </div>

                        <div className="w-full bg-slate-50 h-2 sm:h-3 rounded-full overflow-hidden p-0.5 sm:p-1 border border-slate-100 relative shadow-inner">
                            <motion.div 
                                initial={{ width: 0 }} 
                                animate={{ width: `${percentage}%` }} 
                                className={`h-full rounded-full relative ${
                                    percentage >= 75 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 
                                    percentage >= 40 ? 'bg-gradient-to-r from-blue-600 to-indigo-500' : 'bg-gradient-to-r from-red-600 to-rose-400'
                                }`}
                                transition={{ duration: 2, ease: "circOut" }}
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsScore;
