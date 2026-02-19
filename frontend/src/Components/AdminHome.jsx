import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { base_url } from '../utils/info';
import { Users, ShieldCheck, ShieldAlert, BadgeCheck, Mail, ArrowRight, RotateCcw, AlertTriangle, Megaphone, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';
import WhatsAppAdminControl from './WhatsAppAdminControl';

const AdminHome = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeCertificates: 0,
    revokedCertificates: 0,
    totalEmployees: 0,
    contactCount: 0,
    newsletterCount: 0,
    workshopCount: 0,
    appearedCount: 0,
    liveTakingCount: 0
  });
  const [monitorData, setMonitorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const socketUrl = base_url.replace('/api', '');
    const newSocket = io(socketUrl, { auth: { token } });
    setSocket(newSocket);

    const fetchStats = async () => {
      try {
        const res = await axios.get(`${base_url}/api/admins/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    const fetchMonitorData = async () => {
      try {
        const res = await axios.get(`${base_url}/api/admins/admin/monitor`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMonitorData(res.data);
      } catch (err) {
        console.error("Error fetching monitor:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    fetchMonitorData();

    // Join Admin Monitor Room
    newSocket.on('connect', () => {
      newSocket.emit('join_admin_monitor');
    });

    // Real-time Update Listeners
    newSocket.on('student_joined', (data) => {
      fetchMonitorData();
      fetchStats();
    });

    newSocket.on('student_progress', (data) => {
      setMonitorData(prev => prev.map(s =>
        s._id === data.studentId
          ? { ...s, attemptedCount: data.attemptedCount, lastQuestion: data.currentQuestion, totalQuestions: data.totalQuestions }
          : s
      ));
    });

    newSocket.on('risk_alert', (data) => {
      setMonitorData(prev => prev.map(s =>
        s._id === data.studentId
          ? { ...s, violationCount: (s.violationCount || 0) + 1 }
          : s
      ));

      // Dynamic Toast for Admin
      Swal.fire({
        title: 'Risk Detected!',
        text: `${data.email} committed ${data.violation}`,
        icon: 'warning',
        toast: true,
        position: 'top-end',
        timer: 4000,
        showConfirmButton: false
      });
    });

    const interval = setInterval(fetchStats, 10000);

    return () => {
      clearInterval(interval);
      newSocket.disconnect();
    };
  }, []);

  const handleBroadcast = async () => {
    if (!socket) return;

    // First, let's get the active tests to choose from
    const activeTests = await axios.get(`${base_url}/api/admin/test-config/active`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });

    if (!activeTests.data || activeTests.data.length === 0) {
      Swal.fire('No Active Tests', 'There are no live exams running to broadcast to.', 'info');
      return;
    }

    const { value: formValues } = await Swal.fire({
      title: 'Group Broadcast',
      html:
        '<label class="block text-left text-[10px] font-black uppercase text-slate-400 mb-2">Select Target Test Group (Security Key)</label>' +
        `<select id="swal-test" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold mb-4">` +
        activeTests.data.map(t => `<option value="${t._id}">${t.title} (Key: ${t.testAccessKey})</option>`).join('') +
        '</select>' +
        '<label class="block text-left text-[10px] font-black uppercase text-slate-400 mb-2">Notice Message</label>' +
        '<textarea id="swal-msg" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium h-24" placeholder="Type your instruction..."></textarea>',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: '🚀 Send Broadcast',
      customClass: { popup: 'rounded-[2rem]' },
      preConfirm: () => {
        return {
          testId: document.getElementById('swal-test').value,
          message: document.getElementById('swal-msg').value
        }
      }
    });

    if (formValues && formValues.message) {
      socket.emit('send_broadcast', {
        testId: formValues.testId,
        message: formValues.message,
        type: 'announcement'
      });
      Swal.fire({ title: 'Broadcast Sent', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    }
  };

  const handleReset = async (studentId, studentName) => {
    const result = await Swal.fire({
      title: 'Reset Session?',
      text: `Are you sure you want to wipe ${studentName}'s session? They will have to restart the test from scratch.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Reset Now',
      customClass: { popup: 'rounded-3xl' }
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem('adminToken');
        await axios.post(`${base_url}/api/admins/admin/reset-test`, { studentId }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire({ title: 'Reset Complete', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
        // Data will refresh on next poll
      } catch (err) {
        Swal.fire('Error', 'Failed to reset session', 'error');
      }
    }
  };

  const statCards = [
    {
      label: 'Exam Appeared',
      value: stats.appearedCount,
      icon: Users,
      color: 'amber',
      link: '/admin-dashboard',
      desc: 'Assigned papers completed'
    },
    {
      label: 'Currently Testing',
      value: stats.liveTakingCount,
      icon: Users,
      color: 'blue',
      link: '/admin-dashboard',
      desc: 'Live active sessions'
    },
    {
      label: 'Active Certificates',
      value: stats.activeCertificates,
      icon: BadgeCheck,
      color: 'emerald',
      link: '/admin-certificates',
      desc: 'Currently valid'
    },
    {
      label: 'Revoked',
      value: stats.revokedCertificates,
      icon: ShieldAlert,
      color: 'red',
      link: '/admin-certificates',
      desc: 'Suspended records'
    },
    {
      label: 'Student Feedback',
      value: stats.feedbackCount || 0,
      icon: MessageSquare,
      color: 'pink',
      link: '/admin-feedback',
      desc: 'Reviews & insights'
    }
  ];

  const hubCards = [
    { label: 'Inquiries', value: stats.contactCount, icon: Mail, color: 'blue' },
    { label: 'Newsletter', value: stats.newsletterCount, icon: ShieldCheck, color: 'emerald' },
    { label: 'Workshops', value: stats.workshopCount, icon: Users, color: 'amber' }
  ];

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-8 md:space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">System <span className="text-blue-600">Overview</span></h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">Real-time synchronization with primary database sectors.</p>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Database Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                <stat.icon size={28} />
              </div>
              <Link to={stat.link} className="text-slate-300 hover:text-blue-600 transition-colors">
                <ArrowRight size={20} />
              </Link>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
              <p className="text-[10px] text-slate-400 mt-3 font-black uppercase tracking-widest">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Data Hub Quick View */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Data <span className="text-blue-600">Intelligence</span></h2>
          <Link to="/admin-data" className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b-2 border-blue-600/10 hover:border-blue-600 transition-all">
            Access Full Archives
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hubCards.map((hub, i) => (
            <div key={i} className="bg-slate-50/50 border border-slate-100 p-6 rounded-[2rem] flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{hub.label}</p>
                <p className="text-2xl font-black text-slate-900">{hub.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-${hub.color}-600`}>
                <hub.icon size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions & Hubs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column: Logs */}
        <div className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden group h-full flex flex-col justify-between min-h-[400px]">
          <div className="relative z-10 space-y-6 md:space-y-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 rounded-2.5xl flex items-center justify-center shadow-2xl shadow-blue-500/40">
              <Mail size={32} className="md:w-10 md:h-10" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter italic uppercase">Comms & Audit <span className="text-blue-400">Logs</span></h2>
              <p className="text-slate-400 mt-4 font-medium max-w-sm text-sm md:text-base leading-relaxed">Analyze outgoing traffic, certificate delivery status, and student OTP synchronization across all sectors.</p>
            </div>
          </div>
          <div className="relative z-10 pt-10">
            <Link to="/admin-logs" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl">
              Launch Analyzer <ArrowRight size={20} />
            </Link>
          </div>
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-blue-600/10 rounded-full blur-[100px] group-hover:bg-blue-600/20 transition-all duration-700"></div>
        </div>

        {/* Right Column: WhatsApp Control */}
        <WhatsAppAdminControl />
      </div>

      {/* Live Monitor Table */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Live <span className="text-blue-600">Assessment Monitor</span></h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time student progress tracking</p>
          </div>
          <button
            onClick={handleBroadcast}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-95"
          >
            <Megaphone size={14} /> Broadcast to Group
          </button>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black border border-blue-100">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
            REAL-TIME: SOCKET
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student / Profile</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Progress</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Violations</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Auto Score</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Time Left</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {monitorData.map((student, i) => {
                const isLive = student.testStartTime && !student.testAttempted;
                const timeLeft = student.testEndTime ? Math.max(0, Math.floor((new Date(student.testEndTime) - new Date()) / 1000)) : 0;
                const mins = Math.floor(timeLeft / 60);
                const secs = timeLeft % 60;

                return (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 text-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {student.fullName?.[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{student.fullName}</p>
                          <p className="text-[10px] font-medium text-slate-400 mb-1">{student.college}</p>
                          <div className="flex flex-wrap gap-1">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[9px] font-black uppercase tracking-tight border border-blue-100">{student.branch}</span>
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-[9px] font-black uppercase tracking-tight border border-slate-200">{student.year}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      {student.testAttempted ? (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase border border-emerald-100">Submitted</span>
                      ) : isLive ? (
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase border border-blue-100 animate-pulse">Live</span>
                      ) : (
                        <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase border border-slate-100">Waiting</span>
                      )}
                    </td>
                    <td className="px-8 py-6 w-48">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase">
                          <span className="text-slate-400">Completion</span>
                          <span className="text-blue-600">{student.totalQuestions > 0 ? Math.round(((student.attemptedCount || 0) / student.totalQuestions) * 100) : 0}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${student.testAttempted ? 'bg-emerald-500' : 'bg-blue-600'}`}
                            style={{ width: `${student.totalQuestions > 0 ? ((student.attemptedCount || 0) / student.totalQuestions) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-center text-[9px] font-bold text-slate-300 tracking-tighter">
                          {student.attemptedCount || 0} / {student.totalQuestions || 0} QUESTIONS
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black ${student.violationCount > 0 ? 'bg-red-50 text-red-600 border border-red-100 animate-pulse' : 'bg-slate-50 text-slate-300'}`}>
                        <AlertTriangle size={12} />
                        {student.violationCount || 0}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`font-black text-lg ${student.testAttempted ? 'text-blue-600' : 'text-slate-200 italic'}`}>
                        {student.testAttempted ? student.score : '--'}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center font-mono font-bold">
                      {isLive ? (
                        <span className={timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-600'}>
                          {mins}:{String(secs).padStart(2, '0')}
                        </span>
                      ) : (
                        <span className="text-slate-100">--:--</span>
                      )}
                    </td>
                    <td className="px-8 py-6 text-right">
                      {(student.testAttempted || isLive) && (
                        <button
                          onClick={() => handleReset(student._id, student.fullName)}
                          className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group/btn"
                          title="Reset Session"
                        >
                          <RotateCcw size={18} className="group-hover/btn:rotate-[-45deg] transition-transform" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {monitorData.length === 0 && (
            <div className="p-20 text-center text-slate-400 font-bold italic uppercase tracking-widest text-[10px]">
              No students found in surveillance matrix
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
