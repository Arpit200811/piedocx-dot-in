import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, BookOpen, Award, Download, User, 
    LogOut, Search, Clock, ChevronRight, CheckCircle2,
    FileText, ExternalLink, Activity, Info, Bell, ShieldCheck,
    Phone, Mail, GraduationCap, Building2, Calendar, Camera, UploadCloud,
    QrCode, MapPin, Menu, X
} from 'lucide-react';
import SEO from './SEO';
import { base_url } from '../utils/info';
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
    const { student, logout: authLogout } = useStudentAuth();
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

            <div className="bg-slate-900 text-white py-2 px-8 overflow-hidden relative border-b border-blue-600/20 rounded-2xl mb-6">
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-white/90 italic">
                    <span className="bg-blue-600 px-2 py-0.5 rounded text-white font-black not-italic border border-blue-500 shadow-sm">Bulletin</span>
                    <div className="flex-1 overflow-hidden relative h-4">
                        <motion.div animate={{ x: ["100%", "-100%"] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute whitespace-nowrap">
                            {announcements.map(a => a.text).join(" • ")}
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && (
                            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-6xl space-y-8">
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm group">
                                    <div className="flex-1 space-y-3">
                                        <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Welcome back, {student.firstName}!</h1>
                                        <p className="text-slate-500 text-sm leading-relaxed max-w-lg font-medium opacity-80">
                                            {student.testAttempted 
                                                ? "Assessment complete. Your results have been updated." 
                                                : "Please complete your pending exam."
                                            }
                                        </p>
                                        {!student.testAttempted && (
                                            <button onClick={() => navigate('/student-dashboard/exams')} className="mt-4 px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase italic tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all flex items-center gap-2 group border border-blue-500">
                                                Start Exam <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="w-full md:w-80 p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex items-center gap-6 shadow-inner">
                                        <SimpleDonut score={student.score || 0} />
                                        <div className="flex-1">
                                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 italic">Status</p>
                                            <p className={`text-xs font-black uppercase italic ${student.testAttempted ? 'text-green-600' : 'text-amber-600'}`}>
                                                {student.testAttempted ? 'Verified' : 'Pending'}
                                            </p>
                                            <div className="mt-4">
                                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 italic">Completion</p>
                                                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${((student.score || 0)/30)*100}%` }} className="bg-blue-600 h-full shadow-[0_0_10px_#2563eb]" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-3 gap-8">
                                    <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm lg:col-span-2">
                                        <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] flex items-center gap-2 mb-8 italic">
                                            <Activity size={16} /> Activity Log
                                        </h3>
                                        <div className="space-y-4">
                                            {[
                                                { msg: 'Profile loaded', time: 'Just now', icon: CheckCircle2, color: 'text-green-600' },
                                                { msg: student.testAttempted ? 'Results published' : 'Exam Active', time: '2h ago', icon: Info, color: 'text-blue-500' },
                                                { msg: 'System check passed', time: 'Yesterday', icon: ShieldCheck, color: 'text-slate-400' }
                                            ].map((log, i) => (
                                                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:shadow-md transition-all group">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-slate-100 group-hover:bg-slate-50 transition-colors">
                                                            <log.icon size={16} className={log.color} />
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tight opacity-90">{log.msg}</span>
                                                    </div>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase italic">{log.time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="bg-white p-8 rounded-[1.5rem] border border-slate-200 shadow-sm">
                                            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6 italic">Student Info</h3>
                                            <div className="space-y-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm"><Building2 size={16}/></div>
                                                    <div>
                                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Institution</p>
                                                        <p className="text-xs font-bold text-slate-800 uppercase tracking-tight leading-tight">{student.college}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center border border-purple-100 shadow-sm"><GraduationCap size={16}/></div>
                                                    <div>
                                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Branch-Year</p>
                                                        <p className="text-xs font-bold text-slate-800 uppercase tracking-tight leading-tight">{student.branch} • Y{student.year}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <button onClick={() => navigate('/student-dashboard/profile')} className="w-full mt-8 py-3 bg-slate-50 hover:bg-blue-600 hover:text-white rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] transition-all border border-slate-100 group">
                                                View Full Profile
                                            </button>
                                        </div>
                                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-[1.5rem] text-white shadow-xl relative overflow-hidden group">
                                            <div className="relative z-10">
                                                <h4 className="font-black text-xs uppercase italic tracking-widest mb-3 text-blue-400">Help & Support</h4>
                                                <p className="text-[11px] text-slate-400 leading-relaxed mb-6 font-medium">Having trouble with the exam? Contact support immediately.</p>
                                                <button className="w-full py-3 bg-white/10 hover:bg-white text-slate-900 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-white/10 italic">
                                                    Contact Support
                                                </button>
                                            </div>
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'profile' && (
                            <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="max-w-4xl space-y-10">
                                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden group">
                                    <div className="h-48 bg-slate-900 relative">
                                        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-pulse"></div>
                                        <div className="absolute top-6 right-8 text-right hidden md:block">
                                            <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] italic">Student Profile</p>
                                            <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">Status: Active</p>
                                        </div>
                                        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
                                    </div>
                                    <div className="px-12 pb-12 relative">
                                        <div className="flex flex-col md:flex-row items-end gap-10 -translate-y-16">
                                            <div className="relative group/photo">
                                                <div className="w-40 h-40 bg-white p-2 rounded-[2.5rem] shadow-2xl relative z-10 ring-4 ring-slate-50">
                                                    <div className="w-full h-full bg-slate-100 rounded-[2rem] flex items-center justify-center overflow-hidden border-4 border-white group-hover/photo:opacity-90 transition-opacity">
                                                        {student.profilePicture ? (
                                                            <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <User size={64} className="text-slate-200" />
                                                        )}
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => fileInputRef.current.click()}
                                                    className="absolute bottom-2 right-2 z-20 w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-xl border-4 border-white hover:scale-110 active:scale-95 transition-all group/btn"
                                                >
                                                    <Camera size={20} className="group-hover/btn:rotate-12 transition-transform" />
                                                </button>
                                                <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                                            </div>
                                            <div className="flex-1 pb-4">
                                                <h2 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{student.fullName}</h2>
                                                <div className="flex items-center gap-4 mt-4">
                                                    <span className="px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic">{student.studentId}</span>
                                                    <div className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-blue-100 shadow-sm">
                                                        <ShieldCheck size={14} /> Verified Student
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 mt-4">
                                            <div className="space-y-6">
                                                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-slate-100 pb-3 italic">Contact Info</h3>
                                                <div className="space-y-5">
                                                    <div className="flex items-center gap-5 group/item p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all shadow-sm">
                                                        <div className="w-12 h-12 bg-white text-slate-400 group-hover/item:bg-blue-600 group-hover/item:text-white group-hover/item:rotate-12 rounded-2xl flex items-center justify-center transition-all border border-slate-100 shadow-sm"><Mail size={20}/></div>
                                                        <div>
                                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5 italic">Email</p>
                                                            <p className="text-sm font-black text-slate-900 italic tracking-tight uppercase truncate max-w-[180px]">{student.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-5 group/item p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all shadow-sm">
                                                        <div className="w-12 h-12 bg-white text-slate-400 group-hover/item:bg-green-600 group-hover/item:text-white group-hover/item:rotate-12 rounded-2xl flex items-center justify-center transition-all border border-slate-100 shadow-sm"><Phone size={20}/></div>
                                                        <div>
                                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5 italic">Phone</p>
                                                            <p className="text-sm font-black text-slate-900 italic tracking-tight uppercase">{student.mobile || "Not set"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-6">
                                                <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] border-b border-slate-100 pb-3 italic">Academic Info</h3>
                                                <div className="space-y-5">
                                                    <div className="flex items-center gap-5 group/item p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all shadow-sm">
                                                        <div className="w-12 h-12 bg-white text-slate-400 group-hover/item:bg-indigo-600 group-hover/item:text-white group-hover/item:rotate-12 rounded-2xl flex items-center justify-center transition-all border border-slate-100 shadow-sm"><Building2 size={20}/></div>
                                                        <div>
                                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5 italic">College / University</p>
                                                            <p className="text-sm font-black text-slate-900 italic tracking-tight uppercase truncate max-w-[180px] leading-tight">{student.college}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-5 group/item p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-slate-200 hover:bg-white transition-all shadow-sm">
                                                        <div className="w-12 h-12 bg-white text-slate-400 group-hover/item:bg-purple-600 group-hover/item:text-white group-hover/item:rotate-12 rounded-2xl flex items-center justify-center transition-all border border-slate-100 shadow-sm"><Calendar size={20}/></div>
                                                        <div>
                                                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1.5 italic">Current Year</p>
                                                            <p className="text-sm font-black text-slate-900 italic tracking-tight uppercase">Year {student.year}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Professional Physical ID Card Redesign */}
                                        <div className="mt-16 flex flex-col md:flex-row items-center gap-12 bg-slate-50 p-10 rounded-[3rem] border border-slate-200 relative overflow-hidden group/id-section shadow-inner">
                                            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none group-hover/id-section:bg-blue-600/10 transition-colors"></div>
                                            
                                            <div className="flex-1 space-y-6 relative z-10 text-center md:text-left">
                                                <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-2xl border border-slate-100 shadow-sm mb-2">
                                                    <img src="/pie_logo.png" alt="" className="h-5 w-auto mix-blend-multiply" />
                                                    <span className="text-[9px] font-black text-slate-900 uppercase italic tracking-widest">Student ID Card</span>
                                                </div>
                                                <h3 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-[1.1]">
                                                    Piedocx Student <br/>
                                                    <span className="text-blue-600 decoration-blue-200 decoration-8 underline underline-offset-[12px]">Identity Card</span>
                                                </h3>
                                                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed max-w-sm">
                                                    Official ID card authorized for verification and exam access.
                                                </p>
                                                <button 
                                                    onClick={() => navigate(`/verify/${student.studentId}`)}
                                                    className="hidden md:flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase italic tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 active:scale-95 group/btn-dl"
                                                >
                                                    Download ID Card <Download size={16} className="group-hover/btn-dl:translate-y-1 transition-transform" />
                                                </button>
                                            </div>

                                            {/* Physical Card Mockup */}
                                            <div className="relative group/mock">
                                                {/* Card Background Shadow Effects */}
                                                <div className="absolute -inset-4 bg-blue-600/10 rounded-[2.5rem] blur-2xl group-hover/mock:bg-blue-600/20 transition-all duration-500"></div>
                                                
                                                <div className="w-[320px] h-[480px] bg-white rounded-[2rem] shadow-2xl relative z-10 overflow-hidden border border-slate-200 flex flex-col group-hover/mock:-translate-y-2 transition-transform duration-500">
                                                    {/* Card Header */}
                                                    <div className="h-24 bg-slate-900 p-6 flex items-center justify-between relative overflow-hidden">
                                                        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                                        <img src="/pie_logo.png" alt="Piedocx" className="h-8 w-auto relative z-10 brightness-0 invert" />
                                                        <div className="text-right relative z-10">
                                                            <p className="text-[7px] font-black text-blue-400 uppercase tracking-widest mb-1 italic">Identity Card</p>
                                                            <p className="text-[6px] font-bold text-white/40 uppercase tracking-tighter leading-none italic">Verified v4.0.2</p>
                                                        </div>
                                                        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
                                                    </div>

                                                    {/* Card Body */}
                                                    <div className="flex-1 p-8 flex flex-col items-center">
                                                        {/* Profile Image Frame */}
                                                        <div className="relative mb-6">
                                                            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[1.75rem] blur-sm opacity-20"></div>
                                                            <div className="w-32 h-32 bg-white p-1 rounded-[1.5rem] shadow-lg relative z-10">
                                                                <div className="w-full h-full bg-slate-50 rounded-[1.25rem] overflow-hidden border-2 border-slate-100 flex items-center justify-center">
                                                                    {student.profilePicture ? (
                                                                        <img src={student.profilePicture} alt="" className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <User size={48} className="text-slate-200" />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Student Name & ID */}
                                                        <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter text-center leading-tight mb-2 underline decoration-blue-600/20 decoration-2 underline-offset-4">
                                                            {student.fullName}
                                                        </h4>
                                                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.3em] mb-8 bg-blue-50 px-3 py-1 rounded-full italic border border-blue-100">
                                                            ID: {student.studentId}
                                                        </p>

                                                        {/* Details Grid */}
                                                        <div className="w-full grid grid-cols-2 gap-x-6 gap-y-5 border-t border-slate-100 pt-6">
                                                            <div>
                                                                <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Department</p>
                                                                <p className="text-[8px] font-black text-slate-800 uppercase italic truncate">{student.branch}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Batch Year</p>
                                                                <p className="text-[8px] font-black text-slate-800 uppercase italic">Batch of {student.year}</p>
                                                            </div>
                                                            <div className="col-span-2 mt-1">
                                                                <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Institution Hub</p>
                                                                <p className="text-[8px] font-black text-slate-800 uppercase italic truncate leading-tight">{student.college}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Card Footer (Chip & QR Area) */}
                                                    <div className="p-8 bg-slate-50 relative border-t border-slate-100/50">
                                                        <div className="flex justify-between items-end relative z-10">
                                                            <div className="space-y-1">
                                                                <p className="text-[6px] font-black text-slate-400 uppercase tracking-widest italic leading-none">Status</p>
                                                                <p className="text-[8px] font-black text-green-600 uppercase italic flex items-center gap-1.5 leading-none">
                                                                    <ShieldCheck size={10} /> ACCESS VERIFIED
                                                                </p>
                                                            </div>
                                                            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm group-hover/mock:rotate-3 transition-transform">
                                                                <QrCode size={36} className="text-slate-900 opacity-80" strokeWidth={1.5} />
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Tagline at bottom */}
                                                        <div className="mt-4 pt-3 border-t border-slate-200/50">
                                                            <p className="text-[6px] font-black text-slate-300 uppercase italic text-center tracking-[0.2em]">DECODE THE FUTURE WITH PIEDOCX</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => navigate(`/verify/${student.studentId}`)}
                                                className="w-full md:hidden py-5 bg-slate-900 text-white rounded-[1.5rem] text-[10px] font-black uppercase italic tracking-[0.2em] shadow-2xl shadow-slate-900/20 active:scale-95 mt-4">
                                                Download Matrix Card
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'resources' && (
                            <motion.div key="resources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {studyResources.map((item, i) => (
                                    <div key={i} className="p-8 bg-white rounded-[1.5rem] border border-slate-200 hover:border-blue-600 hover:shadow-2xl hover:shadow-blue-600/5 transition-all flex flex-col group">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                            <FileText size={24} />
                                        </div>
                                        <h4 className="text-sm font-black text-slate-800 uppercase italic tracking-tight mb-2 leading-none">{item.title}</h4>
                                        <p className="text-[10px] text-slate-400 mb-6 font-black uppercase tracking-widest">{item.size} • {item.type}</p>
                                        <button className="mt-auto py-3 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl text-[9px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-slate-100 shadow-sm">
                                            Access Data <ExternalLink size={14} />
                                        </button>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'exams' && (
                            <motion.div key="exams" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl">
                                {testInfo ? (
                                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                                        <div className="flex justify-between items-start mb-8 relative z-10">
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">{testInfo.title}</h3>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic opacity-60">{testInfo.branchGroup} Group Assessment Node</p>
                                            </div>
                                            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-1.5 rounded-full border border-green-100">
                                                <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse shadow-[0_0_8px_#16a34a]"></div>
                                                <span className="text-[10px] font-black uppercase tracking-widest italic">Node Active</span>
                                            </div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-6 mb-10 relative z-10 font-bold italic tracking-tight">
                                            <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                                                <p className="text-[9px] text-slate-400 font-black uppercase mb-2 tracking-widest leading-none">Time matrix</p>
                                                <p className="text-xl font-black text-slate-900">{testInfo.duration} <span className="text-[10px] opacity-40">MINUTES</span></p>
                                            </div>
                                            <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                                                <p className="text-[9px] text-slate-400 font-black uppercase mb-2 tracking-widest leading-none">Data sets</p>
                                                <p className="text-xl font-black text-slate-900">{testInfo.totalQuestions || 30} <span className="text-[10px] opacity-40">MCQS</span></p>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={() => navigate('/waiting-room', {
                                                state: {
                                                    testId: testInfo?._id || 'default',
                                                    testTitle: testInfo?.title,
                                                    studentName: student.fullName,
                                                    studentId: student.studentId,
                                                    yearGroup: student.year,
                                                    branchGroup: student.branch === 'CS' || student.branch === 'IT' ? 'CS-IT' : 'CORE'
                                                }
                                            })}
                                            disabled={student.testAttempted} 
                                            className={`w-full py-5 rounded-[1.5rem] font-black text-sm transition-all shadow-2xl uppercase italic tracking-[0.2em] relative z-10 ${student.testAttempted ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20 active:scale-95 border border-blue-500'}`}>
                                            {student.testAttempted ? 'Decryption Complete' : 'Enter Waiting Lobby'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="py-24 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200 shadow-sm">
                                        <div className="w-20 h-20 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto mb-6 border border-slate-100">
                                            <BookOpen size={32} className="text-slate-200" />
                                        </div>
                                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.4em] italic">No active assessment nodes found</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'certificates' && (
                            <motion.div key="certificates" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="bg-white p-12 lg:p-16 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-16 group/cert relative overflow-hidden">
                                     <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="flex-1 space-y-8 relative z-10">
                                        <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                                            <ShieldCheck size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Official verification node</span>
                                        </div>
                                        <h3 className="text-5xl font-black text-slate-900 leading-[1.1] uppercase italic tracking-tighter">Your Verified <br/><span className="text-blue-600 underline decoration-blue-200 decoration-8 underline-offset-8">Academic Assets.</span></h3>
                                        <p className="text-slate-500 text-base font-medium leading-relaxed max-w-sm opacity-80">
                                            Secure, high-integrity digital credentials generated upon successful validation of your skill matrix.
                                        </p>
                                        
                                        {student.testAttempted ? (
                                            <button 
                                                onClick={() => navigate(`/verify/${student.studentId}`)}
                                                className="px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase italic tracking-[0.3em] flex items-center gap-4 hover:bg-blue-600 transition-all shadow-2xl shadow-slate-900/10 active:scale-95 border border-slate-800 hover:border-blue-500 group/dl">
                                                Download Certificate PDF <Download size={20} className="group-dl:animate-bounce" />
                                            </button>
                                        ) : (
                                            <div className="inline-flex px-8 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] border border-slate-100 italic">
                                                Node Status: Encrypted / Locked
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-80 h-56 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-200 gap-6 group/mock shadow-inner relative z-10 hover:border-blue-200 transition-colors">
                                        <Award size={64} className="group-hover/mock:scale-110 group-hover/mock:text-blue-100 transition-all duration-500" />
                                        <p className="text-[9px] font-black uppercase tracking-[0.4em] italic opacity-40">Preview matrix pending</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default StudentDashboard;
