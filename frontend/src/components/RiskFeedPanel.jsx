
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { ShieldAlert, Activity, UserX, MonitorOff, MousePointer2 } from 'lucide-react';
import { base_url } from '../utils/info';

const RiskFeedPanel = () => {
  const [logs, setLogs] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    const socketUrl = base_url.replace('/api', '');
    const socket = io(socketUrl, {
      auth: { token }
    });

    socket.on('connect', () => {
      setConnectionStatus('Live Monitor Active');
      socket.emit('join_admin_monitor');
    });

    socket.on('disconnect', () => setConnectionStatus('Reconnecting...'));

    socket.on('risk_alert', (data) => {
      setLogs(prev => [{
        id: Date.now(),
        type: 'risk',
        student: data.email,
        violation: data.violation,
        score: data.riskScore,
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 50)); // Keep only last 50
    });

    socket.on('student_joined', (data) => {
        setLogs(prev => [{
            id: Date.now(),
            type: 'info',
            student: data.email,
            violation: 'Joined Exam Session',
            score: 0,
            time: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 50));
    });

    return () => socket.disconnect();
  }, []);

  const getRiskColor = (score) => {
    if (score > 80) return 'bg-red-500 text-white';
    if (score > 40) return 'bg-amber-500 text-white';
    return 'bg-emerald-500 text-white';
  };

  const getIcon = (violation) => {
      if (violation.includes('Tab')) return <MonitorOff size={16} />;
      if (violation.includes('Mouse')) return <MousePointer2 size={16} />;
      if (violation.includes('Joined')) return <Activity size={16} />;
      return <ShieldAlert size={16} />;
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl h-[500px] flex flex-col">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
        <h3 className="font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
            <Activity className="text-blue-600 animate-pulse" /> Live Risk Feed
        </h3>
        <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${connectionStatus.includes('Active') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
            {connectionStatus}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {logs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-2">
                <Activity size={48} />
                <p className="text-xs font-bold uppercase tracking-widest">Waiting for activity...</p>
            </div>
        )}

        {logs.map(log => (
            <div key={log.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:scale-[1.02] transition-transform">
                <div className={`p-3 rounded-xl ${log.type === 'risk' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                    {getIcon(log.violation)}
                </div>
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-black text-slate-700">{log.student}</span>
                        <span className="text-[10px] font-mono text-slate-400">{log.time}</span>
                    </div>
                    <p className="text-xs font-medium text-slate-500">{log.violation}</p>
                </div>
                {log.score > 0 && (
                    <div className={`px-2 py-1 rounded-lg text-[10px] font-black ${getRiskColor(log.score)}`}>
                        {log.score}
                    </div>
                )}
            </div>
        ))}
      </div>
      
      <style>{`
         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
         .custom-scrollbar::-webkit-scrollbar-track { bg: transparent; }
         .custom-scrollbar::-webkit-scrollbar-thumb { bg: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default RiskFeedPanel;
