import React from 'react';
import { Zap, Clock } from 'lucide-react';

const TestHeader = ({ testTitle, isOnline, isSyncing, completedPercentage, timeLeft, theme }) => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;

    return (
        <header className={`flex flex-col md:flex-row justify-between items-stretch ${theme === 'dark' ? 'bg-white/5 border-white/10 glass-dark' : 'bg-white border-slate-100 shadow-xl'} p-3 sm:p-5 md:p-6 lg:p-7 rounded-[2rem] md:rounded-[2.5rem] border shadow-2xl gap-4 md:gap-6 relative overflow-hidden premium-border`}>
            <div className="flex items-center gap-6 relative z-10">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-800 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.3)] shrink-0 border border-white/20">
                    <Zap size={28} className="text-white" />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border transition-all ${isOnline ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                            {isOnline ? 'Online' : 'Offline'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase tracking-widest border border-blue-500/20 transition-opacity ${isSyncing ? 'opacity-100' : 'opacity-0'}`}>
                            Syncing...
                        </span>
                    </div>
                    <h2 className="font-black text-lg md:text-2xl lg:text-3xl tracking-tighter text-white leading-none truncate italic uppercase">{testTitle}</h2>
                </div>
            </div>

            <div className="flex items-center gap-4 md:gap-8 bg-black/40 p-2 pr-4 md:pr-8 rounded-[2rem] border border-white/5">
                <div className="hidden sm:flex flex-col items-end border-r border-white/10 pr-6">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Completion</span>
                    <div className="flex items-center gap-2">
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-1000"
                                style={{ width: `${completedPercentage}%` }}
                            ></div>
                        </div>
                        <span className="text-xs font-black text-blue-400">{Math.round(completedPercentage)}%</span>
                    </div>
                </div>
                <div className={`p-1 flex flex-col items-center justify-center min-w-[100px] md:min-w-[150px]`}>
                    <span className="text-[8px] md:text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Time Left</span>
                    <div className={`text-xl md:text-4xl font-black font-mono transition-all tabular-nums text-glow ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {mins}<span className="opacity-30 mx-1">:</span>{String(secs).padStart(2, '0')}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default TestHeader;
