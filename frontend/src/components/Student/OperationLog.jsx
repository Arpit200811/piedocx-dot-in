import React from 'react';
import { Activity, Clock, ShieldAlert, ShieldCheck } from 'lucide-react';

const OperationLog = ({ student }) => {
    // Dynamically map real security violations instead of hardcoded mock data
    const logs = (student.violationHistory || []).slice(-4).reverse();

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                    <Activity size={14} className="text-blue-600" /> Security Logs
                </h3>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>

            <div className="space-y-4">
                {logs.length > 0 ? logs.map((log, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                        <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                            <ShieldAlert size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-800 tracking-tight line-clamp-1 uppercase italic">{log.reason}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                                {new Date(log.timestamp).toLocaleString()}
                            </p>
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-3">
                            <ShieldCheck size={20} />
                        </div>
                        <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">No Security Alerts</p>
                        <p className="text-[9px] font-bold text-slate-300 mt-1">Clean Record</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OperationLog;
