import React from 'react';
import { motion } from 'framer-motion';

// 1. Code Logic Animation
export const DeveloperIllustration = () => (
    <div className="relative w-full aspect-square flex items-center justify-center p-8">
        <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative w-full max-w-[450px] bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
            {/* Terminal Header */}
            <div className="flex gap-1.5 px-4 py-3 bg-slate-800/50">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            </div>
            {/* Code Animation */}
            <div className="p-6 font-mono text-sm space-y-3">
                {[...Array(8)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: [0, 1, 1, 0.5], x: 0 }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.2,
                            repeatDelay: 1
                        }}
                        className="flex items-center gap-3"
                    >
                        <span className="text-slate-500">{i + 1}</span>
                        <div
                            className={`h-4 rounded-full ${['bg-blue-400', 'bg-purple-400', 'bg-emerald-400', 'bg-pink-400'][i % 4]}`}
                            style={{ width: `${Math.random() * 60 + 20}%` }}
                        ></div>
                    </motion.div>
                ))}
            </div>
        </div>
        {/* Floating Particles */}
        {[...Array(5)].map((_, i) => (
            <motion.div
                key={i}
                animate={{
                    y: [0, -40, 0],
                    opacity: [0, 0.5, 0]
                }}
                transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-2 h-2 bg-blue-500 rounded-full"
                style={{ left: `${20 + i * 15}%`, top: `${70 - i * 5}%` }}
            />
        ))}
    </div>
);

// 2. Mobile App Mockup Animation
export const AppIllustration = () => (
    <div className="relative w-full aspect-square flex items-center justify-center">
        <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-64 h-[500px] bg-slate-100 rounded-[3rem] p-4 shadow-2xl border-[8px] border-slate-900"
        >
            <div className="w-1/3 h-6 bg-slate-900 mx-auto rounded-b-2xl mb-6"></div>
            <div className="space-y-4">
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="h-32 bg-blue-600 rounded-2xl"
                ></motion.div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="h-20 bg-white rounded-xl shadow-sm border border-slate-100"></div>
                    <div className="h-20 bg-white rounded-xl shadow-sm border border-slate-100"></div>
                </div>
                <div className="h-40 bg-white rounded-xl shadow-sm border border-slate-100 p-4 space-y-3">
                    <div className="h-2 bg-slate-100 rounded-full w-3/4"></div>
                    <div className="h-2 bg-slate-100 rounded-full w-1/2"></div>
                    <div className="h-2 bg-slate-100 rounded-full w-2/3"></div>
                </div>
            </div>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-1 bg-slate-300 rounded-full"></div>
        </motion.div>
        {/* Floating App Icons */}
        <motion.div
            animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-1/4 right-1/4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-blue-50"
        >
            <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
        </motion.div>
        <motion.div
            animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute bottom-1/4 left-1/4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-emerald-50"
        >
            <div className="w-8 h-8 bg-emerald-500 rounded-lg"></div>
        </motion.div>
    </div>
);

// 3. Grid Network Animation
export const CloudIllustration = () => (
    <div className="relative w-full aspect-square flex items-center justify-center">
        <div className="relative w-full max-w-[500px] h-[500px] bg-slate-50/50 rounded-full overflow-hidden border border-slate-100">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 opacity-20">
                {[...Array(64)].map((_, i) => (
                    <div key={i} className="border border-blue-200"></div>
                ))}
            </div>
            {/* Pulsing Nodes */}
            <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/10 rounded-full flex items-center justify-center"
            >
                <div className="w-16 h-16 bg-blue-600 rounded-2xl rotate-45 flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <div className="w-6 h-6 bg-white rounded-sm"></div>
                </div>
            </motion.div>
            {/* Connection Lines */}
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{ pathLength: [0, 1], opacity: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                >
                    <svg className="w-full h-full">
                        <line x1="250" y1="250" x2={Math.random() * 500} y2={Math.random() * 500} stroke="#3b82f6" strokeWidth="2" strokeDasharray="4 4" />
                    </svg>
                </motion.div>
            ))}
        </div>
    </div>
);

// 4. Collaborative Team Animation
export const TeamIllustration = () => (
    <div className="relative w-full aspect-square flex items-center justify-center">
        <div className="relative w-full max-w-[500px] h-[400px]">
            {/* Floating Avatar Cards */}
            {[...Array(4)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{
                        y: [0, -20, 0],
                        rotate: [i % 2 === 0 ? 0 : -2, i % 2 === 0 ? 2 : 0, i % 2 === 0 ? 0 : -2]
                    }}
                    transition={{
                        duration: 4 + i,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5
                    }}
                    className={`absolute p-4 bg-white rounded-2xl shadow-xl flex items-center gap-4 border border-slate-50`}
                    style={{
                        top: `${10 + i * 20}%`,
                        left: i % 2 === 0 ? '10%' : '50%',
                        zIndex: 10 + i
                    }}
                >
                    <div className={`w-12 h-12 rounded-full ${['bg-blue-100', 'bg-purple-100', 'bg-emerald-100', 'bg-amber-100'][i]}`}></div>
                    <div className="space-y-2">
                        <div className="h-3 w-24 bg-slate-100 rounded-full"></div>
                        <div className="h-2 w-16 bg-slate-50 rounded-full"></div>
                    </div>
                </motion.div>
            ))}
            {/* Central Abstract Logic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-4 border-blue-500/20 rounded-full border-dashed animate-spin-slow"></div>
        </div>
        <style>{`
      @keyframes spin-slow {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
      .animate-spin-slow {
        animation: spin-slow 12s linear infinite;
      }
    `}</style>
    </div>
);
