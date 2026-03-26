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

// Tab Components
import OverviewTab from './Student/OverviewTab';
import ExamsTab from './Student/ExamsTab';
import ResourcesTab from './Student/ResourcesTab';
import CertificatesTab from './Student/CertificatesTab';
import ProfileTab from './Student/ProfileTab';

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
        const pathSegment = location.pathname.split('/').pop();
        if (pathSegment === 'student-dashboard' || !pathSegment) {
            return 'dashboard';
        }
        return pathSegment;
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
        fetchProfile();
    }, []);

    useEffect(() => {
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
                    fetchProfile();
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

    const fetchProfile = async () => {
        try {
            const data = await api.get('/api/student-auth/profile');
            if (data) {
                // Feature #7 Fix: Ensure violationHistory, assignedQuestions, and all
                // full profile fields are merged into context so child components get real data
                const merged = {
                    ...student,
                    ...data,
                    firstName: data.firstName || data.fullName?.split(' ')[0] || student?.firstName
                };
                setStudent(merged);
                localStorage.setItem('studentData', JSON.stringify(merged));
            }
        } catch (err) { }
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
                        <OverviewTab 
                            student={student}
                            testInfo={testInfo}
                            isDownloadingID={isDownloadingID}
                            downloadIDCard={downloadIDCard}
                            idCardRef={idCardRef}
                            navigate={navigate}
                        />
                    )}

                    {activeTab === 'exams' && (
                        <ExamsTab 
                            isExamsLoading={isExamsLoading}
                            testInfo={testInfo}
                            student={student}
                            onNavigate={navigate}
                        />
                    )}

                    {activeTab === 'resources' && (
                        <ResourcesTab 
                            isResourcesLoading={isResourcesLoading}
                            studyResources={studyResources}
                        />
                    )}

                    {activeTab === 'certificates' && (
                        <CertificatesTab 
                            isCertificatesLoading={isCertificatesLoading}
                            student={student}
                            setShowCertificate={setShowCertificate}
                        />
                    )}

                    {activeTab === 'profile' && (
                        <ProfileTab 
                            student={student}
                            isEditingProfile={isEditingProfile}
                            setIsEditingProfile={setIsEditingProfile}
                            editFormData={editFormData}
                            setEditFormData={setEditFormData}
                            handleSaveProfile={handleSaveProfile}
                            isSavingProfile={isSavingProfile}
                            fileInputRef={fileInputRef}
                            handlePhotoUpload={handlePhotoUpload}
                            testInfo={testInfo}
                            onNavigate={navigate}
                        />
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
