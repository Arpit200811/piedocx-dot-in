import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { base_url, getSocketUrl } from '../utils/info';
import { Users, ShieldCheck, ShieldAlert, BadgeCheck, Mail, ArrowRight, RotateCcw, AlertTriangle, Megaphone, MessageSquare, Wifi, WifiOff, X } from 'lucide-react';
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
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [selectedConfigId, setSelectedConfigId] = useState(null);
  const [fetchingAnalytics, setFetchingAnalytics] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const socketUrl = getSocketUrl();
    const newSocket = io(socketUrl, { auth: { token } });
    setSocket(newSocket);

    const fetchStats = async () => {
      try {
        const res = await api.get(`/api/admin/stats`);
        setStats(res);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    const fetchMonitorData = async () => {
      try {
        const res = await api.get(`/api/admin/monitor`);
        setMonitorData(res);
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

    const fetchAnalytics = async (configId) => {
        if (!configId) return;
        setFetchingAnalytics(true);
        try {
            const res = await api.get(`/api/admin/question-analytics/${configId}`);
            setAnalyticsData(res);
            setShowAnalytics(true);
        } catch (err) {
            Swal.fire('Error', 'Failed to fetch analytics', 'error');
        } finally {
            setFetchingAnalytics(false);
        }
    };
    window._fetchAnalytics = fetchAnalytics; // Expose for internal click


    // Real-time Update Listeners
    newSocket.on('student_joined', (data) => {
      fetchMonitorData();
      fetchStats();
    });

    newSocket.on('batch_progress_update', (data) => {
      setMonitorData(prev => {
        let newData = [...prev];
        data.updates.forEach(update => {
          newData = newData.map(s =>
            s._id === update.studentId
              ? { 
                  ...s, 
                  attemptedCount: update.attemptedCount, 
                  lastQuestion: update.currentQuestion, 
                  totalQuestions: update.totalQuestions,
                  score: update.score
                }
              : s
          );
        });
        return newData;
      });
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
    const activeTests = await api.get(`/api/admin/test-config/active`);

    if (!activeTests || activeTests.length === 0) {
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

  const handleWarnStudent = async (studentId, studentName) => {
    const { value: message } = await Swal.fire({
      title: `Warn ${studentName}`,
      input: 'textarea',
      inputLabel: 'Warning Message',
      inputPlaceholder: 'Type your warning here, e.g., Please face the camera...',
      inputAttributes: {
        'aria-label': 'Type your warning here'
      },
      showCancelButton: true,
      confirmButtonText: 'Send Warning',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      }
    });

    if (message && socket) {
      socket.emit('admin_warn_student', { studentId, message });
      Swal.fire({ title: 'Warning Sent', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
    }
  };

  const [filter, setFilter] = useState({ search: '', branch: 'All', year: 'All' });

  const handleViewDetails = async (studentId) => {
    try {
      Swal.fire({ title: 'Loading details...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const res = await api.get(`/api/admin/student-test-detail/${studentId}`);
      
      const questionsHtml = res.questions.map((q, idx) => `
        <div class="mb-6 p-4 rounded-2xl border ${q.isCorrect ? 'border-emerald-100 bg-emerald-50/30' : 'border-red-100 bg-red-50/30'} text-left">
          <p class="text-[10px] font-black text-slate-400 uppercase mb-2">Question ${idx+1}</p>
          <p class="text-xs font-bold text-slate-900 mb-3">${q.questionText}</p>
          <div class="space-y-2">
            ${q.options.map(opt => `
              <div class="text-[11px] p-2 rounded-lg border ${opt === q.correctAnswer ? 'bg-emerald-500 text-white border-emerald-500' : (opt === q.studentAnswer ? 'bg-red-500 text-white border-red-500' : 'bg-white border-slate-200 text-slate-500')}">
                ${opt} ${opt === q.correctAnswer ? ' (✔ Correct)' : (opt === q.studentAnswer ? ' (✘ Your Choice)' : '')}
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');

      Swal.fire({
        title: `${res.fullName}'s Submission Detail`,
        html: `<div class="p-2 overflow-y-auto max-h-[600px]">${questionsHtml}</div>`,
        width: '800px',
        confirmButtonText: 'Done',
        customClass: { popup: 'rounded-[3rem]' }
      });
    } catch (err) {
      Swal.fire('Error', 'Failed to fetch details', 'error');
    }
  };

  const handleShowViolations = (student) => {
    if (!student.violationHistory || student.violationHistory.length === 0) {
      Swal.fire('Safe', 'No security violations recorded for this student.', 'success');
      return;
    }

    const historyHtml = `
      <div class="text-left font-sans p-4 max-h-[300px] overflow-y-auto">
        ${student.violationHistory.map(v => `
          <div class="mb-3 pb-3 border-b border-slate-100">
            <p class="text-[11px] font-black text-slate-400 uppercase mb-1">${new Date(v.timestamp).toLocaleString()}</p>
            <p class="text-xs font-bold text-red-600">${v.reason}</p>
          </div>
        `).join('')}
      </div>
    `;

    Swal.fire({
      title: 'Security Violation Log',
      html: historyHtml,
      confirmButtonText: 'Acknowledged',
      customClass: { popup: 'rounded-[2rem]' }
    });
  };

  const handleReset = async (studentId, studentName, hasViolations = false) => {
    const result = await Swal.fire({
      title: hasViolations ? 'Grant Security Pardon?' : 'Reset Session?',
      text: hasViolations 
        ? `Student ${studentName} was terminated due to violations. Giving permission will clear their history and let them start fresh.`
        : `Are you sure you want to wipe ${studentName}'s session? They will have to restart the test from scratch.`,
      icon: hasViolations ? 'shield-check' : 'warning',
      showCancelButton: true,
      confirmButtonColor: hasViolations ? '#2563eb' : '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: hasViolations ? 'Yes, Authorize Retake' : 'Yes, Reset Now',
      customClass: { popup: 'rounded-3xl' }
    });

    if (result.isConfirmed) {
      try {
        await api.post(`/api/admin/reset-test`, { studentId });
        Swal.fire({ title: 'Reset Complete', icon: 'success', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
        // Data will refresh on next poll
      } catch (err) {
        Swal.fire('Error', 'Failed to reset session', 'error');
      }
    }
  };

  const statCards = [
    {
      label: 'Total Registered',
      value: stats.totalStudents,
      icon: Users,
      color: 'indigo',
      link: '/admin-certificates',
      desc: 'Overall student list'
    },
    {
      label: 'Exam Appeared',
      value: stats.appearedCount,
      icon: Users,
      color: 'amber',
      link: '/admin-dashboard',
      desc: 'Full exams submitted'
    },
    {
      label: 'Currently Testing',
      value: stats.liveTakingCount,
      icon: Users,
      color: 'blue',
      link: '/admin-dashboard',
      desc: 'In-progress exams'
    },
    {
      label: 'Active Certificates',
      value: stats.activeCertificates,
      icon: BadgeCheck,
      color: 'emerald',
      link: '/admin-certificates',
      desc: 'Valid certificates issued'
    },
    {
      label: 'Revoked',
      value: stats.revokedCertificates,
      icon: ShieldAlert,
      color: 'red',
      link: '/admin-certificates',
      desc: 'Blocked or invalid'
    },
    {
      label: 'Student Feedback',
      value: stats.feedbackCount || 0,
      icon: MessageSquare,
      color: 'pink',
      link: '/admin-feedback',
      desc: 'Student opinions & ratings'
    }
  ];

  const hubCards = [
    { label: 'Inquiries', value: stats.contactCount, icon: Mail, color: 'blue' },
    { label: 'Newsletter', value: stats.newsletterCount, icon: ShieldCheck, color: 'emerald' },
    { label: 'Workshops', value: stats.workshopCount, icon: Users, color: 'amber' }
  ];

  const filteredMonitorData = monitorData.filter(student => {
    const matchesSearch = !filter.search || 
      student.fullName?.toLowerCase().includes(filter.search.toLowerCase()) || 
      student.email?.toLowerCase().includes(filter.search.toLowerCase()) ||
      student.studentId?.toLowerCase().includes(filter.search.toLowerCase());
    
    const matchesBranch = filter.branch === 'All' || student.branch === filter.branch;
    const matchesYear = filter.year === 'All' || student.year === filter.year;
    
    return matchesSearch && matchesBranch && matchesYear;
  });

  const branches = ['All', ...new Set(monitorData.map(s => s.branch).filter(Boolean))];
  const years = ['All', ...new Set(monitorData.map(s => s.year).filter(Boolean))];

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-6 md:p-8 lg:p-12 space-y-8 md:space-y-12 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Main <span className="text-blue-600">Dashboard</span></h1>
          <p className="text-slate-500 font-medium mt-1 text-sm md:text-base">All your student data and exam status in one place.</p>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">System Working</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white p-4 sm:p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                  stat.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                    stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                      stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                        stat.color === 'red' ? 'bg-red-50 text-red-600' :
                          stat.color === 'pink' ? 'bg-pink-50 text-pink-600' :
                            'bg-slate-50 text-slate-600'
                }`}>
                <stat.icon size={24} className="sm:w-7 sm:h-7" />
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
          <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Quick <span className="text-blue-600">Summary</span></h2>
          <Link to="/admin-data" className="text-[10px] font-black text-blue-600 uppercase tracking-widest border-b-2 border-blue-600/10 hover:border-blue-600 transition-all">
            See All Records
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
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
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter italic uppercase">Email & System <span className="text-blue-400">History</span></h2>
              <p className="text-slate-400 mt-4 font-medium max-w-sm text-sm md:text-base leading-relaxed">Check sent emails, certificate status, and system activity logs here.</p>
            </div>
          </div>
          <div className="relative z-10 pt-10">
            <Link to="/admin-audit" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 hover:text-white transition-all shadow-xl">
              Open Logs <ArrowRight size={20} />
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
            <h2 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic">Live <span className="text-blue-600">Exam Tracking</span></h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">See what students are doing in the exam right now</p>
          </div>
          <div className="flex items-center gap-4">
            <input 
              type="text" 
              placeholder="Search Student..." 
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-600/20"
            />
            <select
              value={filter.branch}
              onChange={(e) => setFilter(prev => ({ ...prev, branch: e.target.value }))}
              className="px-4 py-1.5 bg-white border border-slate-200 rounded-xl text-[10px] font-bold outline-none"
            >
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-end">
            <button
              onClick={handleBroadcast}
              className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-lg active:scale-95"
            >
              <Megaphone size={14} /> Broadcast to Group
            </button>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black border border-blue-100">
              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse"></div>
              ONLINE NOW
            </div>
            {filteredMonitorData.length > 0 && monitorData[0]?.testId && (
                <button
                    onClick={() => window._fetchAnalytics(monitorData[0].testId)}
                    className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 transition-all shadow-lg"
                >
                    <ArrowRight size={14} /> View Test Heatmap
                </button>
            )}
          </div>
        </div>

        <div className="block lg:hidden divide-y divide-slate-100">
          {filteredMonitorData.map((student, i) => {
            const isLive = student.testStartTime && !student.testAttempted;
            const timeLeft = student.testEndTime ? Math.max(0, Math.floor((new Date(student.testEndTime) - new Date()) / 1000)) : 0;
            const mins = Math.floor(timeLeft / 60);
            const secs = timeLeft % 60;
            const progress = student.totalQuestions > 0 ? Math.round(((student.attemptedCount || 0) / student.totalQuestions) * 100) : 0;

            return (
              <div key={i} className="p-6 space-y-4 bg-white hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xs">
                      {student.fullName?.[0]}
                    </div>
                    <div>
                       <div className="flex items-center gap-2">
                         <h4 className="font-black text-slate-900 text-sm italic uppercase tracking-tight">{student.fullName}</h4>
                         {isLive && (
                             student.isOnline 
                                 ? <Wifi size={10} className="text-emerald-500" /> 
                                 : <WifiOff size={10} className="text-red-400" />
                         )}
                       </div>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.college}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {student.testAttempted ? (
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-md text-[8px] font-black uppercase border border-emerald-100 italic">Submitted</span>
                    ) : isLive ? (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[8px] font-black uppercase border border-blue-100 animate-pulse italic">Live Exam</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-slate-50 text-slate-400 rounded-md text-[8px] font-black uppercase border border-slate-100 italic">Waiting</span>
                    )}
                    {isLive && (
                      <div className={`text-xs font-mono font-black ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}>
                        {mins}:{String(secs).padStart(2, '0')}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Progress</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full ${student.testAttempted ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${progress}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black text-slate-900">{progress}%</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Score / Safety</p>
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-black text-sm text-blue-600">{student.score || 0}</span>
                      <div 
                        onClick={() => handleShowViolations(student)}
                        className={`flex items-center gap-1 text-[10px] font-black cursor-pointer hover:underline ${student.violationCount > 0 ? 'text-red-600' : 'text-slate-300'}`}
                      >
                        <AlertTriangle size={10} /> {student.violationCount || 0}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold uppercase">{student.branch}</span>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold uppercase">{student.year}</span>
                  </div>
                  {((student.testAttempted || isLive) && !student.isLegacy) && (
                    <div className="flex gap-2 w-full mt-2">
                      <button
                        onClick={() => handleViewDetails(student._id)}
                        className="flex-1 flex items-center justify-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-lg transition-all"
                      >
                        Details
                      </button>
                      {isLive && (
                        <button
                            onClick={() => handleWarnStudent(student._id, student.fullName)}
                            className="flex-1 flex items-center justify-center gap-1 text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1.5 rounded-lg transition-all"
                        >
                            <Megaphone size={12} /> Warn
                        </button>
                      )}
                      <button
                        onClick={() => handleReset(student._id, student.fullName, (student.violationCount || 0) > 0)}
                        className="flex-1 flex items-center justify-center gap-1 text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-50 px-3 py-1.5 rounded-lg transition-all"
                      >
                        <RotateCcw size={12} /> Reset
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student Info</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Progress</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Security Alerts</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Live Score</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Time Left</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMonitorData.map((student, i) => {
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
                          <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            {student.fullName}
                            {isLive && (
                              student.isOnline 
                                ? <Wifi size={12} className="text-emerald-500" title="Connected" /> 
                                : <WifiOff size={12} className="text-red-400" title="Disconnected" />
                            )}
                          </p>
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
                      <div 
                        onClick={() => handleShowViolations(student)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black cursor-pointer hover:bg-red-100 transition-all ${student.violationCount > 0 ? 'bg-red-50 text-red-600 border border-red-100 animate-pulse' : 'bg-slate-50 text-slate-300'}`}
                      >
                        <AlertTriangle size={12} />
                        {student.violationCount || 0}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`font-black text-lg ${student.testAttempted ? 'text-emerald-600' : 'text-blue-600 italic'}`}>
                        {student.score || 0}
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
                      <div className="flex items-center justify-end gap-2">
                        {((student.testAttempted || isLive) && !student.isLegacy) && (
                          <button
                            onClick={() => handleViewDetails(student._id)}
                            className="p-2.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                            title="View Detailed Answers"
                          >
                            <Users size={18} />
                          </button>
                        )}
                        {isLive && (
                          <button
                            onClick={() => handleWarnStudent(student._id, student.fullName)}
                            className="p-2.5 text-amber-500 hover:text-white hover:bg-amber-500 rounded-xl transition-all"
                            title="Send Warning Message"
                          >
                            <Megaphone size={18} />
                          </button>
                        )}
                        {(student.testAttempted || isLive) && (
                          <button
                            onClick={() => handleReset(student._id, student.fullName, (student.violationCount || 0) > 0)}
                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all group/btn"
                            title="Reset Session"
                          >
                            <RotateCcw size={18} className="group-hover/btn:rotate-[-45deg] transition-transform" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {monitorData.length === 0 && (
          <div className="p-20 text-center text-slate-400 font-bold italic uppercase tracking-widest text-[10px]">
            No students are currently taking the exam.
          </div>
        )}
      </div>
      {/* ANALYTICS HEATMAP MODAL */}
      {showAnalytics && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border border-slate-100 animate-in zoom-in duration-300">
                  <div className="p-8 sm:p-12 bg-slate-900 text-white flex justify-between items-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]"></div>
                      <div className="relative z-10">
                          <h3 className="text-3xl font-black italic uppercase tracking-tighter">Question <span className="text-blue-500">Analytics</span></h3>
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Real-time Difficulty & Accuracy Heatmap</p>
                      </div>
                      <button onClick={() => setShowAnalytics(false)} className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all relative z-10">
                          <X size={24} />
                      </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                      {analyticsData.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {analyticsData.map((item, idx) => (
                                  <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-xl transition-all group">
                                      <div className="flex justify-between items-start mb-4">
                                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                              item.status === 'EASY' ? 'bg-emerald-100 text-emerald-600' :
                                              item.status === 'MEDIUM' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                                          }`}>
                                              {item.status}
                                          </span>
                                          <span className="text-xs font-black text-slate-400">#{idx + 1}</span>
                                      </div>
                                      <p className="text-sm font-bold text-slate-800 line-clamp-2 mb-6 leading-relaxed">
                                          {item.text}
                                      </p>
                                      
                                      <div className="space-y-4">
                                          <div className="flex justify-between items-end">
                                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accuracy</span>
                                              <span className={`text-xl font-black italic ${item.accuracy > 70 ? 'text-emerald-500' : item.accuracy > 40 ? 'text-amber-500' : 'text-red-500'}`}>
                                                  {item.accuracy}%
                                              </span>
                                          </div>
                                          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                                              <div 
                                                className={`h-full transition-all duration-1000 ${item.accuracy > 70 ? 'bg-emerald-500' : item.accuracy > 40 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                style={{ width: `${item.accuracy}%` }}
                                              ></div>
                                          </div>
                                          <p className="text-[9px] font-black text-slate-500 text-right uppercase tracking-[0.2em]">{item.totalAttempts} Students Attempted</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                      ) : (
                          <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                              <AlertTriangle size={64} className="mb-6 text-slate-300" />
                              <h4 className="text-xl font-black uppercase italic tracking-widest text-slate-400">No Analytics Data Available</h4>
                              <p className="text-xs font-bold text-slate-300 mt-2">Finish some tests to see the magic happen.</p>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminHome;
