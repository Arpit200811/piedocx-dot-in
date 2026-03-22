import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import api from '../../utils/api';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Wifi, ShieldCheck, User, Zap, Lock, Cpu, ShieldAlert, Check, KeyRound, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { base_url, getSocketUrl } from '../../utils/info';

const WaitingRoom = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { testId, testTitle, studentName, studentId, yearGroup, branchGroup, testInfo } = location.state || {};

    const [timeLeft, setTimeLeft] = useState(null);
    const [status, setStatus] = useState('Checking Status...');
    // const [socket, setSocket] = useState(null); // Removed: Using useRef
    const [networkStatus, setNetworkStatus] = useState('Good');
    const [isLaunching, setIsLaunching] = useState(false);
    const [launchPhase, setLaunchPhase] = useState(0);
    const [agreed, setAgreed] = useState(false);
    const [accessKey, setAccessKey] = useState('');

    useEffect(() => {
        // 1. Initial Status Check
        const checkStatus = async () => {
            try {
                const data = await api.get('/api/admin/test-config/time-check', {
                    params: { yearGroup, branchGroup }
                });

                const now = new Date(data.serverTime).getTime();
                const start = new Date(data.startTime).getTime();

                if (data.isLive) {
                    enterExam();
                } else if (now < start) {
                    setTimeLeft(start - now);
                    setStatus('Waiting for Exam Start');
                } else {
                    setStatus('Exam has Ended or is not Active');
                }
            } catch (err) {
                console.error(err);
                setStatus('Connection Error');
            }
        };

        if (yearGroup && branchGroup) {
            checkStatus();
            const timer = setInterval(checkStatus, 10000); // Re-sync every 10s
            return () => clearInterval(timer);
        } else {
            // Fallback for direct access without state
            Swal.fire({
                title: 'No Session Found',
                text: 'Please select an exam from the dashboard to enter the waiting room.',
                icon: 'error',
                confirmButtonColor: '#2563eb'
            }).then(() => navigate('/student-dashboard'));
        }
    }, [yearGroup, branchGroup]);

    // 2. Countdown Timer
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1000) {
                    clearInterval(interval);
                    enterExam(); // Auto-enter when timer hits 0
                    return 0;
                }
                return prev - 1000;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const socketRef = useRef(null);

    // 3. Socket Listener for "Force Start"
    useEffect(() => {
        const token = localStorage.getItem('studentToken');
        if (!token) return;

        const socketUrl = getSocketUrl();

        // Only create if not exists
        if (!socketRef.current) {
            const newSocket = io(socketUrl, {
                auth: { token },
                reconnection: true,
                reconnectionDelay: 1000
            });

            newSocket.on('connect', () => {
                setNetworkStatus('Connected');
            });

            newSocket.on('disconnect', () => setNetworkStatus('Reconnecting...'));
            newSocket.on('exam_live', () => {
                enterExam();
            });

            socketRef.current = newSocket;
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, []);

    const enterExam = async () => {
        if (isLaunching) return;

        // Validation Check
        if (!agreed) {
            Swal.fire({
                icon: 'warning',
                title: 'Agreement Required',
                text: 'You must agree to all terms and conditions before starting the examination.',
                confirmButtonColor: '#2563eb'
            });
            return;
        }

        if (testInfo?.hasAccessKey && !accessKey.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Access Key Required',
                text: 'Please enter the 6-digit access key provided by the admin.',
                confirmButtonColor: '#2563eb'
            });
            return;
        }

        setIsLaunching(true);

        // Sequence phases
        setLaunchPhase(1); // "Connecting to Server..."
        await new Promise(r => setTimeout(r, 1200));

        setLaunchPhase(2); // "Loading Questions..."
        await new Promise(r => setTimeout(r, 1000));

        setLaunchPhase(3); // "Preparing Test Environment..."
        await new Promise(r => setTimeout(r, 800));

        navigate('/test-interface', {
            state: { testId, testTitle, studentName, studentId, yearGroup, branchGroup, agreed: true, accessKey: accessKey },
            replace: true
        });
    };

    const formatTime = (ms) => {
        if (ms <= 0) return "00 : 00 : 00";
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')} : ${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
    };

    useEffect(() => {
        // Detailed Logging for Debugging
        if (!location.state) {
            console.error("❌ ERROR: Missing 'location.state' in WaitingRoom.");
            console.error("This usually happens if the page was refreshed or accessed directly via URL.");
            console.log("Expected testId, testTitle, studentName, etc. but found:", location.state);

            Swal.fire({
                icon: 'warning',
                title: 'Session Restoration',
                text: 'Refreshing your session. Redirecting to dashboard...',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                navigate('/student-dashboard', { replace: true });
            });
        } else {
            console.log("✅ WaitingRoom Loaded with State:", location.state);
        }
    }, [location.state, navigate]);

    if (!location.state) return null;

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <AnimatePresence>
                {isLaunching && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center overflow-hidden"
                    >
                        {/* Matrix-like background effect for launch */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative z-10 flex flex-col items-center"
                        >
                            <div className="w-24 h-24 mb-8 relative">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 border-4 border-blue-500/20 rounded-full"
                                ></motion.div>
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-2 border-t-4 border-blue-500 rounded-full"
                                ></motion.div>
                                <div className="absolute inset-0 flex items-center justify-center text-blue-500">
                                    {launchPhase === 1 && <Lock size={32} className="animate-pulse" />}
                                    {launchPhase === 2 && <Cpu size={32} className="animate-pulse" />}
                                    {launchPhase === 3 && <Zap size={32} className="animate-pulse" />}
                                </div>
                            </div>

                            <div className="h-12 overflow-hidden flex flex-col items-center">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={launchPhase}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        className="text-sm sm:text-base md:text-lg font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] italic text-blue-400"
                                    >
                                        {launchPhase === 1 && "Connecting to Server"}
                                        {launchPhase === 2 && "Getting Paper"}
                                        {launchPhase === 3 && "Starting Exam Now"}
                                    </motion.p>
                                </AnimatePresence>
                            </div>

                            <div className="mt-4 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(launchPhase / 3) * 100}%` }}
                                    className="h-full bg-blue-600 shadow-[0_0_15px_#2563eb]"
                                ></motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Background Effects */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[150px] opacity-20 animate-pulse delay-1000"></div>

            {/* Main Card */}
            <div className="relative z-10 w-full max-w-4xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-10 text-center shadow-2xl mx-4 overflow-y-auto max-h-[90vh]">

                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mb-3">
                        <Clock size={24} className="text-blue-400" />
                    </div>
                    <div className="flex items-center gap-2 mb-2 bg-blue-600/10 px-3 py-1 rounded-full border border-blue-500/20 shadow-sm animate-pulse">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.3em]">Secure Waiting Area</span>
                    </div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight mb-2 px-2 uppercase italic">{testTitle || "Exam Starting Soon"}</h1>
                    <p className="text-slate-400 font-medium text-xs sm:text-sm uppercase tracking-widest leading-none">Status: {status}</p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-stretch pt-2">
                    
                    {/* Left Column: Info & Rules (Span 7) */}
                    <div className="lg:col-span-7 flex flex-col gap-6">
                        
                        {/* Info Grid */}
                        <div className="grid grid-cols-2 gap-4 text-left">
                            <div className="bg-slate-700/30 p-4 rounded-3xl border border-slate-600/30 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                                <div className="p-3 bg-slate-800 rounded-2xl text-slate-400 shadow-inner"><User size={20} /></div>
                                <div>
                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Student Name</p>
                                    <p className="font-bold text-white text-sm md:text-base leading-none">{studentName}</p>
                                </div>
                            </div>
                            <div className="bg-slate-700/30 p-4 rounded-3xl border border-slate-600/30 flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                                <div className={`p-3 rounded-2xl shadow-inner ${networkStatus === 'Connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    <Wifi size={20} />
                                </div>
                                <div>
                                    <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Network Status</p>
                                    <p className={`font-bold text-sm md:text-base leading-none ${networkStatus === 'Connected' ? 'text-emerald-400' : 'text-red-400'}`}>{networkStatus}</p>
                                </div>
                            </div>
                        </div>

                        {/* Rules & Guidelines */}
                        <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-6 text-left shadow-xl flex-1 flex flex-col">
                            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                                <div className="p-2.5 bg-blue-600/20 rounded-xl">
                                    <ShieldAlert size={20} className="text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-white uppercase tracking-tighter leading-none mb-1">Rules & Guidelines</h3>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Mandatory Assessment Protocols</p>
                                </div>
                            </div>

                            <div className="overflow-y-auto pr-2 custom-scrollbar space-y-6 flex-1 max-h-[250px] md:max-h-[300px]">
                                <div className="space-y-4">
                                    <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-4 h-[2px] rounded-full bg-blue-400"></span> English Instructions
                                    </p>
                                    <ul className="text-xs text-slate-400 space-y-4 list-none font-medium leading-relaxed px-1">
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_#3b82f6]"></div>
                                            <span><b className="text-white">No Tab Switch:</b> Navigating away from the test triggers an instant termination warning.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_#3b82f6]"></div>
                                            <span><b className="text-white">DND Mode:</b> Block all calls & notifications before starting.</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_#3b82f6]"></div>
                                            <span><b className="text-white">AI Proctor:</b> Keeps track of your face, eye movement, and ambient noise.</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                                        <span className="w-4 h-[2px] rounded-full bg-orange-400"></span> हिंदी नियम (Hindi)
                                    </p>
                                    <ul className="text-xs text-slate-400 space-y-4 list-none font-semibold leading-relaxed px-1">
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_#f97316]"></div>
                                            <span><b className="text-white">Tab Switching:</b> मना है। 3 वार्निंग के बाद टेस्ट अपने आप बंद हो जायेगा।</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_#f97316]"></div>
                                            <span><b className="text-white">DND मोड:</b> परीक्षा शुरू करने से पहले फोन को DND पर रखें।</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 shrink-0 shadow-[0_0_8px_#f97316]"></div>
                                            <span><b className="text-white">Camera & Video:</b> निरंतर चेहरा सामने रखें, AI आपको मॉनिटर कर रहा है।</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Timer & Controls (Span 5) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        {/* Counter */}
                        <div className="bg-slate-900/80 p-6 md:p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                            <div className="font-mono text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.2)] mb-3 z-10 relative">
                                {timeLeft !== null ? formatTime(timeLeft) : "-- : -- : --"}
                            </div>
                            <p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.4em] z-10 relative">Countdown Clock</p>
                        </div>

                        {/* Action Box */}
                        <div className="bg-blue-900/10 p-6 rounded-3xl border border-blue-500/20 shadow-xl flex-1 flex flex-col justify-center space-y-6 relative overflow-hidden">
                            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
                            
                            {testInfo?.hasAccessKey && (
                                <div className="space-y-3 text-left relative z-10">
                                    <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 flex items-center gap-2"><KeyRound size={12}/> Access Key</label>
                                    <div className="relative group">
                                        <input
                                            type="text"
                                            value={accessKey}
                                            onChange={(e) => setAccessKey(e.target.value)}
                                            placeholder="ENTER 6-DIGIT KEY"
                                            className="w-full bg-slate-950/80 border-2 border-slate-700 rounded-2xl p-5 text-center text-xl font-black tracking-[0.4em] text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all uppercase placeholder:opacity-30 placeholder:tracking-widest shadow-inner relative z-10"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>
                            )}

                            <div 
                                className={`p-4 rounded-2xl flex items-center gap-4 text-left group cursor-pointer border transition-all z-10 relative select-none ${agreed ? 'bg-blue-600/20 border-blue-500 shadow-md' : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-slate-600'}`} 
                                onClick={() => setAgreed(!agreed)}
                            >
                                <div className={`w-6 h-6 rounded-lg border-2 flex-shrink-0 flex items-center justify-center transition-all ${agreed ? 'bg-blue-600 border-blue-600' : 'border-slate-500'}`}>
                                    {agreed && <Check size={14} className="text-white" />}
                                </div>
                                <p className="text-[9px] sm:text-[10px] text-slate-300 font-bold leading-relaxed uppercase tracking-widest">
                                    I agree to the AI monitoring proctoring rules.
                                </p>
                            </div>

                            <button
                                onClick={enterExam}
                                disabled={isLaunching || (timeLeft > 0 && !(testInfo?.isLive)) || !agreed || (testInfo?.hasAccessKey && !accessKey)}
                                className="w-full h-16 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] disabled:opacity-50 disabled:grayscale disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative z-10"
                            >
                                {timeLeft > 0 && !(testInfo?.isLive) ? `Waiting to Start...` : `Enter Assessment Now`} <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest italic">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span>Security verified. The assessment logs your activity for forensic review.</span>
                    </div>
                </div>
            </div>

            {/* Matrix-like overlay style */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
            `}</style>
        </div>
    );
};

export default WaitingRoom;
