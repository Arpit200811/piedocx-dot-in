import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from '../utils/html2canvasSafe';
import {
    BookOpen, Award, Download, User,
    LogOut, Clock, ChevronRight,
    FileText, ExternalLink, ShieldCheck,
    Phone, Mail, GraduationCap, Building2, Calendar, Camera,
    QrCode, MapPin, Trophy, Info, X
} from 'lucide-react';
import SEO from './SEO';
import Swal from 'sweetalert2';
import { useStudentAuth } from '../context/StudentAuth';
import { io } from 'socket.io-client';
import { getSocketUrl } from '../utils/info';
import { getYearGroup, getBranchGroup } from '../utils/branchMapping';

// Modular Components
import BroadcastBanner from './Student/BroadcastBanner';
import StatsScore from './Student/StatsScore';
import DashboardHero from './Student/DashboardHero';
import IDCardAsset from './Student/IDCardAsset';
import Certificate from './Certificate';
import OperationLog from './Student/OperationLog';
import PerformanceJourney from './PerformanceJourney';
import Leaderboard from './Student/Leaderboard';
import TestScheduler from './Student/TestScheduler';
import { ExamsSkeleton, ResourcesSkeleton, CertificatesSkeleton } from './Student/Skeleton';

const StudentDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { student, setStudent, logout: authLogout } = useStudentAuth();
    const fileInputRef = useRef(null);
    const idCardRef = useRef(null);
    const [isDownloadingID, setIsDownloadingID] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [editFormData, setEditFormData] = useState({
        fullName: '',
        mobile: '',
        college: '',
        branch: '',
        year: ''
    });

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
    const [announcements, setAnnouncements] = useState([]);
    const [studyResources, setStudyResources] = useState([]);
    const [isExamsLoading, setIsExamsLoading] = useState(true);
    const [isResourcesLoading, setIsResourcesLoading] = useState(true);
    const [isCertificatesLoading, setIsCertificatesLoading] = useState(true);
    const [showCertificate, setShowCertificate] = useState(false);

    useEffect(() => {
        fetchTestInfo();
        fetchBulletins();
        fetchResources();

        if (student) {
            const socketUrl = getSocketUrl();
            const socket = io(socketUrl, {
                auth: { token: localStorage.getItem('studentToken') }
            });

            socket.on('bulletin_updated', () => {
                fetchBulletins();
                Swal.fire({ title: 'New Announcement', text: 'Dashboard bulletin board has been updated.', icon: 'info', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
            });

            socket.on('resource_updated', () => {
                fetchResources();
                Swal.fire({ title: 'Resources Updated', text: 'New study materials are available in the archive.', icon: 'info', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
            });

            socket.on('test_config_updated', (data) => {
                const myYear = getYearGroup(student.year);
                const myBranch = getBranchGroup(student.branch);

                if (data.yearGroup === myYear && data.branchGroup === myBranch) {
                    fetchTestInfo();
                    Swal.fire({
                        title: data.resultsPublished ? 'Results Published!' : 'Exam Updated',
                        text: data.resultsPublished ? `Results for ${data.title} are now live.` : `New exam settings: ${data.title}`,
                        icon: 'info',
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 5000
                    });
                }
            });

            setEditFormData({
                fullName: student.fullName || '',
                mobile: student.mobile || '',
                college: student.college || '',
                branch: student.branch || '',
                year: student.year || ''
            });

            return () => socket.disconnect();
        }
    }, [student]);

    const fetchBulletins = async () => {
        try {
            const data = await api.get('/api/student-auth/bulletins');
            setAnnouncements(data);
        } catch (err) { console.log("Bulletins fetch failed"); }
    };

    const fetchResources = async () => {
        try {
            setIsResourcesLoading(true);
            const data = await api.get('/api/student-auth/resources');
            setStudyResources(data);
        } catch (err) { console.log("Resources fetch failed"); }
        finally { setIsResourcesLoading(false); }
    };

    const fetchTestInfo = async () => {
        try {
            setIsExamsLoading(true);
            setIsCertificatesLoading(true);
            const data = await api.get('/api/student-auth/test-info');
            setTestInfo(data);
        } catch (err) { }
        finally {
            setIsExamsLoading(false);
            setIsCertificatesLoading(false);
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
                await api.post('/api/student-auth/update-profile', { profilePicture: base64String });
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
                await new Promise(r => setTimeout(r, 800));

                const canvas = await html2canvas(idCardRef.current, {
                    scale: 4,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    onclone: (clonedDoc) => {
                        const el = clonedDoc.querySelector('.id-card-capture');
                        if (el) {
                            el.style.transform = 'none';
                            el.style.boxShadow = 'none';
                            el.style.width = '340px';
                            el.style.margin = '0';
                            el.style.display = 'block';

                            // Recursively remove oklch from all elements in the clone
                            const allElements = el.querySelectorAll('*');
                            allElements.forEach(item => {
                                try {
                                    const style = window.getComputedStyle(item);
                                    if (style.color?.includes('oklch')) item.style.color = '#000';
                                    if (style.backgroundColor?.includes('oklch')) item.style.backgroundColor = 'transparent';
                                    if (style.borderColor?.includes('oklch')) item.style.borderColor = 'transparent';
                                } catch (e) { }
                            });
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
                    Swal.fire({ icon: 'success', title: 'ID Card Downloaded', timer: 2000, showConfirmButton: false });
                }, 'image/png', 1.0);

            } catch (err) {
                Swal.fire({ icon: 'error', title: 'Download Failed', text: err.message });
            } finally { setIsDownloadingID(false); }
        }
    };

    const handleSaveProfile = async () => {
        try {
            setIsSavingProfile(true);
            const response = await api.post('/api/student-auth/update-profile', editFormData);
            if (response.student) {
                setStudent(response.student);
                localStorage.setItem('studentData', JSON.stringify(response.student));
                setIsEditingProfile(false);
                Swal.fire({ icon: 'success', title: 'Profile Updated', timer: 2000, showConfirmButton: false });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Update Failed', text: err.response?.data?.message || 'Error saving profile' });
        } finally { setIsSavingProfile(false); }
    };

    if (!student) return null;

    return (
        <div className="flex-1 flex flex-col min-w-0">
            <SEO title="Student Dashboard | Piedocx" />
            <BroadcastBanner announcements={announcements} />

            <main className="flex-1">
                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && (
                        <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                            <div className="flex flex-col lg:flex-row gap-8">
                                <DashboardHero student={student} navigate={navigate} />
                                <StatsScore student={student} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                                <OperationLog student={student} />
                                <TestScheduler testInfo={testInfo} student={student} onAction={() => navigate('/student-dashboard/exams')} />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10">
                                <PerformanceJourney />
                                <Leaderboard />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col justify-between">
                                    <div className="space-y-6">
                                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                                            <ShieldCheck size={14} className="text-blue-600" /> Your Safety Info
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 group">
                                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all"><QrCode size={20} /></div>
                                                <div><p className="text-xs font-black text-slate-800 uppercase italic">Digital ID</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Secure Code</p></div>
                                            </div>
                                            <div className="flex items-center gap-4 group">
                                                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all"><Camera size={20} /></div>
                                                <div><p className="text-xs font-black text-slate-800 uppercase italic">Camera Check</p><p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Live Protection</p></div>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={downloadIDCard} className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl transition-all group border-none">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">{isDownloadingID ? 'Saving...' : 'Download ID Card'}</span>
                                        <Download size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                    </button>
                                </div>
                            </div>
                            <IDCardAsset ref={idCardRef} student={student} />
                        </motion.div>
                    )}

                    {activeTab === 'exams' && (
                        <motion.div key="exams" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl">
                            <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter mb-8 md:mb-10 flex items-center gap-4">
                                <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg"><BookOpen size={20} /></span>
                                Your Exams
                            </h2>
                            {isExamsLoading ? (
                                <ExamsSkeleton />
                            ) : testInfo ? (
                                <div className="bg-white p-6 sm:p-10 md:p-12 rounded-3xl md:rounded-[3.5rem] border border-slate-200 shadow-2xl relative overflow-hidden group hover-lift text-center lg:text-left">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-10 relative z-10">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex items-center justify-center lg:justify-start gap-3">
                                                <span className="px-3 py-1 bg-green-50 text-green-600 text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-full border border-green-100">Live Status</span>
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic leading-none opacity-60 shrink-0">{testInfo.branchGroup} Group</span>
                                            </div>
                                            <h3 className="text-2xl md:text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-tight">{testInfo.title}</h3>
                                            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 md:gap-8 pt-2">
                                                <div className="flex items-center gap-2"><Clock size={16} className="text-blue-600" /><span className="text-xs font-black text-slate-900 uppercase italic tracking-tight">{testInfo.duration} Min</span></div>
                                                <div className="flex items-center gap-2"><Calendar size={16} className="text-purple-600" /><span className="text-xs font-black text-slate-900 uppercase italic tracking-tight">{new Date(testInfo.startDate).toLocaleDateString()}</span></div>
                                            </div>
                                        </div>
                                        <button onClick={() => navigate('/waiting-room', { state: { testId: testInfo.id, testTitle: testInfo.title, studentName: student.fullName, studentId: student.studentId, yearGroup: testInfo.yearGroup, branchGroup: testInfo.branchGroup }})} disabled={student.testAttempted} className={`w-full lg:w-auto px-10 py-5 rounded-2xl md:rounded-2.5xl font-black text-[10px] md:text-xs transition-all shadow-2xl uppercase italic tracking-[0.2em] flex items-center justify-center gap-3 ${student.testAttempted ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/30 active:scale-95'}`}>
                                            {student.testAttempted ? 'Exam Already Given' : 'Start Exam Now'} <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-20 md:py-24 text-center bg-white rounded-[2.5rem] md:rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner px-6"><p className="text-slate-300 font-black text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] italic">No active exams available right now.</p></div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'resources' && (
                        <motion.div key="resources" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                            <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter flex items-center gap-4"><span className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg"><FileText size={20} /></span>Study Material Archive</h2>
                            {isResourcesLoading ? (
                                <ResourcesSkeleton />
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {studyResources.length > 0 ? (
                                        studyResources.map((item, i) => (
                                            <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl hover-lift flex flex-col group">
                                                <div className="w-14 h-14 bg-slate-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300"><Download size={24} /></div>
                                                <h4 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter mb-2 group-hover:text-indigo-600 transition-colors truncate">{item.title}</h4>
                                                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-8 opacity-60">Study Notes</p>
                                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="mt-auto py-4 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 border border-slate-100">Download Now <ExternalLink size={14} /></a>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="md:col-span-3 py-16 text-center bg-slate-50/50 rounded-[3rem] border border-dashed border-slate-200">
                                            <p className="text-slate-400 font-black text-xs uppercase italic tracking-widest">No resources uploaded yet.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'certificates' && (
                        <motion.div key="certificates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
                            {isCertificatesLoading ? (
                                <CertificatesSkeleton />
                            ) : (
                                <div className="bg-white p-5 sm:p-12 lg:p-16 rounded-3xl md:rounded-[4rem] border border-slate-100 shadow-2xl flex flex-col md:flex-row items-center gap-10 md:gap-16 relative overflow-hidden text-center md:text-left">
                                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                                    <div className="flex-1 space-y-6 md:space-y-10 relative z-10">
                                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 italic"><ShieldCheck size={18} /><span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em]">Official Certificates</span></div>
                                        <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] uppercase italic tracking-tighter">Your Digital <br /><span className="text-blue-600 decoration-blue-100 decoration-8 underline underline-offset-[8px] md:underline-offset-[12px]">Certificates.</span></h3>
                                        <p className="text-slate-500 text-sm md:text-base font-medium leading-relaxed max-w-sm mx-auto md:mx-0 opacity-70">Download your verified exam certificates from here securely.</p>
                                        <div className="pt-2">
                                            {student.testAttempted ? (
                                                <button onClick={() => setShowCertificate(true)} className="w-full sm:w-auto px-10 md:px-14 py-5 md:py-6 bg-blue-600 text-white rounded-2xl md:rounded-[2rem] font-black text-[10px] md:text-xs uppercase italic tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-blue-700 transition-all shadow-2xl hover:scale-105 active:scale-95">View & Download <Download size={20} /></button>
                                            ) : (
                                                <div className="inline-flex px-8 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] border border-slate-100 italic">Status: Exam Not Done Yet</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="w-full sm:w-80 h-48 md:h-64 bg-slate-50 rounded-3xl md:rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-200 gap-6 shadow-inner relative z-10 hover:border-blue-200 transition-all group"><Award size={60} className="group-hover:scale-110 transition-transform md:w-20 md:h-20" /><p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.5em] italic opacity-30">Identity Verification Required</p></div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'profile' && (
                        <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10">
                            <div className="lg:col-span-3 bg-white rounded-3xl md:rounded-[4rem] border border-slate-100 shadow-2xl overflow-hidden relative pb-12 md:pb-16 px-4 sm:px-12 text-center md:text-left">
                                <div className="h-32 md:h-40 bg-blue-600 relative -mx-4 sm:-mx-12">
                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
                                </div>
                                <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-10 -translate-y-16 md:-translate-y-20 relative">
                                    <div className="relative group/photo">
                                        <div className="w-32 h-32 md:w-48 md:h-48 bg-white p-2 md:p-3 rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl z-10 ring-4 ring-slate-50 overflow-hidden"><div className="w-full h-full bg-slate-100 rounded-[2rem] md:rounded-[2.8rem] flex items-center justify-center overflow-hidden border-2 border-white">{student.profilePicture ? <img src={student.profilePicture} alt="Profile" className="w-full h-full object-cover" /> : <User size={60} className="text-slate-200" />}</div></div>
                                        <button onClick={() => fileInputRef.current.click()} className="absolute bottom-1 right-1 md:bottom-2 md:right-2 z-20 w-10 h-10 md:w-14 md:h-14 bg-blue-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-2xl border-2 md:border-4 border-white hover:scale-110 transition-all"><Camera size={18} /></button>
                                        <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                                    </div>
                                    <div className="flex-1 pb-2 md:pb-4 w-full">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{student.fullName}</h2>
                                            {!isEditingProfile && <button onClick={() => setIsEditingProfile(true)} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest italic hover:bg-blue-600 transition-all shadow-lg">Change Profile</button>}
                                        </div>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4 md:mt-5"><span className="px-4 py-2 bg-slate-900 text-white rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest italic">{student.studentId}</span><span className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg md:rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest italic border border-blue-100">Verified Account</span></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 mt-0 md:mt-6">
                                    {!isEditingProfile ? (
                                        <>
                                            <div className="space-y-4 md:space-y-6">
                                                <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100"><p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-1 md:mb-2 opacity-60">My Email</p><p className="text-xs md:text-sm font-black text-slate-900 uppercase italic tracking-tight truncate">{student.email}</p></div>
                                                <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100"><p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-1 md:mb-2 opacity-60">My Phone</p><p className="text-xs md:text-sm font-black text-slate-900 uppercase italic tracking-tight">{student.mobile || "Not Added"}</p></div>
                                            </div>
                                            <div className="space-y-4 md:space-y-6">
                                                <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100"><p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-1 md:mb-2 opacity-60">My College</p><p className="text-xs md:text-sm font-black text-slate-900 uppercase italic tracking-tight leading-tight">{student.college}</p></div>
                                                <div className="p-4 md:p-6 bg-slate-50 rounded-2xl md:rounded-[2rem] border border-slate-100"><p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest italic mb-1 md:mb-2 opacity-60">Admission Year</p><p className="text-xs md:text-sm font-black text-slate-900 uppercase italic tracking-tight">{student.year}</p></div>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="md:col-span-2 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2 text-left"><label className="text-[9px] font-black uppercase text-slate-400 mb-2 block">Full Name</label><input type="text" value={editFormData.fullName} onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-sm focus:border-blue-600 outline-none uppercase italic" /></div>
                                                <div className="text-left"><label className="text-[9px] font-black uppercase text-slate-400 mb-2 block">Phone Number</label><input type="text" value={editFormData.mobile} onChange={(e) => setEditFormData({...editFormData, mobile: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-sm focus:border-blue-600 outline-none" /></div>
                                                <div className="text-left"><label className="text-[9px] font-black uppercase text-slate-400 mb-2 block">Current Year</label><select value={editFormData.year} onChange={(e) => setEditFormData({...editFormData, year: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl font-bold text-sm focus:border-blue-600 outline-none">{['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'].map(y => <option key={y} value={y}>{y}</option>)}</select></div>
                                            </div>
                                            <div className="flex gap-4"><button onClick={handleSaveProfile} disabled={isSavingProfile} className="flex-1 h-14 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95">{isSavingProfile ? 'Saving...' : 'Update Records'}</button><button onClick={() => setIsEditingProfile(false)} className="px-8 h-14 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button></div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-slate-900 rounded-3xl md:rounded-[4rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
                                    <div className="relative z-10">
                                        <h3 className="text-xl font-black italic uppercase tracking-tighter mb-4">Quick <span className="text-blue-500">Links</span></h3>
                                        <p className="text-slate-400 text-xs font-medium mb-8 leading-relaxed">Direct shortcuts to important pages.</p>
                                        <div className="space-y-4">
                                            {testInfo?.resultsPublished && (
                                                <button onClick={() => navigate('/student-results')} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group">
                                                    <span className="text-[9px] font-black uppercase tracking-widest">See My Result</span>
                                                    <ChevronRight size={16} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            )}
                                            <button onClick={() => window.open('https://api.whatsapp.com/send?phone=919572458428', '_blank')} className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 group">
                                                <span className="text-[9px] font-black uppercase tracking-widest">Contact Help</span>
                                                <ChevronRight size={16} className="text-blue-500 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-3xl md:rounded-[4rem] p-8 md:p-10 border border-slate-100 shadow-xl flex flex-col items-center justify-center text-center gap-6 group"><div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Info size={40} /></div><p className="text-[10px] font-black uppercase tracking-[0.4em] italic text-slate-400 leading-none">Security: Enabled</p><p className="text-xs font-medium text-slate-500 px-4 leading-relaxed italic">"Your data and profile are completely safe and secure with Piedocx."</p></div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
            
            {/* Full-Screen Certificate View Modal */}
            <AnimatePresence>
                {showCertificate && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 30 }}
                            className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl p-4 md:p-10 overflow-auto max-h-[95vh] custom-scrollbar"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div className="text-left">
                                    <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-1">Your <span className="text-blue-600">Credential</span></h1>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified Secure Assert • Asset ID: {student.studentId}</p>
                                </div>
                                <button
                                    onClick={() => setShowCertificate(false)}
                                    className="p-3 bg-slate-100 rounded-full hover:bg-red-50 hover:text-red-600 transition-all shadow-sm"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex justify-center bg-slate-50/50 p-4 rounded-3xl border border-slate-100 min-h-[400px]">
                                <Certificate
                                    student={{
                                        name: student.fullName,
                                        college: student.college,
                                        branch: student.branch,
                                        year: student.year,
                                        studentId: student.studentId,
                                        certificateId: student.certificateId || student.studentId,
                                        _id: student._id
                                    }}
                                    userEmail={student.email}
                                    autoSend={false}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StudentDashboard;
