import React from 'react';
import { motion } from 'framer-motion';
import { Lock, ChevronRight } from 'lucide-react';

const SecurityAlert = ({ isOutOfSync, violationCount, studentId, onReEnter }) => {
    if (!isOutOfSync) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[99999] bg-[#000] flex flex-col items-center justify-center p-8 text-center"
        >
            <div className="absolute inset-0 bg-red-600/10 animate-pulse pointer-events-none"></div>
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-32 h-32 bg-red-600 text-white rounded-[3rem] flex items-center justify-center mb-10 shadow-[0_0_80px_rgba(239,68,68,0.6)] border-4 border-white/20"
            >
                <Lock size={60} />
            </motion.div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter italic uppercase mb-2 text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                Security Alert
            </h2>
            <div className="h-1.5 w-32 bg-red-600 mb-8 rounded-full mx-auto shadow-[0_0_20px_rgba(239,68,68,0.5)]"></div>
            <div className="space-y-4 mb-12">
                <p className="text-white text-xl font-bold uppercase tracking-widest leading-relaxed">
                    PROCTORING VIOLATION RECORDED
                </p>
                <div className="px-6 py-3 bg-red-600/10 border border-red-500/20 rounded-2xl">
                    <p className="text-red-400 font-black text-2xl uppercase">
                        Warning {violationCount} / 3
                    </p>
                </div>
                <p className="text-slate-500 max-w-lg mx-auto font-medium text-xs uppercase tracking-widest leading-loose">
                    Your ID <b>{studentId}</b> has been flagged. <br />
                    Activity logged: Switching apps, screenshots, or exiting fullscreen is prohibited. <br />
                    One more violation may terminate your examination permanently.
                </p>
            </div>

            <button
                type="button"
                onClick={onReEnter}
                className="group relative bg-white text-black px-16 py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-2xl active:scale-95 overflow-hidden"
            >
                <span className="relative z-10 flex items-center gap-3">
                    Re-Enter Secure Environment <ChevronRight size={20} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 translate-y-full group-hover:translate-y-0 transition-transform"></div>
            </button>
        </motion.div>
    );
};

export default SecurityAlert;
