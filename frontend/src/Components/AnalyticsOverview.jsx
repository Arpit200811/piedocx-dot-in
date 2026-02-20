
import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { BarChart, Activity, Users, Clock, AlertTriangle, RefreshCw } from 'lucide-react';

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

    if (loading) return <div className="p-10 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">Loading Analytics Engine...</div>;
    if (!data) return <div className="p-10 text-center text-red-400 font-bold">Analytics Unavailable</div>;

    const MetricCard = ({ title, value, subtext, icon: Icon, color }) => (
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon size={64} />
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${color.replace('text-', 'bg-').replace('500', '100')} ${color}`}>
                <Icon size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{title}</p>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
            {subtext && <p className="text-xs font-bold text-slate-500 mt-2">{subtext}</p>}
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Activity className="text-blue-600" /> Deep Analytics
                </h2>
                <button
                    onClick={fetchAnalytics}
                    className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors text-slate-600"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Overview Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Completion Rate"
                    value={data.overview.completionRate}
                    subtext={`${data.overview.completedTests} / ${data.overview.totalStudents} Students`}
                    icon={Users}
                    color="text-blue-500"
                />
                <MetricCard
                    title="Avg Exam Time"
                    value={`${data.performance.avgTimeMinutes}m`}
                    subtext="Per Completed Session"
                    icon={Clock}
                    color="text-indigo-500"
                />
                <MetricCard
                    title="Drop-Off Rate"
                    value={data.overview.dropOffRate}
                    subtext="Started but not finished"
                    icon={BarChart}
                    color="text-rose-500"
                />
                <MetricCard
                    title="Avg Reconnects"
                    value={data.performance.avgReconnects}
                    subtext="Network instability factor"
                    icon={RefreshCw}
                    color="text-amber-500"
                />
            </div>

            {/* Risk Distribution Widget */}
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2 mb-8">
                    <AlertTriangle className="text-slate-400" />
                    <h3 className="font-bold text-lg text-slate-800">Risk Profile Distribution</h3>
                </div>

                <div className="flex flex-col gap-6">
                    {/* High Risk */}
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide">
                            <span className="text-red-500">High Risk (80+)</span>
                            <span className="text-slate-600">{data.risk.high} Students</span>
                        </div>
                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: `${(data.risk.high / data.overview.startedSessions) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Medium Risk */}
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide">
                            <span className="text-amber-500">Medium Risk (40-79)</span>
                            <span className="text-slate-600">{data.risk.medium} Students</span>
                        </div>
                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${(data.risk.medium / data.overview.startedSessions) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Low Risk */}
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-2 uppercase tracking-wide">
                            <span className="text-emerald-500">Low Risk (0-39)</span>
                            <span className="text-slate-600">{data.risk.low} Students</span>
                        </div>
                        <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${(data.risk.low / data.overview.startedSessions) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <p className="text-[10px] text-slate-400 font-medium">
                        Data Source: {data.source === 'cache' ? 'Redis Heap (Cached)' : 'Live MongoDB Aggregation'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsOverview;
