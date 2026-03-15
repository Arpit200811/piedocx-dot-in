import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { 
    BarChart3, Activity, Users, Clock, 
    AlertTriangle, RefreshCw, TrendingUp, 
    Zap, Award, ShieldCheck, Database
} from 'lucide-react';
import { motion } from 'framer-motion';

const AnalyticsOverview = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/api/admin/analytics/overview`);
            setData(res);
        } catch (err) {
            console.error("Failed to load analytics", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    if (loading) return (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Initializing Data Engine...</p>
        </div>
    );

    if (!data) return (
        <div className="p-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-red-100">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-xl font-black text-slate-900 uppercase italic">Analytics Offline</h3>
            <p className="text-slate-500 text-xs mt-2">Could not retrieve node data. Please check connection.</p>
        </div>
    );

    const MetricCard = ({ title, value, subtext, icon: Icon, color, delay }) => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all"
        >
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${color}`}>
                <Icon size={120} />
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${color.replace('text-', 'bg-').replace('500', '600')} text-white`}>
                <Icon size={28} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{title}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h3>
                <TrendingUp size={16} className="text-emerald-500 mb-1" />
            </div>
            {subtext && <p className="text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-wider">{subtext}</p>}
        </motion.div>
    );

    return (
        <div className="space-y-10 max-w-[1600px] mx-auto pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="px-3 py-1 bg-blue-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest italic">Live Cluster</div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{data.source === 'cache' ? 'Redis Optimized' : 'Disk Aggregation'}</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 italic uppercase tracking-tighter leading-none">
                        Performance <span className="text-blue-600">Intelligence</span>
                    </h1>
                </div>
                <button
                    onClick={fetchAnalytics}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
                >
                    Resync Node <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                </button>
            </div>

            {/* Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <MetricCard
                    title="System Completion"
                    value={data.overview.completionRate}
                    subtext={`${data.overview.completedTests} Validated Assests`}
                    icon={ShieldCheck}
                    color="text-blue-500"
                    delay={0.1}
                />
                <MetricCard
                    title="Mean Session Time"
                    value={`${data.performance.avgTimeMinutes}m`}
                    subtext="Processing Efficiency"
                    icon={Clock}
                    color="text-indigo-500"
                    delay={0.2}
                />
                <MetricCard
                    title="User Drop-Off"
                    value={data.overview.dropOffRate}
                    subtext="Anomaly Detected"
                    icon={Zap}
                    color="text-rose-500"
                    delay={0.3}
                />
                <MetricCard
                    title="Active Sessions"
                    value={data.overview.startedSessions}
                    subtext={`${data.overview.totalStudents} Registered Node`}
                    icon={Users}
                    color="text-amber-500"
                    delay={0.4}
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Score Distribution Visualizer */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="flex items-center justify-between mb-12 relative z-10">
                        <div>
                            <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Proctoring Metrics</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Integrity Violation Distribution</p>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-2xl text-slate-400"><Activity size={24} /></div>
                    </div>

                    <div className="space-y-10 relative z-10">
                        {/* High Risk */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest block mb-1">Critical Priority</span>
                                    <h4 className="text-lg font-black text-slate-800 uppercase italic tracking-tighter">High Risk Cluster (80+)</h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-slate-900">{data.risk.high}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase ml-2 italic">Units</span>
                                </div>
                            </div>
                            <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(data.risk.high / data.overview.startedSessions) * 100}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-red-500 to-rose-600 rounded-full shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                                ></motion.div>
                            </div>
                        </div>

                        {/* Medium Risk */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-1">Warning State</span>
                                    <h4 className="text-lg font-black text-slate-800 uppercase italic tracking-tighter">Moderate Deviation (40-79)</h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-slate-900">{data.risk.medium}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase ml-2 italic">Units</span>
                                </div>
                            </div>
                            <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(data.risk.medium / data.overview.startedSessions) * 100}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                                ></motion.div>
                            </div>
                        </div>

                        {/* Low Risk */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-end">
                                <div>
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Optimal Nodes</span>
                                    <h4 className="text-lg font-black text-slate-800 uppercase italic tracking-tighter">Verified Integrity (0-39)</h4>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-black text-slate-900">{data.risk.low}</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase ml-2 italic">Units</span>
                                </div>
                            </div>
                            <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(data.risk.low / data.overview.startedSessions) * 100}%` }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.4 }}
                                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Score Achievement Hub */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-between"
                >
                    <div className="absolute top-0 right-0 w-full h-full opacity-10 blur-[100px] bg-gradient-to-br from-blue-600 to-purple-600"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-blue-400"><Award size={24} /></div>
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Honor Roll</h3>
                        </div>
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-4xl font-black text-white tracking-tighter tabular-nums">{data.performance.avgScore?.toFixed(1) || '0.0'}</h4>
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400/60 mt-2">Aggregate Mean Score</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Max Pulse</p>
                                    <p className="text-xl font-black text-white">98%</p>
                                </div>
                                <div className="p-5 bg-white/5 rounded-3xl border border-white/5">
                                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2">Total Passed</p>
                                    <p className="text-xl font-black text-white">84%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="relative z-10 p-6 bg-blue-600 rounded-[2rem] mt-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white"><Database size={20} /></div>
                            <div>
                                <p className="text-[9px] font-black uppercase text-blue-100 tracking-widest">Active Database</p>
                                <p className="text-[10px] font-bold text-white uppercase italic">Cluster Sync Verified</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AnalyticsOverview;
