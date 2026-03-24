import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Calendar, ChevronRight, ShieldCheck, QrCode } from 'lucide-react';
import { ExamsSkeleton } from './Skeleton';

const ExamsTab = ({ isExamsLoading, testInfo, student, onNavigate }) => {
    return (
        <motion.div 
            key="exams" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-6xl pb-20"
        >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-16">
                <div data-aos="fade-right">
                    <p className="text-[9px] md:text-[10px] font-black text-blue-500 uppercase tracking-[0.5em] mb-2 md:mb-3 italic">Session Frequency 0.1hz</p>
                    <h2 className="text-2xl md:text-5xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        Online <span className="text-blue-600">Exams_</span>
                    </h2>
                </div>
                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-4 md:px-6 py-2 md:py-3 rounded-2xl border border-white/80 shadow-sm w-fit" data-aos="fade-left">
                    <div className="w-1 md:w-1.5 h-1 md:h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                    <span className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-widest italic opacity-60">Live Gateway Operational</span>
                </div>
            </div>

            {isExamsLoading ? (
                <ExamsSkeleton />
            ) : testInfo ? (
                <div className="relative group/exam w-full" data-aos="zoom-in-up">
                    {/* Futuristic Background Blur Behind Card */}
                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/5 via-indigo-600/5 to-transparent rounded-[3rem] md:rounded-[4rem] blur-2xl group-hover/exam:opacity-100 opacity-0 transition-opacity duration-1000"></div>
                    
                    <div className="bg-slate-900 p-8 sm:p-12 md:p-16 lg:p-20 rounded-[2.5rem] md:rounded-[4.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.1)] relative overflow-hidden transition-all duration-700 hover:shadow-[0_50px_130px_rgba(37,99,235,0.15)] group-hover/exam:-translate-y-2">
                        {/* Interactive Background Elements */}
                        <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-gradient-to-bl from-blue-600/20 to-transparent pointer-events-none group-hover/exam:from-blue-600/30 transition-all duration-1000"></div>
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none transition-opacity group-hover/exam:opacity-[0.05]"></div>

                        <div className="flex flex-col xl:flex-row justify-between items-center gap-10 lg:gap-20 relative z-10 w-full">
                            <div className="flex-1 space-y-6 md:space-y-8 text-center xl:text-left w-full">
                                <div className="flex flex-wrap items-center justify-center xl:justify-start gap-4">
                                    <div className="px-4 py-1.5 md:px-5 md:py-2 bg-emerald-500/10 text-emerald-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl border border-emerald-500/20 shadow-sm flex items-center gap-2">
                                        <div className="w-1 h-1 bg-emerald-400 rounded-full animate-ping"></div>
                                        Active Link
                                    </div>
                                    <span className="px-4 py-1.5 md:px-5 md:py-2 bg-white/5 text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-2xl border border-white/5 backdrop-blur-sm group-hover/exam:border-white/10 transition-colors">{testInfo.branchGroup} • Year {testInfo.yearGroup}</span>
                                </div>

                                <div className="space-y-3 md:space-y-4">
                                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white uppercase italic tracking-tighter leading-[1] md:leading-[0.9] drop-shadow-2xl">{testInfo.title}<span className="text-blue-500">_</span></h3>
                                    <p className="text-[10px] md:text-[11px] font-bold text-blue-400/60 uppercase tracking-[0.4em] leading-relaxed italic">Encrypted Assessment Module • V 2.4.9</p>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 md:pt-10 border-t border-white/5">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center justify-center xl:justify-start gap-2 text-slate-500 group-hover/exam:text-blue-400/60 transition-colors">
                                            <Clock size={12} className="group-hover/exam:rotate-12 transition-transform" />
                                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest italic opacity-50">Operational Time</span>
                                        </div>
                                        <p className="text-lg md:text-xl font-black text-white italic tracking-tighter">{testInfo.duration} Min</p>
                                    </div>
                                    <div className="space-y-1.5 border-l border-white/5 pl-6">
                                        <div className="flex items-center justify-center xl:justify-start gap-2 text-slate-500 group-hover/exam:text-indigo-400/60 transition-colors">
                                            <Calendar size={12} className="group-hover/exam:rotate-12 transition-transform" />
                                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest italic opacity-50">Activation Date</span>
                                        </div>
                                        <p className="text-lg md:text-xl font-black text-white italic tracking-tighter">{new Date(testInfo.startDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="space-y-1.5 border-l border-white/5 pl-6 hidden md:block">
                                        <div className="flex items-center justify-center xl:justify-start gap-2 text-slate-500 group-hover/exam:text-emerald-400/60 transition-colors">
                                            <ShieldCheck size={12} className="group-hover/exam:scale-110 transition-transform" />
                                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest italic opacity-50">Terminal Security</span>
                                        </div>
                                        <p className="text-lg md:text-xl font-black text-white italic tracking-tighter">Level 4</p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full xl:w-auto relative group-hover/exam:scale-105 transition-transform duration-500">
                                <div className="absolute inset-0 bg-blue-600/10 rounded-full blur-3xl lg:scale-150 animate-pulse pointer-events-none"></div>
                                <button
                                    onClick={() => onNavigate('/waiting-room', { state: { testId: testInfo.id, testTitle: testInfo.title, studentName: student.fullName, studentId: student.studentId, yearGroup: testInfo.yearGroup, branchGroup: testInfo.branchGroup, testInfo: testInfo } })}
                                    disabled={student.testAttempted}
                                    className={`w-full xl:w-[320px] h-20 md:h-24 rounded-[2.5rem] font-black p-1 transition-all flex items-center group/btn relative overflow-hidden
                                    ${student.testAttempted
                                            ? 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/10'
                                            : 'bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-[0_20px_60px_rgba(37,99,235,0.4)] hover:shadow-[0_30px_80px_rgba(37,99,235,0.6)]'
                                        }`}
                                >
                                    <div className="w-full h-full rounded-[2.3rem] flex items-center justify-between px-8 md:px-10 relative overflow-hidden group-hover/btn:bg-white/5 transition-colors">
                                        {!student.testAttempted && (
                                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700 ease-in-out pointer-events-none"></div>
                                        )}
                                        <span className={`text-[11px] md:text-[12px] uppercase italic tracking-[0.25em] relative z-10 ${student.testAttempted ? 'text-slate-600' : 'text-white'}`}>
                                            {student.testAttempted ? 'Assessed' : 'Initialize Exam'}
                                        </span>
                                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-xl flex items-center justify-center transition-all duration-500 relative z-10 ${student.testAttempted ? 'bg-white/5 text-slate-600' : 'bg-white/20 text-white group-hover/btn:bg-white group-hover/btn:text-blue-600 group-hover/btn:rotate-[-45deg]'}`}>
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </button>
                                {!student.testAttempted && (
                                    <div className="mt-5 md:mt-6 flex flex-col items-center gap-2" data-aos="fade-up" data-aos-delay="400">
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.3em] flex items-center gap-3 opacity-60">
                                            <span className="w-6 md:w-10 h-px bg-white/10"></span>
                                            Secure Session Ready
                                            <span className="w-6 md:w-10 h-px bg-white/10"></span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
iv>

                    {/* Decorative Corner Element */}
                    <div className="absolute top-10 right-10 w-24 h-24 pointer-events-none opacity-10 filter invert hiden lg:block">
                        <QrCode size={96} className="text-white" />
                    </div>
                </div>
            ) : (
                <div 
                    className="py-32 text-center bg-white/40 backdrop-blur-md rounded-[4rem] border-2 border-dashed border-slate-200/50 shadow-inner px-10 transition-all hover:bg-white/60 group/empty"
                    data-aos="fade-up"
                >
                    <BookOpen size={48} className="mx-auto text-slate-200 mb-6 group-hover/empty:scale-110 transition-transform duration-700" />
                    <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.4em] italic leading-relaxed opacity-60">
                        No active assessment frequencies <br />
                        detected in this sector.
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default ExamsTab;
