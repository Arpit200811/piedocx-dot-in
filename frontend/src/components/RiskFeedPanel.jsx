import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { ShieldAlert, Activity, UserX, MonitorOff, MousePointer2, AlertCircle, Ban, Send, RotateCcw } from 'lucide-react';
import { getSocketUrl } from '../utils/info';
import api from '../utils/api';
import Swal from 'sweetalert2';

const RiskFeedPanel = () => {
  const [logs, setLogs] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) return;

    const socketUrl = getSocketUrl();
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
        studentId: data.studentId,
        student: data.email,
        violation: data.violation,
        score: data.riskScore,
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 50));
    });

    socket.on('student_joined', (data) => {
      setLogs(prev => [{
        id: Date.now(),
        type: 'info',
        studentId: data.studentId,
        student: data.email,
        violation: 'Joined Exam Session',
        score: 0,
        time: new Date().toLocaleTimeString()
      }, ...prev].slice(0, 50));
    });

    socketRef.current = socket;
    return () => socket.disconnect();
  }, []);

  const handleTerminate = (studentId, email) => {
    Swal.fire({
      title: 'Force Terminate Session?',
      text: `Student ${email} will be kicked out immediately.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, Terminate'
    }).then((result) => {
      if (result.isConfirmed && socketRef.current) {
        socketRef.current.emit('admin_terminate_student', { studentId, reason: 'Manually terminated by Admin for suspicious activity.' });
        Swal.fire('Action Sent', 'The session termination signal was broadcast.', 'success');
      }
    });
  };

  const handleReset = async (studentId, studentName) => {
    const result = await Swal.fire({
      title: 'Authorize Retake?',
      text: `Confirming this for ${studentName} will wipe their previous progress and violations, allowing them to re-attempt the exam.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'Yes, Grant Retake',
      customClass: { popup: 'rounded-3xl' }
    });

    if (result.isConfirmed) {
      try {
        await api.post(`/api/admin/reset-test`, { studentId });
        Swal.fire({ title: 'System Updated', text: 'Student may now restart the session.', icon: 'success' });
      } catch (err) {
        Swal.fire('Error', 'Failed to update system permissions.', 'error');
      }
    }
  };

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
    <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-2xl h-[600px] flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="flex items-center justify-between mb-8 border-b border-slate-50 pb-6 relative z-10">
        <div>
           <h3 className="font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-2 text-xl">
             <Activity className="text-blue-600 animate-pulse" /> Intelligence <span className="text-blue-600">Feed</span>
           </h3>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Real-time Risk Analysis Engine</p>
        </div>
        <span className={`text-[9px] font-black px-4 py-2 rounded-xl transition-all uppercase tracking-widest ${connectionStatus.includes('Active') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
          {connectionStatus}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar relative z-10">
        {logs.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200">
                <Activity size={40} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-[0.3em] animate-pulse">Scanning Grid...</p>
          </div>
        )}

        {logs.map(log => (
          <div key={log.id} className="group relative flex items-start gap-5 p-5 rounded-[2rem] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`p-4 rounded-2xl shrink-0 ${log.type === 'risk' ? 'bg-red-100 text-red-600 shadow-inner' : 'bg-blue-100 text-blue-600'}`}>
              {getIcon(log.violation)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight truncate max-w-[150px]">{log.student}</span>
                <span className="text-[9px] font-black text-slate-400 font-mono tracking-widest uppercase">{log.time}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wide leading-tight">{log.violation}</p>
              
              {/* Quick Actions (Visible on hover) */}
              {log.type === 'risk' && (
                <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={() => handleTerminate(log.studentId, log.student)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg"
                   >
                     <Ban size={12} /> Force Kill
                   </button>
                   <button 
                     onClick={() => handleReset(log.studentId, log.student)}
                     className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg"
                   >
                     <RotateCcw size={12} /> Grant Retake
                   </button>
                   <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg">
                     <AlertCircle size={12} /> Investigate
                   </button>
                </div>
              )}
            </div>
            {log.score > 0 && (
              <div className={`px-4 py-2 rounded-xl text-[10px] font-black shadow-lg ${getRiskColor(log.score)}`}>
                {log.score}
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
         .custom-scrollbar::-webkit-scrollbar-track { bg: transparent; }
         .custom-scrollbar::-webkit-scrollbar-thumb { bg: #e2e8f0; border-radius: 20px; }
         .custom-scrollbar::-webkit-scrollbar-thumb:hover { bg: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default RiskFeedPanel;
