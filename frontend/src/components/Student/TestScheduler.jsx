import React from 'react';
import { Calendar, ChevronRight, Zap, Clock, Ghost } from 'lucide-react';
import { motion } from 'framer-motion';

const TestScheduler = ({ testInfo, student, onAction }) => {
    return (
        <div className="bg-slate-900 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl transition-transform group-hover:scale-150"></div>
            
            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 rounded-xl">
                            <Calendar className="text-white" size={18} />
                        </div>
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Exam <span className="text-blue-500">Status</span></h3>
                    </div>
                    {testInfo?.isActive && (
                        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                            <Zap size={10} className="text-emerald-500 fill-emerald-500" />
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
                        </div>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-3">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Current Exam Details</p>
                        <h4 className="text-xl font-black text-white tracking-tight leading-tight uppercase">
                            {testInfo?.title || 'No Exam Scheduled'}
                        </h4>
                        <div className="flex items-center gap-4 pt-2">
                            <div className="flex items-center gap-1.5">
                                <Clock size={12} className="text-blue-400" />
                                <span className="text-[10px] font-bold text-slate-300">{testInfo?.duration || '—'} Minutes</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Zap size={12} className="text-amber-400" />
                                <span className="text-[10px] font-bold text-slate-300">{testInfo?.totalQuestions || '—'} Questions</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onAction}
                        disabled={student.testAttempted || !testInfo?.isActive}
                        className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                            student.testAttempted ? 'bg-emerald-500 text-white cursor-default' : 
                            testInfo?.isActive ? 'bg-blue-600 text-white hover:bg-blue-500' : 'bg-white/5 text-slate-500 cursor-not-allowed'
                        }`}
                    >
                        {student.testAttempted ? 'Exam Finished' : testInfo?.isActive ? 'Start Exam Now' : 'No Exam Right Now'}
                        {!student.testAttempted && testInfo?.isActive && <ChevronRight size={16} />}
                    </button>
                    
                    {!testInfo?.isActive && !student.testAttempted && (
                        <div className="flex flex-col items-center justify-center py-6 gap-6">
                            <motion.div
                                animate={{ 
                                    y: [0, -10, 0],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center border border-blue-500/20"
                            >
                                <Ghost size={32} className="text-blue-400 opacity-60" />
                            </motion.div>
                            <p className="text-[10px] text-center font-black text-slate-500 px-8 uppercase tracking-[0.2em] leading-relaxed">
                                System is Idle. <br />
                                <span className="text-blue-400/50">Waiting for mission start signal...</span>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestScheduler;
