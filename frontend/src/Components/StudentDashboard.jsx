import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, BookOpen, Award, Download, User, 
    LogOut, Search, Clock, ChevronRight, CheckCircle2,
    FileText, ExternalLink, Activity, Info, Bell, ShieldCheck,
    Phone, Mail, GraduationCap, Building2, Calendar, Camera, UploadCloud,
    QrCode, MapPin, Menu, X, Trophy, TrendingUp, Zap
} from 'lucide-react';
import SEO from './SEO';
import { base_url } from '../utils/info';
import { getYearGroup, getBranchGroup } from '../utils/branchMapping';
import Swal from 'sweetalert2';
import { useStudentAuth } from '../context/StudentAuthContext';
import { useLocation } from 'react-router-dom';

// Custom SVG Donut Chart Component
const SimpleDonut = ({ score, total = 30 }) => {
    const percentage = Math.min(100, Math.max(0, (score / total) * 100));
    const strokeWidth = 8;
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90">
                <circle cx="56" cy="56" r={radius} fill="transparent" stroke="#e2e8f0" strokeWidth={strokeWidth} />
                <motion.circle
                    cx="56" cy="56" r={radius} fill="transparent" stroke="#2563eb" strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xl font-bold text-slate-800 leading-none">{score}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase mt-1">Score</span>
            </div>
        </div>
    );
};

const StudentDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { student, setStudent, logout: authLogout } = useStudentAuth();
    const fileInputRef = useRef(null);

    const getActiveTabFromPath = () => {
        const path = location.pathname;
        if (path.endsWith('/exams')) return 'exams';
        if (path.endsWith('/resources')) return 'resources';
        if (path.endsWith('/certificates')) return 'certificates';
        if (path.endsWith('/profile')) return 'profile';
        return 'dashboard';
    };

    const activeTab = getActiveTabFromPath();
    const [testInfo, setTestInfo] = useState(null);
    const [loading, setLoading] = useState(false); // Context handles initial loading
    const [announcements, setAnnouncements] = useState([]);
    const [studyResources, setStudyResources] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        // fetchProfile(); // No longer needed, handled by AuthContext
        fetchTestInfo();
        fetchBulletins();
        fetchResources();
    }, []);

    const fetchBulletins = async () => {
        try {
            const res = await axios.get(`${base_url}/api/student-auth/bulletins`);
            setAnnouncements(res.data);
        } catch (err) {
            console.log("Bulletins fetch failed");
        }
    };

    const fetchResources = async () => {
        try {
            const res = await axios.get(`${base_url}/api/student-auth/resources`);
            setStudyResources(res.data);
        } catch (err) {
            console.log("Resources fetch failed");
        }
    };

    const handleLogout = () => {
        authLogout();
        navigate('/student-login', { replace: true });
    };

    const fetchTestInfo = async () => {
        try {
            const token = localStorage.getItem('studentToken');
            const res = await axios.get(`${base_url}/api/student-auth/test-info`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTestInfo(res.data);
        } catch (err) {
            console.log("No test info found");
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            Swal.fire({ icon: 'error', title: 'File too large', text: 'Please upload a photo under 1MB.' });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64String = reader.result;
            try {
                const token = localStorage.getItem('studentToken');
                await axios.post(`${base_url}/api/student-auth/update-profile`, 
                    { profilePicture: base64String },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setStudent(prev => ({ ...prev, profilePicture: base64String }));
                Swal.fire({ icon: 'success', title: 'Profile Updated', text: 'Your photo has been uploaded successfully.' });
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Upload Failed', text: 'Something went wrong while saving your photo.' });
            }
        };
        reader.readAsDataURL(file);
    };

    if (loading) return null; // Loading handled by ProtectedRoute

    if (!student) return null;

    return (
        <div className="flex-1 flex flex-col min-w-0">
            <SEO title="Student Dashboard | Piedocx" />

            {/* Global Broadcast Banner */}
            <div className="bg-blue-600 mx-auto w-full rounded-[2rem] p-3 mb-8 overflow-hidden relative border border-blue-500 shadow-2xl shadow-blue-600/20">
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-white italic h-6">
                    <span className="bg-white/20 px-3 py-1 rounded-full text-white font-black not-italic border border-white/20 flex items-center gap-2">
                        <Bell size={12} className="animate-bounce" /> Broadcast
                    </span>
                    <div className="flex-1 overflow-hidden relative">
                        <motion.div animate={{ x: ["100%", "-100%"] }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }} className="absolute whitespace-nowrap opacity-70">
                            {announcements.length > 0 ? announcements.map(a => a.text).join(" • ") : "Welcome to the new PIEDOCX Assessment Infrastructure. System Status: All Systems Operational • Security Protocols: Active"}
                        </motion.div>
                    </div>
                </div>
            </div>

            <main className="flex-1">
                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && (
                        <motion.div 
                            key="dashboard" 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -20 }} 
                            className="space-y-10"
                        >
                            {/* Hero Dashboard Section */}
                            <div className="bg-white rounded-[3.5rem] p-10 md:p-16 relative overflow-hidden group shadow-2xl border border-blue-50">
                                <div className="absolute top-0 right-0 w-[40%] h-full bg-gradient-to-l from-blue-100/40 to-transparent"></div>
                                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-100/40 rounded-full blur-[80px]"></div>
                                
                                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                                            <span className="text-xs font-black text-blue-400 uppercase tracking-[0.4em]">Student Terminal</span>
                                        </div>
                                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 italic uppercase tracking-tighter leading-tight">
                                            Welcome Back, <span className="text-blue-600">{student.firstName}</span>.
                                        </h1>
                                        <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl font-medium opacity-80">
                                            {student.testAttempted 
                                                ? "Your assessment cycle is complete. Your verified scores and performance breakdown are available below." 
                                                : "Final preparations for your scheduled assessment are complete. Please ensure a stable connection before proceeding."
                                            }
                                        </p>
                                        
                                        <div className="flex flex-wrap gap-4 pt-4">
                                            {student.testAttempted ? (
                                                <button 
                                                    onClick={() => navigate('/student-results')} 
                                                    className="px-10 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-xs uppercase italic tracking-[0.2em] shadow-2xl hover:bg-blue-600 hover:text-white transition-all flex items-center gap-3 group border-none"
                                                >
                                                    Analysis Report <Trophy size={18} className="group-hover:scale-125 transition-transform" />
                                                </button>
                                            ) : (
                                                <button 
                                                    onClick={() => navigate('/student-dashboard/exams')} 
                                                    className="px-10 py-5 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase italic tracking-[0.2em] shadow-2xl shadow-blue-600/30 hover:bg-blue-500 transition-all flex items-center gap-3 group border-none"
                                                >
                                                    Start Assessment <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="w-full lg:w-96 bg-blue-50/50 backdrop-blur-3xl rounded-[3rem] p-8 border border-blue-100 shadow-inner group">
                                         <div className="flex flex-col items-center gap-6">
                                             <div className="relative">
                                                 <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-2xl animate-pulse"></div>
                                                 <SimpleDonut score={student.score || 0} />
                                             </div>
                                             <div className="text-center">
                                                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-2 italic leading-none">Global Status</p>
                                                 <p className={`text-xl font-black uppercase italic tracking-tight ${student.testAttempted ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                     {student.testAttempted ? 'Verified' : 'Assessment Pending'}
                                                 </p>
                                                 <div className="mt-6 w-56 mx-auto">
                                                     <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">
                                                         <span>Efficiency</span>
                                                         <span>{Math.round(((student.score || 0)/30)*100)}%</span>
                                                     </div>
                                                      <div className="w-full bg-blue-50 h-1 rounded-full overflow-hidden">
                                                          <motion.div initial={{ width: 0 }} animate={{ width: `${((student.score || 0)/30)*100}%` }} className="bg-blue-600 h-full shadow-[0_0_15px_#2563eb]" />
                                                      </div>
                                                 </div>
                                             </div>
                                         </div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity and Info Grid */}
                            <div className="grid lg:grid-cols-3 gap-10">
                                {/* Operation Log */}
                                <div className="lg:col-span-2 bg-white rounded-[3.5rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden hover-lift">
                                    <div className="flex items-center justify-between mb-10">
                                        <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] flex items-center gap-3 italic">
                                            <Activity size={18} /> Operation Log
                                        </h3>
                                        <TrendingUp size={20} className="text-slate-200" />
                                    </div>
                                    
                                    <div className="space-y-5">
                                        {[
                                            { msg: 'System Interface Synchronized', time: 'ACTIVE', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
                                            { msg: student.testAttempted ? 'Final Submission Verified' : 'Awaiting Student Input', time: '2H AGO', icon: Info, color: student.testAttempted ? 'text-emerald-600' : 'text-amber-600', bg: student.testAttempted ? 'bg-emerald-50' : 'bg-amber-50' },
                                            { msg: 'Login Credentials Validated', time: 'SESSION START', icon: CheckCircle2, color: 'text-slate-400', bg: 'bg-slate-50' }
                                        ].map((log, i) => (
                                            <motion.div 
                                                key={i} 
                                                whileHover={{ x: 10 }}
                                                className="flex items-center justify-between p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem] transition-all group hover:bg-white hover:shadow-xl hover:border-slate-200"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className={`w-14 h-14 rounded-2.5xl flex items-center justify-center ${log.bg} shadow-sm border border-white/50 group-hover:scale-110 transition-transform`}>
                                                        <log.icon size={22} className={log.color} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic opacity-60">Status Update</p>
                                                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight italic leading-none">{log.msg}</span>
                                                    </div>
                                                </div>
                                                <span className="text-[9px] font-black text-slate-300 uppercase italic tracking-widest bg-slate-100 px-3 py-1 rounded-full">{log.time}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Info & Support */}
                                <div className="space-y-8">
                                    <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border border-slate-100 flex flex-col hover-lift">
                                        <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-10 italic">Academic Profile</h3>
                                        <div className="space-y-8 flex-1">
                                            <div className="flex items-start gap-6 group">
                                                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all"><Building2 size={22}/></div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none mb-2 italic">Institutional</p>
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-snug italic">{student.college}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-6 group">
                                                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all"><GraduationCap size={22}/></div>
                                                <div>
                                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none mb-2 italic">Stream • Year</p>
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight leading-snug italic">{student.branch} • Y{student.year}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => navigate('/student-dashboard/profile')} className="w-full mt-10 h-14 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] transition-all border border-slate-100 italic">
                                            Manage Profile
                                        </button>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[3rem] p-8 text-white shadow-2xl relative overflow-hidden group hover-lift">
                                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                                        <div className="relative z-10 flex flex-col justify-between h-full">
                                            <div>
                                                <h4 className="font-black text-[10px] uppercase italic tracking-widest mb-1 text-blue-100">Support Terminal</h4>
                                                <p className="text-sm font-black uppercase italic tracking-tighter">System Issues?</p>
                                            </div>
                                            <button className="w-full h-11 mt-6 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all border border-white/20 italic">
                                                Open Ticket
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'exams' && (
                        <motion.div key="exams" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-4xl">
                            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-10 flex items-center gap-4">
                                <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg"><BookOpen size={20}/></span>
                                Assessment Nodes Available
                            </h2>
                            {testInfo ? (
                                <div className="bg-white p-12 rounded-[3.5rem] border border-slate-200 shadow-2xl relative overflow-hidden group hover-lift">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-10 relative z-10">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 bg-green-50 text-green-600 text-[9px] font-black uppercase tracking-widest rounded-full border border-green-100">Live Server</span>
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic leading-none opacity-60">{testInfo.branchGroup} Node</span>
                                            </div>
                                            <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{testInfo.title}</h3>
                                            <div className="flex items-center gap-8 pt-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-blue-600" />
                                                    <span className="text-xs font-black text-slate-900 uppercase italic tracking-tight">{testInfo.duration} Minutes</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-purple-600" />
                                                    <span className="text-xs font-black text-slate-900 uppercase italic tracking-tight">{new Date(testInfo.startDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => navigate('/waiting-room')}
                                            disabled={student.testAttempted} 
                                            className={`px-12 py-5 rounded-2.5xl font-black text-xs transition-all shadow-2xl uppercase italic tracking-[0.2em] flex items-center gap-3 ${student.testAttempted ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30 active:scale-95'}`}
                                        >
                                            {student.testAttempted ? 'Attempt Recorded' : 'Initialize Access'} <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner">
                                    <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.5em] italic">Scanning for active assessment nodes...</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'resources' && (
                        <motion.div key="resources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                             <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-4">
                                <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg"><FileText size={20}/></span>
                                Study Material Archive
                            </h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {studyResources.length > 0 ? studyResources.map((item, i) => (
                                    <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl hover-lift flex flex-col group">
                                        <div className="w-14 h-14 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                            <Download size={24} />
                                        </div>
                                        <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter mb-2 group-hover:text-indigo-600 transition-colors truncate">{item.title}</h4>
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-8 opacity-60">Verified Educational Asset</p>
                                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-auto py-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 border border-slate-100">
                                            Access Node <ExternalLink size={14} />
                                        </a>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 text-center">
                                         <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.5em] italic">No resources synced yet.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'certificates' && (
                        <motion.div key="certificates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
                            <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-slate-100 shadow-2xl flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                                <div className="flex-1 space-y-10 relative z-10 text-center md:text-left">
                                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 italic">
                                        <ShieldCheck size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Verified Credentials Node</span>
                                    </div>
                                    <h3 className="text-5xl font-black text-slate-900 leading-[1.1] uppercase italic tracking-tighter">Your Digital <br/><span className="text-blue-600 decoration-blue-100 decoration-8 underline underline-offset-[12px]">Certificates.</span></h3>
                                    <p className="text-slate-500 text-base font-medium leading-relaxed max-w-sm mx-auto md:mx-0 opacity-70">
                                        Tamper-proof, cryptographically signed academic assets issued upon verification.
                                    </p>
                                    
                                    {student.testAttempted ? (
                                        <button 
                                            onClick={() => navigate(`/verify/${student.studentId}`)}
                                            className="px-14 py-6 bg-blue-600 text-white rounded-[2rem] font-black text-xs uppercase italic tracking-[0.3em] flex items-center gap-4 hover:bg-blue-700 transition-all shadow-2xl hover:scale-105 active:scale-95 group/dl"
                                        >
                                            Download Asset Node <Download size={20} className="group-dl:animate-bounce" />
                                        </button>
                                    ) : (
                                        <div className="inline-flex px-10 py-5 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] border border-slate-100 italic">
                                            Status: Locked / Pending Evaluation
                                        </div>
                                    )}
                                </div>

                                <div className="w-80 h-64 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-200 gap-6 group hover:border-blue-200 transition-all duration-500 shadow-inner relative z-10">
                                    <Award size={80} className="group-hover:scale-110 group-hover:text-blue-100 transition-all duration-700" />
                                    <p className="text-[8px] font-black uppercase tracking-[0.5em] italic opacity-30">Identity Verification Required</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'profile' && (
                        <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-10">
                            {/* Profile Details Container */}
                            <div className="lg:col-span-3 bg-white rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden relative group">
                                <div className="h-40 bg-blue-600 relative">
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
                                </div>
                                <div className="px-12 pb-16 relative">
                                    <div className="flex flex-col md:flex-row items-end gap-10 -translate-y-20">
                                        <div className="relative group/photo">
                                            <div className="w-48 h-48 bg-white p-3 rounded-[3.5rem] shadow-2xl relative z-10 ring-4 ring-slate-50">
                                                <div className="w-full h-full bg-slate-100 rounded-[2.8rem] flex items-center justify-center overflow-hidden border-2 border-white">
                                                    {student.profilePicture ? (
                                                        <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User size={80} className="text-slate-200" />
                                                    )}
                                                </div>
                                            </div>
                                            <button 
                                                onClick={() => fileInputRef.current.click()}
                                                className="absolute bottom-2 right-2 z-20 w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-2xl border-4 border-white hover:scale-110 transition-all"
                                            >
                                                <Camera size={20} />
                                            </button>
                                            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{student.fullName}</h2>
                                            <div className="flex items-center gap-4 mt-5">
                                                <span className="px-5 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic">{student.studentId}</span>
                                                <span className="px-5 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-blue-100">Verified Identity</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-10 mt-6">
                                        <div className="space-y-6">
                                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-2 opacity-60">Digital Mail</p>
                                                <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight truncate">{student.email}</p>
                                            </div>
                                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-2 opacity-60">Mobile Node</p>
                                                <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">{student.phone || "Not Synced"}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-2 opacity-60">Institution</p>
                                                <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight leading-tight">{student.college}</p>
                                            </div>
                                            <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-2 opacity-60">Enrollment Year</p>
                                                <p className="text-sm font-black text-slate-900 uppercase italic tracking-tight">Year {student.year}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Matrix ID Card Mockup - Clean White Version */}
                            <div className="lg:col-span-2 space-y-8 flex flex-col items-center">
                                <motion.div 
                                    whileHover={{ y: -5 }}
                                    className="bg-white rounded-[3rem] p-1 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] relative group/card overflow-hidden w-full max-w-[340px] border border-slate-100"
                                >
                                    {/* ID Card Interior */}
                                    <div className="bg-white rounded-[2.8rem] h-[520px] overflow-hidden flex flex-col relative">
                                        {/* Subtle Background Accent */}
                                        <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-br from-blue-600 to-blue-700"></div>
                                        <div className="absolute top-24 right-0 w-full h-12 bg-white skew-y-3 origin-right"></div>
                                        
                                        {/* Card Header: Branding */}
                                        <div className="p-8 pb-4 flex justify-between items-center relative z-10">
                                            <div className="flex items-center gap-2">
                                                <Zap size={20} className="text-white fill-white" />
                                                <span className="text-lg font-black text-white italic tracking-tighter">PIEDOCX</span>
                                            </div>
                                            <div className="text-[7px] font-black text-white/70 uppercase tracking-[0.3em] italic">Identity Node</div>
                                        </div>

                                        <div className="flex-1 px-8 pt-12 flex flex-col items-center relative z-10 text-center">
                                            {/* Profile Photo */}
                                            <div className="w-36 h-36 bg-white rounded-3xl p-1 mb-6 shadow-xl border border-slate-100 relative group/photo">
                                                <div className="w-full h-full bg-slate-50 rounded-[1.25rem] overflow-hidden border border-slate-100">
                                                    {student.profilePicture ? (
                                                        <img src={student.profilePicture} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <User size={48} className="text-slate-200" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg border-2 border-white">
                                                    <ShieldCheck size={16} className="text-white" />
                                                </div>
                                            </div>

                                            {/* Student Name & ID */}
                                            <h4 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter mb-1 leading-none">{student.fullName}</h4>
                                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest italic mb-8">{student.studentId}</p>
                                            
                                            {/* Details Grid - High Contrast */}
                                            <div className="w-full grid grid-cols-2 gap-x-6 gap-y-6 text-left border-t border-slate-100 pt-8">
                                                <div>
                                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Branch / Stream</p>
                                                    <p className="text-[10px] font-black text-slate-900 uppercase italic truncate">{student.branch}</p>
                                                </div>
                                                <div>
                                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Valid Through</p>
                                                    <p className="text-[10px] font-black text-slate-900 uppercase italic">2026 Season</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Institution</p>
                                                    <p className="text-[10px] font-black text-slate-900 uppercase italic truncate">{student.college}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer - Signature Appearance */}
                                        <div className="px-8 py-8 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center mt-auto">
                                            <div className="text-left">
                                                <p className="text-[6px] font-bold text-slate-400 uppercase tracking-widest mb-1 leading-none">Security Node</p>
                                                <p className="text-[8px] font-black text-slate-900 uppercase italic tracking-tighter">Verified Session</p>
                                            </div>
                                            <QrCode size={36} className="text-slate-900 opacity-80" />
                                        </div>
                                    </div>
                                </motion.div>
                                <button 
                                    onClick={() => navigate(`/verify/${student.studentId}`)} 
                                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-xs uppercase italic tracking-[0.3em] transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3 border-none"
                                >
                                    <Award size={18} /> Export Identity Node
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default StudentDashboard;
