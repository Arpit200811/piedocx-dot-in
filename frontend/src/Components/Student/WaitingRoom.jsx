import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Wifi, ShieldCheck, User, Zap, Lock, Cpu } from 'lucide-react';
import Swal from 'sweetalert2';
import { base_url } from '../../utils/info';

const WaitingRoom = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { testId, testTitle, studentName, studentId, yearGroup, branchGroup } = location.state || {};

    const [timeLeft, setTimeLeft] = useState(null);
    const [status, setStatus] = useState('Checking Status...');
    // const [socket, setSocket] = useState(null); // Removed: Using useRef
    const [networkStatus, setNetworkStatus] = useState('Good');
    const [isLaunching, setIsLaunching] = useState(false);
    const [launchPhase, setLaunchPhase] = useState(0);

    useEffect(() => {
        // 1. Initial Status Check
        const checkStatus = async () => {
            try {
                const res = await axios.get(`${base_url}/api/admin/test-config/time-check`, {
                    params: { yearGroup, branchGroup }
                });

                const now = new Date(res.data.serverTime).getTime();
                const start = new Date(res.data.startTime).getTime();

                if (res.data.isLive) {
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

        // Use URL constructor for safer parsing
        let socketUrl = base_url;
        try {
            const url = new URL(base_url);
            socketUrl = url.origin;
        } catch (e) {
            socketUrl = base_url.replace('/api', '');
        }

        // Only create if not exists
        if (!socketRef.current) {
            const newSocket = io(socketUrl, {
                auth: { token },
                reconnection: true,
                reconnectionDelay: 1000
            });

            newSocket.on('connect', () => {
                setNetworkStatus('Connected');
                // console.log("Waiting Room Socket Connected");
            });

            newSocket.on('disconnect', () => setNetworkStatus('Reconnecting...'));

            // If admin forces exam start via socket
            newSocket.on('exam_live', () => {
                // console.log("Admin forced exam start!");
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
        setIsLaunching(true);

        // Sequence phases
        setLaunchPhase(1); // "Connecting to Server..."
        await new Promise(r => setTimeout(r, 1200));

        setLaunchPhase(2); // "Loading Questions..."
        await new Promise(r => setTimeout(r, 1000));

        setLaunchPhase(3); // "Preparing Test Environment..."
        await new Promise(r => setTimeout(r, 800));

        navigate('/test-interface', {
            state: { testId, testTitle, studentName, studentId, yearGroup, branchGroup },
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
                                        {launchPhase === 2 && "Loading Questions"}
                                        {launchPhase === 3 && "Preparing Test Environment"}
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
            <div className="relative z-10 w-full max-w-2xl bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 text-center shadow-2xl mx-4">

                {/* Header */}
                <div className="flex flex-col items-center mb-6 sm:mb-8 md:mb-10">
                    <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-blue-600/20 rounded-full flex items-center justify-center mb-3 sm:mb-4 animate-bounce">
                        <Clock size={32} className="text-blue-400 sm:w-9 sm:h-9 md:w-10 md:h-10" />
                    </div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tight mb-2 px-2">{testTitle || "Assessment Lobby"}</h1>
                    <p className="text-slate-400 font-medium text-sm sm:text-base md:text-lg">{status}</p>
                </div>

                {/* Counter */}
                <div className="mb-8 sm:mb-10 md:mb-12">
                    <div className="font-mono text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg">
                        {timeLeft !== null ? formatTime(timeLeft) : "-- : -- : --"}
                    </div>
                    <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-3 sm:mt-4">Time Until Launch</p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                    <div className="bg-slate-700/30 p-4 rounded-2xl border border-slate-600/30 flex items-center gap-4">
                        <div className="p-3 bg-slate-800 rounded-xl text-slate-400"><User size={20} /></div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Candidate</p>
                            <p className="font-bold text-white">{studentName}</p>
                        </div>
                    </div>
                    <div className="bg-slate-700/30 p-4 rounded-2xl border border-slate-600/30 flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${networkStatus === 'Connected' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                            <Wifi size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Live Connection</p>
                            <p className={`font-bold ${networkStatus === 'Connected' ? 'text-emerald-400' : 'text-red-400'}`}>{networkStatus}</p>
                        </div>
                    </div>
                </div>

                {/* Footer Message */}
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-slate-700/50">
                    <div className="flex items-center justify-center gap-2 text-slate-400 text-xs sm:text-sm font-medium">
                        <ShieldCheck size={14} className="sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="text-center">Please do not refresh or close this page. The exam will start automatically.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WaitingRoom;
