import React from 'react';
import { Trophy, ChevronRight } from 'lucide-react';

const DashboardHero = ({ student, navigate }) => {
    return (
        <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-5 sm:p-10 md:p-16 relative overflow-hidden group shadow-2xl border border-blue-50">
            <div className="absolute top-0 right-0 w-full sm:w-[40%] h-full bg-gradient-to-l from-blue-100/40 to-transparent"></div>
            <div className="absolute -bottom-24 -left-24 sm:-right-24 w-64 h-64 bg-indigo-100/40 rounded-full blur-[80px]"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="flex-1 space-y-4 md:space-y-6 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-3">
                        <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                        <span className="text-[10px] md:text-xs font-black text-blue-400 uppercase tracking-[0.4em]">Student Dashboard</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 italic uppercase tracking-tighter leading-tight">
                        Welcome Back, <span className="text-blue-600 underline decoration-blue-100 underline-offset-4">{student.firstName}</span>.
                    </h1>
                    <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium opacity-80">
                        {student.testAttempted
                            ? "Your exam is finished. You can check your marks and result details below."
                            : "Your exam is ready. Please check your internet connection and start when you are ready."
                        }
                    </p>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                        {student.testAttempted ? (
                            <button
                                onClick={() => navigate('/student-results')}
                                className="px-8 md:px-10 py-4 md:py-5 bg-slate-900 text-white rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase italic tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3 group border-none"
                            >
                                View My Result <Trophy size={18} className="group-hover:scale-125 transition-transform" />
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/student-dashboard/exams')}
                                className="px-8 md:px-10 py-4 md:py-5 bg-blue-600 text-white rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase italic tracking-[0.2em] shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-all flex items-center gap-3 group border-none"
                            >
                                Start My Exam <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        )}
                    </div>
                </div>
                {/* Score component will be rendered next to it or as a child in layout */}
            </div>
        </div>
    );
};

export default DashboardHero;
