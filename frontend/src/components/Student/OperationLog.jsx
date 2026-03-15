import React from 'react';
import { Activity, Clock } from 'lucide-react';

const OperationLog = ({ student }) => {
    const logs = [
        { id: 1, action: "Login Success", time: "Just now", type: "system" },
        { id: 2, action: "Profile Photo Changed", time: "2 hours ago", type: "user" },
        { id: 3, action: "Data Saved Online", time: "5 hours ago", type: "system" },
    ];

    if (student.testAttempted) {
        logs.unshift({ id: 0, action: "Exam Completed", time: "Recent", type: "result" });
    }

    return (
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                    <Activity size={14} className="text-blue-600" /> Activity Log
                </h3>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </div>

            <div className="space-y-4">
                {logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                        <div className={`p-2.5 rounded-xl ${
                            log.type === 'result' ? 'bg-emerald-50 text-emerald-600' : 
                            log.type === 'system' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                        }`}>
                            <Clock size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-800 tracking-tight line-clamp-1 uppercase italic">{log.action}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">{log.time}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full py-4 text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] border-t border-slate-50 hover:bg-slate-50 transition-all rounded-b-2xl">
                View Detailed Logs
            </button>
        </div>
    );
};

export default OperationLog;
