import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import {
    LayoutDashboard, BookOpen, Award, Download, User,
    LogOut, Search, Clock, ChevronRight, CheckCircle2,
    FileText, ExternalLink, Activity, Info, Bell, ShieldCheck,
    Phone, Mail, GraduationCap, Building2, Calendar, Camera, UploadCloud,
    QrCode, MapPin, Menu, X, Trophy, TrendingUp, Zap
} from 'lucide-react';
import SEO from './SEO';
import { getYearGroup, getBranchGroup } from '../utils/branchMapping';
import Swal from 'sweetalert2';
import { useStudentAuth } from '../context/StudentAuthContext';
import { useLocation } from 'react-router-dom';
import QRCode from "react-qr-code";
import { io } from 'socket.io-client';
import { base_url } from '../utils/info';

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
    const idCardRef = useRef(null);
    const [isDownloadingID, setIsDownloadingID] = useState(false);

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

        // Socket Connection for Real-time Test Updates
        if (student) {
            const socketUrl = base_url.replace('/api', '');
            const socket = io(socketUrl, {
                auth: { token: localStorage.getItem('studentToken') }
            });

            socket.on('connect', () => {
                console.log("Student Socket Connected");
            });

            socket.on('test_config_updated', (data) => {
                console.log("Test Update Received:", data);
                const myYear = getYearGroup(student.year);
                const myBranch = getBranchGroup(student.branch);

                // Check if update is relevant to me
                if (data.yearGroup === myYear && data.branchGroup === myBranch) {
                    fetchTestInfo();
                    Swal.fire({
                        title: 'Assessment Updated',
                        text: `New configuration: ${data.title}`,
                        icon: 'info',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000
                    });
                }
            });

            return () => socket.disconnect();
        }
    }, [student]);

    const fetchBulletins = async () => {
        try {
            const data = await api.get('/api/student-auth/bulletins');
            setAnnouncements(data);
        } catch (err) {
            console.log("Bulletins fetch failed");
        }
    };

    const fetchResources = async () => {
        try {
            const data = await api.get('/api/student-auth/resources');
            setStudyResources(data);
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
            const data = await api.get('/api/student-auth/test-info');
            setTestInfo(data);
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
                await api.post('/api/student-auth/update-profile',
                    { profilePicture: base64String }
                );
                setStudent(prev => ({ ...prev, profilePicture: base64String }));
                Swal.fire({ icon: 'success', title: 'Profile Updated', text: 'Your photo has been uploaded successfully.' });
            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Upload Failed', text: 'Something went wrong while saving your photo.' });
            }
        };
        reader.readAsDataURL(file);
    };

    const downloadIDCard = async () => {
        if (idCardRef.current && !isDownloadingID) {
            try {
                setIsDownloadingID(true);

                // Wait for any potential transitions to settle
                await new Promise(r => setTimeout(r, 800));

                const canvas = await html2canvas(idCardRef.current, {
                    scale: 4, // Increased quality for professional print
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    onclone: (clonedDoc) => {
                        // Selection specifically for the professional card
                        const el = clonedDoc.querySelector('.id-card-capture');
                        if (el) {
                            el.style.transform = 'none';
                            el.style.boxShadow = 'none';
                            el.style.width = '340px';
                            el.style.margin = '0';
                        }
                    }
                });

                canvas.toBlob((blob) => {
                    if (!blob) throw new Error("Generation failed");
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.download = `${student.fullName.replace(/\s+/g, '_')}_ID_Card.png`;
                    link.href = url;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    Swal.fire({
                        icon: 'success',
                        title: 'ID Card Downloaded',
                        text: 'Your official ID asset has been generated successfully.',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }, 'image/png', 1.0);

            } catch (err) {
                console.error("ID Download Error:", err);
                Swal.fire({
                    icon: 'error',
                    title: 'Download Failed',
                    text: 'Could not generate ID card image. Error: ' + (err.message || 'Canvas issue'),
                });
            } finally {
                setIsDownloadingID(false);
            }
        }
    };

    if (loading) return null; // Loading handled by ProtectedRoute

    if (!student) return null;

    return (
        <div className="flex-1 flex flex-col min-w-0">
            <SEO title="Student Dashboard | Piedocx" />

            {/* Global Broadcast Banner */}
            <div className="bg-blue-600 w-full rounded-2xl md:rounded-[2rem] p-3 md:p-4 mb-6 md:mb-8 overflow-hidden relative border border-blue-500 shadow-xl shadow-blue-600/20">
                <div className="flex items-center gap-3 md:gap-6 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-white italic h-6">
                    <span className="bg-white/20 px-2 md:px-3 py-0.5 md:py-1 rounded-full text-white font-black not-italic border border-white/20 flex items-center gap-2 whitespace-nowrap">
                        <Bell size={12} className="animate-bounce" /> <span className="hidden sm:inline">Broadcast</span>
                    </span>
                    <div className="flex-1 overflow-hidden relative">
                        <motion.div
                            animate={{ x: ["100%", "-100%"] }}
                            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                            className="absolute whitespace-nowrap opacity-90 font-bold"
                        >
                            {announcements.length > 0 ? announcements.map(a => a.text).join(" • ") : "Welcome to PIEDOCX Student Portal. System Status: Online • Security Protocols: Active • Assessment Cycle: Open"}
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
                            <div className="bg-white rounded-[2rem] md:rounded-[3.5rem] p-5 sm:p-10 md:p-16 relative overflow-hidden group shadow-2xl border border-blue-50">
                                <div className="absolute top-0 right-0 w-full sm:w-[40%] h-full bg-gradient-to-l from-blue-100/40 to-transparent"></div>
                                <div className="absolute -bottom-24 -left-24 sm:-right-24 w-64 h-64 bg-indigo-100/40 rounded-full blur-[80px]"></div>

                                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-12">
                                    <div className="flex-1 space-y-4 md:space-y-6 text-center lg:text-left">
                                        <div className="flex items-center justify-center lg:justify-start gap-3">
                                            <span className="w-8 h-1 bg-blue-600 rounded-full"></span>
                                            <span className="text-[10px] md:text-xs font-black text-blue-400 uppercase tracking-[0.4em]">Student Dashboard</span>
                                        </div>
                                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 italic uppercase tracking-tighter leading-tight">
                                            Welcome Back, <span className="text-blue-600 underline decoration-blue-100 underline-offset-4">{student.firstName}</span>.
                                        </h1>
                                        <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium opacity-80">
                                            {student.testAttempted
                                                ? "Your assessment cycle is complete. Your verified scores and performance breakdown are available below."
                                                : "Final preparations for your scheduled assessment are complete. Please ensure a stable connection before proceeding."
                                            }
                                        </p>

                                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                                            {student.testAttempted ? (
                                                <button
                                                    onClick={() => navigate('/student-results')}
                                                    className="px-8 md:px-10 py-4 md:py-5 bg-slate-900 text-white rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase italic tracking-[0.2em] shadow-xl hover:bg-blue-600 transition-all flex items-center gap-3 group border-none"
                                                >
                                                    Analysis Report <Trophy size={18} className="group-hover:scale-125 transition-transform" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => navigate('/student-dashboard/exams')}
                                                    className="px-8 md:px-10 py-4 md:py-5 bg-blue-600 text-white rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase italic tracking-[0.2em] shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-all flex items-center gap-3 group border-none"
                                                >
                                                    Start Assessment <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-96 bg-blue-50/50 backdrop-blur-3xl rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 border border-blue-100 shadow-inner group">
                                        <div className="flex flex-col items-center gap-4 md:gap-6">
                                            <div className="relative scale-90 md:scale-100">
                                                <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-2xl animate-pulse"></div>
                                                <SimpleDonut score={student.score || 0} />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-[9px] md:text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-2 italic leading-none">Global Status</p>
                                                <p className={`text-lg md:text-xl font-black uppercase italic tracking-tight ${student.testAttempted ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                    {student.testAttempted ? 'Verified' : 'Assessment Pending'}
                                                </p>
                                                <div className="mt-4 md:mt-6 w-48 md:w-56 mx-auto">
                                                    <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest mb-2">
                                                        <span>Efficiency</span>
                                                        <span>{Math.round(((student.score || 0) / 30) * 100)}%</span>
                                                    </div>
                                                    <div className="w-full bg-blue-100/50 h-1.5 rounded-full overflow-hidden">
                                                        <motion.div initial={{ width: 0 }} animate={{ width: `${((student.score || 0) / 30) * 100}%` }} className="bg-blue-600 h-full shadow-[0_0_15px_#2563eb]" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Activity and Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                                {/* Operation Log */}
                                <div className="md:col-span-2 bg-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-2xl border border-slate-100 relative overflow-hidden hover-lift">
                                    <div className="flex items-center justify-between mb-8 md:mb-10">
                                        <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] flex items-center gap-3 italic">
                                            <Activity size={18} /> Operation Log
                                        </h3>
                                        <TrendingUp size={20} className="text-slate-200 hidden sm:block" />
                                    </div>

                                    <div className="space-y-4 md:space-y-5">
                                        {[
                                            { msg: 'System Interface Synchronized', time: 'ACTIVE', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
                                            { msg: student.testAttempted ? 'Final Submission Verified' : 'Awaiting Student Input', time: '2H AGO', icon: Info, color: student.testAttempted ? 'text-emerald-600' : 'text-amber-600', bg: student.testAttempted ? 'bg-emerald-50' : 'bg-amber-50' },
                                            { msg: 'Login Credentials Validated', time: 'SESSION START', icon: CheckCircle2, color: 'text-slate-400', bg: 'bg-slate-50' }
                                        ].map((log, i) => (
                                            <motion.div
                                                key={i}
                                                whileHover={{ x: 5 }}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 bg-slate-50/50 border border-slate-100 rounded-2xl md:rounded-[2rem] transition-all group hover:bg-white hover:shadow-xl hover:border-slate-200 gap-4"
                                            >
                                                <div className="flex items-center gap-4 md:gap-6">
                                                    <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2.5xl flex items-center justify-center ${log.bg} shadow-sm border border-white/50 group-hover:scale-110 transition-transform shrink-0`}>
                                                        <log.icon size={20} className={log.color} />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 italic opacity-60">Status Update</p>
                                                        <span className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight italic leading-none block truncate">{log.msg}</span>
                                                    </div>
                                                </div>
                                                <span className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase italic tracking-widest bg-slate-100 px-3 py-1 rounded-full self-start sm:self-center">{log.time}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Info & Support */}
                                <div className="space-y-6 md:space-y-8">
                                    <div className="bg-white rounded-3xl md:rounded-[3.5rem] p-6 md:p-10 shadow-2xl border border-slate-100 flex flex-col hover-lift">
                                        <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-8 md:mb-10 italic">Academic Profile</h3>
                                        <div className="space-y-6 md:space-y-8 flex-1">
                                            <div className="flex items-start gap-4 md:gap-6 group">
                                                <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center border border-blue-100 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all shrink-0"><Building2 size={20} /></div>
                                                <div className="min-w-0">
                                                    <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none mb-2 italic">Institutional</p>
                                                    <p className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight leading-snug italic truncate">{student.college}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-4 md:gap-6 group">
                                                <div className="w-12 h-12 md:w-14 md:h-14 bg-indigo-50 text-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center border border-indigo-100 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-all shrink-0"><GraduationCap size={20} /></div>
                                                <div className="min-w-0">
                                                    <p className="text-[9px] md:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none mb-2 italic">Stream • Year</p>
                                                    <p className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight leading-snug italic">{student.branch} • Y{student.year}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => navigate('/student-dashboard/profile')} className="w-full mt-8 md:mt-10 h-14 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] transition-all border border-slate-100 italic">
                                            Manage Profile
                                        </button>
                                    </div>

                                    <div className="bg-gradient-to-br from-blue-700 to-indigo-800 rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-8 text-white shadow-2xl relative overflow-hidden group hover-lift">
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
                        <motion.div key="exams" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-8 md:mb-10 flex items-center gap-4">
                                <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg"><BookOpen size={20} /></span>
                                Active Assessments
                            </h2>
                            {testInfo ? (
                                <div className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl md:rounded-[3.5rem] border border-slate-200 shadow-2xl relative overflow-hidden group hover-lift">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-10 relative z-10 text-center lg:text-left">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center justify-center lg:justify-start gap-3">
                                                <span className="px-3 py-1 bg-green-50 text-green-600 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-full border border-green-100">Live Server</span>
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic leading-none opacity-60 shrink-0">{testInfo.branchGroup} Node</span>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight">{testInfo.title}</h3>
                                            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 md:gap-8 pt-2">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={16} className="text-blue-600" />
                                                    <span className="text-xs font-black text-slate-900 uppercase italic tracking-tight">{testInfo.duration} Min</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-purple-600" />
                                                    <span className="text-xs font-black text-slate-900 uppercase italic tracking-tight">{new Date(testInfo.startDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => navigate('/waiting-room', {
                                                state: {
                                                    testId: testInfo.id,
                                                    testTitle: testInfo.title,
                                                    studentName: student.fullName,
                                                    studentId: student.studentId,
                                                    yearGroup: testInfo.yearGroup,
                                                    branchGroup: testInfo.branchGroup
                                                }
                                            })}
                                            disabled={student.testAttempted}
                                            className={`w-full lg:w-auto px-10 py-5 rounded-2xl md:rounded-2.5xl font-black text-[10px] md:text-xs transition-all shadow-2xl uppercase italic tracking-[0.2em] flex items-center justify-center gap-3 ${student.testAttempted ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30 active:scale-95'}`}
                                        >
                                            {student.testAttempted ? 'Attempt Recorded' : 'Initialize Access'} <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 md:py-24 text-center bg-white rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner px-6">
                                    <p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] italic">Scanning for active assessment nodes...</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'resources' && (
                        <motion.div key="resources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-4">
                                <span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg"><FileText size={20} /></span>
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
                        <motion.div key="certificates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
                            <div className="bg-white p-5 sm:p-12 lg:p-16 rounded-3xl md:rounded-[4rem] border border-slate-100 shadow-2xl flex flex-col md:flex-row items-center gap-10 md:gap-16 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                                <div className="flex-1 space-y-6 md:space-y-10 relative z-10 text-center md:text-left">
                                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 italic">
                                        <ShieldCheck size={18} />
                                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Verified Credentials Node</span>
                                    </div>
                                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] uppercase italic tracking-tighter">Your Digital <br /><span className="text-blue-600 decoration-blue-100 decoration-8 underline underline-offset-[8px] md:underline-offset-[12px]">Certificates.</span></h3>
                                    <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed max-w-sm mx-auto md:mx-0 opacity-70">
                                        Tamper-proof, cryptographically signed academic assets issued upon verification.
                                    </p>

                                    <div className="pt-2">
                                        {student.testAttempted ? (
                                            <button
                                                onClick={() => navigate(`/verify/${student.studentId}`)}
                                                className="w-full sm:w-auto px-10 md:px-14 py-5 md:py-6 bg-blue-600 text-white rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase italic tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-blue-700 transition-all shadow-2xl hover:scale-105 active:scale-95 group/dl"
                                            >
                                                Download Asset Node <Download size={20} className="group-dl:animate-bounce" />
                                            </button>
                                        ) : (
                                            <div className="inline-flex px-8 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] border border-slate-100 italic">
                                                Status: Locked / Pending Evaluation
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full sm:w-80 h-48 md:h-64 bg-slate-50 rounded-3xl md:rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-200 gap-6 group hover:border-blue-200 transition-all duration-500 shadow-inner relative z-10">
                                    <Award size={60} className="group-hover:scale-110 group-hover:text-blue-100 transition-all duration-700 md:w-20 md:h-20" />
                                    <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.5em] italic opacity-30">Identity Verification Required</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'profile' && (
                        <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
                            {/* Profile Details Container */}
                            <div className="lg:col-span-3 bg-white rounded-3xl md:rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden relative group">
                                <div className="h-32 md:h-40 bg-blue-600 relative">
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
                                </div>
                                <div className="px-4 sm:px-12 pb-12 md:pb-16 relative">
                                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 -translate-y-16 md:-translate-y-20 text-center md:text-left">
                                        <div className="relative group/photo">
                                            <div className="w-32 h-32 md:w-48 md:h-48 bg-white p-2 md:p-3 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl relative z-10 ring-4 ring-slate-50">
                                                <div className="w-full h-full bg-slate-100 rounded-[2rem] md:rounded-[2.8rem] flex items-center justify-center overflow-hidden border-2 border-white">
                                                    {student.profilePicture ? (
                                                        <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User size={60} className="text-slate-200" />
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => fileInputRef.current.click()}
                                                className="absolute bottom-1 right-1 md:bottom-2 md:right-2 z-20 w-10 h-10 md:w-14 md:h-14 bg-blue-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl border-2 md:border-4 border-white hover:scale-110 transition-all"
                                            >
                                                <Camera size={18} />
                                            </button>
                                            <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                                        </div>
                                        <div className="flex-1 pb-2 md:pb-4 w-full">
                                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{student.fullName}</h2>
                                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 md:mt-5">
                                                <span className="px-4 py-2 bg-slate-900 text-white rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest italic">{student.studentId}</span>
                                                <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest italic border border-blue-100">Verified Identity</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 mt-0 md:mt-6">
                                        <div className="space-y-4 md:space-y-6">
                                            <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                                                <p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-1 md:mb-2 opacity-60">Digital Mail</p>
                                                <p className="text-xs md:text-sm font-black text-slate-900 uppercase italic tracking-tight truncate">{student.email}</p>
                                            </div>
                                            <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                                                <p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-1 md:mb-2 opacity-60">Mobile Node</p>
                                                <p className="text-xs md:text-sm font-black text-slate-900 uppercase italic tracking-tight">{student.mobile || "Not Synced"}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-4 md:space-y-6">
                                            <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                                                <p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-1 md:mb-2 opacity-60">Institution</p>
                                                <p className="text-xs md:text-sm font-black text-slate-900 uppercase italic tracking-tight leading-tight">{student.college}</p>
                                            </div>
                                            <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100 group-hover:bg-white group-hover:shadow-xl transition-all">
                                                <p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-1 md:mb-2 opacity-60">Enrollment Year</p>
                                                <p className="text-xs md:text-sm font-black text-slate-900 uppercase italic tracking-tight">Year {student.year}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* PROFESSIONAL STUDENT ID CARD */}
                            <div className="lg:col-span-2 space-y-6 md:space-y-8 flex flex-col items-center">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="relative group/card w-full max-w-[280px] sm:max-w-[340px]"
                                >
                                    {/* Subtle Modern Shadow */}
                                    <div className="absolute inset-0 bg-blue-600/5 rounded-[2.5rem] blur-2xl transform translate-y-4"></div>

                                    <div
                                        ref={idCardRef}
                                        className="relative id-card-capture"
                                        style={{
                                            borderRadius: '2.5rem',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            backgroundColor: '#ffffff',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: 'none'
                                        }}
                                    >
                                        {/* Card Header Accent */}
                                        <div style={{ height: '10px', width: '100%', backgroundColor: '#2563eb' }}></div>

                                        {/* Logo and Institution Section */}
                                        <div style={{ paddingLeft: '24px', paddingRight: '24px', paddingTop: '20px', paddingBottom: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '6px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                                                <img src="/pie_logo.png" crossOrigin="anonymous" alt="Piedocx Logo" style={{ height: '28px', width: 'auto', objectFit: 'contain' }} />
                                                <div style={{ height: '20px', width: '1px', marginLeft: '2px', marginRight: '2px', backgroundColor: '#e2e8f0' }}></div>
                                                <div style={{ textAlign: 'left' }}>
                                                    <h3 style={{ fontSize: '9px', fontWeight: 900, lineHeight: 1, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#0f172a' }}>Piedocx Technologies</h3>
                                                    <p style={{ fontSize: '6px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1, marginTop: '2px', fontStyle: 'italic', color: '#2563eb' }}>Pvt. Ltd.</p>
                                                </div>
                                            </div>
                                            <div style={{ width: '100%', height: '1px', marginTop: '2px', marginBottom: '2px', backgroundColor: '#f8fafc' }}></div>
                                            <h2 style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginTop: '2px', color: '#1e293b' }}>Identity Card</h2>
                                        </div>

                                        {/* Photo Section */}
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '24px', paddingRight: '24px', marginTop: '4px' }}>
                                            <div style={{ position: 'relative', padding: '2px', borderRadius: '2rem', backgroundColor: '#ffffff', border: '1px solid #f1f5f9' }}>
                                                <div style={{ width: '96px', height: '96px', borderRadius: '1.8rem', overflow: 'hidden', backgroundColor: '#f8fafc', border: '1px solid #f1f5f9' }}>
                                                    {student.profilePicture ? (
                                                        <img src={student.profilePicture} crossOrigin="anonymous" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    ) : (
                                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                            <User size={36} style={{ color: '#e2e8f0' }} />
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #ffffff', backgroundColor: '#2563eb' }}>
                                                    <ShieldCheck size={12} style={{ color: '#ffffff' }} />
                                                </div>
                                            </div>

                                            <div style={{ marginTop: '12px', textAlign: 'center', width: '100%' }}>
                                                <h4 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: '2px', lineHeight: 1.2, overflowWrap: 'break-word', paddingLeft: '16px', paddingRight: '16px', color: '#0f172a' }}>{student.fullName}</h4>
                                                <div style={{ display: 'inline-block', paddingLeft: '8px', paddingRight: '8px', paddingTop: '2px', paddingBottom: '2px', borderRadius: '6px', fontSize: '8px', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', fontStyle: 'italic', backgroundColor: '#0f172a', color: '#ffffff' }}>
                                                    ID: {student.studentId || "PDX-NODE-000"}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Information Grid */}
                                        <div style={{ paddingLeft: '28px', paddingRight: '28px', marginTop: '12px' }}>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', paddingTop: '16px', paddingBottom: '16px', borderTop: '1px solid #f8fafc' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontSize: '7px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Stream / Branch</span>
                                                    <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1.2, overflowWrap: 'break-word', color: '#1e293b' }}>{student.branch}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                    <span style={{ fontSize: '7px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Academic Year</span>
                                                    <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', color: '#1e293b' }}>Year {student.year}</span>
                                                </div>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontSize: '7px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8' }}>Enrolled Institution</span>
                                                    <span style={{ fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', lineHeight: 1.4, overflowWrap: 'break-word', color: '#1e293b' }}>{student.college}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer / QR Scanner */}
                                        <div style={{ paddingLeft: '28px', paddingRight: '28px', paddingTop: '16px', paddingBottom: '16px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', backgroundColor: '#f8fafc' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px rgba(16, 185, 129, 0.4)' }}></div>
                                                    <p style={{ fontSize: '7px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#0f172a' }}>Verified Node</p>
                                                </div>
                                                <p style={{ fontSize: '6px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8' }}>Exp: 2026 ACTIVE</p>
                                            </div>
                                            <div style={{ padding: '4px', paddingLeft: '6px', paddingRight: '6px', borderRadius: '8px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                                                <QRCode
                                                    size={40}
                                                    style={{ height: "auto", maxWidth: "40px", width: "40px" }}
                                                    value={`${window.location.origin}/#/verify/${student.certificateId || student.studentId}`}
                                                    viewBox={`0 0 256 256`}
                                                    fgColor="#0f172a"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                <div className="w-full flex flex-col gap-3">
                                    {/* <button
                                        onClick={downloadIDCard}
                                        disabled={isDownloadingID}
                                        className={`w-full py-5 rounded-[2rem] font-black text-[10px] sm:text-xs uppercase italic tracking-[0.3em] transition-all shadow-2xl flex items-center justify-center gap-3 border ${isDownloadingID ? 'bg-slate-100 text-slate-400' : 'bg-[#0f172a] text-white hover:bg-blue-600 border-transparent hover:border-blue-600'}`}
                                    >
                                        {isDownloadingID ? 'Generating Asset...' : <><Download size={18} /> Verify Identity Portal</>}
                                    </button> */}

                                    <button
                                        onClick={() => navigate(`/verify/${student.certificateId || student.studentId}`)}
                                        className="w-full py-5 bg-white text-slate-900 rounded-[2rem] font-black text-[10px] sm:text-xs uppercase italic tracking-[0.3em] transition-all shadow-2xl hover:bg-slate-50 active:scale-95 flex items-center justify-center gap-3 border border-[#e2e8f0]"
                                    >
                                        <Award size={20} />  Download Official ID Card
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default StudentDashboard;
