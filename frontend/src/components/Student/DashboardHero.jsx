import React from 'react';
import { Trophy, ChevronRight, Zap } from 'lucide-react';

const DashboardHero = ({ student, navigate, testInfo }) => {
    const displayName = student.firstName || student.fullName?.split(' ')[0] || 'Student';
    return (
        <div className="bg-white rounded-[2.5rem] md:rounded-[4rem] p-6 md:p-14 lg:p-14 relative overflow-hidden group shadow-[0_40px_100px_rgba(0,0,0,0.03)] border border-white/50 group/hero h-full flex flex-col justify-center">
            {/* Unique Mesh Background Gradient */}
            <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-blue-50/50 via-indigo-50/20 to-transparent pointer-events-none"></div>
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-400/5 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-indigo-500/5 rounded-full blur-[80px]"></div>

            {/* Matrix Static Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')] opacity-[0.03] pointer-events-none group-hover/hero:opacity-[0.05] transition-opacity duration-1000"></div>

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10 md:gap-16">
                <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left w-full">
                    <div className="flex items-center justify-center lg:justify-start gap-3 md:gap-4" data-aos="fade-right">
                        <div className="h-1 lg:h-1.5 w-8 lg:w-12 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
                        <span className="text-[10px] md:text-xs font-black text-blue-500 uppercase tracking-[0.4em] italic">Sector Delta-9 Terminal</span>
                    </div>
                    
                    <div className="space-y-3 md:space-y-4">
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-5xl font-black text-slate-900 italic uppercase tracking-tighter leading-[0.95] md:leading-[0.9] transition-all" data-aos="fade-up">
                            Welcome Back, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 drop-shadow-sm truncate inline-block max-w-full pb-1">
                                {displayName}
                            </span><span className="text-blue-600 animate-pulse">.</span>
                        </h1>
                        <p className="text-slate-500 text-[11px] sm:text-sm md:text-base leading-relaxed max-w-sm mx-auto lg:mx-0 font-medium opacity-70 italic" data-aos="fade-up" data-aos-delay="100">
                            {student.testAttempted
                                ? "Assessment sequence complete. Internal analytics are now processing your performance metadata."
                                : "Operational protocols ready. Initialize the evaluator engine to begin your scheduled assessment module."
                            }
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center lg:justify-start gap-4 md:gap-5 pt-4 md:pt-6" data-aos="fade-up" data-aos-delay="200">
                        {student.testAttempted && testInfo?.resultsPublished ? (
                            <button
                                onClick={() => navigate('/student-results')}
                                className="px-6 md:px-10 py-4 md:py-5 bg-slate-900 text-white rounded-[2rem] font-black text-[10px] md:text-xs uppercase italic tracking-[0.2em] shadow-2xl hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 md:gap-4 group/btn border border-white/10"
                            >
                                View Analytics <Trophy size={18} className="group-hover/btn:rotate-12 group-hover/btn:scale-125 transition-transform md:w-5 md:h-5" />
                            </button>
                        ) : student.testAttempted ? (
                            <div className="px-6 md:px-10 py-4 md:py-5 bg-amber-50/50 backdrop-blur-sm border border-amber-200/50 text-amber-700 rounded-[2rem] font-black text-[10px] md:text-xs uppercase italic tracking-[0.2em] flex items-center gap-3 md:gap-4 shadow-sm">
                                <span className="relative flex h-2.5 w-2.5 md:h-3 md:w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 md:h-3 md:w-3 bg-amber-500"></span>
                                </span>
                                Analytics Syncing...
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/student-dashboard/exams')}
                                className="px-8 md:px-10 py-4 md:py-5 bg-blue-600 text-white rounded-[2rem] font-black text-[10px] md:text-xs uppercase italic tracking-[0.2em] shadow-[0_20px_40px_rgba(37,99,235,0.3)] hover:bg-blue-500 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 md:gap-4 group/btn border border-white/20"
                            >
                                Initialize Exam <ChevronRight size={18} className="group-hover/btn:translate-x-2 transition-transform md:w-5 md:h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Unique Decorative Asset - Hidden on mobile/tablet */}
                <div className="relative hidden xl:block shrink-0" data-aos="zoom-in" data-aos-delay="300">
                    <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-[100px] animate-pulse scale-150"></div>
                    <div className="relative w-64 h-64 lg:w-72 lg:h-72 bg-white/40 backdrop-blur-3xl border border-white/40 rounded-[3.5rem] lg:rounded-[4rem] flex items-center justify-center p-8 shadow-2xl rotate-6 group-hover/hero:rotate-0 transition-all duration-1000 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent"></div>
                        <div className="text-center relative z-10">
                            <div className="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-blue-600/40">
                                <Trophy size={40} className="text-white lg:w-12 lg:h-12 drop-shadow-lg" />
                            </div>
                            <h4 className="text-lg lg:text-xl font-black text-slate-900 uppercase italic tracking-tight mb-2">Piedocx v2</h4>
                            <p className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Secured Node</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHero;
