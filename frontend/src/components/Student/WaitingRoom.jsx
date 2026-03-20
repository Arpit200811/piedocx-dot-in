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
            setStatus('Invalid Session Data');
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
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight mb-2 px-2 uppercase italic">{testTitle || "Exam Starting Soon"}</h1>
                    <p className="text-slate-400 font-medium text-xs sm:text-sm uppercase tracking-widest leading-none">{status}</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    
                    {/* Left Column: Timer & Info */}
                    <div className="space-y-6">
                        {/* Counter */}
                        <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-700/50">
                            <div className="font-mono text-3xl sm:text-4xl md:text-5xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg">
                                {timeLeft !== null ? formatTime(timeLeft) : "-- : -- : --"}
                            </div>
                            <p className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-[0.3em] mt-3">Countdown Until Start</p>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 gap-4 text-left">
                            <div className="bg-slate-700/30 p-4 rounded-2xl border border-slate-600/30 flex items-center gap-4">
                                <div className="p-3 bg-slate-800 rounded-xl text-slate-400"><User size={20} /></div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Student Name</p>
                                    <p className="font-bold text-white text-sm">{studentName}</p>
                                </div>
                            </div>
                            <div className="bg-slate-700/30 p-4 rounded-2xl border border-slate-600/30 flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${networkStatus === 'Connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                    <Wifi size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Network Status</p>
                                    <p className={`font-bold text-sm ${networkStatus === 'Connected' ? 'text-emerald-400' : 'text-red-400'}`}>{networkStatus}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4 space-y-4">
                            {testInfo?.hasAccessKey && (
                                <div className="space-y-2 text-left">
                                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">SECURE ACCESS KEY</label>
                                    <div className="relative">
                                        <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                        <input
                                            type="text"
                                            value={accessKey}
                                            onChange={(e) => setAccessKey(e.target.value)}
                                            placeholder="ENTER KEY"
                                            className="w-full bg-slate-900/80 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-center text-xl font-black tracking-[0.3em] text-white focus:outline-none focus:border-blue-500 transition-all uppercase"
                                            maxLength={6}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className={`p-4 rounded-2xl flex items-start gap-4 text-left group cursor-pointer border transition-all ${agreed ? 'bg-blue-600/10 border-blue-500/50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`} onClick={() => setAgreed(!agreed)}>
                                <div className={`w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all ${agreed ? 'bg-blue-600 border-blue-600' : 'border-slate-600'}`}>
                                    {agreed && <Check size={14} className="text-white" />}
                                </div>
                                <p className="text-[10px] text-slate-300 font-bold leading-relaxed uppercase tracking-widest select-none">
                                    I agree to the AI monitoring proctoring rules.
                                </p>
                            </div>

                            <button
                                onClick={enterExam}
                                disabled={isLaunching || (timeLeft > 0 && !(testInfo?.isLive)) || !agreed || (testInfo?.hasAccessKey && !accessKey)}
                                className="w-full py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-50 transition-all shadow-xl active:scale-95 disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {timeLeft > 0 && !(testInfo?.isLive) ? `Waiting for Start...` : `Enter Assessment Now`} <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Right Column: T&C */}
                    <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 text-left shadow-2xl flex flex-col h-full max-h-[460px]">
                        <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                            <div className="p-2 bg-blue-600/20 rounded-xl">
                                <ShieldAlert size={20} className="text-blue-500" />
                            </div>
                            <h3 className="text-sm font-black text-white uppercase tracking-tighter">Rules & Guidelines</h3>
                        </div>

                        <div className="overflow-y-auto pr-2 custom-scrollbar space-y-6">
                            {/* Shortened rules for waiting room */}
                            <div className="space-y-4">
                                <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-4 h-[1px] bg-blue-400"></span> English Instructions
                                </p>
                                <ul className="text-[10px] text-slate-400 space-y-3 list-none font-medium leading-relaxed">
                                    <li className="flex gap-2">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                        <span><b>No Tab Switch:</b> instant termination warning.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                        <span><b>DND Mode:</b> Block all calls & notifications.</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                                        <span><b>AI Proctor:</b> Monitors your face and noise.</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-4 h-[1px] bg-orange-400"></span> हिंदी नियम
                                </p>
                                <ul className="text-[11px] text-slate-400 space-y-3 list-none font-semibold leading-relaxed">
                                    <li className="flex gap-2">
                                        <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 shrink-0"></div>
                                        <span><b>Tab Switching:</b> मना है। 3 वार्निंग के बाद टेस्ट बंद।</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 shrink-0"></div>
                                        <span><b>DND मोड:</b> फोन को DND पर रखें।</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <div className="w-1 h-1 bg-orange-500 rounded-full mt-1.5 shrink-0"></div>
                                        <span><b>Camera & Video:</b> निरंतर चेहरा सामने रखें।</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-8 pt-6 border-t border-slate-700/50 hidden sm:block">
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-medium italic">
                        <ShieldCheck size={14} className="flex-shrink-0" />
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
