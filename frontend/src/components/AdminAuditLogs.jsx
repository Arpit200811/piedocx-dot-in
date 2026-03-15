import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { ShieldCheck, Clock, User, Info, Search, RefreshCw, AlertCircle, Database } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminAuditLogs = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/admin/audit-logs');
            setLogs(res);
        } catch (err) {
            console.error("Failed to load audit logs", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log => 
        log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getActionColor = (action) => {
        if (action.includes('DELETE')) return 'bg-red-50 text-red-600 border-red-100';
        if (action.includes('CREATE')) return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        if (action.includes('UPDATE')) return 'bg-blue-50 text-blue-600 border-blue-100';
        return 'bg-slate-50 text-slate-600 border-slate-100';
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg">
                            <ShieldCheck size={20} />
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">System Accountability Hub</span>
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
                        Audit <span className="text-blue-600">Trails</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search Logs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border-2 border-slate-100 rounded-2xl pl-12 pr-6 py-3 text-sm font-bold focus:outline-none focus:border-blue-500 transition-all w-64"
                        />
                    </div>
                    <button 
                        onClick={fetchLogs}
                        className="p-4 bg-white border-2 border-slate-100 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Logs Timeline */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden relative">
                 {/* Decorative background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="p-8 border-b border-slate-50 relative z-10 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-2">
                        <Clock size={16} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Event History Timeline</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 italic">Showing last 200 system events</span>
                </div>

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Timestamp</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Administrator</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Action Protocol</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Target Node</th>
                                <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Scanning Audit Vault...</p>
                                    </td>
                                </tr>
                            ) : filteredLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                                            <AlertCircle size={32} />
                                        </div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No matching security logs found.</p>
                                    </td>
                                </tr>
                            ) : filteredLogs.map((log, idx) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.03 }}
                                    key={log._id} 
                                    className="hover:bg-slate-50/50 transition-colors group"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="text-[11px] font-bold text-slate-900">{new Date(log.timestamp).toLocaleDateString()}</span>
                                            <span className="text-[13px] font-black text-slate-400 font-mono tracking-tighter">{new Date(log.timestamp).toLocaleTimeString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black uppercase group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                {log.adminEmail[0]}
                                            </div>
                                            <span className="text-[11px] font-black text-slate-700 tracking-tight italic uppercase">{log.adminEmail.split('@')[0]}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black border uppercase tracking-widest ${getActionColor(log.action)}`}>
                                            {log.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] font-mono font-bold text-slate-500 truncate max-w-[120px]">{log.targetId || 'SYSTEM_GLOBAL'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg ml-auto">
                                            Inspect <Database size={12} />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminAuditLogs;
