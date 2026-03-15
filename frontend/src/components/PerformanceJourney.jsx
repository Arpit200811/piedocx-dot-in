import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { TrendingUp, Award, Calendar, ChevronRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const PerformanceJourney = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await api.get('/api/student-auth/performance');
                setHistory(res);
            } catch (err) {
                console.error("Failed to fetch performance", err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return (
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm animate-pulse">
            <div className="h-4 w-32 bg-slate-100 rounded-full mb-6"></div>
            <div className="h-40 w-full bg-slate-50 rounded-[2rem]"></div>
        </div>
    );

    if (history.length === 0) return null;

    // Simple SVG Chart Logic
    const maxScore = 100;
    const padding = 40;
    const width = 600;
    const height = 200;
    
    const points = history.map((h, i) => {
        const x = (i / (history.length > 1 ? history.length - 1 : 1)) * (width - 2 * padding) + padding;
        const y = height - ((h.percentage / maxScore) * (height - 2 * padding) + padding);
        return { x, y, percentage: h.percentage, date: h.date };
    });

    const pathD = points.length > 1 
        ? `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`
        : "";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl overflow-hidden relative group"
        >
            {/* Animated background gradient */}
            <div className="absolute top-0 right-0 w-full h-full opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600"></div>
            
            <div className="flex items-center justify-between mb-10 relative z-10">
                <div>
                    <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2 flex items-center gap-2 italic">
                        <Activity size={14} /> Progress Engine
                    </h3>
                    <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">
                        Performance <span className="text-blue-600">Journey</span>
                    </h2>
                </div>
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                    <TrendingUp size={24} />
                </div>
            </div>

            <div className="relative mb-10 h-[220px] z-10 flex items-center justify-center">
                {history.length > 1 ? (
                    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                        {/* Grid Lines */}
                        {[0, 25, 50, 75, 100].map(val => {
                            const y = height - ((val / maxScore) * (height - 2 * padding) + padding);
                            return (
                                <g key={val}>
                                    <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                                    <text x={padding - 10} y={y + 4} textAnchor="end" className="text-[8px] font-black fill-slate-300 uppercase tracking-widest">{val}%</text>
                                </g>
                            );
                        })}

                        {/* Main Path */}
                        <motion.path
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            d={pathD}
                            fill="none"
                            stroke="url(#chartGradient)"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {/* Points */}
                        {points.map((p, i) => (
                            <motion.g 
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 1 + i * 0.2 }}
                                key={i}
                            >
                                <circle cx={p.x} cy={p.y} r="6" className="fill-blue-600 stroke-white stroke-[3px] shadow-lg" />
                                <text x={p.x} y={p.y - 15} textAnchor="middle" className="text-[10px] font-black fill-slate-900 tabular-nums">{p.percentage}%</text>
                            </motion.g>
                        ))}

                        <defs>
                            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#2563eb" />
                                <stop offset="50%" stopColor="#7c3aed" />
                                <stop offset="100%" stopColor="#db2777" />
                            </linearGradient>
                        </defs>
                    </svg>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                         <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                             <Award size={32} />
                         </div>
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Single Data Point Recorded.<br/><span className="text-blue-600 underline">Complete more tests to unlock trends.</span></p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 z-10 relative">
                {history.slice(-4).reverse().map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg transition-all">
                        <div className="flex items-center gap-2 mb-2">
                            <Calendar size={10} className="text-slate-400" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <h4 className="text-xl font-black text-slate-900 tracking-tighter">{item.percentage}%</h4>
                            <ChevronRight size={14} className="text-blue-600" />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default PerformanceJourney;
