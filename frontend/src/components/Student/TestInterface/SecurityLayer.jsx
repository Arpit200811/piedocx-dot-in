import React from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export const InternetSyncNotice = ({ isOnline, syncError, onSync }) => {
    if (isOnline && !syncError) return null;
    return (
        <div className="fixed top-0 left-0 right-0 z-[100001] bg-red-600 px-6 py-2.5 flex items-center justify-between text-white shadow-lg animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-ping"></div>
                <span className="font-black text-[11px] uppercase tracking-[0.2em] italic">Internet / Sync Problem Detected</span>
            </div>
            <div className="flex items-center gap-6">
                <span className="text-[10px] font-bold text-white/90 uppercase tracking-widest hidden md:block">Saving to local cache...</span>
                <button
                    onClick={onSync}
                    className="bg-white text-red-600 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-neutral-100 transition-all shadow-lg active:scale-95"
                >
                    Retry Sync Now
                </button>
            </div>
        </div>
    );
};

export const ScreenshotBlocker = ({ active }) => {
    if (!active) return null;
    return (
        <div className="fixed inset-0 z-[1000000] bg-black flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-white text-7xl font-black uppercase italic tracking-tighter mb-4">CAPTURE BLOCKED</h1>
                <p className="text-red-500 text-2xl font-black uppercase tracking-[0.3em]">CRITICAL VIOLATION LOGGED</p>
            </div>
        </div>
    );
};

export const FocusRestrictionLayer = ({ isFocused }) => {
    if (isFocused) return null;
    return (
        <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center text-center p-6">
            <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mb-8 border-4 border-red-600/50 animate-pulse">
                <Lock size={48} className="text-red-600" />
            </div>
            <h2 className="text-4xl font-black text-white mb-4 uppercase tracking-[0.2em]">ACCESS RESTRICTED</h2>
            <p className="text-red-500 text-lg max-w-md font-black uppercase italic animate-bounce">
                SCREEN CAPTURE / FOCUS LOSS DETECTED
            </p>
            <div className="mt-8 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-loose">
                    CONTENT AUTOMATICALLY BLACKED OUT <br />
                    VIOLATION HAS BEEN LOGGED TO THE SERVER
                </p>
            </div>
        </div>
    );
};

export const SecurityWatermark = ({ studentProfile }) => {
    if (!studentProfile) return null;
    return (
        <>
            <div className="fixed inset-0 pointer-events-none z-[50] overflow-hidden select-none opacity-[0.14]">
                <motion.div
                    animate={{ x: [0, -40, 0, 40, 0], y: [0, 40, 0, -40, 0] }}
                    transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                    className="absolute inset-[-20%] flex flex-wrap content-start gap-y-24 gap-x-20 p-4"
                >
                    {Array.from({ length: 80 }).map((_, i) => (
                        <div key={i} className="transform -rotate-[35deg] whitespace-nowrap select-none font-black text-[18px] uppercase tracking-tighter text-black/80">
                            {studentProfile.studentId} • {studentProfile.fullName} • IP: REQ_LOGGED
                        </div>
                    ))}
                </motion.div>
            </div>
            <motion.div
                animate={{ top: ['5%', '85%', '85%', '5%', '5%'], left: ['5%', '5%', '85%', '85%', '5%'] }}
                transition={{ repeat: Infinity, duration: 40, ease: "easeInOut" }}
                className="fixed z-[9500] pointer-events-none"
            >
                <div className="flex items-center gap-2 bg-red-600/60 backdrop-blur-md border border-red-400/50 px-3 py-1.5 rounded-full shadow-xl">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
                        ID: {studentProfile.studentId}
                    </span>
                </div>
            </motion.div>
        </>
    );
};

export const LiveProctorFeed = ({ videoRef, noiseViolation }) => {
    return (
        <div className="fixed bottom-6 right-6 z-[9000] group pointer-events-none">
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative w-40 h-28 md:w-52 md:h-36 bg-black rounded-3xl overflow-hidden border-2 transition-all duration-500 shadow-2xl ${noiseViolation ? 'border-red-600 scale-105 shadow-red-600/20' : 'border-white/10 group-hover:border-blue-600/50'}`}
            >
                <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className={`w-full h-full object-cover transition-opacity duration-1000 ${noiseViolation ? 'opacity-50' : 'opacity-80'}`}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${noiseViolation ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                        <span className="text-[8px] font-black text-white/60 uppercase tracking-[0.2em]">Secure Feed</span>
                    </div>
                </div>

                <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded-lg border border-white/10">
                    <span className="text-[7px] font-black text-white uppercase tracking-widest">LIVE</span>
                </div>

                {noiseViolation && (
                    <div className="absolute inset-0 bg-red-600/20 flex flex-col items-center justify-center text-center p-2 backdrop-blur-[2px]">
                        <span className="text-[9px] font-black text-white uppercase italic tracking-tighter leading-none animate-bounce">Voice Detected</span>
                    </div>
                )}
            </motion.div>
            <p className="text-center mt-3 text-[7px] font-black text-white/20 uppercase tracking-[0.4em] italic group-hover:text-blue-500/40 transition-colors">AI Proctoring Active</p>
        </div>
    );
};

export const BackgroundEffects = () => (
    <>
        <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>
    </>
);
